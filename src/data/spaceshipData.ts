import { SpaceshipModel, CombatTarget } from '../types/spaceship';

export const SPACESHIP_FLEET: SpaceshipModel[] = [
  {
    id: 'eclipse-interceptor',
    name: 'Aethel-X Totality Interceptor',
    callsign: 'ECLIPSE-1',
    class: 'Hypersonic Orbital Interceptor',
    role: 'Solar Shadow Superiority & High-G Air/Space Combat',
    stats: {
      firepower: 92,
      shields: 78,
      speed: 96,
      handling: 94,
      sensorRange: 2400,
      topSpeedMach: 28.5
    },
    primaryWeapon: {
      name: 'Twin Tachyon Pulse Lasers',
      type: 'laser',
      damage: 35,
      fireRateHz: 6,
      color: '#00f2fe',
      soundType: 'laser',
      overheatPerShot: 4
    },
    secondaryWeapon: {
      name: 'Photonic Solar Torpedoes',
      type: 'torpedo',
      damage: 180,
      fireRateHz: 1.2,
      color: '#f59e0b',
      soundType: 'torpedo',
      overheatPerShot: 25
    },
    specialAbility: {
      name: 'Tachyon Overdrive',
      description: 'Supercharges ion drives to Mach 40 and vents heat instantly, boosting shield replenishment by 300%.',
      cooldownSeconds: 20,
      durationSeconds: 6
    },
    flavor: 'Engineered specifically for the 2026 total eclipse corridor. Features dual aerospike plasma thrust vectors and polarized optical sensor shrouds.',
    badgeColor: '#00f2fe',
    accentHex: 0x00f2fe,
    geometryType: 'interceptor'
  },
  {
    id: 'sol-vanguard',
    name: 'Helios Vanguard Cruiser',
    callsign: 'SOL-TITAN',
    class: 'Heavy Orbital Combat Frigate',
    role: 'Planetary Defense, Heavy Ordnance & Debris Sweeping',
    stats: {
      firepower: 98,
      shields: 95,
      speed: 68,
      handling: 64,
      sensorRange: 3200,
      topSpeedMach: 21.0
    },
    primaryWeapon: {
      name: 'Heavy Magnetic Rail Cannon',
      type: 'plasma',
      damage: 60,
      fireRateHz: 3.5,
      color: '#f59e0b',
      soundType: 'heavy',
      overheatPerShot: 7
    },
    secondaryWeapon: {
      name: 'Orbital Cluster Warheads',
      type: 'torpedo',
      damage: 260,
      fireRateHz: 0.8,
      color: '#ef4444',
      soundType: 'torpedo',
      overheatPerShot: 35
    },
    specialAbility: {
      name: 'Corona Shield Burst',
      description: 'Projects a 360-degree invulnerable plasma barrier that reflects incoming orbital kinetic hazards.',
      cooldownSeconds: 25,
      durationSeconds: 8
    },
    flavor: 'Heavy armor plating reinforced with neodymium-graphene composite. Anchors orbital corridors against rogue satellite swarms and solar debris.',
    badgeColor: '#f59e0b',
    accentHex: 0xf59e0b,
    geometryType: 'vanguard'
  },
  {
    id: 'chrono-recon',
    name: 'Chrono-Spectral Recon Delta',
    callsign: 'LIGHT-SPECTRE',
    class: 'Advanced Light Vision Fusion Science/Recon',
    role: 'Solar Corona Telemetry, Stealth & Sensor Jamming',
    stats: {
      firepower: 74,
      shields: 82,
      speed: 88,
      handling: 90,
      sensorRange: 4500,
      topSpeedMach: 25.0
    },
    primaryWeapon: {
      name: 'Phase Ion Disruptor',
      type: 'photon',
      damage: 28,
      fireRateHz: 7,
      color: '#a855f7',
      soundType: 'plasma',
      overheatPerShot: 3
    },
    secondaryWeapon: {
      name: 'EMP Singularity Pulse',
      type: 'emp',
      damage: 120,
      fireRateHz: 1.5,
      color: '#c084fc',
      soundType: 'plasma',
      overheatPerShot: 20
    },
    specialAbility: {
      name: 'Light Vision Cloaking',
      description: 'Bends solar light around the hull, rendering the ship invisible to orbital radar while amplifying multispectral optics.',
      cooldownSeconds: 18,
      durationSeconds: 7
    },
    flavor: 'Equipped with the multi-band Light Vision Fusion array to capture the corona flare spectrum at 0.1 angstrom precision in totality.',
    badgeColor: '#a855f7',
    accentHex: 0xa855f7,
    geometryType: 'recon'
  },
  {
    id: 'phantom-dart',
    name: 'Vortex Phantom Dart',
    callsign: 'PHANTOM-9',
    class: 'Arcade Tactical Strike Fighter',
    role: 'Rapid Intercept, Aerobatic Strike & High-Combo Scoring',
    stats: {
      firepower: 86,
      shields: 72,
      speed: 99,
      handling: 98,
      sensorRange: 2100,
      topSpeedMach: 32.0
    },
    primaryWeapon: {
      name: 'Quad Rapid-Plasma Gatling',
      type: 'plasma',
      damage: 24,
      fireRateHz: 10,
      color: '#10b981',
      soundType: 'laser',
      overheatPerShot: 2.5
    },
    secondaryWeapon: {
      name: 'Micro-Seeker Missiles (x8)',
      type: 'torpedo',
      damage: 140,
      fireRateHz: 2.0,
      color: '#34d399',
      soundType: 'torpedo',
      overheatPerShot: 18
    },
    specialAbility: {
      name: 'Quantum Warp Dash',
      description: 'Instantaneous 15km forward jump through hyperspace, leaving an ion trail that destroys trailing debris.',
      cooldownSeconds: 15,
      durationSeconds: 4
    },
    flavor: 'Ultra-light needle hull featuring extreme thrust-to-weight ratio. The ultimate high-tempo arcade combat experience over the planet.',
    badgeColor: '#10b981',
    accentHex: 0x10b981,
    geometryType: 'phantom'
  }
];

