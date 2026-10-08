import React, { useState, useEffect, useCallback } from 'react';
import { networkService } from '../services/networkService';
import { caseService } from '../services/caseService';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Search,
  Filter,
  Share2,
  Route,
  Bot,
  Eye,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import NetworkCanvas from '../components/NetworkCanvas';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const entityTypes = [
  'ALL',
  'PERSON',
  'ORGANIZATION',
  'PHONE',
  'VEHICLE',
  'LOCATION',
  'ACCOUNT',
  'CASE',
  'EVENT',
];

export const NetworkExplorerPage = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [casesList, setCasesList] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Shortest path tool
  const [pathSource, setPathSource] = useState('P101');
  const [pathTarget, setPathTarget] = useState('ORG301');
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [pathSearching, setPathSearching] = useState(false);

  const navigate = useNavigate();

  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await networkService.getNetworkGraph(selectedCaseId ? selectedCaseId : null);
      setGraphData(data || { nodes: [], links: [] });
    } catch (err) {
      console.error('Failed to load network topology:', err);
      setError('Failed to construct network graph.');
    } finally {
      setLoading(false);
    }
  }, [selectedCaseId]);

  const loadCases = async () => {
    try {
      const res = await caseService.getCases({ size: 50 });
      setCasesList(res.content || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadGraph();
    loadCases();
  }, [loadGraph]);

  const handleCalculateShortestPath = async (e) => {
    e.preventDefault();
    if (!pathSource || !pathTarget) return;

    setPathSearching(true);
    try {
      const path = await networkService.getShortestPath(pathSource.trim(), pathTarget.trim());
      setHighlightedPath(path || []);
    } catch (err) {
      console.error('Shortest path error:', err);
      setHighlightedPath([]);
    } finally {
      setPathSearching(false);
    }
  };

  const clearPath = () => {
    setHighlightedPath([]);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  // Find links connected to selected node
  const connectedLinks = selectedNode
    ? graphData.links.filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Title & Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relational Network Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-hop relational topology, entity cluster detection, and shortest-path vectoring
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="">WHOLE REGISTRY NETWORK (ALL CASES)</option>
            {casesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Pathfinding Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Entity Type Filter */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
          <Filter className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-xs font-mono text-slate-400">Filter Nodes:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200"
          >
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Shortest Path Calculator Tool */}
        <div className="lg:col-span-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleCalculateShortestPath} className="flex flex-wrap items-center gap-2">
            <Route className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-xs font-mono text-slate-400">Shortest Path:</span>
            <input
              type="text"
              placeholder="Source Code (P101)"
              value={pathSource}
              onChange={(e) => setPathSource(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
            />
            <span className="text-slate-500 text-xs">→</span>
            <input
              type="text"
              placeholder="Target Code (ORG301)"
              value={pathTarget}
              onChange={(e) => setPathTarget(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200"
            />
            <Button size="sm" type="submit" loading={pathSearching}>
              Trace Path
            </Button>
            {highlightedPath.length > 0 && (
              <Button size="sm" variant="outline" onClick={clearPath}>
                Clear
              </Button>
            )}
          </form>

          {highlightedPath.length > 0 && (
            <div className="text-xs font-mono text-cyan-300 flex items-center space-x-1">
              <span>Hop Sequence:</span>
              <span className="font-bold">{highlightedPath.join(' ➔ ')}</span>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadGraph} />}

      {/* Main Canvas + Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Explorer Area */}
        <div className={`${selectedNode ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all`}>
          {loading ? (
            <LoadingSpinner size="lg" message="Rendering interactive relational topology..." />
          ) : (
            <NetworkCanvas
              graphData={graphData}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleNodeClick}
              highlightedPath={highlightedPath}
              filterType={filterType}
            />
          )}
        </div>

        {/* Selected Entity Detail Drawer */}
        {selectedNode && (
          <div className="nexus-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between max-h-[640px] overflow-y-auto animate-in fade-in slide-in-from-right-4">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{selectedNode.id}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedNode.label}</h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge variant={selectedNode.type}>{selectedNode.type}</Badge>
                <span className="text-xs font-mono text-slate-300">
                  Risk: <strong className="text-cyan-400">{selectedNode.riskScore?.toFixed(2)}</strong>
                </span>
              </div>

              {/* Attributes */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 mb-4">
                <p className="text-slate-400">Total Network Degree: <span className="text-white font-bold">{selectedNode.degree}</span></p>
                <p className="text-slate-400">Status: <span className="text-white">{selectedNode.status || 'ACTIVE'}</span></p>
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                  <p className="text-slate-500 mb-1">Dossier Snippet:</p>
                  <pre className="text-slate-300 whitespace-pre-wrap">{selectedNode.details || 'No attributes filed.'}</pre>
                </div>
              </div>

              {/* Connected Relationships in Graph */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">
                  Connected Links ({connectedLinks.length}):
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {connectedLinks.map((link) => {
                    const otherNode = link.source === selectedNode.id ? link.target : link.source;
                    return (
                      <div
                        key={link.id}
                        className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-center justify-between"
                      >
                        <div>
                          <span className="text-cyan-400 font-bold">{otherNode}</span>
                          <p className="text-[10px] text-slate-500">{link.type}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">w={link.weight}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Query Button for Selected Node */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                icon={Bot}
                onClick={() => navigate(`/nexus-ai?query=Show connections of ${selectedNode.id}`)}
                className="w-full text-cyan-300 border-cyan-800/50 hover:bg-cyan-950/60"
              >
                Analyze with NEXUS AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkExplorerPage;
