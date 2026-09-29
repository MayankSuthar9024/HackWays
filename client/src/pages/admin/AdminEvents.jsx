import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, Calendar, MapPin, Eye, Check, X } from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [mode, setMode] = useState('Online');
  const [venue, setVenue] = useState('Virtual / Main Auditorium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?status=all');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      showError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setShortDescription('');
    setDescription('');
    setCategory('Hackathon');
    setMode('Online');
    setVenue('Virtual / Main Auditorium');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
    setStatus('Upcoming');
    setRegistrationOpen(true);
    setBannerFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setShortDescription(evt.shortDescription);
    setDescription(evt.description);
    setCategory(evt.category);
    setMode(evt.mode);
    setVenue(evt.venue);
    setStartDate(evt.startDate ? new Date(evt.startDate).toISOString().split('T')[0] : '');
    setEndDate(evt.endDate ? new Date(evt.endDate).toISOString().split('T')[0] : '');
    setStatus(evt.status);
    setRegistrationOpen(evt.registrationOpen);
    setBannerFile(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('shortDescription', shortDescription.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('mode', mode);
      formData.append('venue', venue.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('status', status);
      formData.append('registrationOpen', registrationOpen);

      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      if (editingEvent) {
        const res = await api.put(`/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          success('Event updated successfully.');
        }
      } else {
        const res = await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          success('Event created successfully.');
        }
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? All associated problem statements, registrations, and submissions will also be removed.`)) {
      return;
    }

    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        success('Event deleted.');
        fetchEvents();
      }
    } catch (err) {
      showError('Failed to delete event.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Event Administration</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Manage Events</h1>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="card h-64 animate-pulse bg-white/70"></div>
      ) : events.length > 0 ? (
        <div className="bg-white rounded-2xl border border-accent/15 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-background-cream/60 border-b border-accent/15 text-accent font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Event Details</th>
                  <th className="py-3.5 px-4">Category & Mode</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Registrations</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-background-cream/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-dark text-sm">{evt.title}</div>
                      <div className="text-dark-muted line-clamp-1 max-w-xs text-[11px] mt-0.5">
                        {evt.shortDescription}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-dark">
                      {evt.category} • <span className="text-accent">{evt.mode}</span>
                    </td>
                    <td className="py-4 px-4 text-dark-muted whitespace-nowrap">
                      {new Date(evt.startDate).toLocaleDateString()} - {new Date(evt.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          evt.status === 'Ongoing'
                            ? 'bg-emerald-100 text-emerald-800'
                            : evt.status === 'Upcoming'
                            ? 'bg-primary text-white'
                            : 'bg-dark-muted text-white'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          evt.registrationOpen ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}
                      >
                        {evt.registrationOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(evt)}
                        title="Edit Event"
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt._id, evt.title)}
                        title="Delete Event"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-3">
          <p className="text-dark font-semibold text-sm">No events found in database.</p>
          <button onClick={openCreateModal} className="btn-primary text-xs py-2 px-4">
            Create First Event
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Create New Event'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Event Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. InnovateX Global Hackathon"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Short Description / Summary <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One or two sentences summarizing the challenge..."
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Full Event Description & Rules <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed overview, tracks, guidelines..."
              className="input-field text-xs resize-y"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Ideathon">Ideathon</option>
                <option value="Design Challenge">Design Challenge</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Venue / Location</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Main Auditorium / Virtual Discord"
              className="input-field text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="regOpen"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="regOpen" className="font-semibold text-dark cursor-pointer">
              Allow User Registrations for this Event
            </label>
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Banner Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files[0])}
              className="text-xs text-dark-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-primary cursor-pointer"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-accent/15">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-outline text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2 px-6"
            >
              {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
