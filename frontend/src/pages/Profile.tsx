import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Award, Calendar, Sparkles, AlertCircle, Edit, Star, GitBranch, Video, CheckCircle, Camera, GraduationCap } from 'lucide-react';
import { getBadgeConfig } from '../utils/badgeHelper';
import ReactMarkdown from 'react-markdown';
import { RadarChart } from '../components/RadarChart';

const formatExternalUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getAssetUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  const base = window.location.origin.includes(':5173')
    ? 'http://localhost:5001'
    : '';
  return `${base}${path}`;
};


export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // CubeProfile ID
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setAvatarUploading(true);
      try {
        const res = await api.post(`/cubes/${id}/avatar`, { avatar_base64: base64 });
        setData((prev: any) => ({
          ...prev,
          profile: {
            ...prev.profile,
            avatar_url: res.avatar_url
          }
        }));
        setAvatarLoadError(false);
      } catch (err: any) {
        alert(err.message || 'Failed to upload avatar');
      } finally {
        setAvatarUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUni, setEditUni] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editGitlab, setEditGitlab] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editSlack, setEditSlack] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editInternshipStatus, setEditInternshipStatus] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [parsedAiSummary, setParsedAiSummary] = useState<any>(null);

  // Admin progression states
  const [adminLevel, setAdminLevel] = useState('');
  const [adminMentorId, setAdminMentorId] = useState('');
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [mentorSearch, setMentorSearch] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);

  // AI Summary states
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      const res = await api.get(`/cubes/${id}`);
      setData(res);
      setAvatarLoadError(false);
      
      // Seed edit fields
      setEditName(res.profile.user.name);
      setEditUni(res.profile.university || '');
      setEditDept(res.profile.department || '');
      setEditGithub(res.profile.github_url || '');
      setEditGitlab(res.profile.gitlab_url || '');
      setEditLinkedin(res.profile.linkedin_url || '');
      setEditSlack(res.profile.slack_handle || '');
      setEditPhone(res.profile.phone_number || '');
      setEditSkills(res.profile.skills?.join(', ') || '');
      setEditInterests(res.profile.interests?.join(', ') || '');
      setEditInternshipStatus(res.profile.internship_status || '');

      // Seed admin fields
      setAdminLevel(res.profile.current_level);
      setAdminMentorId(res.profile.assigned_mentor_id || '');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const res = await api.get('/mentors');
      setMentorsList(res);
    } catch (e) {
      console.error('Failed to fetch mentors', e);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (user?.role === 'ADMIN') {
      fetchMentors();
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
        phone_number: editPhone,
        skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        interests: editInterests.split(',').map(s => s.trim()).filter(Boolean),
        internship_status: editInternshipStatus
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
    setParsedAiSummary(null);
    try {
      const res = await api.get(`/ai/cube-summary/${id}`);
      setAiSummary(res.summary);
      try {
        const parsed = JSON.parse(res.summary);
        setParsedAiSummary(parsed);
      } catch (e) {
        setParsedAiSummary({
          overview: res.summary,
          strengths: [],
          improvements: [],
          nextSteps: ""
        });
      }
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

  // Compute meeting attendance stats
  const attendanceList = profile.meeting_attendance || [];
  const totalMeetings = attendanceList.length;
  const attendedMeetings = attendanceList.filter((a: any) => a.attended).length;
  const missedMeetings = totalMeetings - attendedMeetings;
  const attendanceRate = totalMeetings > 0 ? Math.round((attendedMeetings / totalMeetings) * 100) : 100;

  // Calculate average scores for radar chart
  const averageScores: { [key: string]: number } = {};
  const skillKeys = [
    'technical_ability_score',
    'research_ability_score',
    'demo_output_score',
    'ownership_score',
    'communication_score',
    'leadership_score',
    'product_thinking_score',
    'reliability_score',
    'self_reflection_score'
  ];
  skillKeys.forEach(k => {
    averageScores[k] = 0;
  });

  if (mentorFeedback && mentorFeedback.length > 0) {
    mentorFeedback.forEach((fb: any) => {
      skillKeys.forEach(k => {
        averageScores[k] += fb[k] || 0;
      });
    });
    skillKeys.forEach(k => {
      averageScores[k] = parseFloat((averageScores[k] / mentorFeedback.length).toFixed(1));
    });
  }

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


  const isOriginalCube = parseInt(profile.cube_number, 10) === 0;

  if (isOriginalCube) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#111113] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.25)] text-center relative overflow-hidden flex flex-col items-center gap-6">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full border border-white/5 opacity-40"></div>
        <div className="absolute left-6 bottom-6 text-[12rem] font-black leading-none text-white/[0.02] select-none">X</div>
        
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-magenta">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-magenta text-xs uppercase font-extrabold tracking-[0.25em]">Classified Record</span>
          <h1 className="text-4xl font-black text-white tracking-tight">Cube #{profile.cube_number}</h1>
        </div>
        
        <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-6 rounded-2xl text-left space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Classification</p>
            <p className="mt-1 text-sm font-extrabold text-white">The Original Cube</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Status</p>
            <span className="mt-1 inline-block rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-200">
              Active
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Access Level</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-white/60">
              No further information available in this directory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Core Info & Admin Controls */}
      <div className="flex flex-col gap-6">
        
        {/* Core Info Card */}
        <div className={`rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden ${
          profile.is_founding_cube
            ? 'bg-gradient-to-br from-amber-50/20 via-white to-white border-2 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
            : 'bg-white border border-gray-100 shadow-subtle'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {profile.is_founding_cube && (
                <span className="bg-amber-400/10 border border-amber-400/30 text-amber-700 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Founding Cube
                </span>
              )}
              <span className={`font-extrabold text-xs px-2.5 py-1 rounded ${
                profile.is_founding_cube
                  ? 'bg-amber-400/10 border border-amber-400/20 text-amber-700'
                  : 'bg-magenta/5 border border-magenta/10 text-magenta'
              }`}>
                Cube #{profile.cube_number}
              </span>
            </div>
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

          {/* Avatar Section */}
          <div className="flex justify-center mt-2 relative">
            <div 
              onClick={() => isOwner && fileInputRef.current?.click()}
              className={`w-24 h-24 rounded-full overflow-hidden relative group border-2 ${
                profile.is_founding_cube ? 'border-amber-400' : 'border-magenta/25'
              } shadow-sm ${isOwner ? 'cursor-pointer' : ''}`}
            >
              {profile.avatar_url && !avatarLoadError ? (
                <img 
                  src={getAssetUrl(profile.avatar_url) || ''} 
                  alt={profile.user.name} 
                  className="w-full h-full object-cover"
                  onError={() => setAvatarLoadError(true)}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center font-black text-xl ${
                  profile.is_founding_cube 
                    ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-white' 
                    : 'bg-gradient-to-tr from-magenta to-pink-600 text-white'
                }`}>
                  {getInitials(profile.user.name)}
                </div>
              )}

              {/* Upload Overlay */}
              {isOwner && (
                <div className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-1 select-none">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-wider">Upload</span>
                </div>
              )}

              {/* Uploading indicator */}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            {/* Hidden Input */}
            {isOwner && (
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug flex items-center gap-2">
              <span>{profile.user.name}</span>
              {profile.is_founding_cube && <Sparkles className="w-5 h-5 text-amber-500 animate-pulse flex-shrink-0" />}
            </h2>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
              {profile.current_level.replace('_', ' ')}
            </p>
            {profile.offboarding_record && (
              <Link
                to={`/offboarding/certificate/${profile.id}`}
                target="_blank"
                className="mt-3 w-full py-2 bg-gradient-to-r from-magenta to-pink-600 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-magenta/15 hover:opacity-95 transition-opacity"
              >
                <GraduationCap className="w-4 h-4" />
                <span>View Offboarding Certificate</span>
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-gray-50 pt-4 text-xs text-gray-500 font-medium">
            <p><span className="font-bold text-gray-700">Cohort:</span> {profile.cohort}</p>
            <p><span className="font-bold text-gray-700">University:</span> {profile.university}</p>
            <p><span className="font-bold text-gray-700">Department:</span> {profile.department}</p>
            <p><span className="font-bold text-gray-700">Slack:</span> {profile.slack_handle || 'N/A'}</p>
            <p><span className="font-bold text-gray-700">Phone:</span> {profile.phone_number || 'N/A'}</p>
            {profile.internship_status && (
              <p><span className="font-bold text-gray-700">Current Role:</span> <span className="text-magenta font-semibold">{profile.internship_status}</span></p>
            )}
            <p><span className="font-bold text-gray-700">Current Status:</span> <span className="uppercase text-[10px] font-extrabold bg-gray-100 border border-gray-200/50 px-2 py-0.5 rounded-full text-gray-500">{profile.current_level.replace(/_/g, ' ')}</span></p>
            {profile.assigned_mentor && (
              <p><span className="font-bold text-gray-700">Mentor:</span> {profile.assigned_mentor.name}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-50 pt-4">
            {profile.github_url && (
              <a href={formatExternalUrl(profile.github_url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                GitHub
              </a>
            )}
            {profile.gitlab_url && (
              <a href={formatExternalUrl(profile.gitlab_url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                GitLab
              </a>
            )}
            {profile.linkedin_url && (
              <a href={formatExternalUrl(profile.linkedin_url)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs font-semibold rounded-lg hover:text-magenta hover:bg-magenta/5 transition-all">
                LinkedIn
              </a>
            )}
          </div>

          {/* Evaluate Cube Action for Mentors/Admins */}
          {isMentorOrAdmin && (
            <Link
              to={`/review?cube=${profile.user.id}`}
              className="mt-2 w-full bg-magenta text-white font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-magenta-hover transition text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Evaluate Cube (Scorecard)
            </Link>
          )}

          {/* Meeting Attendance Stats */}
          <div className="border-t border-gray-50 pt-4 flex flex-col gap-2.5">
            <h3 className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">Meeting Attendance</h3>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-500 font-semibold">Attendance Rate:</span>
              <span className={`font-bold px-2 py-0.5 rounded-lg ${
                attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-700' :
                attendanceRate >= 75 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>{attendanceRate}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Attended:</span>
              <span className="font-bold text-gray-800">{attendedMeetings} / {totalMeetings}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold">Missed Meetings:</span>
              <span className={`font-bold ${missedMeetings > 0 ? 'text-red-600' : 'text-gray-800'}`}>{missedMeetings}</span>
            </div>
            {missedMeetings > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-1.5 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-red-800 font-extrabold">Negative Mark Warning</span>
                  <p className="text-[10px] text-red-600 leading-snug font-medium">Has missed {missedMeetings} meeting(s). This is evaluated as negative points on the scorecard.</p>
                </div>
              </div>
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
              <label className="text-[10px] font-bold text-gray-500 uppercase">Phone Number</label>
              <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Current Role (e.g., Podcast Editor, Iceberg Consultant)</label>
              <input type="text" value={editInternshipStatus} onChange={e => setEditInternshipStatus(e.target.value)} className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta font-semibold" />
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
              <label className="text-[10px] font-bold text-gray-500 uppercase">Progression Level (Status)</label>
              <select value={adminLevel} onChange={e => setAdminLevel(e.target.value)} className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none">
                <option value="Cube">Cube</option>
                <option value="Senior_Cube">Senior Cube</option>
                <option value="Former_Cube">Former Cube</option>
                <option value="Iceberger">Iceberger</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Assigned Mentor</label>
              <input
                type="text"
                placeholder="Filter mentors by name..."
                value={mentorSearch}
                onChange={e => setMentorSearch(e.target.value)}
                className="p-1.5 px-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] outline-none placeholder:text-gray-400 font-semibold"
              />
              <select
                value={adminMentorId}
                onChange={e => setAdminMentorId(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none"
              >
                <option value="">No Mentor Assigned</option>
                {mentorsList
                  .filter(m => m.name.toLowerCase().includes(mentorSearch.toLowerCase()))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role === 'ADMIN' ? 'Admin' : 'Mentor'})
                    </option>
                  ))
                }
              </select>
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

            {parsedAiSummary ? (
              <div className="flex flex-col gap-4 animate-fadeIn">
                {parsedAiSummary.noData ? (
                  <div className="bg-slate-50 border border-dashed border-gray-200 p-4 rounded-xl text-xs text-gray-500 font-medium flex flex-col gap-1.5 leading-relaxed">
                    <p className="font-bold text-gray-700 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>Insufficient Activity</span>
                    </p>
                    <p className="text-[11px] text-gray-400 font-semibold">{parsedAiSummary.message}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Overview Paragraph */}
                    <div className="markdown-body bg-slate-50/50 border border-gray-100 p-3.5 rounded-xl text-xs text-gray-600 font-semibold leading-relaxed italic">
                      <ReactMarkdown>{parsedAiSummary.overview}</ReactMarkdown>
                    </div>

                    {/* Strengths & Improvements Lists */}
                    <div className="flex flex-col gap-3.5">
                      {parsedAiSummary.strengths && parsedAiSummary.strengths.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-green-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>Core Strengths</span>
                          </h4>
                          <ul className="flex flex-col gap-1 text-[11px] text-gray-600 font-semibold pl-1">
                            {parsedAiSummary.strengths.map((s: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-tight">
                                <span className="text-green-500">✓</span>
                                <div className="markdown-body inline-block text-[11px] text-gray-600 font-semibold">
                                  <ReactMarkdown components={{ p: 'span' }}>{s}</ReactMarkdown>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {parsedAiSummary.improvements && parsedAiSummary.improvements.length > 0 && (
                        <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3">
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>Development Areas</span>
                          </h4>
                          <ul className="flex flex-col gap-1 text-[11px] text-gray-600 font-semibold pl-1">
                            {parsedAiSummary.improvements.map((imp: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-tight">
                                <span className="text-amber-500">•</span>
                                <div className="markdown-body inline-block text-[11px] text-gray-600 font-semibold">
                                  <ReactMarkdown components={{ p: 'span' }}>{imp}</ReactMarkdown>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Next Steps Progression Target */}
                    {parsedAiSummary.nextSteps && (
                      <div className="border-t border-gray-50 pt-3">
                        <div className="bg-magenta/5 border border-magenta/10 p-3 rounded-xl flex flex-col gap-1">
                          <p className="text-[9px] font-extrabold uppercase tracking-wider text-magenta">Suggested Progression Path</p>
                          <div className="markdown-body text-xs font-bold text-slate-800 leading-tight">
                            <ReactMarkdown>{parsedAiSummary.nextSteps}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleFetchAISummary}
                  disabled={aiLoading}
                  className="w-full mt-1 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-500 hover:text-magenta rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Regenerating...' : 'Regenerate Summary'}</span>
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
              {profile.cube_badges.map((award: any) => {
                const config = getBadgeConfig(award.badge.icon, award.badge.name);
                const IconComp = config.icon;

                return (
                  <div key={award.id} className="border border-gray-100 p-4 rounded-xl flex flex-col items-center text-center gap-2 bg-gray-50/50 hover:border-magenta/20 hover:scale-[1.02] transition-all duration-300 group" title={award.reason}>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center ${config.glow} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 leading-tight">{award.badge.name}</h4>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                        {award.mission ? award.mission.title : 'General Award'}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500 font-semibold line-clamp-2 mt-1 italic">"{award.reason}"</p>
                  </div>
                );
              })}
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

        {/* Radar Chart Section */}
        <RadarChart
          scores={averageScores}
          feedbackCount={mentorFeedback ? mentorFeedback.length : 0}
        />

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
                      <a href={formatExternalUrl(demo.repository_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-magenta">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {demo.video_url && (
                      <a href={formatExternalUrl(demo.video_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-magenta">
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
