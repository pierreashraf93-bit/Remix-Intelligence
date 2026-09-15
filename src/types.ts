export type Language = 'ar' | 'en';

export type ClearanceLevel = 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET' | 'BLACK OPS';

export type ThemeMode = 'emerald' | 'amber' | 'cyan' | 'crimson';

export type PortalTab = 'dashboard' | 'terminal' | 'files' | 'feed' | 'radar';

export interface ClassifiedDocument {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  clearance: ClearanceLevel;
  date: string;
  operative: string;
  coordinates: string;
  summaryAr: string;
  summaryEn: string;
  fullContentAr: string;
  fullContentEn: string;
  redactedPhrasesAr: string[];
  redactedPhrasesEn: string[];
  isDecrypted: boolean;
  isBurned: boolean;
  interceptedSignal?: string;
  checksum: string;
}

export interface RadarTarget {
  id: string;
  callsign: string;
  type: 'hostile_air' | 'recon_drone' | 'friendly_asset' | 'naval_stealth' | 'satellite' | 'cyber_anomaly';
  distanceKm: number;
  angleDeg: number;
  speedKnots: number;
  altitudeFt: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'FRIENDLY';
  status: 'TRACKING' | 'LOCKED' | 'JAMMED';
  bearing: string;
  transponderId: string;
  notesAr: string;
  notesEn: string;
}

export type VisionMode = 'tactical' | 'nvg' | 'flir' | 'wireframe';

export interface CameraFeed {
  id: string;
  number: number;
  nameAr: string;
  nameEn: string;
  sector: string;
  status: 'ONLINE' | 'STANDBY' | 'MOTION_ALERT' | 'SIGNAL_JAMMED';
  fps: number;
  visionMode: VisionMode;
  pan: number;
  tilt: number;
  zoom: number;
  hasMotion: boolean;
  locationAr: string;
  locationEn: string;
  tempCelsius: number;
  securityZone: string;
}

export interface TerminalEntry {
  id: string;
  timestamp: string;
  type: 'input' | 'output' | 'error' | 'success' | 'warning' | 'info' | 'classified' | 'ascii';
  text: string;
  category?: string;
}

export interface SecurityStatus {
  defcon: 1 | 2 | 3 | 4 | 5;
  isBreached: boolean;
  isLockdown: boolean;
  firewallBypassed: boolean;
  encryptionKey: string;
  activeOperatives: number;
  uplinkLatencyMs: number;
  soundEnabled: boolean;
  crtEnabled: boolean;
  theme: ThemeMode;
}
