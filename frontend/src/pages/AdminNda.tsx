import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Building,
  Calendar,
  Send,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';

export type NdaStatusType = 'not_sent' | 'pending' | 'signed' | 'not_signed';

interface CubeNdaRecord {
  id: string;
  user_id: string;
  cube_number: string;
  cohort: string;
  university: string;
  department: string;
  current_level: string;
  internship_status?: string | null;
  is_founding_cube?: boolean;
  nda_signed: boolean;
  nda_signed_at?: string | null;
  nda_status?: NdaStatusType;
  user: {
    id: string;
    name: string;
    email: string;
  };
  assigned_mentor?: {
    id: string;
    name: string;
  } | null;
}

export const AdminNda: React.FC = () => {
  const [cubes, setCubes] = useState<CubeNdaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cohortFilter, setCohortFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const fetchCubes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/cubes?includeAlumni=true');
      setCubes(res || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Cubes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCubes();
  }, []);

  const getEffectiveStatus = (cube: CubeNdaRecord): NdaStatusType => {
    if (cube.nda_status) return cube.nda_status;
    return cube.nda_signed ? 'signed' : 'not_sent';
  };

  const handleSetStatus = async (cube: CubeNdaRecord, newStatus: NdaStatusType) => {
    setActionLoadingId(cube.id);
    try {
      const res = await api.patch(`/cubes/${cube.id}/nda`, { nda_status: newStatus });
      const updatedNdaStatus = res.cube?.nda_status ?? newStatus;
      const isSigned = updatedNdaStatus === 'signed';

      setCubes((prev) =>
        prev.map((c) =>
          c.id === cube.id
            ? {
                ...c,
                nda_status: updatedNdaStatus,
                nda_signed: isSigned,
                nda_signed_at: isSigned ? res.cube?.nda_signed_at || new Date().toISOString() : null,
              }
            : c
        )
      );

      const statusLabels: Record<NdaStatusType, string> = {
        not_sent: 'Not Sent',
        pending: 'Pending Signature',
        signed: 'Signed',
        not_signed: 'Not Signed',
      };

      setToastMessage(`Cube #${cube.cube_number} (${cube.user?.name}) marked as "${statusLabels[newStatus]}".`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update NDA status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Distinct values for filter dropdowns
  const cohorts = useMemo(() => {
    const set = new Set<string>();
    cubes.forEach((c) => {
      if (c.cohort) set.add(c.cohort);
    });
    return Array.from(set).sort();
  }, [cubes]);

  const levels = useMemo(() => {
    const set = new Set<string>();
    cubes.forEach((c) => {
      if (c.current_level) set.add(c.current_level);
    });
    return Array.from(set).sort();
  }, [cubes]);

  // Filtered Cubes
  const filteredCubes = useMemo(() => {
    return cubes.filter((c) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.cube_number.toLowerCase().includes(query) ||
        (c.user?.name || '').toLowerCase().includes(query) ||
        (c.user?.email || '').toLowerCase().includes(query) ||
        (c.university || '').toLowerCase().includes(query) ||
        (c.department || '').toLowerCase().includes(query);

      const effectiveStatus = getEffectiveStatus(c);
      const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
      const matchesCohort = cohortFilter === 'all' || c.cohort === cohortFilter;
      const matchesLevel = levelFilter === 'all' || c.current_level === levelFilter;

      return matchesSearch && matchesStatus && matchesCohort && matchesLevel;
    });
  }, [cubes, searchQuery, statusFilter, cohortFilter, levelFilter]);

  // KPI Calculations
  const totalCubes = cubes.length;
  const notSentCount = cubes.filter((c) => getEffectiveStatus(c) === 'not_sent').length;
  const pendingCount = cubes.filter((c) => getEffectiveStatus(c) === 'pending').length;
  const signedCount = cubes.filter((c) => getEffectiveStatus(c) === 'signed').length;
  const notSignedCount = cubes.filter((c) => getEffectiveStatus(c) === 'not_signed').length;
  const signedPercentage = totalCubes > 0 ? Math.round((signedCount / totalCubes) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-[1500px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 animate-fadeIn text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">NDA & Agreements</h1>
            <span className="bg-magenta/10 text-magenta text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Administration
            </span>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            Track, send, and verify Non-Disclosure Agreements (Gizlilik Sözleşmesi) across the fellowship pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCubes}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Not Sent */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'not_sent' ? 'all' : 'not_sent')}
          className={`p-5 rounded-2xl shadow-subtle border transition-all cursor-pointer ${
            statusFilter === 'not_sent'
              ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-400/20'
              : 'bg-white border-gray-100 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-blue-600 uppercase flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Not Sent
            </span>
            <span className="text-[10px] font-bold text-gray-400">Needs Dispatch</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">{notSentCount}</div>
          <p className="text-xs text-gray-500 mt-0.5">Agreement not dispatched yet</p>
        </div>

        {/* Pending Signature */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          className={`p-5 rounded-2xl shadow-subtle border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-gray-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-amber-600 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              Pending
            </span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Sent
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">{pendingCount}</div>
          <p className="text-xs text-gray-500 mt-0.5">Sent, awaiting Cube signature</p>
        </div>

        {/* NDA Signed */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'signed' ? 'all' : 'signed')}
          className={`p-5 rounded-2xl shadow-subtle border transition-all cursor-pointer ${
            statusFilter === 'signed'
              ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-white border-gray-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-emerald-600 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Signed
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {signedPercentage}%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">{signedCount}</div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${signedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Not Signed / Declined */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'not_signed' ? 'all' : 'not_signed')}
          className={`p-5 rounded-2xl shadow-subtle border transition-all cursor-pointer ${
            statusFilter === 'not_signed'
              ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-gray-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-rose-600 uppercase flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Not Signed
            </span>
            <span className="text-[10px] font-bold text-gray-400">Total: {totalCubes}</span>
          </div>
          <div className="text-3xl font-extrabold text-rose-700 mt-2">{notSignedCount}</div>
          <p className="text-xs text-gray-500 mt-0.5">Declined or unconfirmed</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-subtle flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, cube number, email, university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-semibold text-xs transition-all focus:bg-white focus:border-magenta/30"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <div className="relative min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Statuses ({totalCubes})</option>
              <option value="not_sent">✉ Not Sent ({notSentCount})</option>
              <option value="pending">⏳ Pending Signature ({pendingCount})</option>
              <option value="signed">✓ Signed ({signedCount})</option>
              <option value="not_signed">✕ Not Signed ({notSignedCount})</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Filter by Cohort */}
          <div className="relative min-w-[140px]">
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Filter by Level */}
          <div className="relative min-w-[130px]">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer pr-8"
            >
              <option value="all">All Levels</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-subtle overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-magenta border-t-transparent animate-spin"></div>
            <p className="text-xs font-bold text-gray-400">Loading fellowship agreements...</p>
          </div>
        ) : error ? (
          <div className="py-16 px-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="font-extrabold text-sm text-gray-900">Failed to load data</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">{error}</p>
          </div>
        ) : filteredCubes.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="font-extrabold text-sm text-gray-900">No Cubes match the selected filters</h3>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search query or clear the filters above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-extrabold tracking-wider uppercase text-gray-400">
                  <th className="py-3 px-4">Cube</th>
                  <th className="py-3 px-4">Cohort &amp; Level</th>
                  <th className="py-3 px-4">University &amp; Dept</th>
                  <th className="py-3 px-4">NDA Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredCubes.map((cube) => {
                  const isActionLoading = actionLoadingId === cube.id;
                  const isFounding = cube.is_founding_cube;
                  const status = getEffectiveStatus(cube);

                  return (
                    <tr
                      key={cube.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Cube Identifier */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono font-extrabold text-[11px] px-2 py-0.5 rounded border shrink-0 ${
                              isFounding
                                ? 'bg-amber-400/10 border-amber-400/20 text-amber-700'
                                : 'bg-magenta/5 border-magenta/15 text-magenta'
                            }`}
                          >
                            #{cube.cube_number}
                          </span>
                          <div className="min-w-0">
                            <Link
                              to={`/cubes/${cube.id}`}
                              className="font-extrabold text-gray-900 hover:text-magenta transition-colors flex items-center gap-1.5 truncate"
                            >
                              <span>{cube.user?.name || 'Unknown Cube'}</span>
                              {isFounding && (
                                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                              )}
                            </Link>
                            <p className="text-[11px] text-gray-400 truncate">{cube.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Cohort & Level */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-semibold text-gray-700">{cube.cohort || 'N/A'}</span>
                          <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200/60">
                            {cube.current_level.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>

                      {/* University & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="min-w-0 max-w-[220px]">
                          <p className="font-semibold text-gray-800 truncate">
                            {cube.university || 'N/A'}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {cube.department || 'General'}
                          </p>
                        </div>
                      </td>

                      {/* NDA Status Badge */}
                      <td className="py-3.5 px-4">
                        {status === 'signed' ? (
                          <div className="inline-flex flex-col items-start gap-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Signed</span>
                            </span>
                            {cube.nda_signed_at && (
                              <span className="text-[10px] font-mono text-gray-400 pl-1">
                                {new Date(cube.nda_signed_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        ) : status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Pending Signature</span>
                          </span>
                        ) : status === 'not_signed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Not Signed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200">
                            <Send className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Not Sent</span>
                          </span>
                        )}
                      </td>

                      {/* Quick Status Select / Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <div className="relative">
                            <select
                              value={status}
                              disabled={isActionLoading}
                              onChange={(e) => handleSetStatus(cube, e.target.value as NdaStatusType)}
                              className={`py-1.5 pl-2.5 pr-7 rounded-xl text-xs font-bold border transition-all appearance-none cursor-pointer outline-none shadow-sm disabled:opacity-50 ${
                                status === 'signed'
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                                  : status === 'pending'
                                  ? 'bg-amber-50/70 border-amber-200 text-amber-800'
                                  : status === 'not_signed'
                                  ? 'bg-rose-50/70 border-rose-200 text-rose-800'
                                  : 'bg-blue-50/70 border-blue-200 text-blue-800'
                              }`}
                            >
                              <option value="not_sent">✉ Not Sent</option>
                              <option value="pending">⏳ Pending</option>
                              <option value="signed">✓ Signed</option>
                              <option value="not_signed">✕ Not Signed</option>
                            </select>
                            <div className="absolute right-2 top-2.5 pointer-events-none text-gray-400">
                              {isActionLoading ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <span className="text-[10px]">▼</span>
                              )}
                            </div>
                          </div>

                          <Link
                            to={`/cubes/${cube.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 hover:border-magenta/30 hover:text-magenta text-gray-500 bg-white transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
