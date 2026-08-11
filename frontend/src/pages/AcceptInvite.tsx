import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Lock, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

/**
 * Public page where an invited person sets their own password.
 *
 * Replaces the previous onboarding, where every approved Cube received the same
 * shared DEFAULT_CUBE_PASSWORD. Accounts created before this still sign in with
 * their existing password — nothing about them changed.
 */
export const AcceptInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/invites/${token}`);
        setInvite(res);
      } catch (err: any) {
        setLoadError(err.message || 'This invitation link is not valid.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/invites/${token}/accept`, { password });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err: any) {
      setError(err.message || 'Could not set your password. The link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-ice px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 sm:p-10 rounded-[2rem] shadow-premium flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-[1.55rem] bg-white border border-gray-100 shadow-lg shadow-black/5 p-1.5">
            <img src="/images/xicon.jpg" alt="Iceberg X" className="w-full h-full rounded-[1.25rem] object-cover" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">Iceberg X OS</h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mt-1">Set up your account</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) {
    return shell(
      <div className="flex justify-center py-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent" />
      </div>
    );
  }

  if (loadError) {
    return shell(
      <>
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{loadError}</div>
        </div>
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Invitation links expire after a few days and can only be used once.
          Ask your mentor to send you a new one.
        </p>
        <Link
          to="/login"
          className="text-center text-xs font-bold text-magenta hover:text-magenta-hover transition-colors"
        >
          Back to sign in
        </Link>
      </>
    );
  }

  if (done) {
    return shell(
      <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-5 rounded-2xl flex flex-col items-center gap-2 text-center">
        <CheckCircle className="w-8 h-8" />
        <p className="font-bold text-sm">Your password is set.</p>
        <p className="text-xs font-semibold">Taking you to the sign-in page…</p>
      </div>
    );
  }

  return shell(
    <>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col gap-1">
        <p className="text-sm font-extrabold text-gray-900">Welcome, {invite.name}</p>
        <p className="text-xs font-semibold text-gray-500">
          {invite.maskedEmail}
          {invite.cubeNumber && <span className="ml-2 text-magenta font-bold">Cube #{invite.cubeNumber}</span>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider pl-1">
            Choose a password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:border-magenta transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider pl-1">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:border-magenta transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-magenta text-white font-bold text-sm rounded-xl hover:bg-magenta-hover transition-colors shadow-sm shadow-magenta/20 disabled:opacity-70"
        >
          {submitting ? 'Setting password…' : 'Set password and continue'}
        </button>
      </form>

      <p className="text-[11px] text-gray-400 font-semibold flex items-start gap-1.5 leading-relaxed">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        This link works only once. Nobody at Iceberg can see the password you choose.
      </p>
    </>
  );
};
