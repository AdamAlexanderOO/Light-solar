import { LatLon } from '../types';

export type VisionFusionMode = 
  | 'standard'
  | 'fusion-corona'
  | 'thermal-infrared'
  | 'cyber-radar'
  | 'ultraviolet-aurora';

export interface SpaceshipStats {
  firepower: number; // 0-100
  shields: number;   // 0-100
  speed: number;     // 0-100
  handling: number;  // 0-100
  sensorRange: number; // km
  topSpeedMach: number;
}

export interface SpaceshipWeapon {
  name: string;
  type: 'laser' | 'photon' | 'plasma' | 'torpedo' | 'emp';
  damage: number;
  fireRateHz: number;
  color: string;
  soundType: 'laser' | 'heavy' | 'plasma' | 'torpedo';
  overheatPerShot: number;
}

export interface SpaceshipModel {
  id: string;
  name: string;
  callsign: string;
  class: string;
  role: string;
  stats: SpaceshipStats;
  primaryWeapon: SpaceshipWeapon;
  secondaryWeapon: SpaceshipWeapon;
  specialAbility: {
    name: string;
    description: string;
    cooldownSeconds: number;
    durationSeconds: number;
  };
  flavor: string;
  badgeColor: string;
  accentHex: number;
  geometryType: 'interceptor' | 'vanguard' | 'recon' | 'phantom';
}

export interface CombatTarget {
  id: string;
  name: string;
  type: 'orbital-debris' | 'rogue-satellite' | 'solar-anomaly' | 'target-drone';
  coords: LatLon;
  altitudeKm: number;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  points: number;
  isDestroyed: boolean;
  velocity: [number, number, number];
}

export interface Projectile {
  id: string;
  origin: [number, number, number];
  direction: [number, number, number];
  speed: number;
  color: string;
  damage: number;
  distanceTraveled: number;
  maxDistance: number;
  isEnemy?: boolean;
}

export interface ExplosionParticle {
  position: [number, number, number];
  velocity: [number, number, number];
  color: string;
  size: number;
  life: number; // 0 to 1
  decay: number;
}

export interface FlightTelemetry {
  lat: number;
  lon: number;
  altitudeKm: number;
  speedMach: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  throttle: number; // 0 to 1
  boostActive: boolean;
  shields: number; // 0 to 100
  hullIntegrity: number; // 0 to 100
  overheat: number; // 0 to 100
  energy: number; // 0 to 100
  score: number;
  targetsDestroyed: number;
  comboMultiplier: number;
  flightMode: 'auto-patrol' | 'manual-pilot' | 'intercept-target';
}

export { SPACESHIP_MODELS, SPACESHIP_FLEET, DEFAULT_TARGETS } from '../data/spaceshipData';

