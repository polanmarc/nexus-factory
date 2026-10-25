import { motion } from 'framer-motion';
import { Factory, Warehouse, Building2, FlaskConical, Truck } from 'lucide-react';
import type { Zone, ZoneId } from '@/types';

const iconMap: Record<string, typeof Factory> = {
  Factory,
  Warehouse,
  Building2,
  FlaskConical,
  Truck,
};

interface Props {
  zones: Zone[];
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  onZoneClick: (id: string) => void;
  onZoneHover: (id: string | null) => void;
}

export function ZoneNav({ zones, selectedZoneId, hoveredZoneId, onZoneClick, onZoneHover }: Props) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 shadow-xl">
      {zones.map((zone) => {
        const Icon = iconMap[zone.icon] ?? Factory;
        const isSelected = selectedZoneId === zone.id;
        const isHovered = hoveredZoneId === zone.id;

        return (
          <button
            key={zone.id}
            onClick={() => onZoneClick(zone.id)}
            onMouseEnter={() => onZoneHover(zone.id)}
            onMouseLeave={() => onZoneHover(null)}
            className="relative flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 group"
            style={{
              background: isSelected || isHovered ? `${zone.color}30` : 'transparent',
            }}
          >
            {isSelected && (
              <motion.div
                layoutId="zone-nav-highlight"
                className="absolute inset-0 rounded-lg"
                style={{ background: `${zone.color}25`, border: `1px solid ${zone.color}60` }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={16}
              className="relative z-10 transition-colors"
              style={{
                color: isSelected || isHovered ? zone.accentColor : '#94a3b8',
              }}
            />
            <span
              className="relative z-10 text-sm font-medium transition-colors hidden sm:inline"
              style={{
                color: isSelected || isHovered ? '#fff' : '#94a3b8',
              }}
            >
              {zone.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
