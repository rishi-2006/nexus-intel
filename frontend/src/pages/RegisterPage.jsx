import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ANALYST',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Check parameters.';
      setServerError(msg);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/20 border border-cyan-400/40 mb-3">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Operative Registration</h1>
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mt-1">
            Personnel Provisioning Console // Unit 3
          </p>
        </div>

        <div className="nexus-card rounded-2xl p-7 border border-slate-800 shadow-2xl">
          {serverError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              required
              placeholder="e.g. Agent Elena Rostova"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <Input
              id="email"
              name="email"
              label="Official Email"
              type="email"
              required
              placeholder="e.g. elena.rostova@nexus.local"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Investigative Role & Clearance <span className="text-rose-400">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono"
              >
                <option value="ANALYST">ANALYST — Intelligence Modeling & Analytics</option>
                <option value="INVESTIGATOR">INVESTIGATOR — Case & Evidence Operations</option>
                <option value="ADMIN">ADMIN — System Command & Directory Administration</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-4"
              icon={ArrowRight}
            >
              Initialize Profile & Authenticate
            </Button>
          </form>

          <div className="mt-5 text-center pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Already have an intelligence profile?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2">
                Return to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
