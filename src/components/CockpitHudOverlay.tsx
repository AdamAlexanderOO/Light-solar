import React from 'react';
import { SpaceshipModel, FlightTelemetry, CombatTarget, VisionFusionMode } from '../types/spaceship';
import { Crosshair, Shield, Zap, Target, Flame, Compass } from 'lucide-react';

interface CockpitHudOverlayProps {
  ship: SpaceshipModel;
  telemetry: FlightTelemetry;
  visionMode: VisionFusionMode;
  lockedTarget: CombatTarget | null;
  cameraMode: 'chase-ship' | 'cockpit-ship' | string;
  onFirePrimary: () => void;
  onFireSecondary: () => void;
  onBoost: () => void;
  onToggleCamera: () => void;
}

export const CockpitHudOverlay: React.FC<CockpitHudOverlayProps> = ({
  ship,
  telemetry,
  visionMode,
  lockedTarget,
  cameraMode,
  onFirePrimary,
  onFireSecondary,
  onBoost,
  onToggleCamera
}) => {
  const isCockpit = cameraMode === 'cockpit-ship';

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 overflow-hidden z-20 font-mono">
      
      {/* Top Banner: Flight Mode & Horizon Tape */}
      <div className="flex items-center justify-between w-full">
        {/* Left: Ship ID & Vision System */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-white tracking-wider">{ship.callsign}</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-300 uppercase text-[10px]">{visionMode} VISION</span>
        </div>

        {/* Center: Compass Heading Tape */}
        <div className="hidden sm:flex flex-col items-center bg-black/60 backdrop-blur-md px-6 py-1.5 rounded-lg border border-white/20">
          <div className="flex items-center gap-4 text-xs font-bold text-cyan-300">
            <span className="text-slate-500">{((Math.round(telemetry.headingDeg) - 30 + 360) % 360).toString().padStart(3, '0')}°</span>
            <span className="text-slate-300">{((Math.round(telemetry.headingDeg) - 15 + 360) % 360).toString().padStart(3, '0')}°</span>
            <span className="text-amber-400 text-sm font-black border-b-2 border-amber-400 pb-0.5">
              {Math.round(telemetry.headingDeg).toString().padStart(3, '0')}° N
            </span>
            <span className="text-slate-300">{((Math.round(telemetry.headingDeg) + 15) % 360).toString().padStart(3, '0')}°</span>
            <span className="text-slate-500">{((Math.round(telemetry.headingDeg) + 30) % 360).toString().padStart(3, '0')}°</span>
          </div>
        </div>

        {/* Right: Camera Mode & Cockpit Toggle */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs">
          <span className="text-slate-400">VIEW:</span>
          <span className="font-bold text-amber-300 uppercase">{isCockpit ? 'COCKPIT CANOPY' : 'CHASE ORBIT'}</span>
          <button
            onClick={onToggleCamera}
            className="pointer-events-auto ml-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white border border-white/20 uppercase"
          >
            [C]
          </button>
        </div>
      </div>

      {/* Center: HUD Crosshair & Pitch Ladder */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Cockpit Canopy Tint Vignette in First-Person */}
        {isCockpit && (
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)] border-[3px] border-cyan-500/10 rounded-3xl" />
        )}

        {/* Central Tactical Reticle */}
        <div className="relative flex items-center justify-center">
          {/* Outer circle */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-cyan-400/30 border-dashed animate-[spin_60s_linear_infinite]" />
          
          {/* Inner reticle bracket */}
          <div className="absolute w-12 h-12 sm:w-16 sm:h-16 border-2 border-cyan-400/60 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
            <div className="absolute -top-3 w-0.5 h-2 bg-cyan-400/80" />
            <div className="absolute -bottom-3 w-0.5 h-2 bg-cyan-400/80" />
            <div className="absolute -left-3 w-2 h-0.5 bg-cyan-400/80" />
            <div className="absolute -right-3 w-2 h-0.5 bg-cyan-400/80" />
          </div>

          {/* Artificial Horizon Pitch Ladder Lines */}
          <div className="absolute flex flex-col gap-5 opacity-40">
            <div className="flex items-center gap-8">
              <div className="w-8 h-0.5 bg-cyan-300" />
              <span className="text-[9px] text-cyan-300">+10°</span>
              <div className="w-8 h-0.5 bg-cyan-300" />
            </div>
            <div className="flex items-center gap-12">
              <div className="w-12 h-0.5 bg-amber-400" />
              <div className="w-12 h-0.5 bg-amber-400" />
            </div>
            <div className="flex items-center gap-8">
              <div className="w-8 h-0.5 bg-cyan-300" />
              <span className="text-[9px] text-cyan-300">-10°</span>
              <div className="w-8 h-0.5 bg-cyan-300" />
            </div>
          </div>

          {/* Locked Target Bracket */}
          {lockedTarget && (
            <div className="absolute -top-20 -right-24 bg-red-950/70 border border-red-500/80 p-2 rounded text-[10px] text-red-200 backdrop-blur-sm animate-pulse flex flex-col gap-0.5 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <div className="flex items-center gap-1.5 font-bold text-red-400 uppercase">
                <Target className="w-3 h-3" />
                <span>LOCK: {lockedTarget.name}</span>
              </div>
              <div className="text-slate-300">
                DIST: <strong>{lockedTarget.distanceKm} km</strong>
              </div>
              <div className="w-28 h-1 bg-black/50 rounded overflow-hidden mt-1">
                <div 
                  className="h-full bg-red-500 rounded" 
                  style={{ width: `${(lockedTarget.health / lockedTarget.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Speed Ladder (Left Tape) */}
        <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/15 flex flex-col gap-1 text-[10px]">
          <span className="text-slate-400 text-[8px] uppercase">VELOCITY</span>
          <span className="text-emerald-400 font-bold text-xs">M {telemetry.speedMach.toFixed(1)}</span>
          <div className="w-1.5 h-20 bg-black/80 rounded-full overflow-hidden border border-white/10 my-1">
            <div 
              className="w-full bg-emerald-400 rounded-full" 
              style={{ height: `${Math.min(100, (telemetry.speedMach / 40) * 100)}%` }} 
            />
          </div>
          <span className="text-slate-400 text-[8px]">{(telemetry.speedMach * 1225).toFixed(0)} km/h</span>
        </div>

        {/* Altitude Ladder (Right Tape) */}
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/15 flex flex-col gap-1 text-[10px] items-end">
          <span className="text-slate-400 text-[8px] uppercase">ORBIT ALT</span>
          <span className="text-cyan-400 font-bold text-xs">{Math.round(telemetry.altitudeKm)} KM</span>
          <div className="w-1.5 h-20 bg-black/80 rounded-full overflow-hidden border border-white/10 my-1">
            <div 
              className="w-full bg-cyan-400 rounded-full" 
              style={{ height: `${Math.min(100, (telemetry.altitudeKm / 300) * 100)}%` }} 
            />
          </div>
          <span className="text-slate-400 text-[8px]">LEO PATH</span>
        </div>
      </div>

      {/* Bottom Bar: Weapon Status & Action Controls */}
      <div className="flex items-end justify-between w-full">
        {/* Left: Shield & Hull Micro Gauges */}
        <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 text-xs">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <div>
              <span className="text-[9px] text-slate-400 block">SHIELD</span>
              <span className="font-bold text-cyan-300">{Math.round(telemetry.shields)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-[9px] text-slate-400 block">HULL</span>
              <span className="font-bold text-emerald-300">{Math.round(telemetry.hullIntegrity)}%</span>
            </div>
          </div>
        </div>

        {/* Center: Controls Keyboard Legend */}
        <div className="hidden md:flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/20 text-[10px] text-slate-300">
          <span><strong className="text-white">[W/A/S/D]</strong> Steer</span>
          <span><strong className="text-cyan-300">[SPACE]</strong> Laser</span>
          <span><strong className="text-amber-300">[E]</strong> Torpedo</span>
          <span><strong className="text-orange-300">[SHIFT]</strong> Boost</span>
          <span><strong className="text-purple-300">[Q]</strong> Shield</span>
          <span><strong className="text-emerald-300">[C]</strong> Camera</span>
        </div>

        {/* Right: Arcade Score & Touch Fire Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onFirePrimary}
            className="px-3 py-2 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400 text-white font-bold text-xs uppercase flex items-center gap-1 active:scale-95 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fire [SPACE]</span>
          </button>

          <button
            onClick={onFireSecondary}
            className="px-3 py-2 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400 text-white font-bold text-xs uppercase flex items-center gap-1 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Torpedo [E]</span>
          </button>

          <button
            onClick={onBoost}
            className="px-2.5 py-2 rounded-lg bg-orange-500/30 hover:bg-orange-500/50 border border-orange-400 text-white font-bold text-xs uppercase flex items-center gap-1 active:scale-95"
            title="Afterburner Boost"
          >
            <span>Boost</span>
          </button>
        </div>
      </div>

    </div>
  );
};
