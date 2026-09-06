import React from 'react';
import { 
  Shield, 
  Zap, 
  Crosshair, 
  Flame, 
  Gauge, 
  Eye, 
  Compass, 
  Volume2, 
  VolumeX, 
  Camera, 
  Layers, 
  RotateCw, 
  Target, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SpaceshipModel, FlightTelemetry, VisionFusionMode, CombatTarget } from '../types/spaceship';
import { audioSynth } from '../utils/audioSynth';

interface CombatDeckPanelProps {
  ship: SpaceshipModel;
  telemetry: FlightTelemetry;
  visionMode: VisionFusionMode;
  onVisionModeChange?: (mode: VisionFusionMode) => void;
  onSelectVisionMode?: (mode: VisionFusionMode) => void;
  cameraMode?: 'free' | 'follow-shadow' | 'focused-station' | 'top-down' | 'spain-fixed' | 'chase-ship' | 'cockpit-ship' | string;
  onCameraModeChange?: (mode: any) => void;
  onToggleCameraMode?: () => void;
  onFirePrimary: () => void;
  onFireSecondary: () => void;
  onBoost: () => void;
  onActivateShield?: () => void;
  onShield?: () => void;
  onTriggerSpecial?: () => void;
  onSpecial?: () => void;
  onOpenHangar?: () => void;
  onOpenShipGallery?: () => void;
  nearestTarget?: CombatTarget | null;
  lockedTarget?: CombatTarget | null;
  targets?: CombatTarget[];
  onLockNextTarget?: () => void;
  onSelectTarget?: (target: CombatTarget) => void;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onSetFlightMode?: (mode: 'auto-patrol' | 'manual-pilot' | 'intercept-target') => void;
  onSelectFlightMode?: (mode: 'auto-patrol' | 'manual-pilot' | 'intercept-target') => void;
  onClose?: () => void;
}

