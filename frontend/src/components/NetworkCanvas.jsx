import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Filter, Shield } from 'lucide-react';

const typeColors = {
  PERSON: '#6366F1',       // Indigo
  ORGANIZATION: '#F59E0B', // Amber
  PHONE: '#14B8A6',        // Teal
  VEHICLE: '#0EA5E9',      // Sky
  LOCATION: '#EC4899',     // Pink
  ACCOUNT: '#EAB308',      // Yellow
  CASE: '#3B82F6',         // Blue
  EVENT: '#8B5CF6',        // Violet
};

export const NetworkCanvas = ({
  graphData,
  selectedNodeId,
  onSelectNode,
  highlightedPath = [],
  filterType = 'ALL',
}) => {
  const canvasRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef(null);
  const nodesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Initialize or update node positions with force layout simulation
  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) return;

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 800;
    const height = canvas ? canvas.height : 600;

    // Preserve existing positions if possible
    const existingPosMap = new Map();
    nodesRef.current.forEach((n) => existingPosMap.set(n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy }));

    const radius = Math.min(width, height) * 0.38;
    const count = graphData.nodes.length;

    nodesRef.current = graphData.nodes.map((node, i) => {
      const existing = existingPosMap.get(node.id);
      const angle = (i / count) * 2 * Math.PI;
      return {
        ...node,
        x: existing ? existing.x : width / 2 + radius * Math.cos(angle) + (Math.random() - 0.5) * 50,
        y: existing ? existing.y : height / 2 + radius * Math.sin(angle) + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        radius: 12 + Math.min(10, (node.degree || 0) * 1.5),
      };
    });
  }, [graphData]);

  // Physics animation loop for spring relaxation
  useEffect(() => {
    let iteration = 0;
    const maxIterations = 200;

    const stepSimulation = () => {
      if (!graphData || !graphData.nodes) return;
      const nodes = nodesRef.current;
      const links = graphData.links || [];

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 260) {
            const force = (260 - dist) / dist * 0.05;
            nodes[i].x -= dx * force;
            nodes[i].y -= dy * force;
            nodes[j].x += dx * force;
            nodes[j].y += dy * force;
          }
        }
      }

      // Attraction along links
      const nodeMap = new Map();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      for (const link of links) {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = 110;
          const force = (dist - desiredDist) * 0.015;
          source.x += (dx / dist) * force;
          source.y += (dy / dist) * force;
          target.x -= (dx / dist) * force;
          target.y -= (dy / dist) * force;
        }
      }

      draw();

      iteration++;
      if (iteration < maxIterations) {
        animFrameRef.current = requestAnimationFrame(stepSimulation);
      }
    };

    animFrameRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [graphData, transform, selectedNodeId, highlightedPath, filterType]);

  // Main draw routine
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background grid
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Subtle grid lines
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    const gridSize = 40;
    const startX = -transform.x / transform.scale - 200;
    const startY = -transform.y / transform.scale - 200;
    const endX = (width - transform.x) / transform.scale + 200;
    const endY = (height - transform.y) / transform.scale + 200;

    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }

    const nodes = nodesRef.current;
    const links = graphData?.links || [];
    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    // Draw Links
    for (const link of links) {
      const src = nodeMap.get(link.source);
      const tgt = nodeMap.get(link.target);
      if (!src || !tgt) continue;

      const isPathLink =
        highlightedPath.length > 1 &&
        highlightedPath.includes(link.source) &&
        highlightedPath.includes(link.target);

      const isSelectedLink =
        selectedNodeId &&
        (link.source === selectedNodeId || link.target === selectedNodeId);

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      if (isPathLink) {
        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00D2FF';
        ctx.shadowBlur = 10;
      } else if (isSelectedLink) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw link label if selected or path
      if ((isSelectedLink || isPathLink) && transform.scale > 0.8) {
        const mx = (src.x + tgt.x) / 2;
        const my = (src.y + tgt.y) / 2;
        ctx.fillStyle = '#94A3B8';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(link.type, mx, my - 4);
      }
    }

    // Draw Nodes
    for (const node of nodes) {
      const isFiltered = filterType !== 'ALL' && node.type !== filterType;
      const isSelected = node.id === selectedNodeId;
      const isInPath = highlightedPath.includes(node.id);

      const color = typeColors[node.type] || '#64748B';
      const radius = node.radius || 14;

      ctx.save();
      if (isFiltered) {
        ctx.globalAlpha = 0.2;
      }

      // Outer glow for selected or path
      if (isSelected || isInPath) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 7, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 210, 255, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#38BDF8' : '#00D2FF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Node Body
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Border
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label text
      ctx.fillStyle = isSelected ? '#FFFFFF' : '#CBD5E1';
      ctx.font = `${isSelected ? 'bold ' : ''}11px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + radius + 14);

      // Node ID / Code
      ctx.fillStyle = '#64748B';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(node.id, node.x, node.y + radius + 25);

      ctx.restore();
    }

    ctx.restore();
  }, [graphData, transform, selectedNodeId, highlightedPath, filterType]);

  // Canvas mouse interactions: Dragging, Zooming, Node Selection
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
    const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;

    // Check if clicked on a node
    const clickedNode = nodesRef.current.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= (n.radius || 14) + 4;
    });

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      if (onSelectNode) onSelectNode(clickedNode);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNodeRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      draggedNodeRef.current.x = (e.clientX - rect.left - transform.x) / transform.scale;
      draggedNodeRef.current.y = (e.clientY - rect.top - transform.y) / transform.scale;
      draw();
    } else if (isDraggingRef.current) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }));
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setTransform((prev) => {
      const newScale = Math.max(0.3, Math.min(3.5, prev.scale * zoomFactor));
      return { ...prev, scale: newScale };
    });
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Resize canvas according to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateSize = () => {
      canvas.width = canvas.parentElement.clientWidth || 800;
      canvas.height = canvas.parentElement.clientHeight || 600;
      draw();
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [draw]);

  return (
    <div className="relative w-full h-[640px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Control overlay floating toolbar */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl z-10">
        <button
          onClick={() => setTransform((prev) => ({ ...prev, scale: Math.min(3.5, prev.scale * 1.2) }))}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTransform((prev) => ({ ...prev, scale: Math.max(0.3, prev.scale * 0.8) }))}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset View"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge Bar */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300 z-10">
        {Object.entries(typeColors).map(([t, color]) => (
          <div key={t} className="flex items-center space-x-1.5 px-1.5 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkCanvas;
