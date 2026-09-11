import { Router, Response } from 'express';
import multer from 'multer';
import prisma from '../services/prisma';
import { requireAuth, AuthenticatedRequest, requireRole } from '../middlewares/auth.middleware';
import { StorageService } from '../services/storage.service';
import { badRequest, forbidden, notFound, sendError } from '../utils/http';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { recalculateAllQuestsForCube } from '../services/quest.service';

const router = Router();
const isMentorOrAdmin = requireRole(['ADMIN', 'MENTOR']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Allowed types: PDF, PNG, JPG, WEBP, DOC, DOCX.'));
    }
  },
});

/**
 * Upload a document for a Cube.
 * Allowed: Admin, Mentor, or the Cube themselves.
 */
router.post(
  '/cubes/:id/documents',
  requireAuth,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      next();
    });
  },
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params; // CubeProfile ID
      const file = req.file;

      if (!file) {
        throw badRequest('No file uploaded.');
      }

      const profile = await prisma.cubeProfile.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!profile) {
        throw notFound('Cube profile not found.');
      }

      // Authorization check
      const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';
      const isOwner = req.user?.role === 'CUBE' && req.user.cubeProfileId === id;
      if (!isStaff && !isOwner) {
        throw forbidden('You do not have permission to upload documents for this Cube.');
      }

      const rawType = (req.body.type || 'OTHER').toUpperCase();
      const validTypes = Object.values(DocumentType);
      const docType: DocumentType = validTypes.includes(rawType as DocumentType)
        ? (rawType as DocumentType)
        : DocumentType.OTHER;

      const title = (req.body.title || '').trim() || `${docType.replace(/_/g, ' ')} - ${file.originalname}`;
      const notes = (req.body.notes || '').trim() || null;

      // Mentors/Admins can mark as approved immediately; Cubes upload as PENDING_REVIEW
      let status: DocumentStatus = DocumentStatus.PENDING_REVIEW;
      if (isStaff && req.body.status === 'APPROVED') {
        status = DocumentStatus.APPROVED;
      }

      // Save file through persistent storage service
      const saved = await StorageService.saveDocument(file.buffer, file.originalname, file.mimetype);

      // Create record
      const document = await prisma.cubeDocument.create({
        data: {
          cube_id: id,
          type: docType,
          title,
          file_name: saved.fileName,
          file_path: saved.filePath,
          file_size: saved.fileSize,
          mime_type: saved.mimeType,
          status,
          notes,
          uploaded_by_id: req.user!.id,
          reviewed_by_id: status === DocumentStatus.APPROVED ? req.user!.id : null,
          reviewed_at: status === DocumentStatus.APPROVED ? new Date() : null,
        },
        include: {
          uploaded_by: { select: { id: true, name: true, role: true } },
          reviewed_by: { select: { id: true, name: true, role: true } },
        },
      });

      // Synchronize NDA status on CubeProfile if an NDA is uploaded
      if (docType === DocumentType.NDA) {
        if (status === DocumentStatus.APPROVED) {
          await prisma.cubeProfile.update({
            where: { id },
            data: {
              nda_signed: true,
              nda_status: 'signed',
              nda_signed_at: new Date(),
            },
          });
        } else if (profile.nda_status !== 'signed') {
          await prisma.cubeProfile.update({
            where: { id },
            data: {
              nda_status: 'pending',
            },
          });
        }
        recalculateAllQuestsForCube(id).catch(err => {
          console.error('Failed to recalculate quests after NDA document upload:', err);
        });
      }

      return res.status(201).json({
        success: true,
        document,
      });
    } catch (error: any) {
      return sendError(res, error);
    }
  }
);

/**
 * List all documents for a Cube.
 * Allowed: Admin, Mentor, or the Cube themselves.
 */
