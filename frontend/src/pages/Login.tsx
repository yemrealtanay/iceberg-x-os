import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      
      const origin = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-ice px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 sm:p-10 rounded-[2rem] shadow-premium flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-[1.55rem] bg-white border border-gray-100 shadow-lg shadow-black/5 p-1.5">
            <img src="/images/xicon.jpg" alt="Iceberg X" className="w-full h-full rounded-[1.25rem] object-cover" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">Iceberg X OS</h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mt-1">Programme operating layer</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm font-medium animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@iceberg.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-magenta focus:bg-white rounded-2xl outline-none font-semibold text-sm transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-magenta focus:bg-white rounded-2xl outline-none font-semibold text-sm transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-magenta text-white font-bold text-sm tracking-wide rounded-2xl hover:bg-magenta-hover active:scale-[0.98] transition-all duration-150 shadow-md shadow-magenta/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Enter Platform →'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 flex flex-col gap-1 mt-2">
          <p>This is an internal operating platform.</p>
          <p className="text-magenta font-semibold tracking-wider">ONCE A CUBE, ALWAYS A CUBE.</p>
        </div>
      </div>
    </div>
  );
};
