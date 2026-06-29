import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Rocket, ShieldAlert, Sparkles, MessageCircle, GitBranch, ExternalLink, Calendar, Plus, Save, Trash2, Check } from 'lucide-react';
import { CustomMarkdown } from '../components/CustomMarkdown';

export const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Mission ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status/Decision edit states (for Mentors/Admins)
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newDecision, setNewDecision] = useState('');
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // AI summary states
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [summarySaved, setSummarySaved] = useState(false);

  // Reflections form states
  const [whatGained, setWhatGained] = useState('');
  const [whatLearned, setWhatLearned] = useState('');
  const [whatCouldBeBetter, setWhatCouldBeBetter] = useState('');
  const [reflectionSubmitting, setReflectionSubmitting] = useState(false);
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const fetchMissionDetails = async () => {
    try {
      const res = await api.get(`/missions/${id}`);
      setData(res);
      setNewStatus(res.mission.status);
      setNewDecision(res.mission.decision || '');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch mission details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionDetails();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusSubmitting(true);

    try {
      const updated = await api.put(`/missions/${id}`, {
        status: newStatus,
        decision: newDecision || null
      });
      setData((prev: any) => ({
        ...prev,
        mission: { ...prev.mission, ...updated }
      }));
      setIsEditingStatus(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleGenerateSummary = async () => {
    setAiLoading(true);
    setAiSummary(null);
    try {
      const res = await api.get(`/ai/mission-summary/${id}`);
      setAiSummary(res.summary);
      setEditedSummary(res.summary);
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI summary');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveSummary = () => {
    // In a real app we might write this to the database. For MVP, we allow local editing and simulate saving.
    setSummarySaved(true);
    setIsEditingSummary(false);
    setTimeout(() => setSummarySaved(false), 2000);
  };

  const handleDeleteMission = async () => {
    if (!window.confirm("Are you sure you want to delete this mission? All teams, updates, and feedback will be deleted!")) return;
    try {
      await api.delete(`/missions/${id}`);
      navigate('/missions');
    } catch (err: any) {
      alert(err.message || 'Failed to delete mission');
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!window.confirm("Are you sure you want to delete this evaluation feedback?")) return;
    try {
      await api.delete(`/feedback/${feedbackId}`);
      setData((prev: any) => ({
        ...prev,
        mentorFeedback: prev.mentorFeedback.filter((fb: any) => fb.id !== feedbackId)
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to delete feedback');
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    try {
      await api.delete(`/updates/${updateId}`);
      setData((prev: any) => ({
        ...prev,
        mission: {
          ...prev.mission,
          updates: prev.mission.updates.filter((up: any) => up.id !== updateId)
        }
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to delete update');
    }
  };

  const handleDeleteDemo = async (demoId: string) => {
    if (!window.confirm("Are you sure you want to delete this demo submission?")) return;
    try {
      await api.delete(`/demos/${demoId}`);
      setData((prev: any) => ({
        ...prev,
        mission: {
          ...prev.mission,
          demo_submissions: prev.mission.demo_submissions.filter((dm: any) => dm.id !== demoId)
        }
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to delete demo submission');
    }
  };

  const handleReflectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatGained || !whatLearned || !whatCouldBeBetter) {
      alert("Please fill in all reflection fields");
      return;
    }

    setReflectionSubmitting(true);
    try {
      await api.post(`/missions/${id}/reflections`, {
        what_gained: whatGained,
        what_learned: whatLearned,
        what_could_be_better: whatCouldBeBetter
      });
      alert("Reflection submitted successfully!");
      setWhatGained('');
      setWhatLearned('');
      setWhatCouldBeBetter('');
      fetchMissionDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to submit reflection');
    } finally {
      setReflectionSubmitting(false);
    }
  };

  const handleMissionApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this mission completion?")) return;
    setApprovalSubmitting(true);
    try {
      await api.post(`/missions/${id}/approve`, {});
      alert("Mission completion approved!");
      fetchMissionDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to approve mission');
    } finally {
      setApprovalSubmitting(false);
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
        <span>{error || 'Mission not found'}</span>
      </div>
    );
  }

  const { mission, mentorFeedback } = data;
  const isMentorOrAdmin = user?.role === 'ADMIN' || user?.role === 'MENTOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left 2 Columns: Core Description, Updates & Demos */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* Title Block */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-magenta/5 border border-magenta/10 text-magenta font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
              {mission.difficulty_level.replace(/_/g, ' ')}
            </span>
            <span className="bg-blue-50 border border-blue-100 text-blue-700 font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
              {mission.category}
            </span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wide ml-auto">
              Status: {mission.status.replace(/_/g, ' ')}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1 leading-snug">{mission.title}</h1>
          <p className="text-gray-500 font-medium">Created by {mission.created_by.name} · Mentor: {mission.mentor ? mission.mentor.name : 'Unassigned'}</p>
        </div>

        {/* Mission Content Cards */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-6">
          <div>
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Mission Description</h3>
            <div className="markdown-body text-xs font-semibold text-gray-600 mt-2 leading-relaxed">
              <CustomMarkdown>{mission.description}</CustomMarkdown>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Context & Background</h3>
            <div className="markdown-body text-xs font-semibold text-gray-600 mt-2 leading-relaxed">
              <CustomMarkdown>{mission.context}</CustomMarkdown>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Problem Statement</h3>
            <div className="markdown-body text-xs font-semibold text-gray-600 mt-2 leading-relaxed bg-gray-50 border border-gray-100 p-3.5 rounded-xl font-mono">
              <CustomMarkdown>{mission.problem_statement}</CustomMarkdown>
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Expected Deliverables</h3>
            <div className="markdown-body text-xs font-semibold text-gray-600 mt-2 leading-relaxed">
              <CustomMarkdown>{mission.expected_output}</CustomMarkdown>
            </div>
          </div>

          {/* Links Row */}
          {(mission.slack_channel_url || mission.repository_url || mission.demo_url) && (
            <div className="flex flex-wrap gap-3 border-t border-gray-50 pt-5 mt-2">
              {mission.slack_channel_url && (
                <a
                  href={mission.slack_channel_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-magenta hover:bg-magenta/5 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-magenta" />
                  <span>Slack Channel</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              )}
              {mission.repository_url && (
                <a
                  href={mission.repository_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-magenta hover:bg-magenta/5 transition-all"
                >
                  <GitBranch className="w-4 h-4 text-magenta" />
                  <span>Code Repository</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              )}
              {mission.demo_url && (
                <a
                  href={mission.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-magenta hover:bg-magenta/5 transition-all"
                >
                  <Rocket className="w-4 h-4 text-magenta" />
                  <span>Live Demo Link</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Demo Submissions list */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="font-extrabold text-lg">Demo Submissions</h3>
            {user?.role === 'CUBE' && (
              <Link
                to="/submit-demo"
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Demo</span>
              </Link>
            )}
          </div>

          {mission.demo_submissions && mission.demo_submissions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {mission.demo_submissions.map((demo: any) => (
                <div key={demo.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 relative group/demo">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{demo.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted by <span className="font-semibold">{demo.submitted_by.name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {new Date(demo.submitted_at).toLocaleDateString()}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteDemo(demo.id)}
                          className="p-1 hover:bg-red-50 border border-transparent rounded text-gray-400 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover/demo:opacity-100"
                          title="Delete demo submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed italic">"{demo.summary}"</p>
                  <div className="flex flex-col gap-1.5 text-xs text-gray-600 mt-1 font-medium">
                    <p><span className="font-bold text-gray-800">What we built:</span> {demo.what_we_built}</p>
                    <p><span className="font-bold text-gray-800">What we learned:</span> {demo.what_we_learned}</p>
                    <p><span className="font-bold text-gray-800">What worked well:</span> {demo.what_worked_well}</p>
                    <p><span className="font-bold text-red-500">What could have done better (Mandatory):</span> {demo.what_could_we_have_done_better}</p>
                    {demo.recommendation && (
                      <p><span className="font-bold text-gray-800">Recommendation:</span> {demo.recommendation}</p>
                    )}
                  </div>
                  
                  {/* Submission Links */}
                  <div className="flex flex-wrap gap-2.5 border-t border-gray-50 pt-3 mt-1 text-[10px] font-bold text-gray-500">
                    {demo.repository_url && (
                      <a href={demo.repository_url} target="_blank" rel="noreferrer" className="hover:text-magenta flex items-center gap-0.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {demo.pull_request_url && (
                      <a href={demo.pull_request_url} target="_blank" rel="noreferrer" className="hover:text-magenta">
                        Pull Request
                      </a>
                    )}
                    {demo.demo_url && (
                      <a href={demo.demo_url} target="_blank" rel="noreferrer" className="hover:text-magenta">
                        Live Demo
                      </a>
                    )}
                    {demo.video_url && (
                      <a href={demo.video_url} target="_blank" rel="noreferrer" className="hover:text-magenta">
                        Video Tour
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No demo day submissions recorded for this mission.</p>
          )}
        </div>

        {/* Individual Reflections & Completion Panel */}
        {mission.teams && mission.teams.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-magenta rotate-45" />
                <span>Individual Mission Reflections</span>
              </h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                teamMembers.some((m: any) => !m.is_submitted)
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-green-50 text-green-700 border border-green-100'
              }`}>
                {teamMembers.some((m: any) => !m.is_submitted) ? 'Pending Reflections' : 'Reflections Complete'}
              </span>
            </div>

            {/* Pending Approval Banner for Mentor/Admin */}
            {mission.status === 'pending_approval' && (
              <div className="border border-amber-200 bg-amber-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-amber-800">Mission Completion Pending Approval</h4>
                  <p className="text-xs text-amber-700 mt-1">All Cubes have submitted reflections. Please review them below and approve mission completion.</p>
                </div>
                {isMentorOrAdmin && (
                  <button
                    onClick={handleMissionApprove}
                    disabled={approvalSubmitting}
                    className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    {approvalSubmitting ? (
                      'Approving...'
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve Completion</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* List of team members and their reflection submission status */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Team Overview Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teamMembers.map((m: any) => {
                  const isOwn = m.cube.user_id === user?.id;
                  const canViewDetail = isMentorOrAdmin || isOwn;
                  const isExpanded = expandedMemberId === m.id;

                  return (
                    <div key={m.id} className="border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2.5 bg-gray-50/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{m.cube.user.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{m.role.replace(/_/g, ' ')}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          m.is_submitted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {m.is_submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </div>

                      {/* Display content if submitted and user is allowed to view */}
                      {m.is_submitted && (
                        <div>
                          {canViewDetail ? (
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() => setExpandedMemberId(isExpanded ? null : m.id)}
                                className="text-[11px] font-bold text-magenta hover:underline"
                              >
                                {isExpanded ? 'Hide Details' : 'View Reflection Details'}
                              </button>

                              {isExpanded && (
                                <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex flex-col gap-2 text-xs text-gray-600 leading-relaxed">
                                  <p>
                                    <span className="font-bold text-gray-800 block">What they gained:</span>
                                    <span className="italic">"{m.what_gained}"</span>
                                  </p>
                                  <p>
                                    <span className="font-bold text-gray-800 block">What they learned:</span>
                                    <span className="italic">"{m.what_learned}"</span>
                                  </p>
                                  <p>
                                    <span className="font-bold text-red-500 block">What could have done better:</span>
                                    <span className="italic">"{m.what_could_be_better}"</span>
                                  </p>
                                  <span className="text-[9px] text-gray-400 block mt-1">Submitted at {new Date(m.submitted_at).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic mt-1">Reflections are private to Mentors & Author.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reflection Form for Logged-in Cube Member if they haven't submitted yet */}
            {myMemberRecord && !myMemberRecord.is_submitted && (
              <form onSubmit={handleReflectionSubmit} className="border border-magenta/10 bg-magenta/5 p-4 sm:p-5 rounded-2xl flex flex-col gap-4 mt-2">
                <div>
                  <h4 className="font-extrabold text-sm text-magenta">Your Individual Overview Reflection</h4>
                  <p className="text-xs text-gray-500 mt-1">Please summarize your personal experience. This is required before the mission can be marked as finished.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">What did you gain from this mission? <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2.5}
                    value={whatGained}
                    onChange={(e) => setWhatGained(e.target.value)}
                    placeholder="Skills, experience, or confidence you gained..."
                    disabled={reflectionSubmitting}
                    className="p-2.5 border border-gray-100 bg-white rounded-lg text-xs outline-none focus:border-magenta font-semibold resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">What did you learn? <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2.5}
                    value={whatLearned}
                    onChange={(e) => setWhatLearned(e.target.value)}
                    placeholder="Technical concepts, workflows, or team dynamics you discovered..."
                    disabled={reflectionSubmitting}
                    className="p-2.5 border border-gray-100 bg-white rounded-lg text-xs outline-none focus:border-magenta font-semibold resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">What did you could have done better? <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={2.5}
                    value={whatCouldBeBetter}
                    onChange={(e) => setWhatCouldBeBetter(e.target.value)}
                    placeholder="Areas where you could have improved, or changes you'd make next time..."
                    disabled={reflectionSubmitting}
                    className="p-2.5 border border-gray-100 bg-white rounded-lg text-xs outline-none focus:border-magenta font-semibold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reflectionSubmitting}
                  className="py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm disabled:opacity-75"
                >
                  {reflectionSubmitting ? 'Submitting Overview...' : 'Submit Reflection Overview'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Timeline of Updates */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3">Updates Feed</h3>

          {mission.updates && mission.updates.length > 0 ? (
            <div className="flex flex-col gap-4">
              {mission.updates.map((update: any) => (
                <div key={update.id} className="border-l-2 border-magenta/20 pl-4 py-1 flex flex-col gap-1 hover:border-magenta transition-all relative group/up">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-700">
                      {update.cube.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-magenta bg-magenta/5 border border-magenta/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {update.type}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="p-1 hover:bg-red-50 border border-transparent rounded text-gray-400 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover/up:opacity-100"
                          title="Delete update"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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

      {/* Right Column: Teams, Review Panel, AI Summary Helper */}
      <div className="flex flex-col gap-6">
        
        {/* Team Members List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg border-b border-gray-50 pb-3 flex items-center gap-2">
            <span>Mission Teams</span>
          </h3>

          {mission.teams && mission.teams.length > 0 ? (
            <div className="flex flex-col gap-4">
              {mission.teams.map((team: any) => (
                <div key={team.id} className="flex flex-col gap-2.5">
                  <h4 className="font-extrabold text-sm text-magenta">{team.name}</h4>
                  <div className="flex flex-col gap-2">
                    {team.members.map((m: any) => (
                      <div key={m.id} className="flex justify-between items-center text-xs">
                        <Link to={`/cubes/${m.cube.id}`} className="font-bold hover:text-magenta transition-colors">
                          {m.cube.user.name}
                        </Link>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase">
                          {m.role.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-2 text-center">No teams created yet.</p>
          )}
          {isMentorOrAdmin && (
            <Link to="/teams" className="w-full text-center py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors mt-2">
              Configure Teams & Assign Cubes
            </Link>
          )}
        </div>

        {/* Mentor/Admin controls: Status & Decision panel */}
        {isMentorOrAdmin && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2 flex justify-between items-center">
              <span>Mission Configuration</span>
              <button
                onClick={() => setIsEditingStatus(!isEditingStatus)}
                className="text-xs text-magenta hover:underline font-bold"
              >
                {isEditingStatus ? 'Cancel' : 'Edit'}
              </button>
            </h3>

            {isEditingStatus ? (
              <form onSubmit={handleStatusUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Mission Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold outline-none"
                  >
                    <option value="idea_pool">Idea Pool</option>
                    <option value="selected">Selected</option>
                    <option value="researching">Researching</option>
                    <option value="building_demo">Building Demo</option>
                    <option value="preparing_handover">Preparing Handover</option>
                    <option value="demo_ready">Demo Ready</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="promoted_to_product_backlog">Promoted to Product Backlog</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {isAdmin && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Final Decision (Admin Only)</label>
                    <select
                      value={newDecision}
                      onChange={(e) => setNewDecision(e.target.value)}
                      className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold outline-none"
                    >
                      <option value="">No decision yet</option>
                      <option value="Promote_to_Product_Backlog">Promote to Backlog</option>
                      <option value="Needs_More_Research">Needs More Research</option>
                      <option value="Keep_as_Internal_Tool">Keep as Internal Tool</option>
                      <option value="Archive">Archive</option>
                      <option value="Moved_to_Product">Moved to Product</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={statusSubmitting}
                  className="py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{statusSubmitting ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-2 text-xs text-gray-600 font-medium">
                <p><span className="font-bold text-gray-700">Status:</span> <span className="uppercase text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-magenta font-extrabold">{mission.status.replace(/_/g, ' ')}</span></p>
                {mission.decision && (
                  <p><span className="font-bold text-gray-700">Decision:</span> <span className="uppercase text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">{mission.decision.replace(/_/g, ' ')}</span></p>
                )}
                 <Link to={`/missions/${id}/edit`} className="w-full text-center py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors mt-2">
                  Edit Full Mission Text
                </Link>
                {isAdmin && (
                  <button
                    onClick={handleDeleteMission}
                    className="w-full text-center py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors mt-1.5"
                  >
                    Delete Mission
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Mission Summary Generator (editable before save) */}
        {isMentorOrAdmin && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-magenta" />
              <span>AI Mission Summary</span>
            </h3>

            {summarySaved && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold p-2.5 rounded-lg border border-green-100">
                Summary successfully saved as final draft.
              </div>
            )}

            {aiSummary ? (
              <div className="flex flex-col gap-3">
                {isEditingSummary ? (
                  <textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={8}
                    className="w-full p-2.5 border border-gray-200 focus:border-magenta text-xs font-semibold rounded-lg outline-none"
                  />
                ) : (
                  <div className="markdown-body bg-magenta/5 border border-magenta/10 p-4 rounded-xl text-xs text-gray-700 max-h-80 overflow-y-auto font-medium leading-relaxed">
                    <CustomMarkdown>{editedSummary}</CustomMarkdown>
                  </div>
                )}

                <div className="flex gap-2">
                  {isEditingSummary ? (
                    <button
                      onClick={handleSaveSummary}
                      className="flex-1 py-1.5 bg-magenta text-white rounded-lg text-xs font-bold hover:bg-magenta-hover transition-colors"
                    >
                      Save Summary
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingSummary(true)}
                      className="flex-1 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                    >
                      Edit Text
                    </button>
                  )}
                  <button
                    onClick={handleGenerateSummary}
                    className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold transition-all"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateSummary}
                disabled={aiLoading}
                className="w-full py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Mission Summary</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Mentor feedback list (Private details visible only to mentors/admins) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-subtle flex flex-col gap-4">
          <h3 className="font-extrabold text-lg border-b border-gray-50 pb-2">Evaluations</h3>
          
          {mentorFeedback && mentorFeedback.length > 0 ? (
            <div className="flex flex-col gap-4">
              {mentorFeedback.map((fb: any) => (
                <div key={fb.id} className="border-l-2 border-magenta pl-3.5 py-0.5 text-xs text-gray-600 relative group/fb">
                  <div className="flex justify-between items-center font-bold text-gray-900 mb-1">
                    <span>{fb.cube ? fb.cube.name : 'Unknown Cube'}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-magenta">{fb.technical_ability_score}/5</span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          className="p-1 hover:bg-red-50 border border-transparent rounded text-gray-400 hover:text-red-500 hover:border-red-100 transition-all opacity-0 group-hover/fb:opacity-100"
                          title="Delete evaluation feedback"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="italic">"{fb.strengths}"</p>
                  <p className="text-[10px] text-gray-400 mt-2">By {fb.mentor.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm py-2 text-center">No evaluations submitted yet.</p>
          )}

          {isMentorOrAdmin && (
            <Link
              to={`/missions/${id}/review`}
              className="w-full text-center py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm shadow-magenta/10"
            >
              Add Evaluation Scorecard
            </Link>
          )}
        </div>

      </div>

    </div>
  );
};
