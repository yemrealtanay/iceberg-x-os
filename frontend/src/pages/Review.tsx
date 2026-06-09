import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Sparkles, Star, Save } from 'lucide-react';

export const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Optional mission ID
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search params to get prefilled Cube ID
  const queryParams = new URLSearchParams(location.search);
  const prefilledCubeId = queryParams.get('cube') || '';

  const [cubes, setCubes] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [cubeId, setCubeId] = useState(prefilledCubeId);
  const [missionId, setMissionId] = useState(id || '');
  
  // Scores (1-5)
  const [technical, setTechnical] = useState(5);
  const [research, setResearch] = useState(5);
  const [demoOutput, setDemoOutput] = useState(5);
  const [ownership, setOwnership] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [leadership, setLeadership] = useState(5);
  const [productThinking, setProductThinking] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [selfReflection, setSelfReflection] = useState(5);

  const [strengths, setStrengths] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [visibleToCube, setVisibleToCube] = useState(true);
  const [recommendedNextStep, setRecommendedNextStep] = useState('Continue_as_Cube');
  const [submitting, setSubmitting] = useState(false);

  // AI draft states
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const initializePageData = async () => {
      try {
        const [cubesRes, missionsRes] = await Promise.all([
          api.get('/cubes'),
          api.get('/missions')
        ]);
        setCubes(cubesRes);
        setMissions(missionsRes);
        if (!cubeId && cubesRes.length > 0) {
          setCubeId(cubesRes[0].user.id); // set user id
        }
        if (!missionId && missionsRes.length > 0) {
          setMissionId(missionsRes[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize page data');
      } finally {
        setLoading(false);
      }
    };

    initializePageData();
  }, [cubeId, missionId]);

  const handleFetchAIDraft = async () => {
    if (!cubeId) {
      alert('Please select a Cube first.');
      return;
    }

    setAiLoading(true);
    setAiDraft(null);

    const scores = {
      technical,
      research,
      demoOutput,
      ownership,
      communication,
      leadership,
      productThinking,
      reliability,
      selfReflection
    };

    try {
      const res = await api.post('/ai/feedback-draft', {
        scores,
        notes: privateNotes || '',
        cube_id: cubeId
      });
      setAiDraft(res.draft);
    } catch (err: any) {
      alert(err.message || 'Failed to generate AI feedback draft');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyDraft = () => {
    if (!aiDraft) return;

    // Parse draft if it contains specific tags, otherwise append to strengths
    // For simplicity, we append to privateNotes or strengths so the mentor can edit it.
    setStrengths(prev => `${prev}\n\n[AI Draft Strengths]:\n` + aiDraft);
    setAiDraft(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cubeId || !missionId || !strengths || !areasToImprove || !recommendedNextStep) {
      setError('Please fill in all required fields and scores.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Cube ID parameter mapping: in cubes database, cube_id can map to User id.
    // In our backend routes: cube_id refers to User id (User FK).
    // Let's make sure we find the User ID for the selected cube profile if cubeId is profile id.
    // Actually, in the frontend cubes directory, we have cube.user.id. Let's make sure we select the User ID!
    // In the dropdown: `c.user.id` is the value, so cubeId represents the User ID. This aligns perfectly with the backend!

    const payload = {
      cube_id: cubeId,
      mission_id: missionId,
      technical_ability_score: technical,
      research_ability_score: research,
      demo_output_score: demoOutput,
      ownership_score: ownership,
      communication_score: communication,
      leadership_score: leadership,
      product_thinking_score: productThinking,
      reliability_score: reliability,
      self_reflection_score: selfReflection,
      strengths,
      areas_to_improve: areasToImprove,
      private_notes: privateNotes || null,
      visible_to_cube: visibleToCube,
      recommended_next_step: recommendedNextStep
    };

    try {
      await api.post('/feedback', payload);
      navigate(`/missions/${missionId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
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

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cube Scorecard Evaluation</h1>
        <p className="text-gray-500 mt-1">Submit feedback after Demo Day. Grade abilities and set progression pathways.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scorecard Form (Left 2 Columns) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-subtle flex flex-col gap-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Fellowship Cube</label>
              <select
                value={cubeId}
                onChange={e => setCubeId(e.target.value)}
                className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              >
                {cubes.map(c => (
                  <option key={c.id} value={c.user.id}>
                    Cube #{c.cube_number} - {c.user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Mission Reviewed</label>
              <select
                value={missionId}
                onChange={e => setMissionId(e.target.value)}
                className="p-2 border border-gray-100 bg-gray-50 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              >
                {missions.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scores Panel */}
          <div>
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3.5">Ratings (1 to 5)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Technical Ability', state: technical, set: setTechnical },
                { label: 'Research Ability', state: research, set: setResearch },
                { label: 'Demo Output', state: demoOutput, set: setDemoOutput },
                { label: 'Ownership', state: ownership, set: setOwnership },
                { label: 'Communication', state: communication, set: setCommunication },
                { label: 'Leadership', state: leadership, set: setLeadership },
                { label: 'Product Thinking', state: productThinking, set: setProductThinking },
                { label: 'Reliability', state: reliability, set: setReliability },
                { label: 'Self-Reflection', state: selfReflection, set: setSelfReflection },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border border-gray-50 bg-gray-50/20 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => item.set(star)}
                        className="p-0.5"
                      >
                        <Star className={`w-5 h-5 ${star <= item.state ? 'fill-magenta text-magenta' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written evaluations */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Core Strengths</label>
              <textarea
                required
                rows={3}
                placeholder="What did the Cube do exceptionally well during the mission?"
                value={strengths}
                onChange={e => setStrengths(e.target.value)}
                className="p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Areas to Improve</label>
              <textarea
                required
                rows={3}
                placeholder="What architectural, engineering, or team interactions could be improved?"
                value={areasToImprove}
                onChange={e => setAreasToImprove(e.target.value)}
                className="p-2.5 border border-gray-100 bg-gray-50 rounded-lg text-xs outline-none focus:border-magenta"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-red-500 uppercase">Private Notes (Hidden from Cube)</label>
              <textarea
                rows={2}
                placeholder="Internal comments for admins and mentors only (e.g. progression hiring contracts)..."
                value={privateNotes}
                onChange={e => setPrivateNotes(e.target.value)}
                className="p-2.5 border border-red-100 bg-red-50/20 rounded-lg text-xs outline-none focus:border-red-400 text-red-700"
              />
            </div>
          </div>

          {/* Visibility and Progression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 pt-5 items-center">
            <div className="flex items-center gap-2">
              <input
                id="visible_check"
                type="checkbox"
                checked={visibleToCube}
                onChange={e => setVisibleToCube(e.target.checked)}
                className="rounded text-magenta focus:ring-magenta w-4.5 h-4.5"
              />
              <label htmlFor="visible_check" className="text-xs font-bold text-gray-600 cursor-pointer">
                Publish feedback scorecard directly to Cube
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Recommended Next Step</label>
              <select
                value={recommendedNextStep}
                onChange={e => setRecommendedNextStep(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="Continue_as_Cube">Continue as Cube</option>
                <option value="Consider_for_Senior_Cube">Consider for Senior Cube</option>
                <option value="Consider_for_Lead_Cube">Consider for Lead Cube</option>
                <option value="Consider_as_Observer">Consider as Observer</option>
                <option value="Consider_as_Project_Contributor">Consider as Project Contributor</option>
                <option value="Consider_as_Part_Time_Candidate">Consider as Part-Time Candidate</option>
                <option value="Needs_Support">Needs Support</option>
                <option value="Inactive_Risk">Inactive Risk</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3.5 bg-magenta text-white font-bold text-xs tracking-wide uppercase rounded-xl hover:bg-magenta-hover active:scale-[0.99] transition-all shadow-md shadow-magenta/15 flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Submitting review...' : 'Submit Evaluation Scorecard'}</span>
          </button>
        </form>

        {/* Sidebar: AI Review Helper */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-subtle flex flex-col gap-4">
            <h3 className="font-extrabold text-sm border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-magenta" />
              <span>AI Review Drafter</span>
            </h3>

            <p className="text-xs text-gray-400">
              Generate a professional draft feedback based on your ratings and observations before submitting.
            </p>

            {aiDraft ? (
              <div className="flex flex-col gap-3">
                <div className="bg-magenta/5 border border-magenta/10 p-4 rounded-xl text-xs text-gray-700 max-h-80 overflow-y-auto font-medium prose prose-sm">
                  {aiDraft.split('\n').map((para, i) => <p key={i} className="mb-2 last:mb-0">{para}</p>)}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleApplyDraft}
                    className="flex-1 py-1.5 bg-magenta text-white text-xs font-bold rounded-lg hover:bg-magenta-hover transition-colors"
                  >
                    Apply Draft to Strengths
                  </button>
                  <button
                    type="button"
                    onClick={handleFetchAIDraft}
                    className="py-1.5 px-3 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold"
                  >
                    Regen
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleFetchAIDraft}
                disabled={aiLoading}
                className="w-full py-2.5 bg-magenta text-white font-bold text-xs rounded-xl hover:bg-magenta-hover transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft Review Text</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
