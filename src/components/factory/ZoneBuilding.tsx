import { motion } from 'framer-motion';
import type { Zone } from '@/types';
import { isoToScreen, isoBoxPath, isoPath, lightenColor, darkenColor, withAlpha, TILE_W, TILE_H } from '@/utils/iso';
import { AnimatedElement } from './AnimatedElement';

interface Props {
  zone: Zone;
  hovered: boolean;
  selected: boolean;
  dimmed: boolean;
  onZoneClick: () => void;
  onZoneHover: (id: string | null) => void;
  onElementClick: (elementId: string) => void;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  onElementHover: (id: string | null) => void;
  index: number;
}

export function ZoneBuilding({
  zone, hovered, selected, dimmed, onZoneClick, onZoneHover,
  onElementClick, selectedElementId, hoveredElementId, onElementHover, index,
}: Props) {
  const { x, y } = isoToScreen(zone.gx, zone.gy);
  const box = isoBoxPath(zone.gx, zone.gy, zone.gw, zone.gh, zone.height);
  const groundPath = isoPath(zone.gx - 0.3, zone.gy - 0.3, zone.gw + 0.6, zone.gh + 0.6);

  return (
    <g>
      {/* Ground / lot */}
      <motion.polygon
        points={groundPath}
        fill={withAlpha(zone.color, selected ? 0.25 : hovered ? 0.2 : 0.12)}
        stroke={zone.accentColor}
        strokeWidth={selected ? 2 : 1}
        strokeDasharray={selected ? '0' : '6 4'}
        initial={false}
        animate={{ opacity: dimmed ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Building walls */}
      <g
        onClick={(e) => { e.stopPropagation(); onZoneClick(); }}
        onMouseEnter={() => onZoneHover(zone.id)}
        onMouseLeave={() => onZoneHover(null)}
        style={{ cursor: 'pointer' }}
      >
        <motion.polygon
          points={box.left}
          fill={darkenColor(zone.color, 25)}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
          initial={false}
          animate={{
            fill: hovered || selected ? darkenColor(zone.color, 15) : darkenColor(zone.color, 25),
            opacity: dimmed ? 0.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.polygon
          points={box.right}
          fill={darkenColor(zone.color, 12)}
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
          initial={false}
          animate={{
            fill: hovered || selected ? darkenColor(zone.color, 5) : darkenColor(zone.color, 12),
            opacity: dimmed ? 0.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.polygon
          points={box.top}
          fill={hovered || selected ? lightenColor(zone.color, 20) : zone.color}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="0.5"
          initial={false}
          animate={{
            fill: hovered || selected ? lightenColor(zone.color, 25) : lightenColor(zone.color, 10),
            opacity: dimmed ? 0.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Roof details - pattern lines */}
        {Array.from({ length: Math.floor(zone.gw) }).map((_, i) => {
          const p1 = isoToScreen(zone.gx + i + 0.5, zone.gy);
          const p2 = isoToScreen(zone.gx + i + 0.5, zone.gy + zone.gh);
          return (
            <line
              key={`h-${i}`}
              x1={p1.x} y1={p1.y - zone.height}
              x2={p2.x} y2={p2.y - zone.height}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          );
        })}
        {Array.from({ length: Math.floor(zone.gh) }).map((_, i) => {
          const p1 = isoToScreen(zone.gx, zone.gy + i + 0.5);
          const p2 = isoToScreen(zone.gx + zone.gw, zone.gy + i + 0.5);
          return (
            <line
              key={`v-${i}`}
              x1={p1.x} y1={p1.y - zone.height}
              x2={p2.x} y2={p2.y - zone.height}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Windows on left wall */}
        {Array.from({ length: Math.max(1, Math.floor(zone.gw / 1.5)) }).map((_, i) => {
          const wx = zone.gx + 0.5 + i * 1.5;
          const p1 = isoToScreen(wx, zone.gy + zone.gh);
          return (
            <g key={`wl-${i}`}>
              <rect
                x={p1.x - 6}
                y={p1.y - zone.height * 0.65}
                width={10}
                height={zone.height * 0.4}
                rx={1}
                fill={hovered || selected ? 'rgba(255,255,200,0.4)' : 'rgba(150,180,220,0.15)'}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Windows on right wall */}
        {Array.from({ length: Math.max(1, Math.floor(zone.gh / 1.5)) }).map((_, i) => {
          const wy = zone.gy + 0.5 + i * 1.5;
          const p1 = isoToScreen(zone.gx + zone.gw, wy);
          return (
            <g key={`wr-${i}`}>
              <rect
                x={p1.x - 4}
                y={p1.y - zone.height * 0.65}
                width={10}
                height={zone.height * 0.4}
                rx={1}
                fill={hovered || selected ? 'rgba(255,255,200,0.4)' : 'rgba(150,180,220,0.15)'}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Zone label */}
        <g transform={`translate(${isoToScreen(zone.gx + zone.gw / 2, zone.gy + zone.gh / 2).x}, ${isoToScreen(zone.gx + zone.gw / 2, zone.gy + zone.gh / 2).y - zone.height - 20})`}>
          <motion.rect
            x={-50}
            y={-14}
            width={100}
            height={22}
            rx={5}
            fill={withAlpha(zone.color, 0.9)}
            initial={false}
            animate={{
              scale: hovered || selected ? 1.1 : 1,
              opacity: dimmed ? 0.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <text
            x={0}
            y={1}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fontWeight="700"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {zone.name}
          </text>
        </g>
      </g>

      {/* Elements */}
      {zone.elements.map((el) => (
        <AnimatedElement
          key={el.id}
          element={el}
          onClick={() => onElementClick(el.id)}
          selected={selectedElementId === el.id}
          hovered={hoveredElementId === el.id}
        />
      ))}

      {/* Hover outline */}
      {hovered && !selected && (
        <polygon
          points={box.all}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity={0.6}
          strokeDasharray="5 3"
          pointerEvents="none"
        />
      )}

      {/* Selected glow */}
      {selected && (
        <motion.polygon
          points={box.all}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
