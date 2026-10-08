import React, { useState, useEffect, useCallback } from 'react';
import { evidenceService } from '../services/evidenceService';
import { caseService } from '../services/caseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import Table from '../components/Table';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ErrorMessage from '../components/ErrorMessage';

const evidenceTypes = ['DIGITAL', 'PHYSICAL', 'DOCUMENTARY', 'TESTIMONIAL', 'FINANCIAL'];

export const EvidencePage = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  const [evidenceList, setEvidenceList] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [caseFilter, setCaseFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEv, setSelectedEv] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    evidenceCode: '',
    caseId: '',
    title: '',
    description: '',
    evidenceType: 'DIGITAL',
    fileUrl: '',
    chainOfCustody: '',
    verified: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEvidence = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size };
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (caseFilter) params.caseId = caseFilter;

      const res = await evidenceService.getEvidence(params);
      setEvidenceList(res.content || []);
      setTotalItems(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load evidence:', err);
      setError('Failed to retrieve evidentiary records.');
    } finally {
      setLoading(false);
    }
  }, [page, size, search, typeFilter, caseFilter]);

  const loadCases = async () => {
    try {
      const res = await caseService.getCases({ size: 50 });
      setCasesList(res.content || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvidence();
    loadCases();
  }, [fetchEvidence]);

  const openCreateModal = () => {
    const randomCode = `E${Math.floor(1050 + Math.random() * 8000)}`;
    setFormData({
      evidenceCode: randomCode,
      caseId: casesList[0]?.id || '',
      title: '',
      description: '',
      evidenceType: 'DIGITAL',
      fileUrl: 'https://nexus.vault/evidence/' + randomCode,
      chainOfCustody: 'Seized by Unit 4 Field Team -> Vault Locker B',
      verified: true,
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (ev) => {
    setSelectedEv(ev);
    setFormData({
      evidenceCode: ev.evidenceCode,
      caseId: ev.caseId,
      title: ev.title,
      description: ev.description || '',
      evidenceType: ev.evidenceType,
      fileUrl: ev.fileUrl || '',
      chainOfCustody: ev.chainOfCustody || '',
      verified: ev.verified || false,
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (ev) => {
    setSelectedEv(ev);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caseId) {
      showToast('Select an investigation case file.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await evidenceService.createEvidence(formData);
      showToast(`Evidence ${formData.evidenceCode} recorded in custody log!`, 'success');
      setCreateModalOpen(false);
      fetchEvidence();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to file evidence.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await evidenceService.updateEvidence(selectedEv.id, formData);
      showToast(`Evidence ${selectedEv.evidenceCode} updated.`, 'success');
      setEditModalOpen(false);
      fetchEvidence();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update evidence.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await evidenceService.deleteEvidence(selectedEv.id);
      showToast(`Evidence ${selectedEv.evidenceCode} removed.`, 'success');
      setDeleteModalOpen(false);
      fetchEvidence();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete evidence.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Evidence Code',
      key: 'evidenceCode',
      cellClassName: 'font-mono text-cyan-400 font-bold',
    },
    {
      header: 'Title & Summary',
      key: 'title',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-white">{val}</p>
          <p className="text-xs text-slate-400 line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Case File',
      key: 'caseNumber',
      render: (val) => <span className="font-mono text-xs text-cyan-300 font-semibold">{val}</span>,
    },
    {
      header: 'Type',
      key: 'evidenceType',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Chain of Custody',
      key: 'chainOfCustody',
      render: (val) => <span className="text-xs text-slate-400 font-mono line-clamp-1">{val || 'Standard locker'}</span>,
    },
    {
      header: 'Verification',
      key: 'verified',
      render: (val) => (
        <div className="flex items-center space-x-1.5">
          {val ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">VERIFIED</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-mono text-slate-400">PRELIMINARY</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {hasRole(['ADMIN', 'INVESTIGATOR']) && (
            <button
              onClick={() => openEditModal(row)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Evidentiary Vault</h1>
          <p className="text-xs text-slate-400 mt-1">
            Forensic exhibits, digital intercepts, documentary proof, and custody logs
          </p>
        </div>
        {hasRole(['ADMIN', 'INVESTIGATOR']) && (
          <Button variant="primary" icon={Plus} onClick={openCreateModal}>
            Log New Evidence
          </Button>
        )}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(0);
          }}
          placeholder="Search by evidence code or description..."
        />

        <div className="flex flex-wrap items-center gap-3">
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
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          >
            <option value="">ALL EVIDENCE TYPES</option>
            {evidenceTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={caseFilter}
            onChange={(e) => {
              setCaseFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
          >
            <option value="">ALL CASES</option>
            {casesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchEvidence} />}

      <Table
        columns={columns}
        data={evidenceList}
        loading={loading}
        emptyMessage="No evidence items match the specified query filters."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={size}
        onPageChange={(p) => setPage(p)}
      />

      {/* CREATE MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Register Evidentiary Artifact"
        subtitle="Record physical/digital evidence into chain of custody"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleCreateSubmit}>
              Log Evidence
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Evidence Code"
              required
              value={formData.evidenceCode}
              onChange={(e) => setFormData({ ...formData, evidenceCode: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Associated Investigation Case
              </label>
              <select
                value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {casesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber} — {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Evidence Title"
            required
            placeholder="e.g. Encrypted SSD Extraction - Pier 14 Raid"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Evidence Type
              </label>
              <select
                value={formData.evidenceType}
                onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {evidenceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-200">Verified Chain of Custody</span>
              </label>
            </div>
          </div>

          <Input
            label="Chain of Custody Transfer Log"
            placeholder="e.g. Seized by Detective Ross -> Deposited in Evidence Safe 4B"
            value={formData.chainOfCustody}
            onChange={(e) => setFormData({ ...formData, chainOfCustody: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Forensic Analysis & Narrative
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Evidence: ${selectedEv?.evidenceCode}`}
        subtitle="Update forensic records and chain of custody"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} onClick={handleEditSubmit}>
              Save Evidence Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Evidence Type
              </label>
              <select
                value={formData.evidenceType}
                onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono"
              >
                {evidenceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-slate-200">Verified Chain of Custody</span>
              </label>
            </div>
          </div>

          <Input
            label="Chain of Custody"
            value={formData.chainOfCustody}
            onChange={(e) => setFormData({ ...formData, chainOfCustody: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Forensic Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
            />
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Evidence Removal"
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
          Delete evidence artifact{' '}
          <strong className="text-white font-mono">{selectedEv?.evidenceCode}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default EvidencePage;
