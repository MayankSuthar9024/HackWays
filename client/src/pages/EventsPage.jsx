import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Users, ArrowRight, Search, Sparkles } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Upcoming' | 'Ongoing' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events?status=${statusFilter}`);
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((evt) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.shortDescription.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-accent/15 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Explore & Participate</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">Organization Events</h1>
          <p className="text-sm text-dark-muted mt-1">
            Discover upcoming hackathons, innovation sprints, and tech summits.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center w-full md:w-72">
          <Search className="w-4 h-4 text-dark-muted absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events or domains..."
            className="input-field pl-11 text-sm"
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'Upcoming', 'Ongoing', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-dark-muted hover:text-dark border border-accent/15'
            }`}
          >
            {st === 'all' ? 'All Events' : `${st} Events`}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card h-96 animate-pulse bg-white/70"></div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt._id}
              className="bg-white rounded-2xl border border-accent/15 shadow-card overflow-hidden flex flex-col justify-between transition-all hover:shadow-elevated"
            >
              <div>
                {/* Banner */}
                <div className="h-48 bg-primary/10 relative overflow-hidden">
                  {evt.bannerImage ? (
                    <img
                      src={evt.bannerImage}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold p-4 text-center">
                      {evt.title}
                    </div>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                      evt.status === 'Ongoing'
                        ? 'bg-emerald-600 text-white'
                        : evt.status === 'Upcoming'
                        ? 'bg-primary text-white'
                        : 'bg-dark-muted text-white'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    <span>{evt.category}</span>
                    <span>•</span>
                    <span>{evt.mode}</span>
                  </div>

                  <h3 className="text-xl font-bold text-dark leading-snug">{evt.title}</h3>

                  <p className="text-xs text-dark-muted line-clamp-3 leading-relaxed">
                    {evt.shortDescription}
                  </p>

                  <div className="pt-2 space-y-1.5 text-xs text-dark-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>
                        {new Date(evt.startDate).toLocaleDateString()} - {new Date(evt.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <Link
                  to={`/events/${evt._id}`}
                  className="w-full btn-primary py-2.5 font-semibold text-xs rounded-xl"
                >
                  <span>View Details & Register</span>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center space-y-3">
          <p className="text-dark font-medium text-base">No events found matching your criteria.</p>
          <p className="text-dark-muted text-xs">Try selecting a different filter or clearing your search term.</p>
        </div>
      )}
    </div>
  );
}
