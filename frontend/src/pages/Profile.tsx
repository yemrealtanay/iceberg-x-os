import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Award, Calendar, Sparkles, AlertCircle, Edit, Star, GitBranch, Video, CheckCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // CubeProfile ID
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUni, setEditUni] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editGitlab, setEditGitlab] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editSlack, setEditSlack] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Admin progression states
  const [adminLevel, setAdminLevel] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const [adminMentorId, setAdminMentorId] = useState('');
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);

  // AI Summary states
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      const res = await api.get(`/cubes/${id}`);
      setData(res);
      
      // Seed edit fields
      setEditName(res.profile.user.name);
      setEditUni(res.profile.university || '');
      setEditDept(res.profile.department || '');
      setEditGithub(res.profile.github_url || '');
      setEditGitlab(res.profile.gitlab_url || '');
      setEditLinkedin(res.profile.linkedin_url || '');
      setEditSlack(res.profile.slack_handle || '');
      setEditSkills(res.profile.skills?.join(', ') || '');
      setEditInterests(res.profile.interests?.join(', ') || '');

      // Seed admin fields
      setAdminLevel(res.profile.current_level);
      setAdminStatus(res.profile.status);
      setAdminMentorId(res.profile.assigned_mentor_id || '');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    if (user?.role === 'ADMIN') {
      try {
        const cubesRes = await api.get('/cubes'); // simple fetch users
        // Since we don't have a distinct mentors endpoint, we can find mentors by fetching directory of cubes or just mapping.
        // Actually, we can get list of mentors from our seed data or profile details.
        // For simplicity we will fetch and filter users or just support manual input, but let's query all users and check who is a MENTOR.
        // For MVP, we can fetch all users if endpoint exists. Let's make a request to /cubes.
        // Wait, since we know user profiles assigned_mentor maps to user, let's keep it simple.
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchProfileData();
    // Load mentors list if Admin
    if (user?.role === 'ADMIN') {
      // In a real app we'd load mentors. For this MVP, we will render a text field or standard options.
    }
  }, [id, user]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);

    try {
      const updated = await api.put(`/cubes/${id}`, {
        name: editName,
        university: editUni,
        department: editDept,
        github_url: editGithub,
        gitlab_url: editGitlab,
        linkedin_url: editLinkedin,
        slack_handle: editSlack,
        skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        interests: editInterests.split(',').map(s => s.trim()).filter(Boolean)
      });
      setData((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updated,
          user: { ...prev.profile.user, name: editName }
        }
      }));
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSubmitting(true);
    setAdminSuccess(false);

    try {
      const updated = await api.post(`/cubes/${id}/progression`, {
        current_level: adminLevel,
        status: adminStatus,
        assigned_mentor_id: adminMentorId || null
      });
      setData((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updated
        }
      }));
      setAdminSuccess(true);
      setTimeout(() => setAdminSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to update progression');
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleFetchAISummary = async () => {
    setAiLoading(true);
    setAiSummary(null);
    try {
      const res = await api.get(`/ai/cube-summary/${id}`);
      setAiSummary(res.summary);
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI summary');
    } finally {
      setAiLoading(false);
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
        <span>{error || 'Profile not found'}</span>
      </div>
    );
  }

  const { profile, updates, demoSubmissions, mentorFeedback } = data;
  const isOwner = user?.cubeProfileId === id;
  const isMentorOrAdmin = user?.role === 'ADMIN' || user?.role === 'MENTOR';

  // Compute category strengths from completed missions
  const completedMissions = profile.team_memberships
    ? profile.team_memberships
        .filter((m: any) => m.team?.mission?.status === 'completed')
        .map((m: any) => m.team.mission)
        .filter(Boolean)
    : [];

  const categoryCounts: { [key: string]: number } = {};
  completedMissions.forEach((m: any) => {
    const cat = m.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Core Info & Admin Controls */}
      <div className="flex flex-col gap-6">
        
        {/* Core Info Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="bg-magenta/5 border border-magenta/10 text-magenta font-extrabold text-xs px-2.5 py-1 rounded">
              Cube #{profile.cube_number}
            </span>
            {isOwner && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:text-magenta transition-colors"
                title="Edit profile"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">{profile.user.name}</h2>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
              {profile.current_level.replace('_', ' ')}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-gray-50 pt-4 text-xs text-gray-500 font-medium">
            <p><span className="font-bold text-gray-700">Cohort:</span> {profile.cohort}</p>
            <p><span className="font-bold text-gray-700">University:</span> {profile.university}</p>
            <p><span className="font-bold text-gray-700">Department:</span> {profile.department}</p>
            <p><span className="font-bold text-gray-700">Slack:</span> {profile.slack_handle || 'N/A'}</p>
            <p><span className="font-bold text-gray-700">Status:</span> <span className="uppercase text-[10px] font-extrabold bg-gray-100 border border-gray-200/50 px-2 py-0.5 rounded-full text-gray-500">{profile.status.replace(/_/g, ' ')}</span></p>
            {profile.assigned_mentor && (
              <p><span className="font-bold text-gray-700">Mentor:</span> {profile.assigned_mentor.name}</p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2 border-t border-gray-50 pt-4">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                GitHub
              </a>
            )}
            {profile.gitlab_url && (
              <a href={profile.gitlab_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                GitLab
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleEditSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-premium flex flex-col gap-4 animate-fadeIn">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2">Edit Public Profile</h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">University</label>
              <input type="text" value={editUni} onChange={e => setEditUni(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Department</label>
              <input type="text" value={editDept} onChange={e => setEditDept(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">GitHub Link</label>
              <input type="url" value={editGithub} onChange={e => setEditGithub(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn Link</label>
              <input type="url" value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Slack Handle</label>
              <input type="text" value={editSlack} onChange={e => setEditSlack(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Skills (comma-separated)</label>
              <textarea value={editSkills} onChange={e => setEditSkills(e.target.value)} rows={2} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold resize-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Interests (comma-separated)</label>
              <textarea value={editInterests} onChange={e => setEditInterests(e.target.value)} rows={2} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold resize-none" />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-500 font-bold text-xs rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={editSubmitting} className="px-4 py-1.5 bg-magenta text-white font-bold text-xs rounded-lg hover:bg-magenta-hover disabled:opacity-70">
                {editSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Admin progression controls panel */}
        {user?.role === 'ADMIN' && (
          <form onSubmit={handleAdminSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2">Program Administration</h3>

            {adminSuccess && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold p-2.5 rounded-lg border border-green-100">
                Progression levels updated.
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Progression Level</label>
              <select value={adminLevel} onChange={e => setAdminLevel(e.target.value)} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none">
                <option value="Cube">Cube</option>
                <option value="Senior_Cube">Senior Cube</option>
                <option value="Lead_Cube">Lead Cube</option>
                <option value="Cube_Mentor">Cube Mentor</option>
                <option value="Iceberg_Fellow">Iceberg Fellow</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Fellowship Status</label>
              <select value={adminStatus} onChange={e => setAdminStatus(e.target.value)} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Assigned Mentor ID</label>
              <input
                type="text"
                placeholder="UUID of User Mentor"
                value={adminMentorId}
                onChange={e => setAdminMentorId(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none"
              />
            </div>

            <button type="submit" disabled={adminSubmitting} className="w-full mt-2 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors disabled:opacity-70">
              {adminSubmitting ? 'Updating...' : 'Update Progression'}
            </button>
          </form>
        )}

        {/* AI Progress Summary helper */}
        {isMentorOrAdmin && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-magenta" />
              <span>AI Progress Helper</span>
            </h3>
            
            <p className="text-xs text-gray-400">Generate a professional progress summary for this Cube based on their profile, scores, and updates history.</p>

            {aiSummary ? (
              <div className="flex flex-col gap-3">
                <div className="bg-magenta/5 border border-magenta/10 p-4 rounded-xl text-xs text-gray-700 max-h-80 overflow-y-auto font-medium prose prose-sm">
                  {aiSummary.split('\n').map((para, i) => <p key={i} className="mb-2 last:mb-0">{para}</p>)}
                </div>
                <button
                  onClick={handleFetchAISummary}
                  className="py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-all"
                >
                  Regenerate Draft
                </button>
              </div>
            ) : (
              <button
                onClick={handleFetchAISummary}
                disabled={aiLoading}
                className="w-full py-2 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Progress Summary</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

      {/* Right 2 Columns: Tabs, Timelines, Badges & Feedback */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* Badges Earned Section */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-magenta" />
            <span>Badges & Accomplishments</span>
          </h3>

          {profile.cube_badges && profile.cube_badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {profile.cube_badges.map((award: any) => (
                <div key={award.id} className="border border-gray-100 p-4 rounded-xl flex flex-col items-center text-center gap-2 bg-gray-50/50" title={award.reason}>
                  <div className="w-12 h-12 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-extrabold text-sm">
                    {award.badge.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 leading-tight">{award.badge.name}</h4>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                      {award.mission ? award.mission.title : 'General Award'}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold line-clamp-2 mt-1 italic">"{award.reason}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No badges awarded yet.</p>
          )}
        </div>

        {/* Technical Skills & Interests */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-5">
          <div>
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Technical Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string) => (
                  <span key={skill} className="bg-magenta/5 border border-magenta/10 text-magenta font-semibold text-xs px-3 py-1 rounded-xl">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No skills added.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest: string) => (
                  <span key={interest} className="bg-gray-100 border border-gray-200 text-gray-600 font-semibold text-xs px-3 py-1 rounded-xl">
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No interests added.</span>
              )}
            </div>
          </div>
        </div>

        {/* Mission Category Strengths */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-magenta" />
            <span>Category Strengths</span>
          </h3>
          <p className="text-xs text-gray-400 -mt-2">Breakdown of competency areas based on completed missions.</p>

          {sortedCategories.length > 0 ? (
            <div className="flex flex-col gap-4 mt-2">
              {sortedCategories.map(([category, count]) => {
                const percentage = Math.round((count / maxCount) * 100);
                return (
                  <div key={category} className="flex flex-col gap-1.5 animate-fadeIn">
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                      <span className="bg-magenta/5 border border-magenta/10 px-2 py-0.5 rounded text-[11px] font-bold text-magenta">
                        {category}
                      </span>
                      <span className="text-gray-500 font-extrabold">
                        {count} {count === 1 ? 'Mission' : 'Missions'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-50 border border-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-magenta to-magenta/70 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-xs py-2 italic">No completed missions recorded yet to build category strengths.</p>
          )}
        </div>

        {/* Demo Submissions list */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg">Demo Showcase</h3>
          
          {demoSubmissions && demoSubmissions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {demoSubmissions.map((demo: any) => (
                <div key={demo.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">{demo.title}</h4>
                      <p className="text-xs text-magenta font-semibold mt-1">Mission: {demo.mission.title}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {new Date(demo.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed italic">"{demo.summary}"</p>

                  <div className="flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
                    <p><span className="font-bold text-gray-700">What they built:</span> {demo.what_we_built}</p>
                    <p><span className="font-bold text-red-500">What could have been done better:</span> {demo.what_could_we_have_done_better}</p>
                  </div>

                  {/* Resource URLs */}
                  <div className="flex flex-wrap gap-2.5 border-t border-gray-50 pt-3.5 mt-1">
                    {demo.repository_url && (
                      <a href={demo.repository_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-magenta">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {demo.video_url && (
                      <a href={demo.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-magenta">
                        <Video className="w-3.5 h-3.5" />
                        <span>Demo Video</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No demo day submissions recorded.</p>
          )}
        </div>

        {/* Feedback Reports */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg">Mentor Evaluation Feedback</h3>

          {mentorFeedback && mentorFeedback.length > 0 ? (
            <div className="flex flex-col gap-6 divide-y divide-gray-50">
              {mentorFeedback.map((fb: any, idx: number) => (
                <div key={fb.id} className={`flex flex-col gap-4 ${idx > 0 ? 'pt-6' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{fb.mission.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Evaluated by <span className="font-semibold">{fb.mentor.name}</span> on {new Date(fb.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-magenta bg-magenta/5 border border-magenta/10 px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {fb.recommended_next_step.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 border border-gray-50 bg-gray-50/30 p-3 rounded-xl">
                    {[
                      { label: 'Technical', val: fb.technical_ability_score },
                      { label: 'Research', val: fb.research_ability_score },
                      { label: 'Demo Output', val: fb.demo_output_score },
                      { label: 'Ownership', val: fb.ownership_score },
                      { label: 'Comm', val: fb.communication_score },
                      { label: 'Leadership', val: fb.leadership_score },
                      { label: 'Product', val: fb.product_thinking_score },
                      { label: 'Reliability', val: fb.reliability_score },
                      { label: 'Reflection', val: fb.self_reflection_score },
                    ].map((score) => (
                      <div key={score.label} className="text-center p-1 border border-gray-50 bg-white rounded-lg">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{score.label}</p>
                        <p className="text-sm font-extrabold mt-0.5 text-magenta flex items-center justify-center gap-0.5">
                          <span>{score.val}</span>
                          <Star className="w-3 h-3 fill-magenta text-magenta" />
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Written comments */}
                  <div className="flex flex-col gap-2 text-xs text-gray-600 font-medium">
                    <p><span className="font-bold text-gray-800">Strengths:</span> {fb.strengths}</p>
                    <p><span className="font-bold text-gray-800">Development Areas:</span> {fb.areas_to_improve}</p>
                    {isMentorOrAdmin && fb.private_notes && (
                      <div className="bg-red-50/50 border border-dashed border-red-100 p-3 rounded-xl mt-1 text-[11px]">
                        <p className="font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Private Mentor Notes (Hidden from Cube)</span>
                        </p>
                        <p className="text-red-700 italic mt-1">"{fb.private_notes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No evaluations or feedbacks recorded yet.</p>
          )}
        </div>

        {/* Timeline of Updates */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg">Timeline Updates</h3>

          {updates && updates.length > 0 ? (
            <div className="flex flex-col gap-4">
              {updates.map((update: any) => (
                <div key={update.id} className="border-l-2 border-magenta/20 pl-4 py-1 flex flex-col gap-1 hover:border-magenta transition-all">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-700">
                      {update.mission.title}
                    </p>
                    <span className="text-[9px] font-bold text-magenta bg-magenta/5 border border-magenta/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {update.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">{update.content}</p>
                  {update.blockers && (
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      ⚠️ Blocker: {update.blockers}
                    </p>
                  )}
                  <span className="text-[10px] text-gray-400 mt-1">{new Date(update.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No progress updates submitted yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};
