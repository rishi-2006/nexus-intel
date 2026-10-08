import React, { useState, useEffect, useCallback } from 'react';
import { entityService } from '../services/entityService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Eye,
  Activity,
  Share2,
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ErrorMessage from '../components/ErrorMessage';

const entityTypes = [
  'PERSON',
  'ORGANIZATION',
  'PHONE',
  'VEHICLE',
  'LOCATION',
  'ACCOUNT',
  'CASE',
  'EVENT',
];

export const EntitiesPage = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [entities, setEntities] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    entityCode: '',
    name: '',
    entityType: 'PERSON',
    riskScore: 0.5,
    status: 'ACTIVE',
    detailsJson: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEntities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size,
        sort: `${sortField},${sortDir}`,
      };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;

      const res = await entityService.getEntities(params);
      setEntities(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load entities:', err);
      setError('Failed to retrieve intelligence entities from MySQL.');
    } finally {
      setLoading(false);
    }
  }, [page, size, search, typeFilter, sortField, sortDir]);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const openCreateModal = () => {
    const randomCode = `P${Math.floor(200 + Math.random() * 800)}`;
    setFormData({
      entityCode: randomCode,
      name: '',
      entityType: 'PERSON',
      riskScore: 0.5,
      status: 'ACTIVE',
      detailsJson: '{"observedAlias": "Subject", "notes": "Active field surveillance"}',
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (entity) => {
    setSelectedEntity(entity);
    setFormData({
      entityCode: entity.entityCode,
      name: entity.name,
      entityType: entity.entityType,
      riskScore: entity.riskScore || 0.0,
      status: entity.status || 'ACTIVE',
      detailsJson: entity.detailsJson || '',
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (entity) => {
    setSelectedEntity(entity);
    setDeleteModalOpen(true);
  };

  const openDetailModal = (entity) => {
    setSelectedEntity(entity);
    setDetailModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await entityService.createEntity(formData);
      showToast(`Entity ${formData.entityCode} created successfully!`, 'success');
      setCreateModalOpen(false);
      fetchEntities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create entity record.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await entityService.updateEntity(selectedEntity.id, formData);
      showToast(`Entity ${selectedEntity.entityCode} updated.`, 'success');
      setEditModalOpen(false);
      fetchEntities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update entity record.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await entityService.deleteEntity(selectedEntity.id);
      showToast(`Entity ${selectedEntity.entityCode} removed.`, 'success');
      setDeleteModalOpen(false);
      fetchEntities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete entity record.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Code',
      key: 'entityCode',
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
      header: 'Entity / Subject Name',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-white">{val}</p>
          <p className="text-xs text-slate-400 font-mono line-clamp-1">{row.detailsJson}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'entityType',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Risk Index',
      key: 'riskScore',
      sortable: true,
      render: (val) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-white">{val?.toFixed(2) || '0.00'}</span>
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                val > 0.75 ? 'bg-rose-500' : val > 0.45 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (val || 0) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Links',
      key: 'connectionCount',
      render: (val, row) => (
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{val || 0} Edges</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {val || 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openDetailModal(row)}
            title="Inspect Entity"
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {hasRole(['ADMIN', 'INVESTIGATOR', 'ANALYST']) && (
            <button
              onClick={() => openEditModal(row)}
              title="Edit Entity"
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {hasRole('ADMIN') && (
            <button
              onClick={() => openDeleteModal(row)}
              title="Delete Entity"
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Entities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Subjects of interest, organizations, telecommunications, and logistical assets
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Register Intelligence Entity
        </Button>
      </div>

      {/* Filter and search toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(0);
          }}
          placeholder="Filter by code or name..."
        />

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="">ALL ENTITY TYPES</option>
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchEntities} />}

      {/* Table */}
      <Table
        columns={columns}
        data={entities}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDir}
        onSort={handleSort}
        emptyMessage="No entities match current filters."
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={size}
        onPageChange={(p) => setPage(p)}
      />

      {/* CREATE ENTITY MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision New Intelligence Entity"
        subtitle="Catalog a person, company, communications asset, or vehicle into MySQL"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleCreateSubmit}>
              Register Entity
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Entity Code"
              required
              placeholder="e.g. P105 or ORG309"
              value={formData.entityCode}
              onChange={(e) => setFormData({ ...formData, entityCode: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Entity Type
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {entityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Name / Identifier"
            required
            placeholder="e.g. Julian Vance or Apex Offshore Ltd"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Analytical Risk Score (0.0 to 1.0)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.riskScore}
                onChange={(e) => setFormData({ ...formData, riskScore: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Operational Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="MONITORED">MONITORED</option>
                <option value="SANCTIONED">SANCTIONED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Attribute Dossier (JSON / Metadata)
            </label>
            <textarea
              rows={3}
              value={formData.detailsJson}
              onChange={(e) => setFormData({ ...formData, detailsJson: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
              placeholder='{"alias": "Ghost", "jurisdiction": "Offshore"}'
            />
          </div>
        </form>
      </Modal>

      {/* EDIT ENTITY MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Update Entity: ${selectedEntity?.entityCode}`}
        subtitle="Modify risk index, attributes, and operational status"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleEditSubmit}>
              Save Entity Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Name / Identifier"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Type
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {entityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Risk Score
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.riskScore}
                onChange={(e) => setFormData({ ...formData, riskScore: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Attribute Dossier (JSON)
            </label>
            <textarea
              rows={3}
              value={formData.detailsJson}
              onChange={(e) => setFormData({ ...formData, detailsJson: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
            />
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Entity Record Deletion"
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
          Are you sure you want to delete entity{' '}
          <strong className="text-white font-mono">{selectedEntity?.entityCode}</strong> (
          {selectedEntity?.name})?
        </p>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Entity Intelligence Profile: ${selectedEntity?.entityCode}`}
        subtitle={selectedEntity?.name}
        footer={
          <Button variant="primary" onClick={() => setDetailModalOpen(false)}>
            Close Profile
          </Button>
        }
      >
        {selectedEntity && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Badge variant={selectedEntity.entityType}>{selectedEntity.entityType}</Badge>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Risk Score: {selectedEntity.riskScore?.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Status: {selectedEntity.status}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <p>
                <strong>Network Degree:</strong>{' '}
                <span className="text-white">{selectedEntity.connectionCount || 0} Connected Edges</span>
              </p>
              <p>
                <strong>Case Involvement:</strong>{' '}
                <span className="text-white">{selectedEntity.caseCount || 0} Investigations</span>
              </p>
              <p>
                <strong>Raw Attribute Schema:</strong>
              </p>
              <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 overflow-x-auto text-[11px]">
                {selectedEntity.detailsJson || 'No attributes recorded.'}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EntitiesPage;
