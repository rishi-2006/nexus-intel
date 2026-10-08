import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Seamless direct navigation without popup message
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid intelligence credentials or unauthorized node access.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass = 'Password123!') => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/20 border border-cyan-400/40 mb-4">
            <ShieldAlert className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">NEXUS INTEL</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mt-1">
            Criminal Network Analysis System // ID: 26189
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Unit 1–10 Technical Training Capstone Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="nexus-card rounded-2xl p-7 border border-slate-800 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Operative Authentication</h2>
          <p className="text-xs text-slate-400 mb-6">Enter authorized credentials to decrypt intelligence console</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-email"
              label="Operative Email"
              type="email"
              required
              placeholder="agent@nexus.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="login-password"
              label="Security Passphrase"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Verify Credentials & Proceed
            </Button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">
              Rapid Development Logins:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@nexus.local')}
                className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 hover:bg-purple-900/60 text-purple-300 text-xs font-mono transition-colors text-center"
              >
                ADMIN
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('investigator@nexus.local')}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono transition-colors text-center"
              >
                INVESTIGATOR
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('analyst@nexus.local')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-mono transition-colors text-center"
              >
                ANALYST
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
              Demo Passphrase: <span className="text-slate-300 font-semibold">Password123!</span>
            </p>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              Need a new security profile?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2">
                Register operative profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