export const INITIAL_COMBAT_TARGETS: CombatTarget[] = [
  {
    id: 'target-1',
    name: 'Derelict Weather Satellite Alpha',
    type: 'rogue-satellite',
    coords: { lat: 68.5, lon: -26.0 },
    altitudeKm: 220,
    position: [0, 0, 0],
    health: 80,
    maxHealth: 80,
    points: 250,
    isDestroyed: false,
    velocity: [0.02, -0.01, 0.01]
  },
  {
    id: 'target-2',
    name: 'Debris Cluster: Rocket Stage Bravo',
    type: 'orbital-debris',
    coords: { lat: 64.8, lon: -19.5 },
    altitudeKm: 180,
    position: [0, 0, 0],
    health: 120,
    maxHealth: 120,
    points: 400,
    isDestroyed: false,
    velocity: [-0.01, 0.02, -0.02]
  },
  {
    id: 'target-3',
    name: 'Solar Plasma Anomaly "Coronal Spark"',
    type: 'solar-anomaly',
    coords: { lat: 52.0, lon: -12.0 },
    altitudeKm: 310,
    position: [0, 0, 0],
    health: 150,
    maxHealth: 150,
    points: 600,
    isDestroyed: false,
    velocity: [0.03, 0.01, -0.01]
  },
  {
    id: 'target-4',
    name: 'Rogue Drone Interceptor Echo',
    type: 'target-drone',
    coords: { lat: 43.5, lon: -5.0 },
    altitudeKm: 160,
    position: [0, 0, 0],
    health: 90,
    maxHealth: 90,
    points: 350,
    isDestroyed: false,
    velocity: [-0.02, -0.02, 0.02]
  },
  {
    id: 'target-5',
    name: 'Dense Debris Fragment: Heat Shield',
    type: 'orbital-debris',
    coords: { lat: 39.8, lon: 0.5 },
    altitudeKm: 140,
    position: [0, 0, 0],
    health: 60,
    maxHealth: 60,
    points: 200,
    isDestroyed: false,
    velocity: [0.01, 0.01, -0.03]
  },
  {
    id: 'target-6',
    name: 'Coronal Radiation Vortex Zeta',
    type: 'solar-anomaly',
    coords: { lat: 35.5, lon: 3.5 },
    altitudeKm: 280,
    position: [0, 0, 0],
    health: 200,
    maxHealth: 200,
    points: 800,
    isDestroyed: false,
    velocity: [-0.02, 0.03, 0.01]
  }
];

export const SPACESHIP_MODELS = SPACESHIP_FLEET;
export const DEFAULT_TARGETS = INITIAL_COMBAT_TARGETS;

