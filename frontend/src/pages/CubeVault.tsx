import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { FolderOpen, Filter, ShieldAlert, GitBranch, ExternalLink } from 'lucide-react';

export const CubeVault: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [decisionFilter, setDecisionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchVaultMissions = async () => {
    try {
      // Query all missions; we will filter for reviewed/promoted/archived in frontend
      const res = await api.get('/missions');
      setMissions(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Cube Vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultMissions();
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

  // Filter for Vault items: status reviewed, promoted_to_product_backlog, or archived
  const vaultMissions = missions.filter((m) => {
    const isVaultStatus = ['reviewed', 'promoted_to_product_backlog', 'archived'].includes(m.status);
    const matchesDecision = decisionFilter ? m.decision === decisionFilter : true;
    const matchesStatus = statusFilter ? m.status === statusFilter : true;

    return isVaultStatus && matchesDecision && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">The Cube Vault</h1>
        <p className="text-gray-500 mt-1">Permanent repository of completed Iceberg X prototypes, outcomes, and research logs.</p>
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
            <option value="">All statuses</option>
            <option value="reviewed">Reviewed</option>
            <option value="promoted_to_product_backlog">Promoted to Backlog</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Filter className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 rounded-xl outline-none font-bold text-xs appearance-none cursor-pointer"
          >
            <option value="">All Decisions</option>
            <option value="Promote_to_Product_Backlog">Promote to Product Backlog</option>
            <option value="Needs_More_Research">Needs More Research</option>
            <option value="Keep_as_Internal_Tool">Keep as Internal Tool</option>
            <option value="Archive">Archive</option>
            <option value="Moved_to_Product">Moved to Product</option>
          </select>
        </div>
      </div>

      {/* Archive Items list */}
      {vaultMissions.length > 0 ? (
        <div className="flex flex-col gap-6">
          {vaultMissions.map((m) => {
            const team = m.teams[0] || null;
            const cubeNumbers = team
              ? team.members.map((mem: any) => `#${mem.cube.cube_number}`).join(', ')
              : 'N/A';
            const lastDemo = m.demo_submissions && m.demo_submissions[0];

            return (
              <div key={m.id} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-subtle flex flex-col gap-5">
                
                {/* Header Title Block */}
                <div className="flex flex-wrap justify-between items-start border-b border-gray-50 pb-3 gap-2">
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 leading-snug">{m.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                      Team: <span className="text-gray-700">{team ? team.name : 'No team'}</span> · Cubes: <span className="text-magenta">{cubeNumbers}</span> · Mentor: <span className="text-gray-700">{m.mentor ? m.mentor.name : 'Unassigned'}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="text-[10px] font-extrabold text-magenta bg-magenta/5 border border-magenta/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {m.status.replace(/_/g, ' ')}
                    </span>
                    {m.decision && (
                      <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 border border-gray-200/50 px-2.5 py-0.5 rounded-full uppercase">
                        {m.decision.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed font-medium">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-gray-800 uppercase tracking-wide">Problem Statement</h4>
                      <p className="mt-1 font-mono bg-gray-50 p-3 rounded-lg border border-gray-100">{m.problem_statement}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 uppercase tracking-wide">What Was Tried</h4>
                      <p className="mt-1">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {lastDemo ? (
                      <>
                        <div>
                          <h4 className="font-bold text-gray-800 uppercase tracking-wide">What Was Built</h4>
                          <p className="mt-1 italic">"{lastDemo.what_we_built}"</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 uppercase tracking-wide">What Was Learned</h4>
                          <p className="mt-1 italic">"{lastDemo.what_we_learned}"</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 italic">No demo reflection logged in database.</p>
                    )}
                  </div>
                </div>

                {/* Actions & Links Row */}
                <div className="border-t border-gray-50 pt-4 mt-2 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex gap-4 text-xs font-bold text-gray-500">
                    {m.repository_url && (
                      <a href={m.repository_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-magenta">
                        <GitBranch className="w-4 h-4 text-magenta" />
                        <span>Code Repository</span>
                      </a>
                    )}
                    {m.demo_url && (
                      <a href={m.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-magenta">
                        <ExternalLink className="w-4 h-4 text-magenta" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <Link to={`/missions/${m.id}`} className="text-xs font-bold text-magenta hover:underline">
                    View Full Mission Timeline →
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No archived missions found in the Vault.
        </p>
      )}
    </div>
  );
};
