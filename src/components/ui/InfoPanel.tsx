import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, ArrowRight } from 'lucide-react';
import type { Zone, ZoneElement } from '@/types';

interface Props {
  zone: Zone | null;
  element: ZoneElement | null;
  onClose: () => void;
  onCloseElement: () => void;
  onElementClick: (id: string) => void;
}

export function InfoPanel({ zone, element, onClose, onCloseElement, onElementClick }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 sm:p-4 z-30">
      <div className="pointer-events-auto w-full max-w-sm max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {element && zone ? (
            <motion.div
              key={`el-${element.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="px-5 py-4 border-b border-slate-700/40"
                style={{
                  background: `linear-gradient(135deg, ${zone.color}40, ${zone.color}10)`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                      {zone.name}
                    </div>
                    <h3 className="text-lg font-bold text-white">{element.label}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{element.description}</p>
                  </div>
                  <button
                    onClick={onCloseElement}
                    className="ml-2 w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{element.info}</p>

                {/* Element stats */}
                {element.stats && element.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {element.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-slate-800/50 border border-slate-700/30 px-3 py-2"
                      >
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                          {stat.label}
                        </div>
                        <div className="text-base font-bold text-white mt-0.5">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Animation indicator */}
                {element.animType && element.animType !== 'none' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <Activity size={13} />
                    <span>Animación activa: {element.animType}</span>
                  </div>
                )}

                {/* Back to zone */}
                <button
                  onClick={onCloseElement}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2.5 text-sm font-medium transition-all duration-200"
                >
                  Volver a {zone.name}
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          ) : zone ? (
            <motion.div
              key={`zone-${zone.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="px-5 py-4 border-b border-slate-700/40 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${zone.color}50, ${zone.color}20)`,
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-30"
                  style={{ background: zone.color }}
                />
                <div className="flex items-start justify-between relative">
                  <div>
                    <h3 className="text-xl font-bold text-white">{zone.name}</h3>
                    <p className="text-sm text-slate-300 mt-0.5">{zone.subtitle}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-2 w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{zone.description}</p>

                {/* Zone stats */}
                <div className="grid grid-cols-3 gap-2">
                  {zone.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-slate-800/50 border border-slate-700/30 px-2 py-2 text-center"
                    >
                      <div className="text-[9px] text-slate-500 uppercase tracking-wide font-medium leading-tight">
                        {stat.label}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Elements list */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Equipos ({zone.elements.length})
                  </div>
                  <div className="space-y-1.5">
                    {zone.elements.map((el) => (
                      <button
                        key={el.id}
                        onClick={() => onElementClick(el.id)}
                        className="w-full flex items-center gap-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/20 hover:border-slate-600/40 px-3 py-2 text-left transition-all duration-200 group"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                          style={{ background: el.color }}
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">
                          {el.label}
                        </span>
                        <ArrowRight size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
