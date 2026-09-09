import React, { useState, useEffect, useRef } from 'react';
import { api, API_BASE } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  Plus,
  FileCheck,
  ShieldCheck,
  Loader2,
  Check,
  X,
  MessageSquare
} from 'lucide-react';

export type DocumentType =
  | 'NDA'
  | 'STUDENT_CERTIFICATE'
  | 'TRANSCRIPT'
  | 'INTERNSHIP_CONTRACT'
  | 'SGK_ENTRY'
  | 'ID_COPY'
  | 'OTHER';

export type DocumentStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface CubeDocument {
  id: string;
  cube_id: string;
  type: DocumentType;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  notes?: string | null;
  uploaded_by?: { id: string; name: string; role: string };
  reviewed_by?: { id: string; name: string; role: string } | null;
  reviewed_at?: string | null;
  created_at: string;
}

interface CubeDocumentsManagerProps {
  cubeId: string;
  isOwner: boolean;
  onDocumentsChange?: () => void;
}

const DOCUMENT_TYPE_LABELS: Record<DocumentType, { label: string; description: string; iconColor: string }> = {
  NDA: {
    label: 'Non-Disclosure Agreement (NDA)',
    description: 'Iceberg Fellowship confidentiality & data protection agreement',
    iconColor: 'text-magenta',
  },
  STUDENT_CERTIFICATE: {
    label: 'Student Certificate',
    description: 'Official active student enrollment certificate',
    iconColor: 'text-blue-500',
  },
  TRANSCRIPT: {
    label: 'Academic Transcript',
    description: 'Official academic grade transcript and course records',
    iconColor: 'text-indigo-500',
  },
  INTERNSHIP_CONTRACT: {
    label: 'Internship / Fellowship Contract',
    description: 'University internship contract or fellowship acceptance agreement',
    iconColor: 'text-purple-500',
  },
  SGK_ENTRY: {
    label: 'Social Security (SGK) Entry Document',
    description: 'Official university or institutional social security entry statement',
    iconColor: 'text-emerald-500',
  },
  ID_COPY: {
    label: 'National ID / Passport Copy',
    description: 'Front and back copy of national ID or passport',
    iconColor: 'text-amber-500',
  },
  OTHER: {
    label: 'Other Official Document',
    description: 'Additional certificate, recommendation, or official paperwork',
    iconColor: 'text-slate-500',
  },
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const CubeDocumentsManager: React.FC<CubeDocumentsManagerProps> = ({
  cubeId,
  isOwner,
  onDocumentsChange,
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<CubeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('NDA');
  const [docTitle, setDocTitle] = useState('');
  const [docNotes, setDocNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review modal state (Admin/Mentor)
  const [reviewDoc, setReviewDoc] = useState<CubeDocument | null>(null);
  const [reviewStatus, setReviewStatus] = useState<DocumentStatus>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Action loading IDs
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'MENTOR';
  const canUpload = isStaff || isOwner;

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/cubes/${cubeId}/documents`);
      setDocuments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [cubeId]);

  const handleOpenUpload = (defaultType?: DocumentType) => {
    setSelectedType(defaultType || 'NDA');
    setDocTitle('');
    setDocNotes('');
    setSelectedFile(null);
    setUploadError(null);
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (file: File) => {
    setUploadError(null);
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      setUploadError('Only PDF, images (PNG, JPG, WEBP), or Word documents (.doc, .docx) can be uploaded.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size cannot exceed the 15MB limit.');
      return;
    }
    setSelectedFile(file);
    if (!docTitle) {
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setDocTitle(`${DOCUMENT_TYPE_LABELS[selectedType].label} - ${baseName}`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', selectedType);
      formData.append('title', docTitle || DOCUMENT_TYPE_LABELS[selectedType].label);
      if (docNotes) formData.append('notes', docNotes);
      if (isStaff) formData.append('status', 'APPROVED');

      await api.upload(`/cubes/${cubeId}/documents`, formData);
      setIsUploadModalOpen(false);
      await fetchDocuments();
      if (onDocumentsChange) onDocumentsChange();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: CubeDocument, isDownload = true) => {
    setActionLoadingId(doc.id);
    try {
      const { blob, filename } = await api.downloadBlob(`/documents/${doc.id}/file${isDownload ? '?download=true' : ''}`);
      const url = window.URL.createObjectURL(blob);
      if (isDownload) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || doc.file_name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.open(url, '_blank');
      }
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err: any) {
      alert(err.message || 'Failed to download document.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (doc: CubeDocument) => {
    if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return;

    setActionLoadingId(doc.id);
    try {
      await api.delete(`/documents/${doc.id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      if (onDocumentsChange) onDocumentsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to delete document.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewDoc) return;

    setReviewLoading(true);
    try {
      await api.patch(`/documents/${reviewDoc.id}/status`, {
        status: reviewStatus,
        notes: reviewNotes,
      });
      setReviewDoc(null);
      await fetchDocuments();
      if (onDocumentsChange) onDocumentsChange();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-subtle flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-magenta/10 text-magenta">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Cube Documents &amp; Confidentiality Agreements (NDA)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Confidentiality agreements (NDA), student certificates, and official fellowship documents.
          </p>
        </div>

        {canUpload && (
          <button
            type="button"
            onClick={() => handleOpenUpload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-magenta text-white font-bold text-xs hover:bg-magenta/90 shadow-md shadow-magenta/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-magenta animate-spin" />
          <p className="text-xs font-bold text-gray-400">Loading documents...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
          <FileText className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-800">No documents uploaded yet</p>
          <p className="text-xs text-gray-400 max-w-sm mt-1">
            You can securely upload your Non-Disclosure Agreement (NDA), student certificate, or official records here.
          </p>
          {canUpload && (
            <button
              type="button"
              onClick={() => handleOpenUpload('NDA')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:border-magenta hover:text-magenta transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Signed NDA</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => {
            const meta = DOCUMENT_TYPE_LABELS[doc.type] || DOCUMENT_TYPE_LABELS.OTHER;
            const isDocActionLoading = actionLoadingId === doc.id;
            const isApproved = doc.status === 'APPROVED';
            const isPending = doc.status === 'PENDING_REVIEW';
            const isRejected = doc.status === 'REJECTED';

            return (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-subtle transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* File info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl bg-gray-50 shrink-0 ${meta.iconColor}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-gray-900 truncate">
                        {doc.title}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/50">
                        {meta.label}
                      </span>
                      {doc.type === 'NDA' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-magenta/10 text-magenta border border-magenta/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Fellowship NDA</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 flex-wrap">
                      <span>{doc.file_name}</span>
                      <span>·</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>·</span>
                      <span>{new Date(doc.created_at).toLocaleDateString('en-GB')}</span>
                      {doc.uploaded_by && (
                        <>
                          <span>·</span>
                          <span>Uploaded by: {doc.uploaded_by.name}</span>
                        </>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="mt-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 inline-block">
                        <span className="font-bold text-gray-400 mr-1">Note:</span>
                        {doc.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status and actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {/* Status Badge */}
                  <div>
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Changes Requested</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isDocActionLoading}
                      onClick={() => handleDownload(doc, false)}
                      className="p-2 text-gray-500 hover:text-magenta hover:bg-magenta/5 rounded-xl border border-gray-100 transition"
                      title="Preview / View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={isDocActionLoading}
                      onClick={() => handleDownload(doc, true)}
                      className="p-2 text-gray-500 hover:text-magenta hover:bg-magenta/5 rounded-xl border border-gray-100 transition"
                      title="Download"
                    >
                      {isDocActionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-magenta" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>

                    {/* Mentor/Admin review action */}
                    {isStaff && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewDoc(doc);
                          setReviewStatus(doc.status === 'APPROVED' ? 'APPROVED' : 'APPROVED');
                          setReviewNotes(doc.notes || '');
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-1"
                        title="Review Document"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                        <span>Review</span>
                      </button>
                    )}

                    {/* Delete action */}
                    {(user?.role === 'ADMIN' || (isOwner && isPending)) && (
                      <button
                        type="button"
                        disabled={isDocActionLoading}
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-magenta/10 text-magenta">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Upload Cube Document
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Securely upload fellowship documents. Sensitive files are only accessible by authorized mentors and admins.
            </p>

            {uploadError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Type *
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    const newType = e.target.value as DocumentType;
                    setSelectedType(newType);
                    if (!docTitle || Object.values(DOCUMENT_TYPE_LABELS).some((m) => docTitle.startsWith(m.label))) {
                      setDocTitle(DOCUMENT_TYPE_LABELS[newType].label);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-magenta focus:ring-1 focus:ring-magenta transition"
                >
                  {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((typeKey) => (
                    <option key={typeKey} value={typeKey}>
                      {DOCUMENT_TYPE_LABELS[typeKey].label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  {DOCUMENT_TYPE_LABELS[selectedType].description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. 2026 Signed Non-Disclosure Agreement"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-magenta focus:ring-1 focus:ring-magenta transition"
                />
              </div>

              {/* File picker drop area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  File (PDF, Image, or Word) *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? 'border-magenta bg-magenta/5'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileChange(f);
                    }}
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <FileCheck className="w-8 h-8 text-magenta mb-1" />
                      <p className="text-xs font-extrabold text-gray-900 truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {formatFileSize(selectedFile.size)} · Click to replace
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                      <p className="text-xs font-bold text-gray-700">
                        Click to browse or drag and drop your file here
                      </p>
                      <p className="text-[11px] text-gray-400">
                        PDF, PNG, JPG, DOCX (Max. 15MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description / Extra Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={docNotes}
                  onChange={(e) => setDocNotes(e.target.value)}
                  placeholder="Any additional notes regarding this document..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-magenta focus:ring-1 focus:ring-magenta transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-magenta text-white hover:bg-magenta/90 shadow-md shadow-magenta/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Upload Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (Staff only) */}
      {reviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setReviewDoc(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">
              Review Document
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Set review decision for "{reviewDoc.title}".
            </p>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Review Decision *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatus('APPROVED')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      reviewStatus === 'APPROVED'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewStatus('REJECTED')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      reviewStatus === 'REJECTED'
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Request Changes</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Review Notes / Feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewStatus === 'APPROVED'
                      ? 'Optional note...'
                      : 'Please specify required changes or missing items for the Cube (e.g. missing signature, illegible scan)...'
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-magenta transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReviewDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-black transition flex items-center gap-1.5"
                >
                  {reviewLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Decision</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
