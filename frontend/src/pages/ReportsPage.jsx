import React, { useState, useEffect } from 'react';
import { caseService } from '../services/caseService';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import {
  FileCheck2,
  Download,
  Printer,
  Shield,
  FileText,
  Briefcase,
  Bot,
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

export const ReportsPage = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCases = async () => {
      try {
        const res = await caseService.getCases({ size: 50 });
        const list = res.content || [];
        setCases(list);
        if (list.length > 0) {
          setSelectedCaseId(list[0].id);
          generateDossier(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const generateDossier = (caseFile) => {
    setReport({
      caseNumber: caseFile.caseNumber,
      title: caseFile.title,
      status: caseFile.status,
      priority: caseFile.priority,
      lead: caseFile.assignedUserName || 'Lead Investigator',
      description: caseFile.description,
      entities: caseFile.entityCodes || [],
      evidenceCount: caseFile.evidenceCount || 0,
      generatedAt: new Date(),
    });
  };

  const handleSelectCase = (id) => {
    setSelectedCaseId(id);
    const found = cases.find((c) => c.id === parseInt(id));
    if (found) generateDossier(found);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUS-DOSSIER-${report.caseNumber}.json`;
    a.click();
    showToast('Investigative dossier exported to JSON.', 'success');
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Compiling intelligence reporting templates..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Reports & Case Dossiers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal analytical briefs for command briefings and cross-agency intelligence exchanges
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon={Printer} onClick={handlePrint}>
            Print Dossier
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExportJson}>
            Export JSON
          </Button>
        </div>
      </div>

      {/* Case Selector */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <Briefcase className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono text-slate-300">Select Target Investigation:</span>
        <select
          value={selectedCaseId}
          onChange={(e) => handleSelectCase(e.target.value)}
          className="px-3.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-300"
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.caseNumber} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Dossier Document Sheet */}
      {report && (
        <div className="nexus-card rounded-2xl p-8 border border-slate-700 bg-slate-950/90 shadow-2xl space-y-6 text-slate-200">
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
                CLASSIFIED INTELLIGENCE DOSSIER // LAW ENFORCEMENT SENSITIVE
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {report.caseNumber}: {report.title}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Investigative Lead: <strong className="text-white">{report.lead}</strong>
              </p>
            </div>
            <div className="text-right flex flex-col items-end space-y-1">
              <Badge variant={report.priority}>{report.priority} PRIORITY</Badge>
              <Badge variant={report.status}>{report.status}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                1. Executive Operational Narrative
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-1 p-4 rounded-xl bg-slate-900 border border-slate-800">
                {report.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                2. Observed Entities & Subjects of Interest
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {report.entities && report.entities.length > 0 ? (
                  report.entities.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                    >
                      {code}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-mono text-slate-500">None mapped</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                3. Forensics & Chain of Custody Summary
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Contains <strong>{report.evidenceCount}</strong> secured physical/digital exhibits registered in the evidence vault.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Generated: {new Date(report.generatedAt).toUTCString()}</span>
            <span>SYSTEM: NEXUS INTEL // PROBLEM STATEMENT 26189</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
