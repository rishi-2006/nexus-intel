import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { caseService } from '../services/caseService';
import {
  Clock,
  Calendar,
  MapPin,
  Tag,
  Shield,
  Filter,
  Search,
} from 'lucide-react';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [allEvents, allCases] = await Promise.all([
        eventService.getAllEvents(),
        caseService.getCases({ size: 50 }),
      ]);
      setEvents(allEvents || []);
      setCasesList(allCases?.content || []);
    } catch (err) {
      console.error('Failed to load timeline:', err);
      setError('Failed to retrieve timeline events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesCase = !selectedCaseId || ev.caseId === parseInt(selectedCaseId);
    const matchesEntity =
      !entityFilter ||
      (ev.entityCode && ev.entityCode.toLowerCase().includes(entityFilter.toLowerCase()));
    return matchesCase && matchesEntity;
  });

  if (loading) {
    return <LoadingSpinner size="lg" message="Compiling sequential timeline logs..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Investigative Chronology Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">
          Time-correlated intercepts, physical surveillance sightings, and tactical operations
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-400">Case Filter:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          >
            <option value="">ALL CASES</option>
            {casesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Entity Code:</span>
          <input
            type="text"
            placeholder="e.g. P101"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-32 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {/* Vertical Timeline Component */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8 my-6">
        {filteredEvents.map((ev, idx) => {
          const dateObj = new Date(ev.eventDate);
          return (
            <div key={ev.id || idx} className="relative group">
              {/* Dot Icon */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

              {/* Event Card */}
              <div className="nexus-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {ev.caseNumber ? `[${ev.caseNumber}]` : '[CASE]'}
                    </span>
                    <h3 className="text-sm font-bold text-white">{ev.eventTitle}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{dateObj.toLocaleDateString()}</span>
                    <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {ev.eventDescription}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  {ev.entityCode && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Subject: {ev.entityCode}
                    </span>
                  )}
                  {ev.locationName && (
                    <span className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span>{ev.locationName}</span>
                    </span>
                  )}
                  {ev.sourceRef && (
                    <span className="text-slate-500">
                      Source: {ev.sourceRef}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelinePage;
