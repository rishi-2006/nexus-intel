import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldX } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const RoleGuard = ({ allowedRoles, children }) => {
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();

  if (!hasRole(allowedRoles)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-amber-400 mb-4">
            <ShieldX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Restricted Intelligence Compartment</h3>
          <p className="text-xs text-slate-400 mb-6">
            Your current security classification (<strong className="text-cyan-400 font-mono">{user?.role || 'UNASSIGNED'}</strong>) does not permit access to this module.
          </p>
          <Button variant="secondary" onClick={() => navigate('/')} className="w-full">
            Return to Operational Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
