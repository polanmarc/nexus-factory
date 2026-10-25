export const TILE_W = 64;
export const TILE_H = 32;

export function isoToScreen(gx: number, gy: number): { x: number; y: number } {
  return {
    x: (gx - gy) * TILE_W,
    y: (gx + gy) * TILE_H,
  };
}

export function screenToIso(sx: number, sy: number): { gx: number; gy: number } {
  return {
    gx: (sx / TILE_W + sy / TILE_H) / 2,
    gy: (sy / TILE_H - sx / TILE_W) / 2,
  };
}

export function gridCenter(gx: number, gy: number, gw: number, gh: number): { x: number; y: number } {
  return isoToScreen(gx + gw / 2, gy + gh / 2);
}

export function isoPath(gx: number, gy: number, gw: number, gh: number): string {
  const c1 = isoToScreen(gx, gy);
  const c2 = isoToScreen(gx + gw, gy);
  const c3 = isoToScreen(gx + gw, gy + gh);
  const c4 = isoToScreen(gx, gy + gh);
  return `${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`;
}

export function isoBoxPath(
  gx: number,
  gy: number,
  gw: number,
  gh: number,
  height: number
): { top: string; left: string; right: string; all: string } {
  const b00 = isoToScreen(gx, gy);
  const b10 = isoToScreen(gx + gw, gy);
  const b11 = isoToScreen(gx + gw, gy + gh);
  const b01 = isoToScreen(gx, gy + gh);

  const t00 = { x: b00.x, y: b00.y - height };
  const t10 = { x: b10.x, y: b10.y - height };
  const t11 = { x: b11.x, y: b11.y - height };
  const t01 = { x: b01.x, y: b01.y - height };

  const top = `${t00.x},${t00.y} ${t10.x},${t10.y} ${t11.x},${t11.y} ${t01.x},${t01.y}`;
  const left = `${b00.x},${b00.y} ${t00.x},${t00.y} ${t01.x},${t01.y} ${b01.x},${b01.y}`;
  const right = `${b01.x},${b01.y} ${t01.x},${t01.y} ${t11.x},${t11.y} ${b11.x},${b11.y}`;
  const all = `${b00.x},${b00.y} ${b10.x},${b10.y} ${b11.x},${b11.y} ${t11.x},${t11.y} ${t10.x},${t10.y} ${t00.x},${t00.y}`;

  return { top, left, right, all };
}

export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round((num >> 16) * (1 + percent / 100)));
  const g = Math.min(255, Math.round(((num >> 8) & 0xff) * (1 + percent / 100)));
  const b = Math.min(255, Math.round((num & 0xff) * (1 + percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent);
}

export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}
