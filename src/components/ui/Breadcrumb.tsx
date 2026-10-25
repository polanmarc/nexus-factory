import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import type { Zone, ZoneElement } from '@/types';

interface Props {
  zone: Zone | null;
  element: ZoneElement | null;
  onHome: () => void;
  onZoneClick: (id: string) => void;
  onElementClick: (id: string) => void;
  zones: Zone[];
}

export function Breadcrumb({ zone, element, onHome, onZoneClick, onElementClick, zones }: Props) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-3 py-2 shadow-xl">
      <button
        onClick={onHome}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
          !zone ? 'text-white' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home size={15} />
        <span>Fábrica</span>
      </button>

      <AnimatePresence mode="wait">
        {zone && (
          <motion.div
            key="zone"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <ChevronRight size={14} className="text-slate-600" />
            <button
              onClick={() => onZoneClick(zone.id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                !element ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
              style={element ? {} : { color: zone.accentColor }}
            >
              {zone.name}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {zone && element && (
          <motion.div
            key="element"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-sm font-medium text-white">{element.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
