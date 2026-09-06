import * as THREE from 'three';
import { SpaceshipModel, CombatTarget } from '../types/spaceship';

export interface BuiltSpaceship {
  group: THREE.Group;
  thrusterFlames: THREE.Mesh[];
  shieldMesh: THREE.Mesh;
  muzzlePoints: THREE.Vector3[];
  accentColor: number;
}

/**
 * Creates a procedural 3D model for a spacecraft based on its geometry type and specifications
 */
export function buildProceduralSpaceship(ship: SpaceshipModel): BuiltSpaceship {
  const group = new THREE.Group();
  const thrusterFlames: THREE.Mesh[] = [];
  const muzzlePoints: THREE.Vector3[] = [];

  const accentColor = ship.accentHex;
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25,
  });

  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.2,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.8,
    metalness: 0.5,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x030712,
    emissive: accentColor,
    emissiveIntensity: 0.4,
    metalness: 0.95,
    roughness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const glowEngineMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.9,
  });

  if (ship.geometryType === 'interceptor') {
    // Aethel-X Totality Interceptor (Sleek needle fighter with forward-swept wings)
    // 1. Fuselage
    const noseGeo = new THREE.ConeGeometry(0.8, 4.2, 6);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, hullMat);
    nose.position.set(0, 0, 1.2);
    group.add(nose);

    const bodyGeo = new THREE.BoxGeometry(1.4, 0.7, 3.2);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.position.set(0, 0, -1.0);
    group.add(body);

    // Cockpit
    const cockpitGeo = new THREE.ConeGeometry(0.5, 2.0, 5);
    cockpitGeo.rotateX(Math.PI / 2);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 0.4, 0.4);
    group.add(cockpit);

    // Wings (Forward-swept)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(3.2, -0.6);
    wingShape.lineTo(3.4, -1.6);
    wingShape.lineTo(0.5, -2.4);
    wingShape.lineTo(0, -2.4);
    wingShape.closePath();

    const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    wingGeo.rotateX(-Math.PI / 2);

    const leftWing = new THREE.Mesh(wingGeo, armorMat);
    leftWing.position.set(0.6, 0, 0.2);
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, armorMat);
    rightWing.position.set(-0.6, 0, 0.2);
    rightWing.scale.set(-1, 1, 1);
    group.add(rightWing);

    // Wingtip Accents & Laser Cannons
    const wingGlowLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 1.2), accentMat);
    wingGlowLeft.position.set(3.3, 0, -1.1);
    group.add(wingGlowLeft);

    const wingGlowRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 1.2), accentMat);
    wingGlowRight.position.set(-3.3, 0, -1.1);
    group.add(wingGlowRight);

    muzzlePoints.push(new THREE.Vector3(3.3, 0, -0.2));
    muzzlePoints.push(new THREE.Vector3(-3.3, 0, -0.2));

    // Dual Engines
    const engineGeo = new THREE.CylinderGeometry(0.32, 0.38, 1.5, 12);
    engineGeo.rotateX(Math.PI / 2);

    const engLeft = new THREE.Mesh(engineGeo, armorMat);
    engLeft.position.set(0.45, 0, -2.4);
    group.add(engLeft);

    const engRight = new THREE.Mesh(engineGeo, armorMat);
    engRight.position.set(-0.45, 0, -2.4);
    group.add(engRight);

    // Thruster exhaust flames
    const flameGeo = new THREE.ConeGeometry(0.28, 1.8, 10);
    flameGeo.rotateX(-Math.PI / 2);
    const flameLeft = new THREE.Mesh(flameGeo, glowEngineMat);
    flameLeft.position.set(0.45, 0, -3.3);
    group.add(flameLeft);
    thrusterFlames.push(flameLeft);

    const flameRight = new THREE.Mesh(flameGeo, glowEngineMat);
    flameRight.position.set(-0.45, 0, -3.3);
    group.add(flameRight);
    thrusterFlames.push(flameRight);

  } else if (ship.geometryType === 'vanguard') {
    // Helios Vanguard Cruiser (Heavy armored wedge frigate with rail cannon)
    const hullGeo = new THREE.ConeGeometry(2.2, 6.0, 4);
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.rotateZ(Math.PI / 4);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.set(0, 0, 0);
    group.add(hull);

    // Heavy Armor Ridge
    const ridgeGeo = new THREE.BoxGeometry(0.8, 0.8, 4.5);
    const ridge = new THREE.Mesh(ridgeGeo, armorMat);
    ridge.position.set(0, 0.6, -0.5);
    group.add(ridge);

    // Dorsal Rail Cannon Turret
    const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.4, 8), accentMat);
    turretBase.position.set(0, 1.1, 0.2);
    group.add(turretBase);

    const barrelGeo = new THREE.BoxGeometry(0.2, 0.2, 3.2);
    const barrel = new THREE.Mesh(barrelGeo, armorMat);
    barrel.position.set(0, 1.25, 1.2);
    group.add(barrel);
    muzzlePoints.push(new THREE.Vector3(0, 1.25, 2.8));

    // Wingout Heavy Sponsons
    const sponsonLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 3.0), armorMat);
    sponsonLeft.position.set(1.9, -0.1, -1.2);
    group.add(sponsonLeft);

    const sponsonRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 3.0), armorMat);
    sponsonRight.position.set(-1.9, -0.1, -1.2);
    group.add(sponsonRight);

    muzzlePoints.push(new THREE.Vector3(1.9, -0.1, 0.3));
    muzzlePoints.push(new THREE.Vector3(-1.9, -0.1, 0.3));

    // Quad Engines
    const engineOffsets = [
      [0.6, 0.3, -3.2],
      [-0.6, 0.3, -3.2],
      [0.6, -0.3, -3.2],
      [-0.6, -0.3, -3.2],
    ];
    engineOffsets.forEach(([x, y, z]) => {
      const flameGeo = new THREE.ConeGeometry(0.3, 2.2, 8);
      flameGeo.rotateX(-Math.PI / 2);
      const flame = new THREE.Mesh(flameGeo, glowEngineMat);
      flame.position.set(x, y, z - 1.0);
      group.add(flame);
      thrusterFlames.push(flame);
    });

  } else if (ship.geometryType === 'recon') {
    // Chrono-Spectral Recon Delta (Lifting body with rotating spectral sensor)
    const bodyGeo = new THREE.CylinderGeometry(0.1, 2.5, 4.8, 3);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Sensor Sphere (Light Vision Fusion Core)
    const sensorGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const sensorMesh = new THREE.Mesh(sensorGeo, accentMat);
    sensorMesh.position.set(0, 0.6, 0.4);
    group.add(sensorMesh);

    // Forward Needle Mast
    const mastGeo = new THREE.CylinderGeometry(0.06, 0.12, 3.0, 8);
    mastGeo.rotateX(Math.PI / 2);
    const mast = new THREE.Mesh(mastGeo, accentMat);
    mast.position.set(0, 0.2, 3.2);
    group.add(mast);
    muzzlePoints.push(new THREE.Vector3(0, 0.2, 4.5));

    // Curved Tail Fins
    const finGeo = new THREE.BoxGeometry(0.12, 1.4, 1.8);
    const finLeft = new THREE.Mesh(finGeo, armorMat);
    finLeft.position.set(1.4, 0.7, -1.8);
    finLeft.rotateZ(-0.25);
    group.add(finLeft);

    const finRight = new THREE.Mesh(finGeo, armorMat);
    finRight.position.set(-1.4, 0.7, -1.8);
    finRight.rotateZ(0.25);
    group.add(finRight);

    // Broad Ion Thruster
    const flameGeo = new THREE.ConeGeometry(0.7, 2.6, 12);
    flameGeo.rotateX(-Math.PI / 2);
    const flame = new THREE.Mesh(flameGeo, glowEngineMat);
    flame.position.set(0, 0, -3.2);
    group.add(flame);
    thrusterFlames.push(flame);

  } else {
    // Vortex Phantom Dart (Arcade hyper-agility needle)
    const bodyGeo = new THREE.ConeGeometry(0.7, 5.0, 5);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, hullMat);
    body.position.set(0, 0, 1.0);
    group.add(body);

    // Double Delta Wings
    const wingGeo = new THREE.BoxGeometry(4.2, 0.08, 1.6);
    const wings = new THREE.Mesh(wingGeo, armorMat);
    wings.position.set(0, 0, -0.6);
    group.add(wings);

    // Wing Cannon Pods
    const podLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 8), accentMat);
    podLeft.rotateX(Math.PI / 2);
    podLeft.position.set(1.6, 0, 0);
    group.add(podLeft);

    const podRight = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.6, 8), accentMat);
    podRight.rotateX(Math.PI / 2);
    podRight.position.set(-1.6, 0, 0);
    group.add(podRight);

    muzzlePoints.push(new THREE.Vector3(1.6, 0, 0.8));
    muzzlePoints.push(new THREE.Vector3(-1.6, 0, 0.8));

    // Twin High-RPM Thrusters
    [-0.5, 0.5].forEach((x) => {
      const flameGeo = new THREE.ConeGeometry(0.25, 2.0, 8);
      flameGeo.rotateX(-Math.PI / 2);
      const flame = new THREE.Mesh(flameGeo, glowEngineMat);
      flame.position.set(x, 0, -2.4);
      group.add(flame);
      thrusterFlames.push(flame);
    });
  }

  // Plasma Shield Bubble (Transparent outer shell)
  const shieldGeo = new THREE.SphereGeometry(3.6, 24, 16);
  const shieldMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  shieldMesh.visible = false;
  group.add(shieldMesh);

  // Scaled down to match Earth radius scale (EARTH_RADIUS is 100)
  group.scale.set(0.45, 0.45, 0.45);

  return {
    group,
    thrusterFlames,
    shieldMesh,
    muzzlePoints,
    accentColor
  };
}

