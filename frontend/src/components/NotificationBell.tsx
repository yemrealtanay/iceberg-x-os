import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import { api } from '../utils/api';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When opening the dropdown: clear unread notification status in database
  const handleToggleOpen = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && notifications.length > 0) {
      try {
        // Clear all notifications in database immediately when read
        await api.post('/notifications/clear');
      } catch (err) {
        console.error('Failed to clear notifications in DB:', err);
      }
    } else if (!nextOpen) {
      // If we close the dropdown, empty the list as they are read and deleted
      setNotifications([]);
    }
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/notifications/clear');
      setNotifications([]);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggleOpen}
        className="relative p-1.5 text-gray-400 hover:text-magenta hover:bg-gray-50 rounded-full transition-colors duration-200"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-100">
            <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[10px] text-gray-405 hover:text-magenta font-extrabold uppercase flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Dismiss All</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 font-semibold italic">
                No new notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 hover:bg-gray-50/50 flex justify-between items-start gap-2 transition group"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-xs text-gray-700 font-semibold leading-relaxed break-words">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-gray-400 font-bold">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteOne(e, n.id)}
                    className="text-gray-300 hover:text-gray-550 p-1 rounded hover:bg-gray-150 transition opacity-0 group-hover:opacity-100 shrink-0"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
