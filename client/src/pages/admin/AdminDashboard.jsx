import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Calendar,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  Database,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToCloud = async () => {
    setSyncingCloud(true);
    try {
      const res = await api.post('/admin/sync-cloud');
      if (res.data?.success) {
        success('All events, problem statements, users, and teams are now pushed to Firebase Cloud!');
        fetchStats();
      } else {
        showError('Firebase rejected write: In Firebase Console -> Realtime Database -> Rules tab, change rules to: { ".read": true, ".write": true } and click Publish.');
      }
    } catch (err) {
      showError(err.message || 'Failed to sync to cloud.');
    } finally {
      setSyncingCloud(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, recentEvents, recentRegistrations } = data || {
    stats: {},
    recentEvents: [],
    recentRegistrations: [],
  };

  return (
    <div className="space-y-8">
      {/* Cloud Database Sync Strip */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-secondary flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-dark">Firebase Cloud Realtime Database</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                active-cc357-default-rtdb
              </span>
            </div>
            <p className="text-[11px] text-dark-muted">
              Sync all registered teams, problem statements, and submissions directly into your live Firebase Cloud.
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncToCloud}
          disabled={syncingCloud}
          className="btn-primary py-2 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
          <span>{syncingCloud ? 'Syncing Cloud...' : 'Sync to Firebase Cloud'}</span>
        </button>
      </div>

      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Executive Summary</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/events" className="btn-primary py-2 px-4 text-xs font-semibold rounded-xl">
            Create Event
          </Link>
          <Link to="/admin/schedule" className="btn-outline py-2 px-4 text-xs font-semibold rounded-xl">
            Schedule Controls
          </Link>
        </div>
      </div>

      {/* 4 Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Total Events</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-dark">{stats.totalEvents || 0}</div>
          <span className="text-[11px] text-dark-muted font-medium">Active & archived programs</span>
        </div>

        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Registered Users</span>
            <div className="p-2 rounded-xl bg-secondary/70 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-dark">{stats.totalUsers || 0}</div>
          <span className="text-[11px] text-dark-muted font-medium">Verified participant accounts</span>
        </div>

        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Event Sign-Ups</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-dark">{stats.totalRegistrations || 0}</div>
          <span className="text-[11px] text-dark-muted font-medium">Total event registrations</span>
        </div>

        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Total Submissions</span>
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-dark">{stats.totalSubmissions || 0}</div>
          <span className="text-[11px] text-dark-muted font-medium">
            {stats.totalIdeaSubmissions || 0} Ideas • {stats.totalPrototypeSubmissions || 0} Prototypes
          </span>
        </div>
      </div>

      {/* Two Columns: Recent Events & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-4">
          <div className="flex items-center justify-between border-b border-accent/15 pb-3">
            <h3 className="font-bold text-base text-dark">Active & Recent Events</h3>
            <Link to="/admin/events" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((evt) => (
                <div
                  key={evt._id}
                  className="p-3.5 rounded-xl bg-background-cream/40 border border-accent/15 flex items-center justify-between gap-4"
                >
                  <div className="truncate space-y-1">
                    <h4 className="font-bold text-sm text-dark truncate">{evt.title}</h4>
                    <span className="text-xs text-dark-muted block">
                      {new Date(evt.startDate).toLocaleDateString()} • {evt.category}
                    </span>
                  </div>
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
                </div>
              ))
            ) : (
              <p className="text-xs text-dark-muted text-center py-4">No events found.</p>
            )}
          </div>
        </div>

        {/* Latest Registrations */}
        <div className="card bg-white p-6 rounded-2xl shadow-card border border-accent/15 space-y-4">
          <div className="flex items-center justify-between border-b border-accent/15 pb-3">
            <h3 className="font-bold text-base text-dark">Latest Registrations</h3>
            <Link to="/admin/users" className="text-xs font-semibold text-primary hover:underline">
              Manage Users
            </Link>
          </div>

          <div className="space-y-3">
            {recentRegistrations.length > 0 ? (
              recentRegistrations.map((r) => (
                <div
                  key={r._id}
                  className="p-3.5 rounded-xl bg-background-cream/40 border border-accent/15 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="truncate space-y-0.5">
                    <div className="font-bold text-dark truncate">{r.user?.name || 'Participant'}</div>
                    <div className="text-dark-muted truncate">{r.event?.title || 'Event'}</div>
                  </div>
                  <div className="text-right text-[11px] text-dark-muted flex-shrink-0">
                    {new Date(r.registeredAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-dark-muted text-center py-4">No registrations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
