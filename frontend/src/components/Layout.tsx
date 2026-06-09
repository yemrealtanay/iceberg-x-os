import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Users, Rocket, Award, FolderOpen, Calendar, Shield, KeyRound } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    const common = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/directory', label: 'Cube Directory', icon: Users },
      { path: '/missions', label: 'Missions', icon: Rocket },
      { path: '/vault', label: 'Cube Vault', icon: FolderOpen },
      { path: '/badges', label: 'Badges', icon: Award },
    ];

    if (user.role === 'ADMIN') {
      return [
        ...common,
        { path: '/teams', label: 'Teams', icon: Shield },
        { path: '/demodays', label: 'Demo Days', icon: Calendar },
        { path: '/admin/users', label: 'Users Admin', icon: Users },
      ];
    }

    if (user.role === 'MENTOR') {
      return [
        ...common,
        { path: '/teams', label: 'Teams', icon: Shield },
        { path: '/demodays', label: 'Demo Days', icon: Calendar },
      ];
    }

    return common;
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-slate-50 text-dark flex flex-col font-sans">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-90 transition-opacity">
                <img src="/images/xicon.jpg" alt="Icon" className="w-8 h-8 rounded-lg object-cover shadow-sm border border-gray-100" />
                <span>Iceberg<span className="text-magenta font-extrabold">X</span> OS</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-magenta text-white shadow-md shadow-magenta/20'
                        : 'text-gray-600 hover:text-magenta hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right-side User Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-bold leading-tight text-gray-900">{user.name}</p>
                  <p className="text-[10px] text-magenta font-bold tracking-wider uppercase">{user.role}</p>
                </div>
                {user.cubeNumber && (
                  <div className="bg-magenta/10 text-magenta font-bold px-1.5 py-0.5 rounded text-[10px]">
                    #{user.cubeNumber}
                  </div>
                )}
              </div>
              <Link
                to="/change-password"
                className="p-1.5 text-gray-400 hover:text-magenta hover:bg-gray-50 rounded-full transition-colors duration-200"
                title="Change password"
              >
                <KeyRound className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-magenta hover:bg-gray-50 rounded-full transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-magenta hover:bg-gray-50 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-inner animate-fadeIn">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-magenta text-white'
                      : 'text-gray-600 hover:text-magenta hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-magenta font-semibold tracking-wider uppercase">{user.role}</p>
                </div>
                {user.cubeNumber && (
                  <span className="bg-magenta/10 text-magenta font-bold px-1.5 py-0.5 rounded text-xs">
                    #{user.cubeNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/change-password"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 text-gray-500 hover:text-magenta hover:bg-magenta/5 border border-gray-100 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Password</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 text-gray-500 hover:text-magenta hover:bg-magenta/5 border border-gray-100 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Iceberg Digital. All rights reserved.</p>
          <p className="text-magenta font-bold tracking-wider">ONCE A CUBE, ALWAYS A CUBE.</p>
        </div>
      </footer>
    </div>
  );
};
