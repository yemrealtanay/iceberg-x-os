import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { MentorDashboard } from './MentorDashboard';
import { CubeDashboard } from './CubeDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MENTOR':
      return <MentorDashboard />;
    case 'CUBE':
      return <CubeDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 font-semibold">Unknown user role configuration.</p>
        </div>
      );
  }
};
