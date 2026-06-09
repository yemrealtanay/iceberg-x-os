import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ShieldAlert, Award, Sparkles } from 'lucide-react';

export const Directory: React.FC = () => {
  const { user } = useAuth();
  const [cubes, setCubes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  useEffect(() => {
    const fetchCubes = async () => {
      try {
        const res = await api.get('/cubes');
        setCubes(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Cube directory');
      } finally {
        setLoading(false);
      }
    };

    fetchCubes();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  // Filter cubes
  const filteredCubes = cubes.filter((cube) => {
    const matchesSearch =
      cube.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cube.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cube.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter ? cube.status === statusFilter : true;
    const matchesLevel = levelFilter ? cube.current_level === levelFilter : true;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cube Directory</h1>
        <p className="text-gray-500 mt-1">Directory of all R&D internship participants and fellowship builders.</p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-subtle flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, university, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-semibold text-xs transition-all"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-44">
            <Filter className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="observer">Observer</option>
              <option value="project_contributor">Project Contributor</option>
              <option value="part_time_candidate">Part-Time Candidate</option>
              <option value="part_time">Part-Time</option>
              <option value="full_time_candidate">Full-Time Candidate</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          <div className="relative flex-1 md:w-44">
            <Filter className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
            >
              <option value="">All Levels</option>
              <option value="Cube">Cube</option>
              <option value="Senior_Cube">Senior Cube</option>
              <option value="Lead_Cube">Lead Cube</option>
              <option value="Cube_Mentor">Cube Mentor</option>
              <option value="Iceberg_Fellow">Iceberg Fellow</option>
            </select>
          </div>
        </div>
      </div>
      {/* Grid */}
      {filteredCubes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCubes.map((cube) => {
            const isFounding = cube.is_founding_cube;
            return (
              <Link
                key={cube.id}
                to={`/cubes/${cube.id}`}
                className={`p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between gap-5 group relative ${
                  isFounding
                    ? 'bg-gradient-to-br from-amber-50/20 via-white to-white border-2 border-amber-400/80 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.08)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1'
                    : 'bg-white border border-gray-100 hover:border-magenta/20 hover:-translate-y-1 shadow-subtle hover:shadow-premium'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-extrabold transition-colors flex items-center gap-1.5 ${
                        isFounding
                          ? 'text-gray-900 group-hover:text-amber-600'
                          : 'text-gray-900 group-hover:text-magenta'
                      }`}>
                        <span>{cube.user.name}</span>
                        {isFounding && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse flex-shrink-0" />}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{cube.cohort}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isFounding && (
                        <span className="bg-amber-400/10 border border-amber-400/30 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                          <Award className="w-3 h-3 text-amber-500" />
                          Founding Cube
                        </span>
                      )}
                      <span className={`font-extrabold text-xs px-2.5 py-0.5 rounded ${
                        isFounding
                          ? 'bg-amber-400/10 border border-amber-400/20 text-amber-700'
                          : 'bg-magenta/5 border border-magenta/10 text-magenta'
                      }`}>
                        #{cube.cube_number}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                      isFounding
                        ? 'text-amber-700 bg-amber-400/10 border-amber-400/20'
                        : 'text-magenta bg-magenta/5 border-magenta/10'
                    }`}>
                      {cube.current_level.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200/50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {cube.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-xs text-gray-500">
                    <p>
                      <span className="font-bold text-gray-600">Uni:</span> {cube.university || 'N/A'}
                    </p>
                    {cube.internship_status && (
                      <p>
                        <span className="font-bold text-gray-600">Internship:</span> <span className="text-magenta font-semibold">{cube.internship_status}</span>
                      </p>
                    )}
                    {cube.assigned_mentor && (
                      <p>
                        <span className="font-bold text-gray-600">Mentor:</span> {cube.assigned_mentor.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills Tags */}
                {cube.skills && cube.skills.length > 0 && (
                  <div className="border-t border-gray-50 pt-4 flex flex-wrap gap-1.5">
                    {cube.skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="bg-slate-50 border border-gray-100 text-[10px] font-semibold text-gray-500 px-2 py-0.5 rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {cube.skills.length > 3 && (
                      <span className="bg-slate-50 border border-gray-100 text-[10px] font-semibold text-gray-400 px-1.5 py-0.5 rounded-lg">
                        +{cube.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No Cubes match the selected filters.
        </p>
      )}
    </div>
  );
};
