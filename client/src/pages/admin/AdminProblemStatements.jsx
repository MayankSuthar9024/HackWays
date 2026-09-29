import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, FileQuestion, Sparkles } from 'lucide-react';

export default function AdminProblemStatements() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPS, setEditingPS] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [psCode, setPsCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState('Medium');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchProblemStatements(selectedEventId);
    } else {
      setStatements([]);
    }
  }, [selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events?status=all');
      if (res.data.success && res.data.events.length > 0) {
        setEvents(res.data.events);
        setSelectedEventId(res.data.events[0]._id);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchProblemStatements = async (evtId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${evtId}/problem-statements`);
      if (res.data.success) {
        setStatements(res.data.statements || []);
      }
    } catch (err) {
      // If 403 because of schedule, admin will bypass with admin routes
      setStatements([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPS(null);
    setPsCode(`PS-${Date.now().toString().slice(-4)}`);
    setTitle('');
    setDescription('');
    setCategory('AI & Software');
    setDifficulty('Medium');
    setIsModalOpen(true);
  };

  const openEditModal = (ps) => {
    setEditingPS(ps);
    setPsCode(ps.psCode);
    setTitle(ps.title);
    setDescription(ps.description);
    setCategory(ps.category);
    setDifficulty(ps.difficulty);
    setIsModalOpen(true);
  };

  const handleSavePS = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      showError('Please select an event first.');
      return;
    }

    setSaving(true);
    try {
      if (editingPS) {
        const res = await api.put(`/problem-statements/${editingPS._id}`, {
          psCode,
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
        });
        if (res.data.success) {
          success('Problem statement updated.');
        }
      } else {
        const res = await api.post(`/events/${selectedEventId}/problem-statements`, {
          psCode,
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
        });
        if (res.data.success) {
          success('Problem statement added to event.');
        }
      }

      setIsModalOpen(false);
      fetchProblemStatements(selectedEventId);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save problem statement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePS = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete problem statement "${name}"?`)) return;

    try {
      const res = await api.delete(`/problem-statements/${id}`);
      if (res.data.success) {
        success('Problem statement removed.');
        fetchProblemStatements(selectedEventId);
      }
    } catch (err) {
      showError('Failed to delete problem statement.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Challenge Curation</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Problem Statements</h1>
        </div>

        <button
          onClick={openCreateModal}
          disabled={!selectedEventId}
          className="btn-primary py-2.5 px-5 text-xs font-semibold rounded-xl inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Problem Statement</span>
        </button>
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

      {/* PS Cards / Table */}
      {loading ? (
        <div className="card h-64 animate-pulse bg-white/70"></div>
      ) : statements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statements.map((ps) => (
            <div
              key={ps._id}
              className="bg-white rounded-2xl border border-accent/15 shadow-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-primary text-secondary rounded-lg">
                    {ps.psCode}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-accent uppercase">{ps.category}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-background-cream text-dark">
                      {ps.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-dark">{ps.title}</h3>
                <p className="text-xs text-dark-muted leading-relaxed line-clamp-4">{ps.description}</p>
              </div>

              <div className="pt-3 border-t border-background-cream flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(ps)}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePS(ps._id, ps.title)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-3">
          <p className="text-dark font-semibold text-sm">No problem statements defined for this event.</p>
          <button onClick={openCreateModal} className="btn-primary text-xs py-2 px-4">
            Add First Problem Statement
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPS ? 'Edit Problem Statement' : 'Add Problem Statement'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSavePS} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">PS Code</label>
              <input
                type="text"
                required
                value={psCode}
                onChange={(e) => setPsCode(e.target.value)}
                placeholder="e.g. PS-AI-101"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Category / Domain</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Healthcare AI"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Multi-Modal Healthcare Diagnostic Assistant"
              className="input-field text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">Detailed Description</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the background problem, objectives, and evaluation requirements..."
              className="input-field text-xs resize-y"
            ></textarea>
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
              {saving ? 'Saving...' : editingPS ? 'Update Statement' : 'Add Statement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
