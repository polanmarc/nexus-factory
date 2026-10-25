import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Zone, CameraState } from '@/types';
import { ZoneBuilding } from './ZoneBuilding';
import { isoToScreen, isoPath, withAlpha, TILE_W, TILE_H } from '@/utils/iso';

interface Props {
  zones: Zone[];
  camera: CameraState;
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  onZoneClick: (id: string) => void;
  onZoneHover: (id: string | null) => void;
  onElementClick: (elementId: string, zoneId: string) => void;
  onElementHover: (id: string | null) => void;
  onBackgroundClick: () => void;
  onPan: (dx: number, dy: number) => void;
  width: number;
  height: number;
}

export function FactoryScene({
  zones, camera, selectedZoneId, hoveredZoneId,
  selectedElementId, hoveredElementId,
  onZoneClick, onZoneHover, onElementClick, onElementHover,
  onBackgroundClick, onPan, width, height,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ dragging: boolean; lastX: number; lastY: number; moved: boolean }>({
    dragging: false, lastX: 0, lastY: 0, moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragState.current = { dragging: true, lastX: e.clientX, lastY: e.clientY, moved: false };
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.lastX;
    const dy = e.clientY - dragState.current.lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragState.current.moved = true;
    onPan(dx, dy);
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
  }, [onPan]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.moved) {
      onBackgroundClick();
    }
    dragState.current.dragging = false;
    setIsDragging(false);
  }, [onBackgroundClick]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Handled by parent
  }, []);

  const cx = width / 2;
  const cy = height / 2;
  const transform = `translate(${cx + camera.x}, ${cy + camera.y}) scale(${camera.zoom})`;

  // Sort zones by depth (gx + gy for painter's algorithm)
  const sortedZones = [...zones].sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));

  const groundW = 14;
  const groundH = 17;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isDragging ? (dragState.current.moved ? 'grabbing' : 'default') : 'grab',
        touchAction: 'none',
        display: 'block',
      }}
    >
      {/* Background gradient */}
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#1e2a3a" />
          <stop offset="60%" stopColor="#162030" />
          <stop offset="100%" stopColor="#0d1420" />
        </radialGradient>
        <linearGradient id="ground-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a3a52" />
          <stop offset="100%" stopColor="#1a2638" />
        </linearGradient>
        <pattern id="grid-pattern" width={TILE_W * 2} height={TILE_H * 2} patternUnits="userSpaceOnUse">
          <polygon
            points={`${TILE_W},0 ${TILE_W * 2},${TILE_H} ${TILE_W},${TILE_H * 2} 0,${TILE_H}`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        </pattern>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={width} height={height} fill="url(#bg-grad)" />

      {/* Stars/particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const sx = (i * 73 + 17) % width;
        const sy = (i * 41 + 11) % (height * 0.4);
        return (
          <motion.circle
            key={`star-${i}`}
            cx={sx}
            cy={sy}
            r={Math.random() * 1.2 + 0.3}
            fill="rgba(255,255,255,0.4)"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.1 }}
          />
        );
      })}

      <g transform={transform}>
        {/* Ground base */}
        <polygon
          points={isoPath(-0.5, -0.5, groundW, groundH)}
          fill="url(#ground-grad)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
        {/* Grid overlay */}
        <polygon
          points={isoPath(-0.5, -0.5, groundW, groundH)}
          fill="url(#grid-pattern)"
        />

        {/* Roads connecting zones */}
        <Roads zones={zones} />

        {/* Zones sorted by depth */}
        {sortedZones.map((zone, i) => (
          <ZoneBuilding
            key={zone.id}
            zone={zone}
            index={i}
            hovered={hoveredZoneId === zone.id}
            selected={selectedZoneId === zone.id}
            dimmed={selectedZoneId !== null && selectedZoneId !== zone.id}
            onZoneClick={() => onZoneClick(zone.id)}
            onZoneHover={onZoneHover}
            onElementClick={(elId) => onElementClick(elId, zone.id)}
            selectedElementId={selectedElementId}
            hoveredElementId={hoveredElementId}
            onElementHover={onElementHover}
          />
        ))}

        {/* Decorative elements */}
        <Decorations />
      </g>
    </svg>
  );
}

function Roads({ zones }: { zones: Zone[] }) {
  const roads: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const allPaths = [
    { x1: -0.5, y1: 5, x2: 13.5, y2: 5 }, // horizontal main road
    { x1: 5.5, y1: -0.5, x2: 5.5, y2: 16 }, // vertical main road
  ];

  return (
    <g>
      {allPaths.map((r, i) => {
        const p1 = isoToScreen(r.x1, r.y1);
        const p2 = isoToScreen(r.x2, r.y2);
        return (
          <g key={`road-${i}`}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.08)" strokeWidth={14} strokeLinecap="round" />
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.04)" strokeWidth={12} strokeLinecap="round" />
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,200,100,0.15)" strokeWidth={1} strokeDasharray="6 6" />
          </g>
        );
      })}
    </g>
  );
}

function Decorations() {
  return (
    <g>
      {/* Trees / decoration around perimeter */}
      {[
        { gx: -0.2, gy: -0.2 },
        { gx: 12, gy: -0.2 },
        { gx: -0.2, gy: 15.5 },
        { gx: 12, gy: 15.5 },
        { gx: 13.3, gy: 5 },
        { gx: -0.2, gy: 10.5 },
      ].map((pos, i) => {
        const { x, y } = isoToScreen(pos.gx, pos.gy);
        return (
          <g key={`tree-${i}`} transform={`translate(${x}, ${y})`}>
            <ellipse cx={0} cy={2} rx={6} ry={3} fill="rgba(0,0,0,0.2)" />
            <rect x={-1.5} y={-6} width={3} height={8} fill="#4a3c28" />
            <circle cx={0} cy={-10} r={7} fill="#2d6a3e" />
            <circle cx={-3} cy={-12} r={4} fill="#3a7a4e" />
            <circle cx={3} cy={-12} r={4} fill="#3a7a4e" />
            <circle cx={0} cy={-15} r={4} fill="#3a7a4e" />
          </g>
        );
      })}

      {/* Solar panels on some roofs */}
      {[
        { gx: 1, gy: 7, w: 3, h: 2 },
      ].map((s, i) => {
        const { x, y } = isoToScreen(s.gx, s.gy);
        return (
          <g key={`solar-${i}`} transform={`translate(${x}, ${y})`}>
            <polygon
              points={isoPath(0, 0, s.w, s.h)}
              fill="rgba(30,60,120,0.5)"
              stroke="rgba(100,150,255,0.3)"
              strokeWidth="0.5"
            />
            {Array.from({ length: Math.floor(s.w * 2) }).map((_, j) => {
              const p1 = isoToScreen(j * 0.5, 0);
              const p2 = isoToScreen(j * 0.5, s.h);
              return <line key={j} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(100,150,255,0.15)" strokeWidth="0.3" />;
            })}
          </g>
        );
      })}

      {/* Street lamps */}
      {[
        { gx: 5, gy: 5 },
        { gx: 0, gy: 11 },
        { gx: 11, gy: 5 },
      ].map((pos, i) => {
        const { x, y } = isoToScreen(pos.gx, pos.gy);
        return (
          <g key={`lamp-${i}`} transform={`translate(${x}, ${y})`}>
            <line x1={0} y1={0} x2={0} y2={-20} stroke="#555" strokeWidth="1.5" />
            <motion.circle
              cx={0}
              cy={-22}
              r={4}
              fill="rgba(255,220,150,0.6)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
          </g>
        );
      })}
    </g>
  );
}
