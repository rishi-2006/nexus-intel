import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { caseService } from '../services/caseService';
import { networkService } from '../services/networkService';
import { anomalyService } from '../services/anomalyService';
import {
  Briefcase,
  Users,
  Share2,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldAlert,
  Bot,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import NetworkCanvas from '../components/NetworkCanvas';

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumData, casesData, netData, anomData] = await Promise.all([
        analyticsService.getSummary(),
        caseService.getRecentCases(),
        networkService.getNetworkGraph(),
        anomalyService.getAnomalies({ size: 4 }),
      ]);
      setSummary(sumData);
      setRecentCases(casesData || []);
      setGraphData(netData);
      setAnomalies(anomData?.content || []);
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
      setError('Unable to reach backend intelligence services. Ensure Spring Boot is operational.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Synchronizing intelligence feeds & analytics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome / Situation Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Operational Intelligence Command
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Criminal Network Analysis Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time entity resolution, relational graph telemetry, and decision-support monitoring
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={Bot}
            onClick={() => navigate('/nexus-ai')}
            className="text-cyan-300 border-cyan-700/50 hover:bg-cyan-950/60"
          >
            Ask NEXUS AI
          </Button>
          <Button
            variant="primary"
            icon={Briefcase}
            onClick={() => navigate('/cases')}
          >
            View Active Cases
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          title="Active Cases"
          value={summary?.activeCases ?? 0}
          icon={Briefcase}
          trend={12}
          onClick={() => navigate('/cases')}
          className="hover:border-cyan-500/40 transition-colors"
        />
        <Card
          title="Total Entities"
          value={summary?.totalEntities ?? 0}
          icon={Users}
          trend={8}
          onClick={() => navigate('/entities')}
          className="hover:border-cyan-500/40 transition-colors"
        />
        <Card
          title="Relationships"
          value={summary?.totalRelationships ?? 0}
          icon={Share2}
          trend={15}
          onClick={() => navigate('/relationships')}
          className="hover:border-cyan-500/40 transition-colors"
        />
        <Card
          title="Evidence Items"
          value={summary?.totalEvidence ?? 0}
          icon={FileText}
          trend={5}
          onClick={() => navigate('/evidence')}
          className="hover:border-cyan-500/40 transition-colors"
        />
        <Card
          title="Analytical Signals"
          value={summary?.totalAnomalies ?? 0}
          icon={AlertTriangle}
          badge={<Badge variant="CRITICAL">ALERT</Badge>}
          onClick={() => navigate('/anomalies')}
          className="hover:border-rose-500/40 transition-colors"
        />
      </div>

      {/* Main Grid: Network Overview & Analytical Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Network Graph Visualization Preview */}
        <div className="lg:col-span-2 nexus-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Relational Network Graph</h2>
              <p className="text-xs text-slate-400 mt-0.5">Interactive topology of cross-entity links and intelligence clusters</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/network')}
            >
              Full Explorer
            </Button>
          </div>
          {graphData && (
            <NetworkCanvas
              graphData={graphData}
              onSelectNode={(node) => navigate(`/entities?search=${node.id}`)}
            />
          )}
        </div>

        {/* Right Col: Analytical Signals & High-Priority Anomalies */}
        <div className="nexus-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Analytical Signals</h2>
              </div>
              <Badge variant="NEW">{anomalies.length} PENDING</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Algorithmic behavioral flags requiring investigator review
            </p>

            <div className="space-y-3">
              {anomalies.map((anom) => (
                <div
                  key={anom.id}
                  onClick={() => navigate('/anomalies')}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">{anom.signalCode}</span>
                    <Badge variant={anom.severity}>{anom.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-2">{anom.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Target: {anom.targetEntityRef || 'N/A'}</span>
                    <span>Status: {anom.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/anomalies')}
            className="w-full mt-4 text-cyan-400 hover:text-cyan-300"
          >
            View All Analytical Signals →
          </Button>
        </div>
      </div>

      {/* Lower Grid: Recent Investigations & High Connectivity Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="nexus-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-tight">Recent Investigations</h2>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/cases')}
            >
              All Cases
            </Button>
          </div>
          <div className="divide-y divide-slate-800">
            {recentCases.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases?id=${c.id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold text-cyan-400">{c.caseNumber}</span>
                    <Badge variant={c.status} size="sm">{c.status}</Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1">{c.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{c.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <Badge variant={c.priority} size="sm">{c.priority}</Badge>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
                    {c.evidenceCount} Evidences
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Connectivity Entities */}
        <div className="nexus-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-tight">High Connectivity Network Hubs</h2>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              onClick={() => navigate('/entities')}
            >
              All Entities
            </Button>
          </div>
          <div className="divide-y divide-slate-800">
            {summary?.highConnectivityEntities?.slice(0, 4).map((e) => (
              <div
                key={e.id}
                onClick={() => navigate(`/entities?code=${e.entityCode}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold">
                    {e.entityCode.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{e.name}</h4>
                    <p className="text-[11px] font-mono text-slate-400">{e.entityCode} // {e.entityType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    Score: {e.riskScore?.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">{e.connectionCount || 0} Links</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
