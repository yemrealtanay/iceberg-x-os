import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'MENTOR' | 'CUBE')[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-grey-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home dashboard if unauthorized
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
