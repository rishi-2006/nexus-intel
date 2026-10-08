import React, { useState, useEffect, useCallback } from 'react';
import { anomalyService } from '../services/anomalyService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  AlertTriangle,
  RefreshCw,
  Filter,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';

const statuses = ['NEW', 'UNDER_REVIEW', 'REVIEWED', 'DISMISSED'];

export const AnomaliesPage = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [anomalies, setAnomalies] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const fetchAnomalies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size };
      if (statusFilter) params.status = statusFilter;
      const res = await anomalyService.getAnomalies(params);
      setAnomalies(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load anomalies:', err);
      setError('Failed to retrieve analytical signals.');
    } finally {
      setLoading(false);
    }
  }, [page, size, statusFilter]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await anomalyService.updateStatus(id, newStatus);
      showToast(`Signal status updated to ${newStatus}`, 'success');
      fetchAnomalies();
    } catch (err) {
      showToast('Failed to update signal status.', 'error');
    }
  };

  const handleTriggerScan = async () => {
    setScanning(true);
    try {
      await anomalyService.triggerScan();
      showToast('Asynchronous anomaly detection pipeline initiated in background.', 'info');
      setTimeout(() => {
        setScanning(false);
        fetchAnomalies();
      }, 1200);
    } catch (err) {
      setScanning(false);
      showToast('Scan pipeline encountered an issue.', 'error');
    }
  };

  const columns = [
    {
      header: 'Signal Code',
      key: 'signalCode',
      cellClassName: 'font-mono text-cyan-400 font-bold',
    },
    {
      header: 'Behavioral Modality',
      key: 'anomalyType',
      render: (val) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
          {val}
        </span>
      ),
    },
    {
      header: 'Severity',
      key: 'severity',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Target Entity',
      key: 'targetEntityRef',
      render: (val) => <span className="font-mono font-bold text-cyan-300 text-xs">{val || 'N/A'}</span>,
    },
    {
      header: 'Narrative Signal',
      key: 'description',
      render: (val) => <p className="text-xs text-slate-300 max-w-md">{val}</p>,
    },
    {
      header: 'Status & Review Workflow',
      key: 'status',
      render: (val, row) => (
        <div className="flex items-center space-x-2">
          <Badge variant={val}>{val}</Badge>
          {hasRole(['ADMIN', 'INVESTIGATOR', 'ANALYST']) && (
            <select
              value={val}
              onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytical Signals & Anomalies</h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic detection of transaction spikes, burst communications, and anomalous timing
          </p>
        </div>
        <Button
          variant="outline"
          icon={RefreshCw}
          loading={scanning}
          onClick={handleTriggerScan}
          className="text-cyan-300 border-cyan-800/60 hover:bg-cyan-950/60"
        >
          Run Anomaly Detection Scan
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Workflow Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          >
            <option value="">ALL SIGNAL STATUSES</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAnomalies} />}

      <Table
        columns={columns}
        data={anomalies}
        loading={loading}
        emptyMessage="No anomalies match current filter criteria."
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

export default AnomaliesPage;
