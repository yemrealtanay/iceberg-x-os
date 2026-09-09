import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assets';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-16 h-16 text-lg font-extrabold',
  xl: 'w-24 h-24 text-2xl font-black',
};

const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Generates a consistent subtle gradient based on name string
const getGradientByName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    'from-pink-500 to-rose-600 text-white',
    'from-purple-500 to-indigo-600 text-white',
    'from-cyan-500 to-blue-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-fuchsia-500 to-pink-600 text-white',
  ];
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  const [loadError, setLoadError] = useState(false);
  const resolvedUrl = getAssetUrl(avatarUrl);
  const sizeClass = sizeClasses[size];
  const initials = getInitials(name);
  const gradientClass = getGradientByName(name);

  if (resolvedUrl && !loadError) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        onError={() => setLoadError(true)}
        className={`${sizeClass} rounded-full object-cover border border-gray-200/80 shadow-sm shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      title={name}
      className={`${sizeClass} rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center font-bold tracking-tight shadow-sm shrink-0 select-none ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
};