export const CombatDeckPanel: React.FC<CombatDeckPanelProps> = ({
  ship,
  telemetry,
  visionMode,
  onVisionModeChange,
  onSelectVisionMode,
  cameraMode = 'chase-ship',
  onCameraModeChange,
  onToggleCameraMode,
  onFirePrimary,
  onFireSecondary,
  onBoost,
  onActivateShield,
  onShield,
  onTriggerSpecial,
  onSpecial,
  onOpenHangar,
  onOpenShipGallery,
  nearestTarget,
  lockedTarget,
  targets,
  onLockNextTarget,
  onSelectTarget,
  isMuted = false,
  onToggleSound,
  onSetFlightMode,
  onSelectFlightMode,
  onClose
}) => {
  const handleVisionChange = (mode: VisionFusionMode) => {
    if (typeof onVisionModeChange === 'function') {
      onVisionModeChange(mode);
    } else if (typeof onSelectVisionMode === 'function') {
      onSelectVisionMode(mode);
    }
  };

  const handleShield = () => {
    if (typeof onActivateShield === 'function') onActivateShield();
    else if (typeof onShield === 'function') onShield();
  };

  const handleSpecial = () => {
    if (typeof onTriggerSpecial === 'function') onTriggerSpecial();
    else if (typeof onSpecial === 'function') onSpecial();
  };

  const handleOpenHangar = () => {
    if (typeof onOpenHangar === 'function') onOpenHangar();
    else if (typeof onOpenShipGallery === 'function') onOpenShipGallery();
  };

  const handleFlightMode = (mode: 'auto-patrol' | 'manual-pilot' | 'intercept-target') => {
    if (typeof onSetFlightMode === 'function') onSetFlightMode(mode);
    else if (typeof onSelectFlightMode === 'function') onSelectFlightMode(mode);
  };

  const handleCameraChange = (newMode: any) => {
    if (typeof onCameraModeChange === 'function') onCameraModeChange(newMode);
    else if (typeof onToggleCameraMode === 'function') onToggleCameraMode();
  };

  const activeTarget = lockedTarget || nearestTarget || (targets && targets.find(t => !t.isDestroyed)) || null;

  const handleLockCycle = () => {
    if (typeof onLockNextTarget === 'function') {
      onLockNextTarget();
    } else if (typeof onSelectTarget === 'function' && targets && targets.length > 0) {
      const aliveTargets = targets.filter(t => !t.isDestroyed);
      if (aliveTargets.length === 0) return;
      const currentIndex = aliveTargets.findIndex(t => t.id === activeTarget?.id);
      const nextIndex = (currentIndex + 1) % aliveTargets.length;
      onSelectTarget(aliveTargets[nextIndex]);
    }
  };
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm font-sans select-none animate-in fade-in duration-200">
      
      {/* 1. Spaceship Status Card (Gallery Style) */}
      <div className="bg-[#050505]/95 border border-white/15 rounded-xl p-3.5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow Accent Header */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: ship.badgeColor, boxShadow: `0 0 10px ${ship.badgeColor}` }}
        />

        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: ship.badgeColor }}
            />
            <div>
              <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                {ship.name}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                {ship.class}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenHangar}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-all"
              title="Switch Spacecraft in Hangar"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Hangar</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white text-[10px] font-mono uppercase transition-all"
                title="Minimize Combat Deck"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Vital Health & Shield Gauges */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 font-mono text-[11px]">
          {/* Shields */}
          <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                <Shield className="w-3 h-3 text-cyan-400" /> SHIELDS
              </span>
              <span className={`font-bold ${telemetry.shields < 30 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {Math.round(telemetry.shields)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, telemetry.shields))}%` }}
              />
            </div>
          </div>

          {/* Hull Integrity */}
          <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                <Zap className="w-3 h-3 text-emerald-400" /> HULL
              </span>
              <span className={`font-bold ${telemetry.hullIntegrity < 40 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {Math.round(telemetry.hullIntegrity)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, telemetry.hullIntegrity))}%` }}
              />
            </div>
          </div>

          {/* Weapon Heat / Capacitor */}
          <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                <Flame className="w-3 h-3 text-amber-400" /> OVERHEAT
              </span>
              <span className={`font-bold ${telemetry.overheat > 80 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                {Math.round(telemetry.overheat)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className={`h-full rounded-full transition-all duration-150 ${
                  telemetry.overheat > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, telemetry.overheat))}%` }}
              />
            </div>
          </div>

          {/* Reactor Energy */}
          <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                <Gauge className="w-3 h-3 text-purple-400" /> REACTOR
              </span>
              <span className="font-bold text-purple-400">
                {Math.round(telemetry.energy)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, telemetry.energy))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flight Navigation Telemetry */}
        <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div className="bg-black/40 p-1.5 rounded">
            <span className="text-slate-400 block text-[9px]">ALTITUDE</span>
            <span className="font-bold text-cyan-300">{Math.round(telemetry.altitudeKm)} km</span>
          </div>
          <div className="bg-black/40 p-1.5 rounded">
            <span className="text-slate-400 block text-[9px]">VELOCITY</span>
            <span className="font-bold text-amber-300">Mach {telemetry.speedMach.toFixed(1)}</span>
          </div>
          <div className="bg-black/40 p-1.5 rounded">
            <span className="text-slate-400 block text-[9px]">HEADING</span>
            <span className="font-bold text-emerald-300">{Math.round(telemetry.headingDeg)}° N</span>
          </div>
        </div>
      </div>

      {/* 2. Light Vision Fusion Control Switcher */}
      <div className="bg-[#050505]/95 border border-white/15 rounded-xl p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Light Vision Fusion Array
          </span>
          <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
            Optic Matrix
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => {
              audioSynth.playVisionSwitch();
              handleVisionChange('standard');
            }}
            className={`px-2 py-1.5 rounded text-left transition-all border ${
              visionMode === 'standard'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="font-bold block">Standard</span>
            <span className="text-[8px] opacity-70 block">True Optical</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playVisionSwitch();
              handleVisionChange('fusion-corona');
            }}
            className={`px-2 py-1.5 rounded text-left transition-all border ${
              visionMode === 'fusion-corona'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="font-bold block">Corona Fusion</span>
            <span className="text-[8px] opacity-70 block">Solar Flare HDR</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playVisionSwitch();
              handleVisionChange('thermal-infrared');
            }}
            className={`px-2 py-1.5 rounded text-left transition-all border ${
              visionMode === 'thermal-infrared'
                ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="font-bold block">Infrared FLIR</span>
            <span className="text-[8px] opacity-70 block">Thermal Heat</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playVisionSwitch();
              handleVisionChange('cyber-radar');
            }}
            className={`px-2 py-1.5 rounded text-left transition-all border ${
              visionMode === 'cyber-radar'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="font-bold block">Cyber Radar</span>
            <span className="text-[8px] opacity-70 block">Tactical Grid</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playVisionSwitch();
              handleVisionChange('ultraviolet-aurora');
            }}
            className={`px-2 py-1.5 rounded text-left transition-all border col-span-2 sm:col-span-1 ${
              visionMode === 'ultraviolet-aurora'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-sm'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="font-bold block">UV Aurora Flux</span>
            <span className="text-[8px] opacity-70 block">Cosmic Magneto</span>
          </button>
        </div>
      </div>

      {/* 3. Arcade Combat Deck & Targeting System */}
      <div className="bg-[#050505]/95 border border-white/15 rounded-xl p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] font-mono uppercase font-bold text-white tracking-wider">
              Arcade Combat Deck
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-slate-400">SCORE:</span>
            <span className="font-bold text-amber-400">{telemetry.score}</span>
            {telemetry.comboMultiplier > 1 && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                {telemetry.comboMultiplier.toFixed(1)}x
              </span>
            )}
          </div>
        </div>

        {/* Nearest Target Readout */}
        <div className="p-2 rounded bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 overflow-hidden">
            <Target className={`w-4 h-4 shrink-0 ${activeTarget ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase block leading-none">LOCKED HAZARD</span>
              <span className="font-bold text-white text-[11px] truncate block">
                {activeTarget ? activeTarget.name : 'No Target in Range'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              audioSynth.playLockOn();
              handleLockCycle();
            }}
            className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-cyan-300 hover:text-white shrink-0 ml-2"
            title="Cycle Target Lock"
          >
            Lock [TAB]
          </button>
        </div>

        {/* Primary & Secondary Weapons Fire Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Primary Weapon */}
          <button
            onClick={onFirePrimary}
            disabled={telemetry.overheat >= 100}
            className={`p-2.5 rounded-lg border font-mono font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              telemetry.overheat >= 100
                ? 'bg-red-950/40 border-red-500/40 text-red-400 cursor-not-allowed'
                : 'bg-gradient-to-b from-cyan-500/30 to-blue-600/30 hover:from-cyan-500/40 hover:to-blue-600/40 border-cyan-400/60 text-white shadow-[0_0_15px_rgba(0,242,254,0.2)]'
            }`}
          >
            <span className="flex items-center gap-1 text-cyan-300">
              <Zap className="w-3.5 h-3.5" /> FIRE PRIMARY
            </span>
            <span className="text-[9px] text-slate-400 font-normal font-sans">
              [SPACE] or Click
            </span>
          </button>

          {/* Secondary Torpedo */}
          <button
            onClick={onFireSecondary}
            className="p-2.5 rounded-lg border border-amber-400/60 bg-gradient-to-b from-amber-500/30 to-orange-600/30 hover:from-amber-500/40 hover:to-orange-600/40 text-white font-mono font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all active:scale-95"
          >
            <span className="flex items-center gap-1 text-amber-300">
              <Crosshair className="w-3.5 h-3.5" /> TORPEDO
            </span>
            <span className="text-[9px] text-slate-400 font-normal font-sans">
              [E] High-Yield
            </span>
          </button>
        </div>

        {/* Afterburner Boost & Special Ability */}
        <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
          <button
            onClick={onBoost}
            className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white flex items-center justify-center gap-1.5 uppercase font-bold tracking-wider transition-all"
          >
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Afterburner [SHIFT]</span>
          </button>

          <button
            onClick={handleSpecial}
            className="p-2 rounded bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 hover:text-white flex items-center justify-center gap-1.5 uppercase font-bold tracking-wider transition-all"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{ship.specialAbility.name} [R]</span>
          </button>
        </div>

        {/* Camera Views & Audio Toggle */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[10px]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCameraChange(cameraMode === 'chase-ship' ? 'cockpit-ship' : 'chase-ship')}
              className={`px-2 py-1 rounded border flex items-center gap-1 uppercase transition-all ${
                cameraMode === 'chase-ship' || cameraMode === 'cockpit-ship'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
              title="Toggle Cockpit or Chase Camera"
            >
              <Camera className="w-3 h-3" />
              <span>{cameraMode === 'cockpit-ship' ? 'Cockpit Cam' : 'Chase Cam'} [C]</span>
            </button>

            <button
              onClick={() => handleCameraChange('follow-shadow')}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white uppercase"
              title="Planet Overview"
            >
              Globe
            </button>
          </div>

          <button
            onClick={() => {
              if (onToggleSound) onToggleSound();
              else audioSynth.toggleMute();
            }}
            className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            title={isMuted ? 'Unmute Combat Audio' : 'Mute Combat Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        {/* Flight Autopilot vs Manual Pilot Switcher */}
        <div className="grid grid-cols-3 gap-1 font-mono text-[9px] pt-1">
          <button
            onClick={() => handleFlightMode('auto-patrol')}
            className={`py-1 rounded text-center border uppercase transition-all ${
              telemetry.flightMode === 'auto-patrol'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Auto Patrol
          </button>
          <button
            onClick={() => handleFlightMode('manual-pilot')}
            className={`py-1 rounded text-center border uppercase transition-all ${
              telemetry.flightMode === 'manual-pilot'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Manual Pilot
          </button>
          <button
            onClick={() => handleFlightMode('intercept-target')}
            className={`py-1 rounded text-center border uppercase transition-all ${
              telemetry.flightMode === 'intercept-target'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-white/5 text-slate-400 border-transparent hover:text-white'
            }`}
          >
            Intercept
          </button>
        </div>

      </div>

    </div>
  );
};
