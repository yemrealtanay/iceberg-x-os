import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plus, Edit, Users, Trash } from 'lucide-react';

export const Teams: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [cubes, setCubes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState('');
  const [members, setMembers] = useState<{ cubeProfileId: string; role: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [teamsRes, missionsRes, cubesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/missions'),
        api.get('/cubes')
      ]);
      setTeams(teamsRes);
      setMissions(missionsRes);
      setCubes(cubesRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load teams data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMemberRow = () => {
    setMembers([...members, { cubeProfileId: '', role: 'Contributor' }]);
  };

  const handleRemoveMemberRow = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: 'cubeProfileId' | 'role', val: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: val };
    setMembers(updated);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingTeamId(null);
    setTeamName('');
    setSelectedMissionId(missions[0]?.id || '');
    setMembers([{ cubeProfileId: '', role: 'Contributor' }]);
    setShowForm(true);
  };

  const handleOpenEdit = (team: any) => {
    setIsEditing(true);
    setEditingTeamId(team.id);
    setTeamName(team.name);
    setSelectedMissionId(team.mission_id);
    setMembers(team.members.map((m: any) => ({
      cubeProfileId: m.cube_id,
      role: m.role
    })));
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    setSubmitting(true);
    setError(null);

    // Filter empty selections
    const validMembers = members.filter(m => m.cubeProfileId);

    try {
      if (isEditing && editingTeamId) {
        await api.put(`/teams/${editingTeamId}`, {
          members: validMembers
        });
      } else {
        await api.post(`/missions/${selectedMissionId}/teams`, {
          name: teamName,
          members: validMembers
        });
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save team');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  const isMentorOrAdmin = user?.role === 'ADMIN' || user?.role === 'MENTOR';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Mission Teams</h1>
          <p className="text-gray-500 mt-1">Manage cross-functional R&D mission teams and participant roles.</p>
        </div>
        {isMentorOrAdmin && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Drawer/Form */}
      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-premium flex flex-col gap-5 max-w-2xl animate-fadeIn">
          <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2">
            {isEditing ? `Edit Members: ${teamName}` : 'Create New Mission Team'}
          </h3>

          {!isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Gamma"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Assigned Mission</label>
                <select
                  value={selectedMissionId}
                  onChange={e => setSelectedMissionId(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none cursor-pointer"
                >
                  {missions.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Members Table Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Team Members</label>
            {members.map((member, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <select
                  value={member.cubeProfileId}
                  onChange={e => handleMemberChange(idx, 'cubeProfileId', e.target.value)}
                  className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="">Select a Cube...</option>
                  {cubes.map(c => (
                    <option key={c.id} value={c.id}>
                      Cube #{c.cube_number} - {c.user.name}
                    </option>
                  ))}
                </select>

                <select
                  value={member.role}
                  onChange={e => handleMemberChange(idx, 'role', e.target.value)}
                  className="w-48 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="Mission_Lead">Mission Lead</option>
                  <option value="Technical_Explorer">Technical Explorer</option>
                  <option value="Demo_Builder">Demo Builder</option>
                  <option value="Documenter">Documenter</option>
                  <option value="Presenter">Presenter</option>
                  <option value="Contributor">Contributor</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveMemberRow(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 border border-gray-100 rounded-lg transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddMemberRow}
              className="mt-1 self-start px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
            >
              + Add Member Row
            </button>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 bg-white border border-gray-200 text-gray-500 font-bold text-xs rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-magenta text-white font-bold text-xs rounded-lg hover:bg-magenta-hover disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* Grid representation of Teams */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-subtle flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">{team.name}</h3>
                  <p className="text-xs text-magenta font-semibold mt-0.5">Mission: {team.mission.title}</p>
                </div>
                {isMentorOrAdmin && (
                  <button
                    onClick={() => handleOpenEdit(team)}
                    className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:text-magenta transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Members List */}
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-magenta" />
                  <span>Team Members ({team.members?.length || 0})</span>
                </p>

                {team.members && team.members.length > 0 ? (
                  <div className="flex flex-col divide-y divide-gray-50">
                    {team.members.map((m: any) => (
                      <div key={m.id} className="flex justify-between items-center py-2 text-xs">
                        <span className="font-bold text-gray-700">{m.cube.user.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-extrabold bg-magenta/5 border border-magenta/10 text-magenta px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {m.role.replace(/_/g, ' ')}
                          </span>
                          <span className="text-gray-400 font-bold">#{m.cube.cube_number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No members assigned to this team.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-100 rounded-2xl shadow-subtle">
          No teams created yet.
        </p>
      )}
    </div>
  );
};