router.get('/cubes/:id/documents', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // CubeProfile ID

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';
    const isOwner = req.user?.role === 'CUBE' && req.user.cubeProfileId === id;
    if (!isStaff && !isOwner) {
      throw forbidden('You do not have permission to view documents for this Cube.');
    }

    const documents = await prisma.cubeDocument.findMany({
      where: { cube_id: id },
      include: {
        uploaded_by: { select: { id: true, name: true, role: true } },
        reviewed_by: { select: { id: true, name: true, role: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return res.json(documents);
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Authenticated file stream/download for a document.
 * Checks permissions before streaming binary file.
 */
router.get('/documents/:id/file', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.cubeDocument.findUnique({
      where: { id },
      include: { cube: true },
    });

    if (!document) {
      throw notFound('Document record not found.');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';
    const isOwner = req.user?.role === 'CUBE' && req.user.cubeProfileId === document.cube_id;
    if (!isStaff && !isOwner) {
      throw forbidden('You do not have permission to access this document.');
    }

    const resolvedPath = StorageService.resolveDocumentPath(document.file_path);
    if (!resolvedPath) {
      throw notFound('Document file not found on disk or storage volume.');
    }

    const isDownload = req.query.download === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';

    res.setHeader('Content-Type', document.mime_type);
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename="${encodeURIComponent(document.file_name)}"`
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');

    return res.sendFile(resolvedPath);
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Update document review status (Approve / Reject / Note).
 * Allowed: Mentor or Admin only.
 */
router.patch(
  '/documents/:id/status',
  requireAuth,
  isMentorOrAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status || !Object.values(DocumentStatus).includes(status)) {
        throw badRequest('Invalid document status. Must be APPROVED or REJECTED.');
      }

      const document = await prisma.cubeDocument.findUnique({
        where: { id },
        include: { cube: true },
      });

      if (!document) {
        throw notFound('Document not found.');
      }

      const updated = await prisma.cubeDocument.update({
        where: { id },
        data: {
          status: status as DocumentStatus,
          notes: notes !== undefined ? notes : document.notes,
          reviewed_by_id: req.user!.id,
          reviewed_at: new Date(),
        },
        include: {
          uploaded_by: { select: { id: true, name: true, role: true } },
          reviewed_by: { select: { id: true, name: true, role: true } },
        },
      });

      // If document is NDA, update CubeProfile NDA status
      if (document.type === DocumentType.NDA) {
        if (status === DocumentStatus.APPROVED) {
          await prisma.cubeProfile.update({
            where: { id: document.cube_id },
            data: {
              nda_signed: true,
              nda_status: 'signed',
              nda_signed_at: new Date(),
            },
          });
        } else if (status === DocumentStatus.REJECTED) {
          // If rejected, set nda_status to not_signed or pending revision
          await prisma.cubeProfile.update({
            where: { id: document.cube_id },
            data: {
              nda_signed: false,
              nda_status: 'not_signed',
            },
          });
        }
        recalculateAllQuestsForCube(document.cube_id, { forceRecheck: true }).catch(err => {
          console.error('Failed to recalculate quests after NDA review:', err);
        });
      }

      return res.json({
        success: true,
        document: updated,
      });
    } catch (error: any) {
      return sendError(res, error);
    }
  }
);

/**
 * Delete a document.
 * Allowed: Admin, or Cube owner if document is still PENDING_REVIEW.
 */
router.delete('/documents/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.cubeDocument.findUnique({
      where: { id },
      include: { cube: true },
    });

    if (!document) {
      throw notFound('Document not found.');
    }

    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = req.user?.role === 'CUBE' && req.user.cubeProfileId === document.cube_id;

    if (!isAdmin && !(isOwner && document.status === DocumentStatus.PENDING_REVIEW)) {
      throw forbidden('You do not have permission to delete this document.');
    }

    // Delete physical file from persistent storage
    await StorageService.deleteDocument(document.file_path);

    // Delete database record
    await prisma.cubeDocument.delete({
      where: { id },
    });

    // If this was an approved NDA, check if other approved NDAs exist; if not, revert nda_signed
    if (document.type === DocumentType.NDA && document.status === DocumentStatus.APPROVED) {
      const remainingApprovedNda = await prisma.cubeDocument.findFirst({
        where: {
          cube_id: document.cube_id,
          type: DocumentType.NDA,
          status: DocumentStatus.APPROVED,
        },
      });

      if (!remainingApprovedNda) {
        await prisma.cubeProfile.update({
          where: { id: document.cube_id },
          data: {
            nda_signed: false,
            nda_status: 'not_sent',
            nda_signed_at: null,
          },
        });
        recalculateAllQuestsForCube(document.cube_id, { forceRecheck: true }).catch(err => {
          console.error('Failed to recalculate quests after NDA deletion:', err);
        });
      }
    }

    return res.json({
      success: true,
      message: 'Document deleted successfully.',
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
