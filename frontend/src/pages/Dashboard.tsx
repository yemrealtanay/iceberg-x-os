import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { MentorDashboard } from './MentorDashboard';
import { CubeDashboard } from './CubeDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [viewAsMentor, setViewAsMentor] = useState(false);

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <button
            onClick={() => setViewAsMentor(!viewAsMentor)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-magenta font-bold text-xs rounded-xl shadow-subtle hover:shadow-premium transition-all duration-200"
          >
            {viewAsMentor ? '← Switch to Admin Operations' : 'Switch to Mentor Workspace →'}
          </button>
        </div>
        {viewAsMentor ? <MentorDashboard /> : <AdminDashboard />}
      </div>
    );
  }

  switch (user.role) {
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
