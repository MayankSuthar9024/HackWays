import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import {
  Send,
  Eye,
  FileText,
  Github,
  Globe,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

export default function AdminSubmissions() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [submissionType, setSubmissionType] = useState('idea'); // 'idea' | 'prototype'
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  // Review Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('Under Review');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedEventId, submissionType]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events?status=all');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/submissions?eventId=${selectedEventId}&type=${submissionType}`);
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    } catch (err) {
      showError('Failed to retrieve submissions.');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (sub) => {
    setSelectedSubmission(sub);
    setReviewStatus(sub.status || 'Under Review');
    setAdminRemarks(sub.adminRemarks || '');
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSavingReview(true);
    try {
      const res = await api.put(`/admin/submissions/${submissionType}/${selectedSubmission._id}/review`, {
        status: reviewStatus,
        adminRemarks: adminRemarks.trim(),
      });

      if (res.data.success) {
        success('Submission evaluation saved.');
        setIsReviewModalOpen(false);
        fetchSubmissions();
      }
    } catch (err) {
      showError('Failed to save review.');
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Evaluation & Feedback</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Participant Submissions</h1>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-background-cream p-1 rounded-xl border border-accent/15">
          <button
            onClick={() => setSubmissionType('idea')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              submissionType === 'idea'
                ? 'bg-primary text-white shadow-sm'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            Stage 1: Ideas ({submissions.length})
          </button>
          <button
            onClick={() => setSubmissionType('prototype')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              submissionType === 'prototype'
                ? 'bg-primary text-white shadow-sm'
                : 'text-dark-muted hover:text-dark'
            }`}
          >
            Stage 2: Prototypes
          </button>
        </div>
      </div>

      {/* Filter by Event */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-dark uppercase tracking-wide">Filter Event:</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="input-field text-xs max-w-sm"
        >
          <option value="all">-- All Events --</option>
          {events.map((evt) => (
            <option key={evt._id} value={evt._id}>
              {evt.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="card h-64 animate-pulse bg-white/70"></div>
      ) : submissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="bg-white rounded-2xl border border-accent/15 shadow-card p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                    {sub.event?.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      sub.status === 'Shortlisted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-dark">
                    {submissionType === 'idea' ? sub.ideaTitle : sub.prototypeTitle}
                  </h3>
                  <div className="text-xs text-dark-muted font-medium mt-0.5">
                    By <strong className="text-dark">{sub.user?.name}</strong> ({sub.user?.email}) •{' '}
                    {sub.user?.college || 'Participant'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background-cream/40 border border-accent/15 text-xs space-y-2">
                  <div>
                    <span className="text-dark-muted font-semibold">Problem: </span>
                    <span className="text-dark font-medium">
                      [{sub.problemStatement?.psCode}] {sub.problemStatement?.title}
                    </span>
                  </div>

                  <p className="text-dark-muted line-clamp-3 leading-relaxed">
                    {submissionType === 'idea' ? sub.ideaDescription : sub.description}
                  </p>

                  {/* Links and Attachments */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {sub.githubUrl && (
                      <a
                        href={sub.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </a>
                    )}
                    {sub.liveDemoUrl && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                    {sub.uploadedFileUrl && (
                      <a
                        href={sub.uploadedFileUrl}
                        download
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File
                      </a>
                    )}
                    {sub.supportingFileUrl && (
                      <a
                        href={sub.supportingFileUrl}
                        download
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Attachment
                      </a>
                    )}
                  </div>
                </div>

                {sub.adminRemarks && (
                  <div className="text-[11px] p-2.5 rounded-lg bg-white border border-accent/20">
                    <span className="font-semibold text-accent block">Feedback Remarks:</span>
                    <span className="text-dark-muted">{sub.adminRemarks}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-background-cream flex items-center justify-between">
                <span className="text-[11px] text-dark-muted">
                  Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => openReviewModal(sub)}
                  className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-xl"
                >
                  Grade & Review
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-2">
          <p className="text-dark font-semibold text-sm">No submissions found for the selected filter.</p>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Grade & Evaluate Submission"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Evaluation Status
            </label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="input-field text-xs"
            >
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Submitted">Submitted (Reset)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-dark mb-1 uppercase tracking-wide">
              Admin / Mentor Remarks & Feedback
            </label>
            <textarea
              rows={4}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="Provide constructive feedback for the participant..."
              className="input-field text-xs resize-y"
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-accent/15">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="btn-outline text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingReview}
              className="btn-primary text-xs py-2 px-6"
            >
              {savingReview ? 'Saving...' : 'Save Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
