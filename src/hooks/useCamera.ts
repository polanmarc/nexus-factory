import { useState, useCallback, useRef } from 'react';
import type { CameraState } from '@/types';
import { isoToScreen, gridCenter } from '@/utils/iso';
import type { Zone } from '@/types';

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;

export function useCamera(initial: CameraState = { x: 0, y: 0, zoom: 0.7 }) {
  const [camera, setCamera] = useState<CameraState>(initial);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<number | null>(null);

  const setZoom = useCallback((z: number) => {
    setCamera((prev) => ({ ...prev, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z)) }));
  }, []);

  const zoomIn = useCallback(() => {
    setCamera((prev) => ({ ...prev, zoom: Math.min(MAX_ZOOM, prev.zoom * 1.25) }));
  }, []);

  const zoomOut = useCallback(() => {
    setCamera((prev) => ({ ...prev, zoom: Math.max(MIN_ZOOM, prev.zoom * 0.8) }));
  }, []);

  const pan = useCallback((dx: number, dy: number) => {
    setCamera((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const reset = useCallback(() => {
    setCamera({ x: 0, y: 0, zoom: 0.7 });
  }, []);

  const animateToZone = useCallback((zone: Zone) => {
    const center = gridCenter(zone.gx, zone.gy, zone.gw, zone.gh);
    const targetX = -center.x * 1.6;
    const targetY = -center.y * 1.6 + 40;
    const targetZoom = 1.6;

    setIsAnimating(true);
    const start = performance.now();
    const startX = camera.x;
    const startY = camera.y;
    const startZoom = camera.zoom;
    const duration = 800;

    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(t);
      setCamera({
        x: startX + (targetX - startX) * e,
        y: startY + (targetY - startY) * e,
        zoom: startZoom + (targetZoom - startZoom) * e,
      });
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [camera.x, camera.y, camera.zoom]);

  const animateToElement = useCallback((zone: Zone, elGx: number, elGy: number) => {
    const screen = isoToScreen(elGx, elGy);
    const targetX = -screen.x * 2.2;
    const targetY = -screen.y * 2.2 - 30;
    const targetZoom = 2.5;

    setIsAnimating(true);
    const start = performance.now();
    const startX = camera.x;
    const startY = camera.y;
    const startZoom = camera.zoom;
    const duration = 700;
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(t);
      setCamera({
        x: startX + (targetX - startX) * e,
        y: startY + (targetY - startY) * e,
        zoom: startZoom + (targetZoom - startZoom) * e,
      });
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [camera.x, camera.y, camera.zoom]);

  return { camera, setZoom, zoomIn, zoomOut, pan, reset, animateToZone, animateToElement, isAnimating };
}
