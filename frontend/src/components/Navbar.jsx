import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Shield,
  Activity,
  Sun,
  Moon,
  User as UserIcon,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-6 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Left side: System status indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ACTIVE // SECURE NODE</span>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>CAPSTONE SYLLABUS: UNIT 1–10</span>
        </div>
      </div>

      {/* Right side: Theme toggle, notification indicator, User menu */}
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 pl-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all text-left"
          >
            <div>
              <p className="text-xs font-semibold text-slate-200">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] font-mono text-slate-400">{user?.email || 'user@nexus.local'}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400 flex items-center justify-center font-bold font-mono text-xs">
              {user?.role?.charAt(0) || 'U'}
            </div>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] font-mono text-cyan-400">{user?.role}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 space-y-0.5">
                  <p>Badge: <span className="text-slate-300">{user?.badgeNumber || 'NX-4029'}</span></p>
                  <p>Clearance: <span className="text-slate-300">{user?.clearanceLevel || 'TOP_SECRET'}</span></p>
                  <p>Division: <span className="text-slate-300">{user?.department || 'Intelligence Task Force'}</span></p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
