import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, ShieldAlert, Award } from 'lucide-react';

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
          {filteredCubes.map((cube) => (
            <Link
              key={cube.id}
              to={`/cubes/${cube.id}`}
              className="bg-white border border-gray-100 hover:border-magenta/20 hover:-translate-y-1 p-6 rounded-2xl shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between gap-5 group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-gray-900 group-hover:text-magenta transition-colors">
                      {cube.user.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{cube.cohort}</p>
                  </div>
                  <span className="bg-magenta/5 border border-magenta/10 text-magenta font-extrabold text-xs px-2.5 py-0.5 rounded">
                    #{cube.cube_number}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-bold text-magenta bg-magenta/5 border border-magenta/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
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
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No Cubes match the selected filters.
        </p>
      )}
    </div>
  );
};
