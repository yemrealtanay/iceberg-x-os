import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plus, Award, Check, Trash2, X } from 'lucide-react';
import { getBadgeConfig } from '../utils/badgeHelper';

export const Badges: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [cubes, setCubes] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Award Form States
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [selectedCubeId, setSelectedCubeId] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState('');
  const [awardReason, setAwardReason] = useState('');
  const [awardSubmitting, setAwardSubmitting] = useState(false);
  const [awardSuccess, setAwardSuccess] = useState(false);

  // Create Badge Form States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [newBadgeDesc, setNewBadgeDesc] = useState('');
  const [newBadgeIcon, setNewBadgeIcon] = useState('Builder');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const fetchBadgeData = async () => {
    try {
      const [badgesRes, cubesRes, missionsRes] = await Promise.all([
        api.get('/badges'),
        api.get('/cubes'),
        api.get('/missions')
      ]);
      setBadges(badgesRes);
      setCubes(cubesRes);
      setMissions(missionsRes);
      
      if (cubesRes.length > 0) setSelectedCubeId(cubesRes[0].id);
      if (badgesRes.length > 0) setSelectedBadgeId(badgesRes[0].id);
      if (missionsRes.length > 0) setSelectedMissionId(missionsRes[0].id);
    } catch (err: any) {
      setError(err.message || 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadgeData();
  }, []);

  const handleAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCubeId || !selectedBadgeId || !awardReason) return;

    setAwardSubmitting(true);
    try {
      await api.post('/badges/award', {
        cubeProfileId: selectedCubeId,
        badgeId: selectedBadgeId,
        missionId: selectedMissionId || undefined,
        reason: awardReason
      });
      setAwardSuccess(true);
      setAwardReason('');
      fetchBadgeData();
      setTimeout(() => {
        setShowAwardForm(false);
        setAwardSuccess(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to award badge');
    } finally {
      setAwardSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeName || !newBadgeDesc) return;

    setCreateSubmitting(true);
    try {
      await api.post('/badges', {
        name: newBadgeName,
        description: newBadgeDesc,
        icon: newBadgeIcon
      });
      setNewBadgeName('');
      setNewBadgeDesc('');
      setShowCreateForm(false);
      fetchBadgeData();
    } catch (err: any) {
      alert(err.message || 'Failed to create badge');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleDeleteBadge = async (badgeId: string) => {
    if (!window.confirm("Are you sure you want to delete this badge definition? All awarded instances will be deleted!")) return;
    try {
      await api.delete(`/badges/${badgeId}`);
      setBadges((prev) => prev.filter((b) => b.id !== badgeId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete badge');
    }
  };

  const handleRevokeAward = async (awardId: string) => {
    if (!window.confirm("Are you sure you want to revoke this badge award?")) return;
    try {
      await api.delete(`/badges/award/${awardId}`);
      fetchBadgeData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke badge award');
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
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Badges & Recognition</h1>
          <p className="text-gray-500 mt-1">Recognize milestones, original concepts, and excellent collaboration.</p>
        </div>
        
        <div className="flex gap-3">
          {isMentorOrAdmin && (
            <button
              onClick={() => { setShowAwardForm(!showAwardForm); setShowCreateForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Award Badge</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => { setShowCreateForm(!showCreateForm); setShowAwardForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Badge</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Award Badge Form */}
        {showAwardForm && (
          <form onSubmit={handleAwardSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-premium flex flex-col gap-4 animate-fadeIn">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2">Award Badge to a Cube</h3>

            {awardSuccess && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold p-2.5 rounded-lg border border-green-100 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Badge successfully awarded.</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Select Cube</label>
              <select value={selectedCubeId} onChange={e => setSelectedCubeId(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold">
                {cubes.map(c => (
                  <option key={c.id} value={c.id}>Cube #{c.cube_number} - {c.user.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Select Badge</label>
              <select value={selectedBadgeId} onChange={e => setSelectedBadgeId(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold">
                {badges.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Associated Mission (Optional)</label>
              <select value={selectedMissionId} onChange={e => setSelectedMissionId(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold">
                <option value="">None / General Fellowship Achievement</option>
                {missions.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Award Reason <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={2}
                placeholder="Why is this Cube receiving this badge? Provide specific examples..."
                value={awardReason}
                onChange={e => setAwardReason(e.target.value)}
                className="p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta resize-none font-semibold"
              />
            </div>

            <button type="submit" disabled={awardSubmitting} className="w-full py-2 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors">
              {awardSubmitting ? 'Awarding...' : 'Award Badge'}
            </button>
          </form>
        )}

        {/* Create Badge Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-premium flex flex-col gap-4 animate-fadeIn">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2">Create New Badge</h3>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Badge Name</label>
              <input type="text" required placeholder="e.g. Architect" value={newBadgeName} onChange={e => setNewBadgeName(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Badge Description</label>
              <textarea required rows={2} placeholder="Define what achievements qualify a Cube for this badge..." value={newBadgeDesc} onChange={e => setNewBadgeDesc(e.target.value)} className="p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta resize-none font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Class/Name</label>
              <select value={newBadgeIcon} onChange={e => setNewBadgeIcon(e.target.value)} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none cursor-pointer">
                <option value="Builder">Builder</option>
                <option value="Innovator">Innovator</option>
                <option value="Collaborator">Collaborator</option>
                <option value="Pathfinder">Pathfinder</option>
                <option value="Pioneer">Pioneer</option>
              </select>
            </div>

            <button type="submit" disabled={createSubmitting} className="w-full py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors">
              {createSubmitting ? 'Creating...' : 'Create Badge Definition'}
            </button>
          </form>
        )}
      </div>

      {/* Grid listing Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const config = getBadgeConfig(badge.icon, badge.name);
          const IconComp = config.icon;

          return (
            <div
              key={badge.id}
              className={`bg-white border ${config.borderColor} p-6 rounded-2xl shadow-subtle hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col gap-4 relative group`}
            >
              {isAdmin && (
                <button
                  onClick={() => handleDeleteBadge(badge.id)}
                  className="absolute top-4 right-4 p-1.5 hover:bg-red-50 border border-transparent rounded-lg text-gray-400 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Delete badge definition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Category Pill Tag */}
              <span className={`absolute top-4 ${isAdmin ? 'right-12' : 'right-4'} text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${config.badgeBg} ${config.textColor} tracking-wider font-sans`}>
                {config.category}
              </span>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center ${config.glow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">{badge.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Icon: {badge.icon}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-medium">{badge.description}</p>

              {/* List of earners */}
              <div className="border-t border-gray-50 pt-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Earned by ({badge.cube_badges?.length || 0})
                </p>
                {badge.cube_badges && badge.cube_badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {badge.cube_badges.map((award: any) => (
                      <span
                        key={award.id}
                        className="bg-magenta/5 border border-magenta/10 text-magenta text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                        title={award.reason}
                      >
                        <span>{award.cube.user.name}</span>
                        {isAdmin && (
                          <button
                            onClick={() => handleRevokeAward(award.id)}
                            className="hover:bg-magenta/10 rounded-full p-0.5 flex items-center justify-center"
                            title="Revoke award"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">No Cubes have earned this badge yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