/**
 * Creates 3D procedural mesh for an orbital target (debris, drone, anomaly)
 */
export function buildCombatTargetMesh(target: CombatTarget): THREE.Group {
  const group = new THREE.Group();

  if (target.type === 'orbital-debris') {
    // Irregular faceted asteroid/debris chunk
    const geo = new THREE.DodecahedronGeometry(1.6, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      metalness: 0.4,
      wireframe: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Hazard warning marker ring
    const ringGeo = new THREE.RingGeometry(2.2, 2.5, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

  } else if (target.type === 'rogue-satellite') {
    // Satellite with solar panels
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
    group.add(body);

    const panelGeo = new THREE.BoxGeometry(3.6, 0.08, 1.2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.1 });
    const panelLeft = new THREE.Mesh(panelGeo, panelMat);
    panelLeft.position.set(2.4, 0, 0);
    group.add(panelLeft);

    const panelRight = new THREE.Mesh(panelGeo, panelMat);
    panelRight.position.set(-2.4, 0, 0);
    group.add(panelRight);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    beacon.position.set(0, 1.0, 0);
    group.add(beacon);

  } else if (target.type === 'solar-anomaly') {
    // Pulsing glowing coronal plasma vortex
    const sphereGeo = new THREE.SphereGeometry(2.0, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true, transparent: true, opacity: 0.8 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    const core = new THREE.Mesh(new THREE.SphereGeometry(1.0, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    group.add(core);

  } else {
    // Rogue Drone Interceptor
    const droneGeo = new THREE.TetrahedronGeometry(1.6);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
    const drone = new THREE.Mesh(droneGeo, droneMat);
    group.add(drone);

    const ring = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.3, 16), new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide }));
    group.add(ring);
  }

  group.userData = { targetId: target.id };
  return group;
}
