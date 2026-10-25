export interface ZoneElement {
  id: string;
  type: 'machine' | 'conveyor' | 'vehicle' | 'robot' | 'station' | 'tank' | 'computer' | 'shelf' | 'door' | 'vehicle-bay' | 'crane' | 'fume-hood' | 'microscope' | 'server' | 'loading-dock';
  label: string;
  description: string;
  gx: number;
  gy: number;
  w: number;
  h: number;
  color: string;
  animType?: 'pulse' | 'rotate' | 'conveyor' | 'bounce' | 'steam' | 'blink' | 'drive' | 'press' | 'lift' | 'scan' | 'none';
  animSpeed?: number;
  info: string;
  stats?: { label: string; value: string }[];
}

export interface Zone {
  id: ZoneId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
  gx: number;
  gy: number;
  gw: number;
  gh: number;
  height: number;
  icon: string;
  elements: ZoneElement[];
  stats: { label: string; value: string }[];
}

export type ZoneId = 'production' | 'warehouse' | 'offices' | 'laboratory' | 'logistics';

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}
