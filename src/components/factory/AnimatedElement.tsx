import { motion } from 'framer-motion';
import type { ZoneElement } from '@/types';
import { isoToScreen, isoBoxPath, TILE_W, TILE_H, darkenColor, lightenColor } from '@/utils/iso';

interface Props {
  element: ZoneElement;
  onClick: () => void;
  selected: boolean;
  hovered: boolean;
}

export function AnimatedElement({ element, onClick, selected, hovered }: Props) {
  const { x, y } = isoToScreen(element.gx, element.gy);
  const center = isoToScreen(element.gx + element.w / 2, element.gy + element.h / 2);
  const height = element.type === 'shelf' ? 50 : element.type === 'machine' ? 35 : element.type === 'computer' ? 25 : element.type === 'tank' ? 45 : element.type === 'robot' ? 40 : element.type === 'vehicle' ? 18 : element.type === 'crane' ? 55 : element.type === 'fume-hood' ? 40 : element.type === 'microscope' ? 20 : element.type === 'loading-dock' ? 15 : 25;
  const box = isoBoxPath(element.gx, element.gy, element.w, element.h, height);
  const c = element.color;
  const cTop = lightenColor(c, 15);
  const cLeft = darkenColor(c, 20);
  const cRight = darkenColor(c, 10);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="cursor-pointer"
      style={{ pointerEvents: 'all' }}
    >
      {/* Shadow */}
      <ellipse cx={center.x - x} cy={center.y - y + 2} rx={element.w * TILE_W * 0.4} ry={element.h * TILE_H * 0.5} fill="rgba(0,0,0,0.25)" />

      {/* Body */}
      {element.type !== 'conveyor' && (
        <>
          <polygon points={box.left} fill={cLeft} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          <polygon points={box.right} fill={cRight} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
          <polygon points={box.top} fill={cTop} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
        </>
      )}

      {/* Type-specific rendering */}
      {element.type === 'conveyor' && <ConveyorVisual element={element} />}
      {element.type === 'machine' && <MachineVisual element={element} height={height} />}
      {element.type === 'robot' && <RobotVisual element={element} height={height} />}
      {element.type === 'vehicle' && <VehicleVisual element={element} />}
      {element.type === 'shelf' && <ShelfVisual element={element} height={height} />}
      {element.type === 'computer' && <ComputerVisual element={element} height={height} />}
      {element.type === 'tank' && <TankVisual element={element} height={height} />}
      {element.type === 'crane' && <CraneVisual element={element} height={height} />}
      {element.type === 'fume-hood' && <FumeHoodVisual element={element} height={height} />}
      {element.type === 'microscope' && <MicroscopeVisual element={element} height={height} />}
      {element.type === 'loading-dock' && <DockVisual element={element} height={height} />}
      {element.type === 'station' && <StationVisual element={element} height={height} />}

      {/* Selection / hover highlight */}
      {(selected || hovered) && (
        <polygon
          points={isoBoxPath(element.gx - 0.1, element.gy - 0.1, element.w + 0.2, element.h + 0.2, height + 8).top}
          transform={`translate(${-x}, ${-y})`}
          fill="none"
          stroke={selected ? '#fbbf24' : '#ffffff'}
          strokeWidth={selected ? 2 : 1.5}
          strokeDasharray={selected ? '0' : '4 3'}
          opacity={0.9}
        />
      )}

      {/* Label on hover/select */}
      {(selected || hovered) && (
        <g transform={`translate(${center.x - x}, ${center.y - y - height - 14})`}>
          <rect x={-60} y={-12} width={120} height={20} rx={4} fill="rgba(0,0,0,0.8)" />
          <text x={0} y={2} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="600">
            {element.label.length > 18 ? element.label.slice(0, 17) + '…' : element.label}
          </text>
        </g>
      )}
    </g>
  );
}

function ConveyorVisual({ element }: { element: ZoneElement }) {
  const speed = element.animSpeed ?? 3;
  const cx = element.w * TILE_W / 2;
  const cy = element.h * TILE_H / 2;

  return (
    <>
      {/* Belt base */}
      <polygon
        points={isoBoxPath(0, 0, element.w, element.h, 6).top}
        fill="#444"
        stroke="#333"
        strokeWidth="0.5"
      />
      <polygon
        points={isoBoxPath(0, 0, element.w, element.h, 6).left}
        fill="#333"
      />
      <polygon
        points={isoBoxPath(0, 0, element.w, element.h, 6).right}
        fill="#3a3a3a"
      />
      {/* Moving packages */}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={-8}
          y={-5}
          width={16}
          height={10}
          rx={1}
          fill="#e67e22"
          stroke="#d35400"
          strokeWidth="0.5"
          animate={{
            x: [-8, element.w * TILE_W * 0.7, -8],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            delay: (i * speed) / 3,
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {/* Direction arrows */}
      {[0.2, 0.5, 0.8].map((t, i) => (
        <motion.polygon
          key={`arrow-${i}`}
          points={`0,-3 6,0 0,3`}
          fill="#f39c12"
          opacity={0.6}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: speed / 2, repeat: Infinity, delay: t * speed }}
          transform={`translate(${t * element.w * TILE_W * 0.8 - 4}, 0)`}
        />
      ))}
    </>
  );
}

function MachineVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;
  const cy = element.h * TILE_H / 2;

  return (
    <>
      {/* Machine details on top */}
      <polygon
        points={`${cx - 14},${-height - 8} ${cx + 14},${-height - 8} ${cx + 14},${-height + 4} ${cx - 14},${-height + 4}`}
        fill={darkenColor(element.color, 30)}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="0.5"
      />
      {/* Status light */}
      <motion.circle
        cx={cx + 10}
        cy={-height - 12}
        r={3}
        fill="#2ecc71"
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.8, 1],
        }}
        transition={{ duration: element.animSpeed ?? 2, repeat: Infinity }}
      />
      {/* Press animation */}
      {element.animType === 'press' && (
        <motion.rect
          x={cx - 8}
          y={-height - 6}
          width={16}
          height={4}
          rx={1}
          fill="#888"
          animate={{ y: [-height - 6, -height + 2, -height - 6] }}
          transition={{ duration: element.animSpeed ?? 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* Pulse rings */}
      {element.animType === 'pulse' && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="none"
          stroke={element.color}
          strokeWidth="1.5"
          animate={{ r: [6, 18], opacity: [0.7, 0] }}
          transition={{ duration: element.animSpeed ?? 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {/* Gear for CNC */}
      <motion.g
        transform={`translate(${cx}, ${-height - 2})`}
        animate={{ rotate: 360 }}
        transition={{ duration: element.animSpeed ?? 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '0px 0px' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={-1.5}
            y={-6}
            width={3}
            height={3}
            fill="#777"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle cx={0} cy={0} r={3} fill="#555" />
        <circle cx={0} cy={0} r={1.5} fill="#333" />
      </motion.g>
    </>
  );
}

function RobotVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;
  const baseY = -height;

  return (
    <>
      {/* Base */}
      <rect x={cx - 6} y={baseY - 2} width={12} height={4} rx={1} fill="#444" />
      {/* Rotating arm */}
      <motion.g
        animate={{ rotate: [-30, 30, -30] }}
        transition={{ duration: element.animSpeed ?? 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${baseY}px` }}
      >
        <line x1={cx} y1={baseY} x2={cx + 18} y2={baseY - 18} stroke="#ddd" strokeWidth="3" strokeLinecap="round" />
        <line x1={cx + 18} y1={baseY - 18} x2={cx + 28} y2={baseY - 8} stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx + 18} cy={baseY - 18} r={2.5} fill="#888" />
        <circle cx={cx + 28} cy={baseY - 8} r={2} fill={element.color} />
      </motion.g>
      {/* LED */}
      <motion.circle
        cx={cx}
        cy={baseY - 6}
        r={2}
        fill={element.color}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </>
  );
}

function VehicleVisual({ element }: { element: ZoneElement }) {
  const cx = element.w * TILE_W / 2;
  const cy = element.h * TILE_H / 2;

  return (
    <>
      <motion.g
        animate={{
          x: [0, 30, 0],
        }}
        transition={{ duration: element.animSpeed ?? 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x={cx - 14} y={cy - 5} width={28} height={10} rx={2} fill={element.color} stroke={darkenColor(element.color, 25)} strokeWidth="0.5" />
        <rect x={cx + 4} y={cy - 4} width={10} height={8} rx={1} fill={lightenColor(element.color, 20)} />
        <circle cx={cx - 8} cy={cy + 4} r={2.5} fill="#222" />
        <circle cx={cx + 8} cy={cy + 4} r={2.5} fill="#222" />
      </motion.g>
    </>
  );
}

function ShelfVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;
  const levels = Math.floor(height / 10);

  return (
    <>
      {Array.from({ length: levels }).map((_, i) => (
        <line
          key={i}
          x1={-element.w * TILE_W * 0.3}
          y1={-height + i * (height / levels)}
          x2={element.w * TILE_W * 0.3}
          y2={-height + i * (height / levels)}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.5"
        />
      ))}
      {/* Boxes on shelves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <rect
          key={i}
          x={cx - 10 + (i - 1) * 6}
          y={-height + 8 + i * (height / 4)}
          width={5}
          height={4}
          fill={['#e67e22', '#3498db', '#2ecc71'][i]}
          opacity={0.8}
        />
      ))}
    </>
  );
}

function ComputerVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Monitor */}
      <rect x={cx - 10} y={-height - 12} width={20} height={12} rx={1} fill="#1a1a2e" stroke="#333" strokeWidth="0.5" />
      <rect x={cx - 8} y={-height - 10} width={16} height={8} rx={0.5} fill="#0d1117" />
      {/* Blinking screen content */}
      <motion.rect
        x={cx - 7}
        y={-height - 9}
        width={14}
        height={1.5}
        fill={element.color}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: element.animSpeed ?? 2, repeat: Infinity }}
      />
      <motion.rect
        x={cx - 7}
        y={-height - 6.5}
        width={8}
        height={1.5}
        fill={element.color}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: (element.animSpeed ?? 2) * 1.3, repeat: Infinity }}
      />
      <motion.rect
        x={cx - 7}
        y={-height - 4}
        width={11}
        height={1.5}
        fill={element.color}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: (element.animSpeed ?? 2) * 0.8, repeat: Infinity }}
      />
      {/* Stand */}
      <rect x={cx - 3} y={-height - 1} width={6} height={2} fill="#555" />
    </>
  );
}

function TankVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;
  const cy = element.h * TILE_H / 2;

  return (
    <>
      {/* Liquid level animation */}
      <motion.circle
        cx={cx}
        cy={-height / 2}
        r={6}
        fill="none"
        stroke={lightenColor(element.color, 30)}
        strokeWidth="1"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: element.animSpeed ?? 1.5, repeat: Infinity }}
      />
      {/* Bubbles */}
      {['0', '1', '2'].map((i) => (
        <motion.circle
          key={i}
          cx={cx + (parseInt(i) - 1) * 4}
          cy={-4}
          r={1.5}
          fill={lightenColor(element.color, 40)}
          animate={{
            y: [0, -height + 4],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: parseInt(i) * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

function CraneVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Crane beam */}
      <rect x={-element.w * TILE_W * 0.3} y={-height} width={element.w * TILE_W * 0.6} height={4} fill="#555" stroke="#333" strokeWidth="0.5" />
      {/* Moving hook */}
      <motion.g
        animate={{
          x: [-element.w * TILE_W * 0.2, element.w * TILE_W * 0.2, -element.w * TILE_W * 0.2],
        }}
        transition={{ duration: element.animSpeed ?? 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1={cx} y1={-height + 4} x2={cx} y2={-height + 20} stroke="#777" strokeWidth="1" />
        <motion.rect
          x={cx - 4}
          y={-height + 20}
          width={8}
          height={6}
          rx={1}
          fill="#888"
          animate={{ y: [-height + 20, -height + 10, -height + 20] }}
          transition={{ duration: (element.animSpeed ?? 3) / 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </>
  );
}

function FumeHoodVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Glass panel */}
      <rect x={cx - 12} y={-height + 4} width={24} height={height - 8} rx={1} fill="rgba(200,220,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      {/* Steam particles */}
      {['0', '1', '2', '3'].map((i) => (
        <motion.circle
          key={i}
          cx={cx + (parseInt(i) - 1.5) * 5}
          cy={-height + 6}
          r={2.5}
          fill="rgba(255,255,255,0.5)"
          animate={{
            y: [-height + 6, -height - 16],
            opacity: [0.6, 0],
            r: [2.5, 5],
          }}
          transition={{
            duration: element.animSpeed ?? 2,
            repeat: Infinity,
            delay: parseInt(i) * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

function MicroscopeVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Scope body */}
      <rect x={cx - 3} y={-height - 8} width={6} height={12} rx={1} fill="#666" />
      <circle cx={cx} cy={-height - 10} r={3} fill={element.color} stroke="#444" strokeWidth="0.5" />
      {/* Scan line */}
      <motion.line
        x1={cx - 10}
        y1={-height + 2}
        x2={cx + 10}
        y2={-height + 2}
        stroke={element.color}
        strokeWidth="1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: element.animSpeed ?? 2, repeat: Infinity }}
      />
    </>
  );
}

function DockVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Dock platform */}
      <rect x={cx - element.w * TILE_W * 0.3} y={-height} width={element.w * TILE_W * 0.6} height={3} fill={darkenColor(element.color, 20)} />
      {/* Loading indicator */}
      <motion.rect
        x={cx - 8}
        y={-height - 4}
        width={16}
        height={3}
        rx={1}
        fill={element.color}
        animate={{ width: [0, 16], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: element.animSpeed ?? 2, repeat: Infinity }}
        style={{ transformOrigin: `${cx}px ${-height - 2}px` }}
      />
    </>
  );
}

function StationVisual({ element, height }: { element: ZoneElement; height: number }) {
  const cx = element.w * TILE_W / 2;

  return (
    <>
      {/* Table surface detail */}
      <rect x={cx - 12} y={-height + 2} width={24} height={2} rx={0.5} fill={lightenColor(element.color, 20)} opacity={0.6} />
      {element.animType === 'pulse' && (
        <motion.circle
          cx={cx}
          cy={-height / 2}
          r={4}
          fill={element.color}
          opacity={0.3}
          animate={{ r: [4, 14], opacity: [0.4, 0] }}
          transition={{ duration: element.animSpeed ?? 3, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </>
  );
}
