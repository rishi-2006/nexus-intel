import React, { useState, useEffect, useCallback } from 'react';
import { relationshipService } from '../services/relationshipService';
import { entityService } from '../services/entityService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Share2, Plus, Edit2, Trash2, Filter, ArrowRight } from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';

const relationshipTypes = [
  'COMMUNICATED_WITH',
  'ASSOCIATED_WITH',
  'TRANSFERRED_TO',
  'USED',
  'LOCATED_AT',
  'MENTIONED_IN',
  'CONNECTED_TO',
  'INVOLVED_IN',
];

export const RelationshipsPage = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [relationships, setRelationships] = useState([]);
  const [entitiesList, setEntitiesList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(15);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRel, setSelectedRel] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    sourceEntityId: '',
    targetEntityId: '',
    relationshipType: 'ASSOCIATED_WITH',
    weight: 1.0,
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRelationships = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size };
      if (typeFilter) params.type = typeFilter;
      const res = await relationshipService.getRelationships(params);
      setRelationships(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load relationships:', err);
      setError('Failed to retrieve entity relationships.');
    } finally {
      setLoading(false);
    }
  }, [page, size, typeFilter]);

  const loadEntities = async () => {
    try {
      const res = await entityService.getEntities({ size: 100 });
      setEntitiesList(res.content || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRelationships();
    loadEntities();
  }, [fetchRelationships]);

  const openCreateModal = () => {
    setFormData({
      sourceEntityId: entitiesList[0]?.id || '',
      targetEntityId: entitiesList[1]?.id || '',
      relationshipType: 'ASSOCIATED_WITH',
      weight: 1.0,
      description: 'Intelligence connection observed during surveillance cycle',
    });
    setCreateModalOpen(true);
  };

  const openDeleteModal = (rel) => {
    setSelectedRel(rel);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sourceEntityId || !formData.targetEntityId) {
      showToast('Select both source and target entities.', 'warning');
      return;
    }
    if (formData.sourceEntityId === formData.targetEntityId) {
      showToast('Source and target entity cannot be identical.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await relationshipService.createRelationship(formData);
      showToast('Relationship edge registered successfully!', 'success');
      setCreateModalOpen(false);
      fetchRelationships();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create relationship edge.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await relationshipService.deleteRelationship(selectedRel.id);
      showToast('Relationship link removed.', 'success');
      setDeleteModalOpen(false);
      fetchRelationships();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete relationship link.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Source Subject',
      key: 'sourceEntityCode',
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-cyan-400">{row.sourceEntityCode}</span>
          <p className="text-xs text-white">{row.sourceEntityName}</p>
        </div>
      ),
    },
    {
      header: 'Relational Link',
      key: 'relationshipType',
      render: (val) => (
        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
          {val}
        </span>
      ),
    },
    {
      header: 'Target Subject',
      key: 'targetEntityCode',
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-cyan-400">{row.targetEntityCode}</span>
          <p className="text-xs text-white">{row.targetEntityName}</p>
        </div>
      ),
    },
    {
      header: 'Weight',
      key: 'weight',
      render: (val) => <span className="font-mono text-xs text-slate-300">{val?.toFixed(1) || '1.0'}</span>,
    },
    {
      header: 'Context Narrative',
      key: 'description',
      render: (val) => <p className="text-xs text-slate-300 line-clamp-1">{val}</p>,
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {hasRole(['ADMIN', 'INVESTIGATOR']) && (
            <button
              onClick={() => openDeleteModal(row)}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relational Network Edges</h1>
          <p className="text-xs text-slate-400 mt-1">
            Communications, ownership, financial transfers, and physical associations
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Map New Relationship
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Filter Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          >
            <option value="">ALL RELATIONSHIPS</option>
            {relationshipTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchRelationships} />}

      <Table
        columns={columns}
        data={relationships}
        loading={loading}
        emptyMessage="No relationships registered for this filter."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={size}
        onPageChange={(p) => setPage(p)}
      />

      {/* CREATE RELATIONSHIP MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Establish Relational Network Link"
        subtitle="Connect two observed entities with verified intelligence corroboration"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleCreateSubmit}>
              Register Link
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Source Entity
              </label>
              <select
                value={formData.sourceEntityId}
                onChange={(e) => setFormData({ ...formData, sourceEntityId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {entitiesList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.entityCode} — {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Entity
              </label>
              <select
                value={formData.targetEntityId}
                onChange={(e) => setFormData({ ...formData, targetEntityId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {entitiesList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.entityCode} — {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Relationship Type
              </label>
              <select
                value={formData.relationshipType}
                onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {relationshipTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Connection Weight / Confidence (0.1 - 2.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="2.0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 1.0 })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Corroboration Notes & Observations
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              placeholder="State the surveillance, wiretap, or bank transfer reference proving this edge..."
            />
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Relationship Edge"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={submitting} onClick={handleDeleteConfirm}>
              Remove Link
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Delete relationship link between{' '}
          <strong className="text-cyan-400 font-mono">{selectedRel?.sourceEntityCode}</strong> and{' '}
          <strong className="text-cyan-400 font-mono">{selectedRel?.targetEntityCode}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default RelationshipsPage;
