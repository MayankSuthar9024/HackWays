import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events/user/my-events');
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Error fetching my events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-accent/15 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Participant Hub</div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">My Registered Events</h1>
        <p className="text-sm text-dark-muted mt-1">
          Track your active registrations, problem statements, and stage submissions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card h-64 animate-pulse bg-white/70"></div>
          ))}
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => {
            const evt = reg.event;
            if (!evt) return null;

            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-accent/15 shadow-card p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">
                      {evt.category} • {evt.mode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {reg.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark">{evt.title}</h3>

                  <div className="space-y-1 text-xs text-dark-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>
                        {new Date(evt.startDate).toLocaleDateString()} - {new Date(evt.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {reg.teamName && (
                      <div className="text-dark font-medium">Team: {reg.teamName}</div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-background-cream flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/events/${evt._id}`}
                    className="text-xs font-semibold text-dark-muted hover:text-dark"
                  >
                    View Event Info
                  </Link>

                  <Link
                    to={`/events/${evt._id}/submissions`}
                    className="btn-primary py-2 px-4 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span>Submissions & PS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-4">
          <p className="text-dark font-medium text-base">You haven't registered for any events yet.</p>
          <p className="text-dark-muted text-xs">Explore our active challenges and secure your spot!</p>
          <div className="pt-2">
            <Link to="/events" className="btn-primary text-xs py-2 px-6">
              Browse Open Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
