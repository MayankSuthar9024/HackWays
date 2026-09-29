import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CountdownTimer from '../components/CountdownTimer';
import Modal from '../components/Modal';
import {
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  Link as LinkIcon,
  Github,
  Globe,
  AlertCircle,
  FolderArchive,
  ArrowRight,
  HelpCircle,
  Eye,
} from 'lucide-react';

export default function EventSubmissionPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [event, setEvent] = useState(null);
  const [scheduleState, setScheduleState] = useState({});
  const [problemStatements, setProblemStatements] = useState([]);
  const [isPSReleased, setIsPSReleased] = useState(false);
  const [psReleaseTime, setPsReleaseTime] = useState(null);

  // Submissions data
  const [myIdea, setMyIdea] = useState(null);
  const [myPrototype, setMyPrototype] = useState(null);
  const [loading, setLoading] = useState(true);

  // Idea Form State
  const [selectedPS, setSelectedPS] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [ideaFile, setIdeaFile] = useState(null);
  const [submittingIdea, setSubmittingIdea] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

  // Prototype Form State
  const [protoTitle, setProtoTitle] = useState('');
  const [protoDesc, setProtoDesc] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [protoFile, setProtoFile] = useState(null);
  const [submittingProto, setSubmittingProto] = useState(false);
  const [isProtoModalOpen, setIsProtoModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Event & Schedule
      const eventRes = await api.get(`/events/${eventId}`);
      if (eventRes.data.success) {
        setEvent(eventRes.data.event);
        setScheduleState(eventRes.data.scheduleState);
      }

      // 2. Fetch Problem Statements
      try {
        const psRes = await api.get(`/events/${eventId}/problem-statements`);
        if (psRes.data.success) {
          setIsPSReleased(true);
          setProblemStatements(psRes.data.statements);
        }
      } catch (err) {
        if (err.response?.status === 403 && err.response?.data?.releaseTime) {
          setIsPSReleased(false);
          setPsReleaseTime(err.response.data.releaseTime);
        }
      }

      // 3. Fetch User's Submissions
      try {
        const subRes = await api.get(`/events/${eventId}/submissions/mine`);
        if (subRes.data.success) {
          setMyIdea(subRes.data.idea);
          setMyPrototype(subRes.data.prototype);

          if (subRes.data.idea) {
            setSelectedPS(subRes.data.idea.problemStatement?._id || subRes.data.idea.problemStatement);
            setIdeaTitle(subRes.data.idea.ideaTitle);
            setIdeaDescription(subRes.data.idea.ideaDescription);
            setTechStackInput((subRes.data.idea.techStack || []).join(', '));
          }

          if (subRes.data.prototype) {
            setProtoTitle(subRes.data.prototype.prototypeTitle);
            setProtoDesc(subRes.data.prototype.description);
            setGithubUrl(subRes.data.prototype.githubUrl || '');
            setLiveDemoUrl(subRes.data.prototype.liveDemoUrl || '');
            setDriveUrl(subRes.data.prototype.driveUrl || '');
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing submissions:', err);
      }
    } catch (err) {
      showError('Failed to load submission dashboard.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Stage 1: Idea
  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPS) {
      showError('Please choose a problem statement.');
      return;
    }

    setSubmittingIdea(true);
    try {
      const formData = new FormData();
      formData.append('problemStatementId', selectedPS);
      formData.append('ideaTitle', ideaTitle.trim());
      formData.append('ideaDescription', ideaDescription.trim());

      const techStack = techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append('techStack', JSON.stringify(techStack));

      if (ideaFile) {
        formData.append('supportingFile', ideaFile);
      }

      const res = await api.post(`/events/${eventId}/submissions/idea`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        success(res.data.message || 'Idea proposal saved successfully!');
        setIsIdeaModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Error submitting idea proposal.');
    } finally {
      setSubmittingIdea(false);
    }
  };

  // Submit Stage 2: Prototype
  const handlePrototypeSubmit = async (e) => {
    e.preventDefault();
    if (!myIdea) {
      showError('You must submit an idea proposal first.');
      return;
    }

    setSubmittingProto(true);
    try {
      const formData = new FormData();
      formData.append('prototypeTitle', protoTitle.trim());
      formData.append('description', protoDesc.trim());
      formData.append('githubUrl', githubUrl.trim());
      formData.append('liveDemoUrl', liveDemoUrl.trim());
      formData.append('driveUrl', driveUrl.trim());

      if (protoFile) {
        formData.append('prototypeFile', protoFile);
      }

      const res = await api.post(`/events/${eventId}/submissions/prototype`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        success(res.data.message || 'Prototype submitted successfully!');
        setIsProtoModalOpen(false);
        fetchData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Error submitting prototype.');
    } finally {
      setSubmittingProto(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Event Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
            <Link to={`/events/${eventId}`} className="hover:underline">
              {event.title}
            </Link>{' '}
            &rarr; Submissions Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
            Problem Statements & Submissions
          </h1>
        </div>

        <Link to={`/events/${eventId}`} className="btn-outline text-xs py-2 px-4 self-start md:self-auto">
          Back to Event Overview
        </Link>
      </div>

      {/* SECTION 1: PROBLEM STATEMENTS STATUS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            {isPSReleased ? <Unlock className="w-5 h-5 text-emerald-700" /> : <Lock className="w-5 h-5 text-accent" />}
            Problem Statements
          </h2>
          {isPSReleased && (
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              Released & Live
            </span>
          )}
        </div>

        {!isPSReleased ? (
          /* PS Countdown Card */
          <div className="card bg-white p-8 sm:p-12 text-center rounded-3xl border border-accent/20 space-y-6 shadow-card">
            <div className="inline-flex p-4 rounded-full bg-secondary text-primary">
              <Clock className="w-8 h-8 text-accent" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-bold text-dark">Problem Statements Are Locked</h3>
              <p className="text-xs sm:text-sm text-dark-muted">
                Problem statements will be released simultaneously for all participants once the timer reaches zero.
              </p>
            </div>

            {psReleaseTime && (
              <div className="flex justify-center pt-2">
                <CountdownTimer
                  targetDate={psReleaseTime}
                  onExpire={() => fetchData()}
                  label="Official Release Countdown"
                />
              </div>
            )}
          </div>
        ) : (
          /* Released PS List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemStatements.map((ps) => (
              <div
                key={ps._id}
                className={`bg-white rounded-2xl border p-6 shadow-card flex flex-col justify-between space-y-4 transition-all ${
                  selectedPS === ps._id ? 'border-primary ring-2 ring-primary/20' : 'border-accent/15'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 bg-primary text-secondary rounded-lg">
                      {ps.psCode}
                    </span>
                    <span className="text-[11px] font-semibold text-accent uppercase tracking-wide">
                      {ps.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-dark leading-snug">{ps.title}</h4>
                  <p className="text-xs text-dark-muted leading-relaxed line-clamp-4">{ps.description}</p>
                </div>

                <div className="pt-3 border-t border-background-cream flex items-center justify-between">
                  <span className="text-[11px] font-bold text-dark-muted">
                    Difficulty: <span className="text-primary font-semibold">{ps.difficulty}</span>
                  </span>

                  {myIdea?.problemStatement?._id === ps._id && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: SUBMISSION PIPELINE (STAGE 1 & STAGE 2) */}
      <div className="space-y-6 pt-6 border-t border-accent/15">
        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Participant Submission Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STAGE 1: IDEA PROPOSAL CARD */}
          <div className="bg-white rounded-2xl border border-accent/20 shadow-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Stage 1</span>
                {myIdea ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {myIdea.status}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary">
                    Pending Submission
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-dark">Idea & Architecture Proposal</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Select your problem statement and submit your approach blueprint, technical stack, and solution summary.
              </p>

              {myIdea && (
                <div className="p-4 rounded-xl bg-background-cream/50 border border-accent/15 space-y-2 text-xs">
                  <div>
                    <span className="text-dark-muted block">Selected Problem:</span>
                    <strong className="text-dark">{myIdea.problemStatement?.title || 'Selected PS'}</strong>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Idea Title:</span>
                    <strong className="text-dark">{myIdea.ideaTitle}</strong>
                  </div>
                  {myIdea.adminRemarks && (
                    <div className="mt-2 p-2.5 rounded bg-white border border-accent/20">
                      <span className="font-semibold text-accent block">Admin Feedback:</span>
                      <span className="text-dark-muted">{myIdea.adminRemarks}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  if (!isPSReleased) {
                    showError('Please wait for problem statements to be released.');
                    return;
                  }
                  setIsIdeaModalOpen(true);
                }}
                disabled={!isPSReleased}
                className="w-full btn-primary py-2.5 text-xs font-semibold rounded-xl"
              >
                {myIdea ? 'View / Edit Idea Proposal' : 'Submit Idea Proposal'}
              </button>
            </div>
          </div>

          {/* STAGE 2: PROTOTYPE SUBMISSION CARD */}
          <div className="bg-white rounded-2xl border border-accent/20 shadow-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Stage 2</span>
                {myPrototype ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {myPrototype.status}
                  </span>
                ) : scheduleState.isPrototypeClosed ? (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                    Closed
                  </span>
                ) : scheduleState.isPrototypeOpen ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Window Open
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    Not Opened Yet
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-dark">Working Prototype & Code</h3>
              <p className="text-xs text-dark-muted leading-relaxed">
                Provide your GitHub repository link, live application demo, or zip file. Submissions automatically lock upon deadline.
              </p>

              {/* Prototype schedule info */}
              {event.schedule.prototypeCloseTime && (
                <div className="text-xs text-dark-muted">
                  <span>Deadline: </span>
                  <strong className="text-primary font-semibold">
                    {new Date(event.schedule.prototypeCloseTime).toLocaleString()}
                  </strong>
                </div>
              )}

              {myPrototype && (
                <div className="p-4 rounded-xl bg-background-cream/50 border border-accent/15 space-y-2 text-xs">
                  <div>
                    <span className="text-dark-muted block">Prototype Title:</span>
                    <strong className="text-dark">{myPrototype.prototypeTitle}</strong>
                  </div>
                  {myPrototype.githubUrl && (
                    <div className="truncate">
                      <span className="text-dark-muted">GitHub: </span>
                      <a href={myPrototype.githubUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                        {myPrototype.githubUrl}
                      </a>
                    </div>
                  )}
                  {myPrototype.adminRemarks && (
                    <div className="mt-2 p-2.5 rounded bg-white border border-accent/20">
                      <span className="font-semibold text-accent block">Admin Remarks:</span>
                      <span className="text-dark-muted">{myPrototype.adminRemarks}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  if (!myIdea) {
                    showError('Please complete Stage 1 (Idea Proposal) before submitting your prototype.');
                    return;
                  }
                  if (!scheduleState.isPrototypeOpen && !myPrototype) {
                    showError('Prototype submission window is not open at this moment.');
                    return;
                  }
                  setIsProtoModalOpen(true);
                }}
                disabled={(!scheduleState.isPrototypeOpen && !myPrototype) || !myIdea}
                className="w-full btn-primary py-2.5 text-xs font-semibold rounded-xl disabled:opacity-50"
              >
                {myPrototype
                  ? scheduleState.isPrototypeClosed
                    ? 'View Submitted Prototype (Locked)'
                    : 'Edit Prototype Submission'
                  : scheduleState.isPrototypeOpen
                  ? 'Submit Working Prototype'
                  : 'Prototype Window Not Open'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STAGE 1 MODAL: IDEA PROPOSAL */}
      <Modal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        title="Stage 1: Idea & Architecture Proposal"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleIdeaSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Select Problem Statement <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={selectedPS}
              onChange={(e) => setSelectedPS(e.target.value)}
              className="input-field text-xs"
            >
              <option value="">-- Choose Problem Statement --</option>
              {problemStatements.map((ps) => (
                <option key={ps._id} value={ps._id}>
                  [{ps.psCode}] {ps.title} ({ps.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Idea / Solution Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              placeholder="e.g. AI-Powered Smart Microgrid Dispatcher"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Detailed Solution Architecture & Description <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Detail your methodology, workflow, user experience, and key innovation..."
              className="input-field text-xs resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="e.g. React, Node.js, Python, OpenCV, MongoDB"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Supporting Document / Architecture Diagram (PDF, PPTX, Image)
            </label>
            <input
              type="file"
              onChange={(e) => setIdeaFile(e.target.files[0])}
              className="text-xs text-dark-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-primary hover:file:bg-secondary-hover cursor-pointer"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-accent/15">
            <button
              type="button"
              onClick={() => setIsIdeaModalOpen(false)}
              className="btn-outline text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingIdea}
              className="btn-primary text-xs py-2 px-6"
            >
              {submittingIdea ? 'Saving...' : 'Save Idea Proposal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* STAGE 2 MODAL: PROTOTYPE SUBMISSION */}
      <Modal
        isOpen={isProtoModalOpen}
        onClose={() => setIsProtoModalOpen(false)}
        title="Stage 2: Prototype & Code Submission"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handlePrototypeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Prototype Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              disabled={scheduleState.isPrototypeClosed}
              value={protoTitle}
              onChange={(e) => setProtoTitle(e.target.value)}
              placeholder="e.g. EcoGrid v1.0 Functional MVP"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Setup Instructions & Demo Summary <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={4}
              disabled={scheduleState.isPrototypeClosed}
              value={protoDesc}
              onChange={(e) => setProtoDesc(e.target.value)}
              placeholder="Brief instructions on how to test and run your prototype, credentials if needed..."
              className="input-field text-xs resize-y"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                GitHub Repository URL
              </label>
              <input
                type="url"
                disabled={scheduleState.isPrototypeClosed}
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                Live App Demo URL
              </label>
              <input
                type="url"
                disabled={scheduleState.isPrototypeClosed}
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://demo.app.com"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
              Google Drive / Video Link (Optional)
            </label>
            <input
              type="url"
              disabled={scheduleState.isPrototypeClosed}
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="input-field text-xs"
            />
          </div>

          {!scheduleState.isPrototypeClosed && (
            <div>
              <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                Upload Prototype Zip / Archive (Max 25MB)
              </label>
              <input
                type="file"
                onChange={(e) => setProtoFile(e.target.files[0])}
                className="text-xs text-dark-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-primary hover:file:bg-secondary-hover cursor-pointer"
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-accent/15">
            <button
              type="button"
              onClick={() => setIsProtoModalOpen(false)}
              className="btn-outline text-xs py-2 px-4"
            >
              Close
            </button>
            {!scheduleState.isPrototypeClosed && (
              <button
                type="submit"
                disabled={submittingProto}
                className="btn-primary text-xs py-2 px-6"
              >
                {submittingProto ? 'Submitting...' : 'Submit Prototype'}
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
