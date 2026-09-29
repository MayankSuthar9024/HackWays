import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Clock, Calendar, ShieldCheck, ToggleLeft, ToggleRight, Save, AlertCircle } from 'lucide-react';

export default function AdminSchedule() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();

  // Schedule form state
  const [psReleaseTime, setPsReleaseTime] = useState('');
  const [psReleasedManual, setPsReleasedManual] = useState(false);
  const [prototypeOpenTime, setPrototypeOpenTime] = useState('');
  const [prototypeCloseTime, setPrototypeCloseTime] = useState('');
  const [prototypeManualOverride, setPrototypeManualOverride] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const evt = events.find((e) => e._id === selectedEventId);
      if (evt) {
        setSelectedEvent(evt);
        setPsReleaseTime(evt.schedule?.psReleaseTime ? formatDateTimeLocal(evt.schedule.psReleaseTime) : '');
        setPsReleasedManual(evt.schedule?.psReleasedManual || false);
        setPrototypeOpenTime(evt.schedule?.prototypeOpenTime ? formatDateTimeLocal(evt.schedule.prototypeOpenTime) : '');
        setPrototypeCloseTime(evt.schedule?.prototypeCloseTime ? formatDateTimeLocal(evt.schedule.prototypeCloseTime) : '');
        setPrototypeManualOverride(evt.schedule?.prototypeManualOverride || false);
      }
    }
  }, [selectedEventId, events]);

  const formatDateTimeLocal = (dateStr) => {
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?status=all');
      if (res.data.success && res.data.events.length > 0) {
        setEvents(res.data.events);
        setSelectedEventId(res.data.events[0]._id);
      }
    } catch (err) {
      showError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;

    setSaving(true);
    try {
      const res = await api.put(`/events/${selectedEventId}/schedule`, {
        psReleaseTime: psReleaseTime ? new Date(psReleaseTime) : null,
        psReleasedManual,
        prototypeOpenTime: prototypeOpenTime ? new Date(prototypeOpenTime) : null,
        prototypeCloseTime: prototypeCloseTime ? new Date(prototypeCloseTime) : null,
        prototypeManualOverride,
      });

      if (res.data.success) {
        success('Schedule settings and overrides updated.');
        // Refresh local state in list
        setEvents((prev) =>
          prev.map((evt) =>
            evt._id === selectedEventId
              ? { ...evt, schedule: res.data.schedule }
              : evt
          )
        );
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update schedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Time Windows & Enforcement</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Schedule Controls</h1>
        </div>
      </div>

      {/* Select Event */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-dark uppercase tracking-wide">Select Event:</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="input-field text-xs max-w-sm"
        >
          {events.map((evt) => (
            <option key={evt._id} value={evt._id}>
              {evt.title} ({evt.status})
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <form onSubmit={handleSaveSchedule} className="space-y-8">
          {/* Section 1: Problem Statements Release Control */}
          <div className="card bg-white p-6 sm:p-8 rounded-2xl border border-accent/15 shadow-card space-y-6">
            <div className="border-b border-accent/15 pb-3">
              <h3 className="text-lg font-bold text-dark">1. Problem Statements Release Timing</h3>
              <p className="text-xs text-dark-muted mt-0.5">
                Participants see a countdown timer until this timestamp, after which problem statements unlock automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  Release Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={psReleaseTime}
                  onChange={(e) => setPsReleaseTime(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 sm:pt-0">
                <input
                  type="checkbox"
                  id="manualRelease"
                  checked={psReleasedManual}
                  onChange={(e) => setPsReleasedManual(e.target.checked)}
                  className="w-5 h-5 text-primary rounded"
                />
                <div>
                  <label htmlFor="manualRelease" className="font-bold text-xs text-dark cursor-pointer block">
                    Manual Release Override
                  </label>
                  <span className="text-[11px] text-dark-muted block">
                    Check to force-release problem statements immediately regardless of the scheduled time.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Prototype Submission Window */}
          <div className="card bg-white p-6 sm:p-8 rounded-2xl border border-accent/15 shadow-card space-y-6">
            <div className="border-b border-accent/15 pb-3">
              <h3 className="text-lg font-bold text-dark">2. Prototype Submission Window & Deadline Lock</h3>
              <p className="text-xs text-dark-muted mt-0.5">
                Submissions are strictly blocked before the start time and automatically locked after the deadline on the server.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  Prototype Window Start Time
                </label>
                <input
                  type="datetime-local"
                  value={prototypeOpenTime}
                  onChange={(e) => setPrototypeOpenTime(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1.5 uppercase tracking-wide">
                  Prototype Submission Deadline (Lock Time)
                </label>
                <input
                  type="datetime-local"
                  value={prototypeCloseTime}
                  onChange={(e) => setPrototypeCloseTime(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="protoOverride"
                checked={prototypeManualOverride}
                onChange={(e) => setPrototypeManualOverride(e.target.checked)}
                className="w-5 h-5 text-primary rounded"
              />
              <div>
                <label htmlFor="protoOverride" className="font-bold text-xs text-dark cursor-pointer block">
                  Manual Prototype Window Override
                </label>
                <span className="text-[11px] text-dark-muted block">
                  Force-open prototype submission window for all participants even if deadline passed.
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4 text-secondary" />
              <span>{saving ? 'Saving...' : 'Save Schedule Controls'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
