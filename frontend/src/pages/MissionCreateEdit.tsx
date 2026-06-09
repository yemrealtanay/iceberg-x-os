import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Save } from 'lucide-react';

export const MissionCreateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Optional Mission ID
  const isEditMode = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Level_3_Working_POC');
  const [status, setStatus] = useState('idea_pool');
  const [mentorId, setMentorId] = useState('');
  const [slackChannelUrl, setSlackChannelUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchMission = async () => {
        try {
          const res = await api.get(`/missions/${id}`);
          const m = res.mission;
          setTitle(m.title);
          setDescription(m.description);
          setContext(m.context);
          setProblemStatement(m.problem_statement);
          setExpectedOutput(m.expected_output);
          setDifficultyLevel(m.difficulty_level);
          setStatus(m.status);
          setMentorId(m.mentor_id || '');
          setSlackChannelUrl(m.slack_channel_url || '');
          setRepositoryUrl(m.repository_url || '');
          setDemoUrl(m.demo_url || '');
          setCategory(m.category || 'General');
        } catch (err: any) {
          setError(err.message || 'Failed to fetch mission details');
        } finally {
          setLoading(false);
        }
      };
      fetchMission();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !context || !problemStatement || !expectedOutput) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      title,
      description,
      context,
      problem_statement: problemStatement,
      expected_output: expectedOutput,
      difficulty_level: difficultyLevel,
      status,
      category,
      mentor_id: mentorId || null,
      slack_channel_url: slackChannelUrl || null,
      repository_url: repositoryUrl || null,
      demo_url: demoUrl || null
    };

    try {
      if (isEditMode) {
        await api.put(`/missions/${id}`, payload);
        navigate(`/missions/${id}`);
      } else {
        const created = await api.post('/missions', payload);
        navigate(`/missions/${created.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save mission');
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
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* Navigation & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(isEditMode ? `/missions/${id}` : '/missions')}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-magenta transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEditMode ? 'Edit Mission details' : 'Create New R&D Mission'}
          </h1>
          <p className="text-gray-500 mt-1">Specify parameters, contexts, expected outcomes, and assign mentors.</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-subtle flex flex-col gap-5">
        
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
            Mission Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. LLM-based Email Router"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Provide a general overview of the mission..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
            Context & Background <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Why is this mission valuable? What is the background detail?"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
            Problem Statement <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Specify the exact technical challenge to solve..."
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
            Expected Outputs & Deliverables <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            placeholder="e.g. Working API microservice and React UI dashboard skeleton"
            value={expectedOutput}
            onChange={(e) => setExpectedOutput(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Difficulty Level</label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold"
            >
              <option value="Level_1_Research_Only">Level 1 - Research Only</option>
              <option value="Level_2_Research_Mock">Level 2 - Research + Mock</option>
              <option value="Level_3_Working_POC">Level 3 - Working POC</option>
              <option value="Level_4_Integration_Candidate">Level 4 - Integration Candidate</option>
              <option value="Level_5_Main_Team_Assist">Level 5 - Main Team Assist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold"
            >
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-xs font-bold"
            >
              <option value="AI/ML">AI/ML</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Data Science">Data Science</option>
              <option value="Research">Research</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Assigned Mentor ID</label>
          <input
            type="text"
            placeholder="UUID of mentor user"
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Slack Channel URL</label>
            <input
              type="url"
              placeholder="e.g. https://slack.com/..."
              value={slackChannelUrl}
              onChange={(e) => setSlackChannelUrl(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Code Repository URL</label>
            <input
              type="url"
              placeholder="e.g. https://github.com/..."
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Live Demo URL</label>
            <input
              type="url"
              placeholder="e.g. https://demo.com"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-magenta focus:bg-white text-xs font-semibold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 py-3.5 bg-magenta text-white font-bold text-xs tracking-wide uppercase rounded-xl hover:bg-magenta-hover active:scale-[0.99] transition-all shadow-md shadow-magenta/15 flex items-center justify-center gap-1.5 disabled:opacity-75"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving changes...' : 'Save R&D Mission'}</span>
        </button>

      </form>
    </div>
  );
};
