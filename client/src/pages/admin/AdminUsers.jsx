import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Download, Search, Users, Calendar, Phone, Mail, Filter } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [selectedEvent, searchQuery]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events?status=all');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error loading events list:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?eventId=${selectedEvent}&search=${searchQuery}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      showError('Failed to load registered users.');
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV Functionality
  const exportToCSV = () => {
    if (users.length === 0) {
      showError('No user records available to export.');
      return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'College / Org', 'Year', 'Event Title', 'Team Name', 'Registered Date'];
    const rows = users.map((r) => [
      `"${r.user?.name || ''}"`,
      `"${r.user?.email || ''}"`,
      `"${r.user?.phone || ''}"`,
      `"${r.collegeOrOrg || r.user?.college || r.user?.institute || ''}"`,
      `"${r.user?.year || ''}"`,
      `"${r.event?.title || ''}"`,
      `"${r.teamName || ''}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hackways_Registered_Users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Participant list exported to CSV.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Participant Directory</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">Registered Participants</h1>
        </div>

        <button
          onClick={exportToCSV}
          className="btn-primary py-2.5 px-5 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-secondary" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex items-center w-full sm:w-72">
          <Search className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="input-field pl-11 text-xs"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input-field text-xs"
          >
            <option value="all">-- All Registered Events --</option>
            {events.map((evt) => (
              <option key={evt._id} value={evt._id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="card h-64 animate-pulse bg-white/70"></div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-2xl border border-accent/15 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-background-cream/60 border-b border-accent/15 text-accent font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6">Participant</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">College / Org</th>
                  <th className="py-3.5 px-4">Event & Team</th>
                  <th className="py-3.5 px-6">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent/10">
                {users.map((reg) => (
                  <tr key={reg._id} className="hover:bg-background-cream/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-dark text-sm">{reg.user?.name || 'Participant'}</div>
                      <div className="text-dark-muted text-[11px]">{reg.user?.email}</div>
                    </td>
                    <td className="py-4 px-4 text-dark font-medium whitespace-nowrap">
                      {reg.user?.phone || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-dark-muted">
                      <div>{reg.collegeOrOrg || reg.user?.college || reg.user?.institute || '—'}</div>
                      {reg.user?.year && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-secondary/50 text-[10px] font-bold text-accent mt-0.5">
                          {reg.user.year}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="font-bold text-primary truncate max-w-xs">{reg.event?.title}</div>
                      {reg.teamName && (
                        <div className="text-[11px] text-dark-muted font-medium">Team: {reg.teamName}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-dark-muted whitespace-nowrap">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-2">
          <p className="text-dark font-semibold text-sm">No registered participants found.</p>
          <p className="text-dark-muted text-xs">Try selecting a different event filter or clear search terms.</p>
        </div>
      )}
    </div>
  );
}
