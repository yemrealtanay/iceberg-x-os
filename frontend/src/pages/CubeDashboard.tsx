import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Award, Rocket, MessageSquare, ShieldAlert, Sparkles, Send, PlayCircle, ExternalLink, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getBadgeConfig } from '../utils/badgeHelper';

export const CubeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Submit Update modal/form states
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateType, setUpdateType] = useState('daily');
  const [updateContent, setUpdateContent] = useState('');
  const [updateBlockers, setUpdateBlockers] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/cube/dashboard');
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateContent) return;

    setUpdateSubmitting(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await api.post('/updates', {
        mission_id: data.activeMission.id,
        type: updateType,
        content: updateContent,
        blockers: updateBlockers || undefined
      });
      setUpdateSuccess(true);
      setUpdateContent('');
      setUpdateBlockers('');
      setTimeout(() => {
        setShowUpdateForm(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to submit update');
    } finally {
      setUpdateSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-magenta border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{error || 'Error loading dashboard'}</span>
      </div>
    );
  }

  const { profile, activeMission, activeTeam, upcomingDemoDay, recentFeedback } = data;

  return (
    <div className="flex flex-col gap-8">
      {/* Cube Banner */}
      <div className={`p-8 rounded-[2rem] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative overflow-hidden transition-all ${
        profile.is_founding_cube
          ? 'bg-gradient-to-br from-[#1a1103] to-[#0a0701] text-white border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
          : 'bg-gradient-to-br from-[#120009] to-[#0a0006] text-white shadow-premium'
      }`}>
        {/* Glow */}
        {profile.is_founding_cube ? (
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full filter blur-[80px] pointer-events-none"></div>
        ) : (
          <div className="absolute top-0 right-0 w-80 h-80 bg-magenta/20 rounded-full filter blur-[80px] pointer-events-none"></div>
        )}

        <div className="flex flex-col gap-1.5 relative z-10">
          <div className="flex items-center gap-3">
            <span className={`text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider ${
              profile.is_founding_cube 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-sm shadow-amber-500/20' 
                : 'bg-magenta'
            }`}>
              {profile.current_level.replace('_', ' ')}
            </span>
            {profile.is_founding_cube && (
              <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Founding Cube
              </span>
            )}
            <span className="text-gray-400 font-bold text-sm">Cube #{profile.cube_number}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <span>{user?.name}</span>
            {profile.is_founding_cube && <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />}
          </h1>
          <p className="text-gray-400 text-sm font-medium">{profile.cohort} · {profile.university}</p>
          
          {profile.is_founding_cube && (
            <div className="bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 mt-2 max-w-lg">
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
              <span>You are recognized as one of the elite <strong>Founding Cubes</strong> of the Iceberg X Portal.</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Badges Earned</p>
            <h2 className={`text-4xl font-extrabold mt-1 ${
              profile.is_founding_cube ? 'text-amber-400' : 'text-magenta'
            }`}>{profile.cube_badges?.length || 0}</h2>
          </div>
          <div className="text-center border-l border-white/10 pl-8">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
            <h2 className="text-xl font-bold text-gray-100 mt-2 uppercase tracking-wide">
              {profile.status.replace(/_/g, ' ')}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Mission & Team (Left 2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Mission Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5 text-magenta" />
                <span>My Active Mission</span>
              </h3>
              {activeMission && (
                <span className="text-xs font-bold text-magenta bg-magenta/5 border border-magenta/10 px-2.5 py-1 rounded-full uppercase">
                  {activeMission.status.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            {activeMission ? (
              <div className="flex flex-col gap-4">
                <div>
                  <Link to={`/missions/${activeMission.id}`} className="text-xl font-bold hover:text-magenta transition-colors">
                    {activeMission.title}
                  </Link>
                  <div className="markdown-body text-gray-500 text-xs mt-2 leading-relaxed">
                    <ReactMarkdown>{activeMission.description}</ReactMarkdown>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {activeMission.slack_channel_url && (
                    <a
                      href={activeMission.slack_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-magenta bg-gray-50 border border-gray-100 p-3 rounded-xl transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-magenta" />
                      <span>Slack Channel Link</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
                    </a>
                  )}
                  {activeMission.repository_url && (
                    <a
                      href={activeMission.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-magenta bg-gray-50 border border-gray-100 p-3 rounded-xl transition-all"
                    >
                      <PlayCircle className="w-4 h-4 text-magenta" />
                      <span>Repository URL</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
                    </a>
                  )}
                </div>

                {/* Submissions/Updates Quick Buttons */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm shadow-magenta/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Update</span>
                  </button>
                  <Link
                    to="/submit-demo"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Submit Demo Day Material</span>
                  </Link>
                </div>

                {/* Submit Update Inline Card */}
                {showUpdateForm && (
                  <form onSubmit={handleUpdateSubmit} className="mt-4 border border-magenta/10 bg-magenta/5 p-4 rounded-xl flex flex-col gap-3.5 animate-fadeIn">
                    <h4 className="font-bold text-xs text-magenta uppercase tracking-wider">New Progress Update</h4>

                    {updateSuccess && (
                      <div className="bg-green-50 text-green-700 text-xs font-semibold p-2.5 rounded-lg border border-green-100">
                        Update submitted successfully!
                      </div>
                    )}
                    {updateError && (
                      <div className="bg-red-50 text-red-700 text-xs font-semibold p-2.5 rounded-lg border border-red-100">
                        {updateError}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <label className="text-xs font-bold text-gray-600">Type:</label>
                      <div className="flex gap-3">
                        {['daily', 'weekly', 'mission_progress'].map((type) => (
                          <label key={type} className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                            <input
                              type="radio"
                              name="updateType"
                              value={type}
                              checked={updateType === type}
                              onChange={() => setUpdateType(type)}
                              className="text-magenta focus:ring-magenta"
                            />
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600">What did you build or discover?</label>
                      <textarea
                        required
                        placeholder="Detail your milestones and findings..."
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 focus:border-magenta rounded-lg text-xs outline-none font-semibold transition-colors"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-600">Blockers (Optional)</label>
                      <input
                        type="text"
                        placeholder="Any engineering bottlenecks or support needed?"
                        value={updateBlockers}
                        onChange={(e) => setUpdateBlockers(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-200 focus:border-magenta rounded-lg text-xs outline-none font-semibold transition-colors"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowUpdateForm(false)}
                        className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-500 font-bold text-xs rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateSubmitting}
                        className="px-4 py-1.5 bg-magenta text-white font-bold text-xs rounded-lg hover:bg-magenta-hover transition-colors disabled:opacity-75"
                      >
                        {updateSubmitting ? 'Submitting...' : 'Send Update'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No active mission currently assigned. Ask your mentor for assignment.</p>
            )}
          </div>

          {/* Team Members */}
          {activeTeam && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
              <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3">
                Team: {activeTeam.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeTeam.members.map((member: any) => (
                  <div key={member.id} className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl">
                    <h4 className="font-bold text-sm text-gray-900">{member.cube.user.name}</h4>
                    <p className="text-xs text-magenta font-bold tracking-wider uppercase mt-1">
                      {member.role.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Cube #{member.cube.cube_number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Achievements & feedback (Right Column) */}
        <div className="flex flex-col gap-8">
          
          {/* Assigned Mentor */}
          {profile.assigned_mentor && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Assigned Mentor</p>
              <div>
                <h4 className="font-bold text-base text-gray-900">{profile.assigned_mentor.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{profile.assigned_mentor.email}</p>
              </div>
            </div>
          )}

          {/* Upcoming Demo Day */}
          {upcomingDemoDay && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upcoming Demo Day</p>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{upcomingDemoDay.title}</h4>
                <p className="text-xs text-magenta font-bold mt-1">
                  {new Date(upcomingDemoDay.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>
          )}

          {/* Earned Badges */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-magenta" />
              <span>Earned Badges</span>
            </h3>

            {profile.cube_badges && profile.cube_badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {profile.cube_badges.map((award: any) => {
                  const config = getBadgeConfig(award.badge.icon, award.badge.name);
                  const IconComp = config.icon;

                  return (
                    <div key={award.id} className="flex flex-col items-center text-center p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:scale-105 transition-all duration-300 group" title={award.reason}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center ${config.glow} transition-all duration-500 group-hover:scale-110`}>
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-800 mt-2 truncate max-w-full">
                        {award.badge.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No badges awarded yet. Deliver a working prototype to earn badges!</p>
            )}
          </div>

          {/* Recent feedback */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-magenta" />
              <span>Recent Feedback</span>
            </h3>

            {recentFeedback && recentFeedback.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recentFeedback.map((feedback: any) => (
                  <div key={feedback.id} className="border-l-2 border-magenta pl-3.5 py-1">
                    <p className="text-xs font-bold text-gray-400">{feedback.mission.title}</p>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Strengths:</p>
                    <p className="text-xs text-gray-600 italic">"{feedback.strengths}"</p>
                    <p className="text-xs text-gray-500 mt-2 font-semibold">Areas to Improve:</p>
                    <p className="text-xs text-gray-600 italic">"{feedback.areas_to_improve}"</p>
                    <p className="text-[10px] text-gray-400 mt-2.5">
                      By {feedback.mentor.name} on {new Date(feedback.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">No visible feedback reports yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
