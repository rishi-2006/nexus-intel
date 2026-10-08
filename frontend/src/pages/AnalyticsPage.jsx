import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import {
  BarChart3,
  TrendingUp,
  Share2,
  Users,
  ShieldAlert,
  Info,
  CheckCircle,
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await analyticsService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Analytics load error:', err);
      setError('Failed to compute analytics and centrality metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Computing network centrality and cluster analytics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  const entityTypeCounts = summary?.entityTypeCounts || {};
  const relTypeCounts = summary?.relationshipTypeCounts || {};
  const highConnEntities = summary?.highConnectivityEntities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Investigative Analytics & Topology</h1>
        <p className="text-xs text-slate-400 mt-1">
          Graph centrality indices, connectivity distributions, and algorithmic signal matrices
        </p>
      </div>

      {/* Mandatory Decision Support Compliance Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-start space-x-3.5">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <p className="font-semibold text-white">Decision-Support Framework Policy:</p>
          <p className="mt-0.5 text-slate-400">
            NEXUS INTEL provides probabilistic analytical signals and network topological metrics.
            The system adheres to neutral analytical terminology (e.g., <em>High Connectivity</em>, <em>Network Bridge</em>, <em>Analytical Signal</em>).
            Algorithmic outputs do not determine legal guilt or mandate enforcement action without human verification.
          </p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Observed Entities" value={summary?.totalEntities || 0} icon={Users} />
        <Card title="Relational Edges" value={summary?.totalRelationships || 0} icon={Share2} />
        <Card title="Active Signal Flags" value={summary?.totalAnomalies || 0} icon={ShieldAlert} />
        <Card title="Custody Evidences" value={summary?.totalEvidence || 0} icon={CheckCircle} />
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entity Type Distribution */}
        <div className="nexus-card rounded-2xl p-5 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-1">Entity Classification Breakdown</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution of subjects, corporate bodies, and telecommunications nodes</p>

          <div className="space-y-3">
            {Object.entries(entityTypeCounts).map(([type, count]) => {
              const total = summary?.totalEntities || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300 font-semibold">{type}</span>
                    <span className="text-cyan-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationship Type Distribution */}
        <div className="nexus-card rounded-2xl p-5 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-1">Relational Frequency Analysis</h2>
          <p className="text-xs text-slate-400 mb-4">Observed modalities of interaction and association</p>

          <div className="space-y-3">
            {Object.entries(relTypeCounts).map(([type, count]) => {
              const total = summary?.totalRelationships || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300 font-semibold">{type}</span>
                    <span className="text-indigo-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* High Connectivity Entities Table */}
      <div className="nexus-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">High Connectivity Subject Telemetry</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Subjects with highest degree centrality and multi-target connectivity (Potential Network Bridges)
            </p>
          </div>
          <Badge variant="INVESTIGATOR">ANALYTICAL SIGNAL</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Entity Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Analytical Risk Score</th>
                <th className="py-3 px-4">Degree Connectivity</th>
                <th className="py-3 px-4">Analytical Posture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {highConnEntities.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{e.entityCode}</td>
                  <td className="py-3 px-4 font-semibold text-white">{e.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant={e.entityType} size="sm">{e.entityType}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">
                    {e.riskScore?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {e.connectionCount || 0} Edges
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                      Requires Review
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
