import React from 'react';

const badgeColors = {
  // Statuses
  OPEN: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
  UNDER_INVESTIGATION: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60',
  PENDING_REVIEW: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
  CLOSED: 'bg-slate-800 text-slate-400 border-slate-700',
  ARCHIVED: 'bg-slate-900 text-slate-500 border-slate-800',

  // Priorities & Severities
  LOW: 'bg-slate-800 text-slate-300 border-slate-700',
  MEDIUM: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
  HIGH: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
  CRITICAL: 'bg-rose-950/80 text-rose-400 border-rose-800/60 animate-pulse-subtle',

  // Roles
  ADMIN: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
  INVESTIGATOR: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
  ANALYST: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',

  // Entity Types
  PERSON: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
  ORGANIZATION: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
  PHONE: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
  VEHICLE: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
  LOCATION: 'bg-pink-950/80 text-pink-300 border-pink-800/60',
  ACCOUNT: 'bg-yellow-950/80 text-yellow-300 border-yellow-800/60',
  CASE: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
  EVENT: 'bg-violet-950/80 text-violet-300 border-violet-800/60',

  // Anomaly Statuses
  NEW: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
  UNDER_REVIEW: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
  REVIEWED: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
  DISMISSED: 'bg-slate-800 text-slate-400 border-slate-700',
};

export const Badge = ({
  children,
  variant,
  className = '',
  size = 'md',
}) => {
  const colorClass = (variant && badgeColors[variant]) || 'bg-slate-800 text-slate-300 border-slate-700';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-mono ${colorClass} ${sizeClass} ${className}`}
    >
      {children || variant}
    </span>
  );
};

export default Badge;
