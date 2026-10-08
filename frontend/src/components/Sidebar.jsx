import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Share2,
  FileText,
  Network,
  BarChart3,
  AlertTriangle,
  Clock,
  Database,
  Bot,
  FileCheck2,
  ShieldCheck,
  History,
  Settings,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, hasRole } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Investigations', path: '/cases', icon: Briefcase, roles: ['ADMIN', 'INVESTIGATOR'] },
    { label: 'Entities', path: '/entities', icon: Users, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Relationships', path: '/relationships', icon: Share2, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Evidence', path: '/evidence', icon: FileText, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Network Explorer', path: '/network', icon: Network, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Anomalies', path: '/anomalies', icon: AlertTriangle, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Timeline', path: '/timeline', icon: Clock, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'Data Sources', path: '/data-sources', icon: Database, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    { label: 'NEXUS AI', path: '/nexus-ai', icon: Bot, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'], highlight: true },
    { label: 'Reports', path: '/reports', icon: FileCheck2, roles: ['ADMIN', 'INVESTIGATOR', 'ANALYST'] },
    // Admin only items
    { label: 'User Directory', path: '/users', icon: ShieldCheck, roles: ['ADMIN'] },
    { label: 'Audit Logs', path: '/audit-logs', icon: History, roles: ['ADMIN'] },
  ];

  const visibleItems = navItems.filter((item) => hasRole(item.roles));

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand / Logo Header */}
        <div className="h-16 px-5 flex items-center border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">NEXUS</span>
                <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">INTEL</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">ID: 26189 // v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-800/90 text-white border border-slate-700/80 font-semibold'
                      : item.highlight
                      ? 'text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-200 border border-transparent'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.highlight ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    AI
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Status Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950">
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800/50 text-cyan-400 font-bold flex items-center justify-center text-xs font-mono">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Agent'}</p>
            <p className="text-[10px] font-mono text-cyan-400/90 tracking-wider truncate">
              {user?.role || 'ANALYST'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
