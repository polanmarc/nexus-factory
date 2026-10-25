import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, Info } from 'lucide-react';
import { zones as zoneData } from '@/data/zones';
import type { Zone, ZoneElement } from '@/types';
import { useCamera } from '@/hooks/useCamera';
import { FactoryScene } from '@/components/factory/FactoryScene';
import { Minimap } from '@/components/ui/Minimap';
import { ZoomControls } from '@/components/ui/ZoomControls';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { InfoPanel } from '@/components/ui/InfoPanel';
import { ZoneNav } from '@/components/ui/ZoneNav';

function App() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { camera, zoomIn, zoomOut, reset, pan, animateToZone, animateToElement } = useCamera();

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewport({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const selectedZone: Zone | null = zoneData.find((z) => z.id === selectedZoneId) ?? null;
  const selectedElement: ZoneElement | null =
    selectedZone?.elements.find((e) => e.id === selectedElementId) ?? null;

  const handleZoneClick = useCallback((id: string) => {
    const zone = zoneData.find((z) => z.id === id);
    if (!zone) return;
    setShowIntro(false);
    setSelectedElementId(null);
    if (selectedZoneId === id) {
      setSelectedZoneId(null);
      reset();
    } else {
      setSelectedZoneId(id);
      animateToZone(zone);
    }
  }, [selectedZoneId, animateToZone, reset]);

  const handleElementClick = useCallback((elementId: string, zoneId: string) => {
    const zone = zoneData.find((z) => z.id === zoneId);
    const element = zone?.elements.find((e) => e.id === elementId);
    if (!zone || !element) return;
    setShowIntro(false);
    setSelectedZoneId(zoneId);
    setSelectedElementId(elementId);
    animateToElement(zone, element.gx + element.w / 2, element.gy + element.h / 2);
  }, [animateToElement]);

  const handleElementClickFromPanel = useCallback((elementId: string) => {
    if (selectedZone) {
      handleElementClick(elementId, selectedZone.id);
    }
  }, [selectedZone, handleElementClick]);

  const handleBackgroundClick = useCallback(() => {
    if (selectedElementId) {
      setSelectedElementId(null);
      if (selectedZone) animateToZone(selectedZone);
    } else if (selectedZoneId) {
      setSelectedZoneId(null);
      reset();
    }
  }, [selectedElementId, selectedZoneId, selectedZone, animateToZone, reset]);

  const handleHome = useCallback(() => {
    setSelectedZoneId(null);
    setSelectedElementId(null);
    setShowIntro(false);
    reset();
  }, [reset]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  return (
    <div className="fixed inset-0 bg-[#0d1420] overflow-hidden select-none">
      {/* Factory Scene */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onWheel={handleWheel}
      >
        <FactoryScene
          zones={zoneData}
          camera={camera}
          selectedZoneId={selectedZoneId}
          hoveredZoneId={hoveredZoneId}
          selectedElementId={selectedElementId}
          hoveredElementId={hoveredElementId}
          onZoneClick={handleZoneClick}
          onZoneHover={setHoveredZoneId}
          onElementClick={handleElementClick}
          onElementHover={setHoveredElementId}
          onBackgroundClick={handleBackgroundClick}
          onPan={pan}
          width={viewport.width}
          height={viewport.height}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-40 flex flex-col gap-2 p-3 sm:p-4 pointer-events-none">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          {/* Logo / Title */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-4 py-2.5 shadow-xl">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Factory size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">NEXUS FACTORY</div>
              <div className="text-[10px] text-slate-400 leading-tight">Simulador Industrial 2.5D</div>
            </div>
          </div>

          {/* Zone navigation */}
          <div className="pointer-events-auto">
            <ZoneNav
              zones={zoneData}
              selectedZoneId={selectedZoneId}
              hoveredZoneId={hoveredZoneId}
              onZoneClick={handleZoneClick}
              onZoneHover={setHoveredZoneId}
            />
          </div>

          {/* Breadcrumb */}
          <div className="pointer-events-auto">
            <Breadcrumb
              zone={selectedZone}
              element={selectedElement}
              onHome={handleHome}
              onZoneClick={handleZoneClick}
              onElementClick={handleElementClickFromPanel}
              zones={zoneData}
            />
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3">
        <ZoomControls
          zoom={camera.zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
          onHome={handleHome}
          showHome={selectedZoneId !== null}
        />
      </div>

      {/* Bottom left minimap */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-40">
        <Minimap
          zones={zoneData}
          selectedZoneId={selectedZoneId}
          hoveredZoneId={hoveredZoneId}
          onZoneClick={handleZoneClick}
          onZoneHover={setHoveredZoneId}
        />
      </div>

      {/* Info panel */}
      <InfoPanel
        zone={selectedZone}
        element={selectedElement}
        onClose={handleHome}
        onCloseElement={() => {
          setSelectedElementId(null);
          if (selectedZone) animateToZone(selectedZone);
        }}
        onElementClick={handleElementClickFromPanel}
      />

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl px-6 py-5 max-w-md text-center mx-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg mx-auto mb-3">
                <Factory size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Bienvenido a Nexus Factory</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Explora una fábrica industrial interactiva en perspectiva isométrica. Haz clic en
                cualquier zona para hacer zoom, descubre los equipos dentro y conoce los procesos industriales.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Info size={13} /> Clic para zoom
                </span>
                <span>Arrastra para navegar</span>
                <span>Rueda para zoom</span>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold px-6 py-2.5 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 active:scale-95"
              >
                Explorar fábrica
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint text when no zone selected */}
      {!showIntro && !selectedZoneId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-slate-500 text-xs font-medium pointer-events-none hidden md:block"
        >
          Haz clic en una zona para explorar · Arrastra para mover · Rueda para zoom
        </motion.div>
      )}
    </div>
  );
}

export default App;
