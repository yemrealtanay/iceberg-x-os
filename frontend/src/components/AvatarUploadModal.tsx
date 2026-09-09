import React, { useState, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Camera, X, Trash2, Check, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newUrl: string | null) => void;
  cubeId?: string; // Optional: if editing a specific Cube's avatar
  userName?: string;
  currentAvatarUrl?: string | null;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  cubeId,
  userName,
  currentAvatarUrl,
}) => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayName = userName || user?.name || 'User';
  const effectiveCurrentUrl = previewUrl !== null ? previewUrl : (currentAvatarUrl ?? user?.avatarUrl);

  const handleFileSelect = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      // If cubeId provided, upload to cube avatar endpoint or universal endpoint
      const endpoint = cubeId ? `/cubes/${cubeId}/avatar` : '/users/me/avatar';

      let newAvatarUrl: string | null = null;
      if (cubeId) {
        // cubes/:id/avatar accepts base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(selectedFile);
        const base64 = await base64Promise;
        const res = await api.post(`/cubes/${cubeId}/avatar`, { avatar_base64: base64 });
        newAvatarUrl = res.avatar_url;
      } else {
        const res = await api.upload('/users/me/avatar', formData);
        newAvatarUrl = res.avatar_url || res.avatarUrl;
      }

      await refreshUser();
      if (onSuccess) onSuccess(newAvatarUrl);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;

    setLoading(true);
    setError(null);

    try {
      if (!cubeId) {
        await api.delete('/users/me/avatar');
      }
      await refreshUser();
      if (onSuccess) onSuccess(null);
      setPreviewUrl(null);
      setSelectedFile(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to remove photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-extrabold text-gray-900 mb-1">
          Profile Photo
        </h3>
        <p className="text-xs text-gray-400 mb-6">
          Upload a clear photo to personalize your profile across the portal.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative group">
            <UserAvatar
              name={displayName}
              avatarUrl={effectiveCurrentUrl}
              size="xl"
              className="ring-4 ring-magenta/10 shadow-lg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Change</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 text-gray-700 hover:border-magenta hover:text-magenta transition flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Choose Image</span>
            </button>
            {effectiveCurrentUrl && !cubeId && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || loading}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-magenta text-white hover:bg-magenta/90 shadow-md shadow-magenta/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Save Photo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
