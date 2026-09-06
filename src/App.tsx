import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_START_SECONDS, SIMULATION_START_SECONDS, SIMULATION_END_SECONDS, OBSERVATION_STATIONS } from './data/eclipseData';
import { ObservationStation, LatLon, TelemetryReadout } from './types';
import { calculateTelemetry, getUmbraPosition, calculateDistanceKm, getAutoTrackingStation } from './utils/astronomy';
import { HeaderClocks } from './components/HeaderClocks';
import { Earth3D } from './components/Earth3D';
import { TelemetryPanel } from './components/TelemetryPanel';
import { PathTimelinePanel } from './components/PathTimelinePanel';
import { TimelineScrubber } from './components/TimelineScrubber';
import { SkyViewPanel } from './components/SkyViewPanel';
import { AttributionModal } from './components/AttributionModal';
import { SpaceshipGalleryModal } from './components/SpaceshipGalleryModal';
import { CombatDeckPanel } from './components/CombatDeckPanel';
import { SPACESHIP_MODELS, SpaceshipModel, FlightTelemetry, VisionFusionMode, CombatTarget, DEFAULT_TARGETS } from './types/spaceship';
import { audioSynth } from './utils/audioSynth';

export default function App() {
  // Simulation State
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(DEFAULT_START_SECONDS);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(300); // default 300x speed

  // Attributions / Info Modal State
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState<boolean>(false);

  // Spaceship Hangar & Combat Deck State
  const [selectedShip, setSelectedShip] = useState<SpaceshipModel>(SPACESHIP_MODELS[0]);
  const [isShipGalleryOpen, setIsShipGalleryOpen] = useState<boolean>(false);
  const [isCombatDeckOpen, setIsCombatDeckOpen] = useState<boolean>(true);
  const [visionMode, setVisionMode] = useState<VisionFusionMode>('standard');
  const [flightTelemetry, setFlightTelemetry] = useState<FlightTelemetry>({
    lat: 68.0,
    lon: -28.0,
    altitudeKm: 140,
    speedMach: 24.8,
    headingDeg: 118,
    pitchDeg: 0,
    rollDeg: 0,
    throttle: 0.8,
    boostActive: false,
    shields: 100,
    hullIntegrity: 100,
    overheat: 0,
    energy: 100,
    score: 0,
    targetsDestroyed: 0,
    comboMultiplier: 1,
    flightMode: 'auto-patrol'
  });

  const [combatTargets, setCombatTargets] = useState<CombatTarget[]>(DEFAULT_TARGETS);
  const [lockedTarget, setLockedTarget] = useState<CombatTarget | null>(null);

  // Weapon Action Triggers for Earth3D
  const [fireTrigger, setFireTrigger] = useState<number>(0);
  const [secondaryFireTrigger, setSecondaryFireTrigger] = useState<number>(0);
  const [boostTrigger, setBoostTrigger] = useState<number>(0);
  const [shieldTrigger, setShieldTrigger] = useState<number>(0);
  const [specialTrigger, setSpecialTrigger] = useState<number>(0);

  // Selection & Camera State
  const [selectedStation, setSelectedStation] = useState<ObservationStation | null>(() => getAutoTrackingStation(DEFAULT_START_SECONDS));
  const [customStation, setCustomStation] = useState<ObservationStation | null>(null);
  const [cameraMode, setCameraMode] = useState<'free' | 'follow-shadow' | 'focused-station' | 'top-down' | 'spain-fixed' | 'chase-ship' | 'cockpit-ship'>('follow-shadow');
  const [trackingMode, setTrackingMode] = useState<'auto' | 'manual' | 'spain-fixed'>('auto');
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);

  // Layer Visibility State
  const [showPathLine, setShowPathLine] = useState<boolean>(true);
  const [showPenumbra, setShowPenumbra] = useState<boolean>(true);
  const [showDayNightTerminator, setShowDayNightTerminator] = useState<boolean>(true);

  // Mobile Bottom Drawer State
  const [mobileTab, setMobileTab] = useState<'telemetry' | 'sky' | 'timeline' | 'combat'>('combat');
  const [isMobilePanelExpanded, setIsMobilePanelExpanded] = useState<boolean>(true);

  // Continuous Simulation loop ticker with loop-to-start
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTimestamp((prev) => {
        const next = prev + (speedMultiplier * 0.05); // 50ms tick interval
        if (next >= SIMULATION_END_SECONDS) {
          return SIMULATION_START_SECONDS; // Seamless loop back to 5:00PM UTC
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Auto-track Eclipse progression:
  // In Auto mode, do NOT show a synthetic "Umbra Center"; instead, focus on the current city,
  // and a short while after the eclipse passes each city, automatically pin to the next city in sequence.
  useEffect(() => {
    if (trackingMode !== 'auto') return;

    const autoStation = getAutoTrackingStation(currentTimestamp);
    if (autoStation && (!selectedStation || selectedStation.id !== autoStation.id || selectedStation.isCustom)) {
      setCustomStation(null);
      setSelectedStation(autoStation);
    }
  }, [currentTimestamp, trackingMode, selectedStation]);

  // Compute live telemetry for selected station
  const activeStation = useMemo(() => customStation || selectedStation, [customStation, selectedStation]);

  const telemetry: TelemetryReadout = useMemo(() => {
    if (!activeStation) {
      return {
        obscurationPercentage: 0,
        sunAltitudeDegrees: 0,
        currentPhase: 'No Eclipse',
        timeToNextPhase: 'N/A',
        distanceToUmbraKm: 9999
      };
    }
    return calculateTelemetry(activeStation.coords, currentTimestamp, activeStation.isCustom ? undefined : activeStation.id);
  }, [activeStation, currentTimestamp]);

  // Handle custom pin drop on 3D Globe
  const handleDropCustomPin = useCallback((coords: LatLon) => {
    setTrackingMode('manual');
    let country: ObservationStation['country'] = 'Ocean';
    let countryCode: ObservationStation['countryCode'] = 'INTL';
    if (coords.lat > 68 && coords.lon < -10) {
      country = 'Greenland';
      countryCode = 'GL';
    } else if (coords.lat > 63 && coords.lat < 67 && coords.lon > -25 && coords.lon < -13) {
      country = 'Iceland';
      countryCode = 'IS';
    } else if (coords.lat > 36 && coords.lat < 44 && coords.lon > -10 && coords.lon < 4) {
      country = 'Spain';
      countryCode = 'ES';
    }

    const newCustomStation: ObservationStation = {
      id: 'custom-pin',
      name: `Point (${coords.lat.toFixed(2)}°, ${coords.lon.toFixed(2)}°)`,
      country,
      countryCode,
      coords,
      elevationMeters: 0,
      description: 'Custom user-selected observation point. Telemetry is calculated dynamically in real-time based on distance from the Moon’s umbral shadow path.',
      weatherProspects: 'Dynamically generated point. Consult local meteorological forecasts for August 2026.',
      eclipseTimes: {
        startPartial: '16:00:00',
        startTotality: '17:30:00',
        peakTotality: '17:31:00',
        endTotality: '17:32:00',
        endPartial: '18:50:00',
        durationSeconds: 120
      },
      maxSunAltitude: 20.0,
      isCustom: true
    };

    setCustomStation(newCustomStation);
    setSelectedStation(newCustomStation);
    setTrackingMode('manual');
    setCameraMode('focused-station');
  }, []);

  const handleSelectStation = useCallback((station: ObservationStation) => {
    setTrackingMode('manual');
    if (station.isCustom && customStation) {
      setSelectedStation(customStation);
    } else {
      setCustomStation(null);
      setSelectedStation(station);
    }
    setCameraMode('focused-station');
  }, [customStation]);

  const handleUserInteract = useCallback(() => {
    setTrackingMode('manual');
  }, []);

  const handleJumpToMilestone = useCallback((timeSeconds: number, stationId?: string) => {
    setCurrentTimestamp(timeSeconds);
    if (stationId) {
      setTrackingMode('manual');
      const found = OBSERVATION_STATIONS.find((s) => s.id === stationId);
      if (found) {
        setCustomStation(null);
        setSelectedStation(found);
        setCameraMode('focused-station');
      }
    }
  }, []);

  const handleSelectTrackingMode = useCallback((mode: 'auto' | 'manual' | 'spain-fixed') => {
    setTrackingMode(mode);
    setCameraResetTrigger((prev) => prev + 1);
    if (mode === 'auto') {
      setCameraMode('follow-shadow');
      setCustomStation(null);
      setSelectedStation(getAutoTrackingStation(currentTimestamp));
    } else if (mode === 'manual') {
      setCameraMode('free');
    } else if (mode === 'spain-fixed') {
      setCameraMode('spain-fixed');
      const madrid = OBSERVATION_STATIONS.find((s) => s.id === 'spain-madrid');
      if (madrid) {
        setCustomStation(null);
        setSelectedStation(madrid);
      }
    }
  }, [currentTimestamp]);

  const handleResetCamera = useCallback(() => {
    setTrackingMode('auto');
    setCameraMode('follow-shadow');
    setCustomStation(null);
    setSelectedStation(getAutoTrackingStation(currentTimestamp));
    setCameraResetTrigger((prev) => prev + 1);
  }, [currentTimestamp]);

  // Global Keyboard Shortcut:
  // - Space bar: Sets camera to fixed Spain zoom-out position
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleSelectTrackingMode('spain-fixed');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectTrackingMode]);

  const handleTargetHit = useCallback((targetId: string, damage: number) => {
    setCombatTargets((prev) =>
      prev.map((t) => {
        if (t.id === targetId) {
          const nextHealth = Math.max(0, t.health - damage);
          const isDestroyed = nextHealth <= 0;
          if (isDestroyed && !t.isDestroyed) {
            audioSynth.playExplosion('large');
            setFlightTelemetry((f) => ({
              ...f,
              score: f.score + t.points
            }));
          }
          return { ...t, health: nextHealth, isDestroyed };
        }
        return t;
      })
    );
  }, []);

  const handleFirePrimary = useCallback(() => {
    setFireTrigger((prev) => prev + 1);
  }, []);

  const handleFireSecondary = useCallback(() => {
    setSecondaryFireTrigger((prev) => prev + 1);
  }, []);

  const handleBoost = useCallback(() => {
    setBoostTrigger((prev) => prev + 1);
    audioSynth.playBoost();
  }, []);

  const handleShield = useCallback(() => {
    setShieldTrigger((prev) => prev + 1);
    audioSynth.playShield();
  }, []);

  const handleSpecial = useCallback(() => {
    setSpecialTrigger((prev) => prev + 1);
    audioSynth.playSpecial();
    setCombatTargets((prev) =>
      prev.map((t) => {
        if (!t.isDestroyed) {
          const nextHealth = Math.max(0, t.health - 150);
          return { ...t, health: nextHealth, isDestroyed: nextHealth <= 0 };
        }
        return t;
      })
    );
  }, []);

  const handleSelectShip = useCallback((ship: SpaceshipModel) => {
    setSelectedShip(ship);
    audioSynth.playSelect();
  }, []);

  const handleSelectVisionMode = useCallback((mode: VisionFusionMode) => {
    setVisionMode(mode);
    audioSynth.playVisionSwitch();
  }, []);

  const handleSelectFlightMode = useCallback((mode: 'auto-patrol' | 'manual-pilot') => {
    setFlightTelemetry((prev) => ({ ...prev, flightMode: mode }));
    audioSynth.playSelect();
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#050505] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Top Header Bar */}
      <HeaderClocks
        currentTimestamp={currentTimestamp}
        onResetCamera={handleResetCamera}
        onOpenInfo={() => setIsAttributionModalOpen(true)}
        onOpenHangar={() => setIsShipGalleryOpen(true)}
        onToggleCombatDeck={() => setIsCombatDeckOpen(!isCombatDeckOpen)}
        isCombatDeckOpen={isCombatDeckOpen}
      />

      {/* 2. Main Workspace: 3D Globe + Floating Reference UI Panels */}
      <main className="flex-1 relative min-h-0 w-full overflow-hidden">
        {/* 3D Earth Studio Canvas */}
        <div className="absolute inset-0 w-full h-full">
          <Earth3D
            currentTimestamp={currentTimestamp}
            selectedStation={activeStation}
            onSelectStation={handleSelectStation}
            cameraMode={cameraMode}
            showPathLine={showPathLine}
            showPenumbra={showPenumbra}
            showDayNightTerminator={showDayNightTerminator}
            onCameraModeChange={(mode) => {
              setCameraMode(mode);
              if (mode === 'free' || mode === 'focused-station' || mode === 'top-down') {
                setTrackingMode('manual');
              } else if (mode === 'follow-shadow') {
                setTrackingMode('auto');
              } else if (mode === 'spain-fixed') {
                setTrackingMode('spain-fixed');
              }
            }}
            onDropCustomPin={handleDropCustomPin}
            onTogglePathLine={() => setShowPathLine(!showPathLine)}
            onTogglePenumbra={() => setShowPenumbra(!showPenumbra)}
            onToggleTerminator={() => setShowDayNightTerminator(!showDayNightTerminator)}
            cameraResetTrigger={cameraResetTrigger}
            onUserInteract={handleUserInteract}
            selectedShip={selectedShip}
            visionMode={visionMode}
            flightTelemetry={flightTelemetry}
            onUpdateFlightTelemetry={setFlightTelemetry}
            combatTargets={combatTargets}
            onTargetHit={handleTargetHit}
            fireTrigger={fireTrigger}
            secondaryFireTrigger={secondaryFireTrigger}
            boostTrigger={boostTrigger}
            shieldTrigger={shieldTrigger}
            specialTrigger={specialTrigger}
            lockedTarget={lockedTarget}
          />
        </div>

        {/* Floating Overlay Panels */}
        <div className="absolute inset-0 pointer-events-none flex justify-between p-3 sm:p-4 lg:p-5 z-20 overflow-hidden transition-opacity duration-300">
          {/* Left Panel: Path of Totality Timeline */}
          <div className="pointer-events-auto self-start hidden xl:block max-h-[calc(100%-16px)] overflow-y-auto no-scrollbar pr-1">
            <PathTimelinePanel
              currentTimestamp={currentTimestamp}
              onSelectMilestone={handleJumpToMilestone}
            />
          </div>

          {/* Center-Left Panel: Combat Deck & Arcade Controls (Desktop) */}
          {isCombatDeckOpen && (
            <div className="pointer-events-auto self-start hidden lg:block max-h-[calc(100%-16px)] overflow-y-auto no-scrollbar pr-1">
              <CombatDeckPanel
                ship={selectedShip}
                telemetry={flightTelemetry}
                visionMode={visionMode}
                onVisionModeChange={handleSelectVisionMode}
                onSelectVisionMode={handleSelectVisionMode}
                onSetFlightMode={handleSelectFlightMode}
                onSelectFlightMode={handleSelectFlightMode}
                onFirePrimary={handleFirePrimary}
                onFireSecondary={handleFireSecondary}
                onBoost={handleBoost}
                onActivateShield={handleShield}
                onShield={handleShield}
                onTriggerSpecial={handleSpecial}
                onSpecial={handleSpecial}
                onOpenHangar={() => setIsShipGalleryOpen(true)}
                onOpenShipGallery={() => setIsShipGalleryOpen(true)}
                targets={combatTargets}
                lockedTarget={lockedTarget}
                nearestTarget={lockedTarget}
                onSelectTarget={(t) => {
                  setLockedTarget(t);
                  audioSynth.playLockOn();
                }}
                onLockNextTarget={() => {
                  const alive = combatTargets.filter(t => !t.isDestroyed);
                  if (alive.length > 0) {
                    const idx = alive.findIndex(t => t.id === lockedTarget?.id);
                    const next = alive[(idx + 1) % alive.length];
                    setLockedTarget(next);
                    audioSynth.playLockOn();
                  }
                }}
                cameraMode={cameraMode}
                onCameraModeChange={(mode) => setCameraMode(mode)}
                onToggleCameraMode={() => {
                  setCameraMode(cameraMode === 'chase-ship' ? 'cockpit-ship' : cameraMode === 'cockpit-ship' ? 'follow-shadow' : 'chase-ship');
                }}
                isMuted={audioSynth.getIsMuted()}
                onToggleSound={() => audioSynth.toggleMute()}
                onClose={() => setIsCombatDeckOpen(false)}
              />
            </div>
          )}

          {/* Right Panel: Observation Point Telemetry Card & Permanent Sky View */}
          <div className="pointer-events-auto self-start hidden md:flex flex-col gap-4 lg:gap-5 max-h-[calc(100%-16px)] overflow-y-auto no-scrollbar pl-1 pr-1 pb-4">
            <TelemetryPanel
              selectedStation={activeStation}
              telemetry={telemetry}
              onSelectStation={handleSelectStation}
              onClearCustomPin={() => {
                setCustomStation(null);
                setSelectedStation(OBSERVATION_STATIONS[1]);
              }}
              trackingMode={trackingMode}
              onSelectTrackingMode={handleSelectTrackingMode}
              isAutoTracking={trackingMode === 'auto'}
              onToggleAutoTrack={() => handleSelectTrackingMode(trackingMode === 'auto' ? 'manual' : 'auto')}
            />
            <SkyViewPanel
              selectedStation={activeStation}
              telemetry={telemetry}
              currentTimestamp={currentTimestamp}
            />
          </div>
        </div>
      </main>

      {/* Mobile-only interactive bottom drawer / tabbed sheet */}
      <div className="md:hidden bg-[#050505]/95 border-t border-white/20 shrink-0 z-30 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {/* Tab Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5 bg-black/90 font-mono text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                if (mobileTab === 'combat' && isMobilePanelExpanded) {
                  setIsMobilePanelExpanded(false);
                } else {
                  setMobileTab('combat');
                  setIsMobilePanelExpanded(true);
                }
              }}
              className={`px-2 py-1 rounded-sm transition-all font-bold tracking-wider uppercase flex items-center gap-1 whitespace-nowrap text-[11px] ${
                mobileTab === 'combat' && isMobilePanelExpanded
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              <span>⚔️</span>
              <span>Combat</span>
            </button>

            <button
              onClick={() => {
                if (mobileTab === 'telemetry' && isMobilePanelExpanded) {
                  setIsMobilePanelExpanded(false);
                } else {
                  setMobileTab('telemetry');
                  setIsMobilePanelExpanded(true);
                }
              }}
              className={`px-2 py-1 rounded-sm transition-all font-bold tracking-wider uppercase flex items-center gap-1 whitespace-nowrap text-[11px] ${
                mobileTab === 'telemetry' && isMobilePanelExpanded
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              <span>📊</span>
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => {
                if (mobileTab === 'sky' && isMobilePanelExpanded) {
                  setIsMobilePanelExpanded(false);
                } else {
                  setMobileTab('sky');
                  setIsMobilePanelExpanded(true);
                }
              }}
              className={`px-2 py-1 rounded-sm transition-all font-bold tracking-wider uppercase flex items-center gap-1 whitespace-nowrap text-[11px] ${
                mobileTab === 'sky' && isMobilePanelExpanded
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              <span>🔭</span>
              <span>Sky View</span>
            </button>

            <button
              onClick={() => {
                if (mobileTab === 'timeline' && isMobilePanelExpanded) {
                  setIsMobilePanelExpanded(false);
                } else {
                  setMobileTab('timeline');
                  setIsMobilePanelExpanded(true);
                }
              }}
              className={`px-2 py-1 rounded-sm transition-all font-bold tracking-wider uppercase flex items-center gap-1 whitespace-nowrap text-[11px] ${
                mobileTab === 'timeline' && isMobilePanelExpanded
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
              }`}
            >
              <span>📍</span>
              <span>Timeline</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobilePanelExpanded(!isMobilePanelExpanded)}
            className="px-2 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/20 ml-1 shrink-0 text-[10px] font-bold font-mono uppercase tracking-wider"
            title={isMobilePanelExpanded ? "Minimize Panel for Full Globe View" : "Expand Panel"}
          >
            {isMobilePanelExpanded ? '▼ MIN' : '▲ MAX'}
          </button>
        </div>

        {/* Panel Content Area (when expanded) */}
        {isMobilePanelExpanded && (
          <div className="p-2 max-h-[36vh] overflow-y-auto no-scrollbar bg-[#04060a]/95 transition-all">
            {mobileTab === 'combat' && (
              <CombatDeckPanel
                ship={selectedShip}
                telemetry={flightTelemetry}
                visionMode={visionMode}
                onVisionModeChange={handleSelectVisionMode}
                onSelectVisionMode={handleSelectVisionMode}
                onSetFlightMode={handleSelectFlightMode}
                onSelectFlightMode={handleSelectFlightMode}
                onFirePrimary={handleFirePrimary}
                onFireSecondary={handleFireSecondary}
                onBoost={handleBoost}
                onActivateShield={handleShield}
                onShield={handleShield}
                onTriggerSpecial={handleSpecial}
                onSpecial={handleSpecial}
                onOpenHangar={() => setIsShipGalleryOpen(true)}
                onOpenShipGallery={() => setIsShipGalleryOpen(true)}
                targets={combatTargets}
                lockedTarget={lockedTarget}
                nearestTarget={lockedTarget}
                onSelectTarget={(t) => {
                  setLockedTarget(t);
                  audioSynth.playLockOn();
                }}
                onLockNextTarget={() => {
                  const alive = combatTargets.filter(t => !t.isDestroyed);
                  if (alive.length > 0) {
                    const idx = alive.findIndex(t => t.id === lockedTarget?.id);
                    const next = alive[(idx + 1) % alive.length];
                    setLockedTarget(next);
                    audioSynth.playLockOn();
                  }
                }}
                cameraMode={cameraMode}
                onCameraModeChange={(mode) => setCameraMode(mode)}
                onToggleCameraMode={() => {
                  setCameraMode(cameraMode === 'chase-ship' ? 'cockpit-ship' : cameraMode === 'cockpit-ship' ? 'follow-shadow' : 'chase-ship');
                }}
                isMuted={audioSynth.getIsMuted()}
                onToggleSound={() => audioSynth.toggleMute()}
              />
            )}
            {mobileTab === 'telemetry' && (
              <TelemetryPanel
                selectedStation={activeStation}
                telemetry={telemetry}
                onSelectStation={handleSelectStation}
                onClearCustomPin={() => {
                  setCustomStation(null);
                  setSelectedStation(OBSERVATION_STATIONS[1]);
                }}
                trackingMode={trackingMode}
                onSelectTrackingMode={handleSelectTrackingMode}
                isAutoTracking={trackingMode === 'auto'}
                onToggleAutoTrack={() => handleSelectTrackingMode(trackingMode === 'auto' ? 'manual' : 'auto')}
              />
            )}
            {mobileTab === 'sky' && (
              <SkyViewPanel
                selectedStation={activeStation}
                telemetry={telemetry}
                currentTimestamp={currentTimestamp}
              />
            )}
            {mobileTab === 'timeline' && (
              <PathTimelinePanel
                currentTimestamp={currentTimestamp}
                onSelectMilestone={handleJumpToMilestone}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Scrubber Bar */}
      <TimelineScrubber
        currentTimestamp={currentTimestamp}
        isPlaying={isPlaying}
        speedMultiplier={speedMultiplier}
        onTimeChange={setCurrentTimestamp}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSpeedChange={setSpeedMultiplier}
        onJumpToMilestone={handleJumpToMilestone}
      />

      {/* 4. Spaceship Fleet Hangar Modal */}
      <SpaceshipGalleryModal
        isOpen={isShipGalleryOpen}
        onClose={() => setIsShipGalleryOpen(false)}
        selectedShip={selectedShip}
        onSelectShip={handleSelectShip}
      />

      {/* 5. Data Sources & Attributions Modal */}
      <AttributionModal
        isOpen={isAttributionModalOpen}
        onClose={() => setIsAttributionModalOpen(false)}
      />
    </div>
  );
}
