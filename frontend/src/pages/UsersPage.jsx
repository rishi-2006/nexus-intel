import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, UserCheck, Shield } from 'lucide-react';
import Table from '../components/Table';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const availableRoles = ['ADMIN', 'INVESTIGATOR', 'ANALYST'];

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to retrieve user directory from repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      showToast(`User security clearance updated to ${newRole}`, 'success');
      loadUsers();
    } catch (err) {
      showToast('Failed to update user security role.', 'error');
    }
  };

  const columns = [
    {
      header: 'Operative Name',
      key: 'name',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-white">{val}</p>
          <p className="text-xs text-slate-400 font-mono">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Badge Number',
      key: 'badgeNumber',
      render: (val) => <span className="font-mono text-cyan-400 text-xs font-bold">{val || 'NX-PENDING'}</span>,
    },
    {
      header: 'Assigned Department',
      key: 'department',
      render: (val) => <span className="text-xs text-slate-300">{val || 'General Command'}</span>,
    },
    {
      header: 'Clearance Tier',
      key: 'clearanceLevel',
      render: (val) => (
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {val || 'TIER_1'}
        </span>
      ),
    },
    {
      header: 'System Role',
      key: 'role',
      render: (val, row) => (
        <div className="flex items-center space-x-2">
          <Badge variant={val}>{val}</Badge>
          <select
            value={val}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Personnel Directory & Clearance</h1>
        <p className="text-xs text-slate-400 mt-1">
          Administrative provisioning, department allocation, and role-based permissions (ADMIN ONLY)
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadUsers} />}

      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No personnel records discovered."
      />
    </div>
  );
};

export default UsersPage;
