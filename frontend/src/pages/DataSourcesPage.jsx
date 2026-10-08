import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  FileCode,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import Button from '../components/Button';

export const DataSourcesPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a synthetic data file to ingest.', 'warning');
      return;
    }

    setUploading(true);
    try {
      const res = await dataService.importFile(file);
      setResult(res);
      if (res.status === 'SUCCESS') {
        showToast(`Ingestion complete! ${res.recordsProcessed} records imported into MySQL.`, 'success');
      } else {
        showToast('Ingestion completed with errors.', 'warning');
      }
    } catch (err) {
      showToast('File ingestion failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Synthetic Data Ingestion Pipeline</h1>
        <p className="text-xs text-slate-400 mt-1">
          Bulk ingestion interface for synthetic intelligence datasets (CSV, JSON, TXT)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Card */}
        <div className="lg:col-span-2 nexus-card rounded-2xl p-6 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-2">Ingest Dataset File</h2>
          <p className="text-xs text-slate-400 mb-6">
            Supported formats: <strong>.CSV</strong>, <strong>.JSON</strong>, <strong>.TXT</strong>.
            All ingested records are validated against schema constraints and persisted directly into MySQL.
          </p>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors bg-slate-950/40">
              <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">
                {file ? file.name : 'Drag & drop your intelligence file here, or browse'}
              </p>
              <p className="text-xs font-mono text-slate-500">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'CSV, JSON, or TXT (Max 15MB)'}
              </p>
              <input
                type="file"
                id="file-upload"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 cursor-pointer transition-colors"
              >
                Choose Local File
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={uploading}
              disabled={!file}
              className="w-full"
            >
              Execute Ingestion Pipeline
            </Button>
          </form>

          {/* Result Card */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-xl border ${
                result.status === 'SUCCESS'
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {result.status === 'SUCCESS' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <h4 className="text-sm font-bold font-mono">
                  Ingestion Status: {result.status}
                </h4>
              </div>
              <p className="text-xs mt-1">{result.message}</p>
              <p className="text-xs font-mono mt-1">
                Records Processed: <strong>{result.recordsProcessed}</strong>
              </p>
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3 p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-rose-300">
                  {result.errors.map((e, i) => (
                    <p key={i}>• {e}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expected Schemas & Sample Format Guide */}
        <div className="nexus-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3">Expected Schema Guide</h3>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-mono text-cyan-400 font-semibold mb-1">JSON Array Format:</p>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`[
  {
    "entityCode": "P150",
    "name": "Marcus Kane",
    "entityType": "PERSON",
    "riskScore": 0.82
  }
]`}
              </pre>
            </div>

            <div>
              <p className="font-mono text-cyan-400 font-semibold mb-1">CSV Format:</p>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`entityCode,name,entityType,riskScore
P151,Sophia Lin,PERSON,0.65
ORG315,Omega Logistics,ORGANIZATION,0.78`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesPage;
