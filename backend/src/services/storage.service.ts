import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { STORAGE_PATH } from '../config/env';

// Subdirectories under STORAGE_PATH
const AVATARS_DIR = path.join(STORAGE_PATH, 'avatars');
const DOCUMENTS_DIR = path.join(STORAGE_PATH, 'documents');

/**
 * Initializes and ensures storage directories exist.
 */
export function ensureStorageDirectories(): void {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(STORAGE_PATH, { recursive: true });
    }
    if (!fs.existsSync(AVATARS_DIR)) {
      fs.mkdirSync(AVATARS_DIR, { recursive: true });
    }
    if (!fs.existsSync(DOCUMENTS_DIR)) {
      fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('[StorageService] Error creating storage directories:', error);
  }
}

// Ensure directories on module import
ensureStorageDirectories();

export interface SavedDocumentResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

export class StorageService {
  /**
   * Returns the directory where avatars are stored.
   */
  static getAvatarsDir(): string {
    return AVATARS_DIR;
  }

  /**
   * Returns the directory where private documents are stored.
   */
  static getDocumentsDir(): string {
    return DOCUMENTS_DIR;
  }

  /**
   * Saves an avatar image from a binary Buffer.
   * Publicly accessible via /uploads/avatars/:filename
   */
  static async saveAvatar(identifier: string, buffer: Buffer, extension: string): Promise<{ filename: string; relativeUrl: string }> {
    ensureStorageDirectories();
    const cleanExt = extension.replace(/^\./, '').toLowerCase() || 'png';
    const filename = `${identifier}_${Date.now()}.${cleanExt}`;
    const targetPath = path.join(AVATARS_DIR, filename);

    await fs.promises.writeFile(targetPath, buffer);
    return {
      filename,
      relativeUrl: `/uploads/avatars/${filename}`,
    };
  }

  /**
   * Saves a confidential document (PDF, PNG, JPG, etc.) to the private documents directory.
   * Generates a collision-resistant UUID filename to prevent direct guessing.
   */
  static async saveDocument(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<SavedDocumentResult> {
    ensureStorageDirectories();
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    const uniqueId = crypto.randomUUID();
    const storedFileName = `${uniqueId}${ext}`;
    const targetPath = path.join(DOCUMENTS_DIR, storedFileName);

    await fs.promises.writeFile(targetPath, fileBuffer);

    return {
      fileName: path.basename(originalName),
      filePath: storedFileName, // Store relative filename for portability across volume mounts
      fileSize: fileBuffer.length,
      mimeType,
    };
  }

  /**
   * Resolves the absolute path for a stored document, strictly enforcing
   * that it stays within DOCUMENTS_DIR to prevent directory traversal.
   */
  static resolveDocumentPath(storedFileName: string): string | null {
    // Sanitize: take only the basename to prevent path traversal like "../../etc/passwd"
    const safeName = path.basename(storedFileName);
    const resolved = path.resolve(DOCUMENTS_DIR, safeName);

    if (!resolved.startsWith(DOCUMENTS_DIR)) {
      return null;
    }

    if (!fs.existsSync(resolved)) {
      return null;
    }

    return resolved;
  }

  /**
   * Safely deletes a document file from storage if it exists.
   */
  static async deleteDocument(storedFileName: string): Promise<boolean> {
    try {
      const filePath = this.resolveDocumentPath(storedFileName);
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`[StorageService] Error deleting document ${storedFileName}:`, error);
      return false;
    }
  }

  /**
   * Safely deletes an avatar file from storage if it exists.
   */
  static async deleteAvatar(relativeUrlOrFilename: string): Promise<boolean> {
    try {
      const filename = path.basename(relativeUrlOrFilename);
      const filePath = path.resolve(AVATARS_DIR, filename);
      if (filePath.startsWith(AVATARS_DIR) && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`[StorageService] Error deleting avatar ${relativeUrlOrFilename}:`, error);
      return false;
    }
  }
}
