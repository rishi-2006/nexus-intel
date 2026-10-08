import React, { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';
import { History, ShieldAlert, Clock, User, Globe } from 'lucide-react';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await auditService.getLogs({ page, size });
      setLogs(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setError('Failed to retrieve security audit trail from database.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (val) => (
        <span className="font-mono text-xs text-slate-400">
          {val ? new Date(val).toLocaleString() : 'Just now'}
        </span>
      ),
    },
    {
      header: 'Operative / User',
      key: 'performedBy',
      render: (val) => <span className="font-mono font-bold text-cyan-400 text-xs">{val}</span>,
    },
    {
      header: 'Action Taken',
      key: 'action',
      render: (val) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
          {val}
        </span>
      ),
    },
    {
      header: 'Target Entity / Case',
      key: 'entityType',
      render: (_, row) => (
        <span className="text-xs font-mono text-slate-300">
          {row.entityType ? `${row.entityType} [${row.entityId || 'N/A'}]` : 'SYSTEM'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      key: 'ipAddress',
      render: (val) => <span className="font-mono text-xs text-slate-400">{val || '127.0.0.1'}</span>,
    },
    {
      header: 'Telemetry Narrative',
      key: 'details',
      render: (val) => <p className="text-xs text-slate-300 line-clamp-1">{val || 'Standard action logged.'}</p>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Audit Logs & Compliance</h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically recorded operative telemetry, query history, and custody changes (ADMIN ONLY)
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadLogs} />}

      <Table
        columns={columns}
        data={logs}
        loading={loading}
        emptyMessage="No audit log entries recorded in current scope."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={size}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default AuditLogsPage;
