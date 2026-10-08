import React, { useState, useEffect, useCallback } from 'react';
import { caseService } from '../services/caseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  Users,
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export const InvestigationsPage = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [cases, setCases] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    entityCodesStr: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size,
        sort: `${sortField},${sortDir}`,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await caseService.getCases(params);
      setCases(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load cases:', err);
      setError('Failed to retrieve investigative cases from database.');
    } finally {
      setLoading(false);
    }
  }, [page, size, search, statusFilter, sortField, sortDir]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const openCreateModal = () => {
    const randomNum = 200 + Math.floor(Math.random() * 800);
    setFormData({
      caseNumber: `C-2024-${randomNum}`,
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'MEDIUM',
      entityCodesStr: 'P101, P102',
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (c) => {
    setSelectedCase(c);
    setFormData({
      caseNumber: c.caseNumber,
      title: c.title,
      description: c.description || '',
      status: c.status,
      priority: c.priority,
      entityCodesStr: c.entityCodes ? Array.from(c.entityCodes).join(', ') : '',
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (c) => {
    setSelectedCase(c);
    setDeleteModalOpen(true);
  };

  const openDetailModal = (c) => {
    setSelectedCase(c);
    setDetailModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const entityCodes = formData.entityCodesStr
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      await caseService.createCase({
        caseNumber: formData.caseNumber,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        entityCodes,
      });

      showToast(`Case ${formData.caseNumber} registered successfully!`, 'success');
      setCreateModalOpen(false);
      fetchCases();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create case file.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const entityCodes = formData.entityCodesStr
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      await caseService.updateCase(selectedCase.id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        entityCodes,
      });

      showToast(`Case ${selectedCase.caseNumber} updated.`, 'success');
      setEditModalOpen(false);
      fetchCases();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update case file.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await caseService.deleteCase(selectedCase.id);
      showToast(`Case ${selectedCase.caseNumber} deleted from registry.`, 'success');
      setDeleteModalOpen(false);
      fetchCases();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete case file.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Case ID',
      key: 'caseNumber',
      sortable: true,
      cellClassName: 'font-mono text-cyan-400 font-bold',
      render: (val, row) => (
        <span
          onClick={(e) => {
            e.stopPropagation();
            openDetailModal(row);
          }}
          className="hover:underline cursor-pointer"
        >
          {val}
        </span>
      ),
    },
    {
      header: 'Title & Focus',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-white">{val}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Priority',
      key: 'priority',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Lead Investigator',
      key: 'assignedUserName',
      render: (val) => <span className="text-xs text-slate-300">{val || 'Unassigned'}</span>,
    },
    {
      header: 'Telemetry',
      key: 'evidenceCount',
      render: (_, row) => (
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span title="Evidence Count">{row.evidenceCount || 0} Evid</span>
          <span>•</span>
          <span title="Linked Entities">{row.entityCodes?.length || 0} Ent</span>
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openDetailModal(row)}
            title="Inspect Case"
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {hasRole(['ADMIN', 'INVESTIGATOR']) && (
            <button
              onClick={() => openEditModal(row)}
              title="Edit Case"
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {hasRole('ADMIN') && (
            <button
              onClick={() => openDeleteModal(row)}
              title="Delete Case"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Investigations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Case management, entity cross-referencing, and evidentiary custody
          </p>
        </div>
        {hasRole(['ADMIN', 'INVESTIGATOR']) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={openCreateModal}
          >
            Create Investigation Case
          </Button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(0);
          }}
          placeholder="Search by case number or title keywords..."
        />

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="">ALL STATUSES</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
            <option value="PENDING_REVIEW">PENDING_REVIEW</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCases} />}

      {/* Cases Data Table */}
      <Table
        columns={columns}
        data={cases}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDir}
        onSort={handleSort}
        emptyMessage="No investigation cases match current query filters."
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={size}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* CREATE CASE MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Register New Investigation Case"
        subtitle="Provision a formal investigative case file in the relational registry"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleCreateSubmit}>
              Initialize Case
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Case Number"
              required
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Priority Tier
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <Input
            label="Case Title"
            required
            placeholder="e.g. Operation Sovereign Horizon"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Investigative Scope & Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              placeholder="Outline the operational targets, jurisdictional anchors, and primary objectives..."
            />
          </div>

          <Input
            label="Initial Entity Codes (Comma-separated)"
            placeholder="e.g. P101, P102, ORG301"
            value={formData.entityCodesStr}
            onChange={(e) => setFormData({ ...formData, entityCodesStr: e.target.value })}
            helper="Links relevant persons, shell companies, or phone burner nodes immediately"
          />
        </form>
      </Modal>

      {/* EDIT CASE MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Modify Case: ${selectedCase?.caseNumber}`}
        subtitle="Update operational classification, narrative, and connected entities"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleEditSubmit}>
              Save Case Modifications
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Case Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
              >
                <option value="OPEN">OPEN</option>
                <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                <option value="CLOSED">CLOSED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <Input
            label="Linked Entity Codes (Comma-separated)"
            value={formData.entityCodesStr}
            onChange={(e) => setFormData({ ...formData, entityCodesStr: e.target.value })}
          />
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Case File Deletion"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteConfirm}>
              Permanently Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to delete case{' '}
          <strong className="text-white font-mono">{selectedCase?.caseNumber}</strong>?
        </p>
        <p className="text-xs text-rose-400 mt-2 font-mono">
          All associated custody references and linked timeline references will be updated.
        </p>
      </Modal>

      {/* DETAIL DRAWER / MODAL */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Investigation Dossier: ${selectedCase?.caseNumber}`}
        subtitle={selectedCase?.title}
        maxWidth="max-w-2xl"
        footer={
          <Button variant="primary" onClick={() => setDetailModalOpen(false)}>
            Close Dossier
          </Button>
        }
      >
        {selectedCase && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Badge variant={selectedCase.status}>{selectedCase.status}</Badge>
              <Badge variant={selectedCase.priority}>{selectedCase.priority} PRIORITY</Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <p>
                <strong>Lead Investigator:</strong>{' '}
                <span className="text-white">{selectedCase.assignedUserName || 'Unassigned'}</span>
              </p>
              <p>
                <strong>Created At:</strong>{' '}
                <span className="font-mono text-slate-400">
                  {selectedCase.createdAt ? new Date(selectedCase.createdAt).toLocaleString() : 'N/A'}
                </span>
              </p>
              <p>
                <strong>Narrative Summary:</strong>
              </p>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {selectedCase.description || 'No narrative description filed for this case file.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
                Linked Intelligence Entities ({selectedCase.entityCodes?.length || 0}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.entityCodes && selectedCase.entityCodes.length > 0 ? (
                  selectedCase.entityCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300"
                    >
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-mono">No entities mapped.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestigationsPage;
