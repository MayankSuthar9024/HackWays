import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [userState, setUserState] = useState({ isRegistered: false });
  const [scheduleState, setScheduleState] = useState({});
  const [loading, setLoading] = useState(true);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
        setUserState(res.data.userState || { isRegistered: false });
        setScheduleState(res.data.scheduleState || {});

        if (user) {
          setTeamName(`${user.name}'s Team`);
          setCollegeOrOrg(user.college || '');
        }
      }
    } catch (err) {
      showError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setRegistering(true);
    try {
      const res = await api.post(`/events/${id}/register`, {
        teamName: teamName.trim(),
        collegeOrOrg: collegeOrOrg.trim(),
      });

      if (res.data.success) {
        success(res.data.message || 'Successfully registered for this event!');
        setIsRegisterModalOpen(false);
        fetchEventDetails();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Error registering for event.');
    } finally {
      setRegistering(false);
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
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center card bg-white">
        <h2 className="text-xl font-bold text-dark">Event Not Found</h2>
        <p className="text-sm text-dark-muted mt-2">The event you are looking for does not exist or has been removed.</p>
        <Link to="/events" className="btn-primary mt-6 text-xs">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-accent/15 shadow-card overflow-hidden">
        <div className="h-64 sm:h-80 bg-primary/20 relative">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {event.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-secondary text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white font-medium text-xs px-3 py-1 rounded-full">
                {event.mode}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white font-medium text-xs px-3 py-1 rounded-full">
                Status: {event.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{event.title}</h1>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 sm:p-8 bg-background-cream/40 border-t border-accent/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 w-full sm:w-auto text-xs sm:text-sm">
            <div>
              <span className="text-dark-muted block">Dates</span>
              <strong className="text-dark font-semibold">
                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </strong>
            </div>
            <div>
              <span className="text-dark-muted block">Venue</span>
              <strong className="text-dark font-semibold truncate block max-w-[160px]">{event.venue}</strong>
            </div>
            <div>
              <span className="text-dark-muted block">Team Limit</span>
              <strong className="text-dark font-semibold">Up to {event.maxTeamSize} Members</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {userState.isRegistered ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Registered
                </span>
                <Link
                  to={`/events/${event._id}/submissions`}
                  className="btn-primary py-2.5 text-xs font-semibold rounded-xl flex-1 sm:flex-none"
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Problem Statements & Submissions</span>
                </Link>
              </div>
            ) : event.registrationOpen ? (
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
                  } else {
                    setIsRegisterModalOpen(true);
                  }
                }}
                className="btn-primary w-full sm:w-auto py-3 px-8 text-sm font-semibold rounded-xl shadow-md"
              >
                Register for Event
              </button>
            ) : (
              <span className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-red-100 text-red-800">
                Registrations Closed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Rules & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card bg-white p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-dark border-b border-accent/15 pb-3">About The Event</h2>
            <div className="text-dark leading-relaxed text-sm whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {event.rules && event.rules.length > 0 && (
            <div className="card bg-white p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-dark border-b border-accent/15 pb-3">Rules & Guidelines</h2>
              <ul className="space-y-3">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-dark-muted">
                    <span className="w-5 h-5 rounded-full bg-secondary text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Schedule and Prizes */}
        <div className="space-y-6">
          {/* Prizes Card */}
          {event.prizes && event.prizes.length > 0 && (
            <div className="card bg-white p-6 space-y-4">
              <h3 className="text-base font-bold text-dark flex items-center gap-2 border-b border-accent/15 pb-3">
                <Award className="w-5 h-5 text-accent" />
                Prizes & Awards
              </h3>
              <div className="space-y-3">
                {event.prizes.map((prize, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-background-cream/60 border border-accent/15 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-dark">{prize.position}</span>
                      <span className="font-extrabold text-sm text-primary">{prize.amount}</span>
                    </div>
                    {prize.perks && <p className="text-xs text-accent font-medium">{prize.perks}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Portal Quick Access if registered */}
          <div className="card bg-primary text-white p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-secondary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Submission Pipeline
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Registered participants can view official problem statements, submit idea summaries, and submit working prototypes during the scheduled windows.
            </p>
            {userState.isRegistered ? (
              <Link
                to={`/events/${event._id}/submissions`}
                className="w-full bg-secondary text-primary hover:bg-secondary-hover py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                Go to Submissions Portal &rarr;
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (!user) navigate('/login');
                  else setIsRegisterModalOpen(true);
                }}
                className="w-full bg-white/15 hover:bg-white/25 text-white py-2.5 rounded-xl font-semibold text-xs transition-colors"
              >
                Register to Unlock Submissions
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title={`Register for ${event.title}`}
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <p className="text-xs text-dark-muted">
            Confirm your participant details for registration.
          </p>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1">Participant Name</label>
            <input
              type="text"
              disabled
              value={user?.name || ''}
              className="input-field bg-background-cream/50 cursor-not-allowed text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="input-field bg-background-cream/50 cursor-not-allowed text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1">Team Name (Optional)</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. CodeCrafters"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark mb-1">College / Organization</label>
            <input
              type="text"
              value={collegeOrOrg}
              onChange={(e) => setCollegeOrOrg(e.target.value)}
              placeholder="e.g. Stanford University"
              className="input-field text-xs"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(false)}
              className="btn-outline text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={registering}
              className="btn-primary text-xs py-2 px-6"
            >
              {registering ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
