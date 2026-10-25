import type { Zone } from '@/types';
import { isoToScreen, withAlpha } from '@/utils/iso';

interface Props {
  zones: Zone[];
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  onZoneClick: (id: string) => void;
  onZoneHover: (id: string | null) => void;
}

export function Minimap({ zones, selectedZoneId, hoveredZoneId, onZoneClick, onZoneHover }: Props) {
  const allPoints = zones.map((z) => [
    isoToScreen(z.gx, z.gy),
    isoToScreen(z.gx + z.gw, z.gy),
    isoToScreen(z.gx, z.gy + z.gh),
    isoToScreen(z.gx + z.gw, z.gy + z.gh),
  ]).flat();

  const minX = Math.min(...allPoints.map((p) => p.x));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxY = Math.max(...allPoints.map((p) => p.y));

  const pad = 15;
  const mapW = maxX - minX + pad * 2;
  const mapH = maxY - minY + pad * 2;
  const svgW = 170;
  const scale = svgW / mapW;
  const svgH = mapH * scale;

  const offX = -minX + pad;
  const offY = -minY + pad;

  return (
    <div className="rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 shadow-xl">
      <div className="text-[10px] text-slate-400 font-semibold mb-1 px-1 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        MINIMAPA
      </div>
      <svg width={svgW} height={svgH} className="rounded-lg">
        <rect width={svgW} height={svgH} fill="#0f1925" rx={6} />
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t}>
            <line x1={t * svgW} y1={0} x2={t * svgW} y2={svgH} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <line x1={0} y1={t * svgH} x2={svgW} y2={t * svgH} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </g>
        ))}

        {zones.map((zone) => {
          const p1 = isoToScreen(zone.gx, zone.gy);
          const p2 = isoToScreen(zone.gx + zone.gw, zone.gy);
          const p3 = isoToScreen(zone.gx + zone.gw, zone.gy + zone.gh);
          const p4 = isoToScreen(zone.gx, zone.gy + zone.gh);
          const pts = `${(p1.x + offX) * scale},${(p1.y + offY) * scale} ${(p2.x + offX) * scale},${(p2.y + offY) * scale} ${(p3.x + offX) * scale},${(p3.y + offY) * scale} ${(p4.x + offX) * scale},${(p4.y + offY) * scale}`;
          const isSelected = selectedZoneId === zone.id;
          const isHovered = hoveredZoneId === zone.id;

          return (
            <polygon
              key={zone.id}
              points={pts}
              fill={withAlpha(zone.color, isSelected ? 0.9 : isHovered ? 0.7 : 0.5)}
              stroke={isSelected ? '#fbbf24' : zone.accentColor}
              strokeWidth={isSelected ? 1.5 : 0.8}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onZoneClick(zone.id)}
              onMouseEnter={() => onZoneHover(zone.id)}
              onMouseLeave={() => onZoneHover(null)}
            />
          );
        })}
      </svg>
    </div>
  );
}
