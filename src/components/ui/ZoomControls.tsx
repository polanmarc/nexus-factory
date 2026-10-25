import { ZoomIn, ZoomOut, Maximize, Home } from 'lucide-react';

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onHome: () => void;
  showHome: boolean;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset, onHome, showHome }: Props) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-1.5 shadow-xl">
      <button
        onClick={onZoomIn}
        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
        title="Acercar"
      >
        <ZoomIn size={18} />
      </button>
      <div className="text-center text-[9px] text-slate-400 font-mono py-0.5">
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={onZoomOut}
        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
        title="Alejar"
      >
        <ZoomOut size={18} />
      </button>
      <button
        onClick={onReset}
        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
        title="Centrar vista"
      >
        <Maximize size={18} />
      </button>
      {showHome && (
        <button
          onClick={onHome}
          className="w-9 h-9 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white flex items-center justify-center transition-all duration-200 active:scale-95"
          title="Vista general"
        >
          <Home size={18} />
        </button>
      )}
    </div>
  );
}
