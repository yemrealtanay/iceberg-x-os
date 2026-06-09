import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, Plus, Filter, ShieldAlert } from 'lucide-react';

export const Missions: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const fetchMissions = async () => {
    try {
      const res = await api.get('/missions');
      setMissions(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
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

  // Filter client side (or server side, we support client filter for speed)
  const filteredMissions = missions.filter((m) => {
    const matchesStatus = statusFilter ? m.status === statusFilter : true;
    const matchesDiff = difficultyFilter ? m.difficulty_level === difficultyFilter : true;
    return matchesStatus && matchesDiff;
  });

  const isMentorOrAdmin = user?.role === 'ADMIN' || user?.role === 'MENTOR';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">R&D Missions</h1>
          <p className="text-gray-500 mt-1">Explore, prototype, and deliver commercial-grade challenges.</p>
        </div>
        {isMentorOrAdmin && (
          <Link
            to="/missions/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm shadow-magenta/15"
          >
            <Plus className="w-4 h-4" />
            <span>New Mission</span>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-subtle flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Filter className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="idea_pool">Idea Pool</option>
            <option value="selected">Selected</option>
            <option value="researching">Researching</option>
            <option value="building_demo">Building Demo</option>
            <option value="preparing_handover">Preparing Handover</option>
            <option value="demo_ready">Demo Ready</option>
            <option value="reviewed">Reviewed</option>
            <option value="promoted_to_product_backlog">Promoted to Backlog</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Filter className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
          >
            <option value="">All Difficulties</option>
            <option value="Level_1_Research_Only">Level 1 - Research Only</option>
            <option value="Level_2_Research_Mock">Level 2 - Research + Mock</option>
            <option value="Level_3_Working_POC">Level 3 - Working POC</option>
            <option value="Level_4_Integration_Candidate">Level 4 - Integration Candidate</option>
            <option value="Level_5_Main_Team_Assist">Level 5 - Main Team Assist</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredMissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((m) => (
            <Link
              key={m.id}
              to={`/missions/${m.id}`}
              className="bg-white border border-gray-100 hover:border-magenta/20 hover:-translate-y-1 p-6 rounded-2xl shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between gap-5 group"
            >
              <div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold text-magenta bg-magenta/5 border border-magenta/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {m.difficulty_level.replace(/_/g, ' ').replace('Level ', 'L')}
                  </span>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                    {m.category}
                  </span>
                  <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 border border-gray-200/50 px-2.5 py-0.5 rounded-full uppercase ml-auto">
                    {m.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="font-extrabold text-gray-900 group-hover:text-magenta transition-colors mt-4 text-base leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{m.description}</p>
              </div>

              <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>Mentor: {m.mentor ? m.mentor.name : 'Unassigned'}</span>
                <span className="text-magenta group-hover:translate-x-1 transition-transform">Details →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No R&D missions found.
        </p>
      )}
    </div>
  );
};
