import React from 'react';
import { X, Shield, Zap, Crosshair, Gauge, Eye, Play, Sparkles, Radio } from 'lucide-react';
import { SpaceshipModel } from '../types/spaceship';
import { SPACESHIP_FLEET } from '../data/spaceshipData';
import { audioSynth } from '../utils/audioSynth';

interface SpaceshipGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedShip: SpaceshipModel;
  onSelectShip: (ship: SpaceshipModel) => void;
  onDeployShip?: (ship: SpaceshipModel) => void;
}

export const SpaceshipGalleryModal: React.FC<SpaceshipGalleryModalProps> = ({
  isOpen,
  onClose,
  selectedShip,
  onSelectShip,
  onDeployShip,
}) => {
  if (!isOpen) return null;

  const handleDeploy = (ship: SpaceshipModel) => {
    if (onDeployShip) {
      onDeployShip(ship);
    } else {
      onSelectShip(ship);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#050505] border border-white/20 rounded-xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-white/15 bg-gradient-to-r from-black via-[#080d1a] to-black">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-mono tracking-wider uppercase text-white">
                  Orbital Spaceship Hangar & Gallery
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  4 Classes Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Select your orbital spacecraft for planetary patrol, Light Vision Fusion, and combat arcade.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioSynth.playLaser('laser');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Close Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two columns (Ship Cards Grid on left, Selected Ship Deep Blueprint on right) */}
        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* Left Column: Ship Selection Cards (Gallery Grid) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col gap-3.5 bg-black/60 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
              <span>Hangar Manifest</span>
              <span>Class Specs</span>
            </div>

            {SPACESHIP_FLEET.map((ship) => {
              const isSelected = selectedShip.id === ship.id;
              return (
                <div
                  key={ship.id}
                  onClick={() => {
                    audioSynth.playLaser('plasma');
                    onSelectShip(ship);
                  }}
                  className={`relative p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer text-left group ${
                    isSelected
                      ? 'bg-white/10 border-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.2)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
                  }`}
                >
                  {/* Active Indicator Strip */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full animate-pulse" 
                          style={{ backgroundColor: ship.badgeColor }} 
                        />
                        <h3 className="font-mono font-bold text-sm text-white tracking-wide">
                          {ship.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 uppercase mt-0.5 block">
                        {ship.class}
                      </span>
                    </div>

                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{ 
                        color: ship.badgeColor, 
                        backgroundColor: `${ship.badgeColor}1a`, 
                        border: `1px solid ${ship.badgeColor}40` 
                      }}
                    >
                      {ship.callsign}
                    </span>
                  </div>

                  {/* Stat Micro-Gauges */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-white/10 text-center font-mono text-[10px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">PWR</span>
                      <span className="font-bold text-amber-300">{ship.stats.firepower}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">SHD</span>
                      <span className="font-bold text-cyan-300">{ship.stats.shields}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">SPD</span>
                      <span className="font-bold text-emerald-300">M{ship.stats.topSpeedMach}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">AGL</span>
                      <span className="font-bold text-purple-300">{ship.stats.handling}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Ship Deep Blueprint & Deployment Deck */}
          <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-[#0a0f1d] via-[#050811] to-[#04060c]">
            <div className="flex flex-col gap-5">
              
              {/* Ship Title & Role */}
              <div className="flex flex-col gap-1 pb-4 border-b border-white/15">
                <div className="flex items-center justify-between">
                  <span 
                    className="px-2.5 py-0.5 rounded font-mono text-xs uppercase tracking-widest font-bold"
                    style={{ 
                      color: selectedShip.badgeColor, 
                      backgroundColor: `${selectedShip.badgeColor}20`,
                      border: `1px solid ${selectedShip.badgeColor}50`
                    }}
                  >
                    {selectedShip.callsign} // {selectedShip.class}
                  </span>
                  <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    SYSTEMS READY
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white mt-1">
                  {selectedShip.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedShip.flavor}
                </p>
              </div>

              {/* Comprehensive Stat Radars */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  Tactical Performance Matrix
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Crosshair className="w-3 h-3 text-amber-400" /> Firepower</span>
                      <span className="text-amber-400 font-bold">{selectedShip.stats.firepower}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedShip.stats.firepower}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Shields</span>
                      <span className="text-cyan-400 font-bold">{selectedShip.stats.shields}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedShip.stats.shields}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-400" /> Speed</span>
                      <span className="text-emerald-400 font-bold">{selectedShip.stats.speed}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedShip.stats.speed}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-purple-400" /> Sensor</span>
                      <span className="text-purple-400 font-bold">{selectedShip.stats.sensorRange}km</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(selectedShip.stats.sensorRange / 5000) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weapon Systems & Special Ability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Primary Weapon */}
                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Primary System</span>
                    <span className="text-cyan-400 font-bold uppercase">{selectedShip.primaryWeapon.type}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">
                    {selectedShip.primaryWeapon.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Yield: <strong className="text-slate-200">{selectedShip.primaryWeapon.damage} DPS</strong></span>
                    <span>Cycle: <strong className="text-slate-200">{selectedShip.primaryWeapon.fireRateHz} Hz</strong></span>
                  </div>
                </div>

                {/* Secondary Weapon */}
                <div className="p-3.5 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Secondary Ordnance</span>
                    <span className="text-amber-400 font-bold uppercase">{selectedShip.secondaryWeapon.type}</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">
                    {selectedShip.secondaryWeapon.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Impact: <strong className="text-slate-200">{selectedShip.secondaryWeapon.damage} DMG</strong></span>
                    <span>Payload: <strong className="text-slate-200">Orbital Grade</strong></span>
                  </div>
                </div>
              </div>

              {/* Special Ability Banner */}
              <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <div className="p-2 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs uppercase text-cyan-300">Special System:</span>
                    <span className="font-mono font-bold text-xs text-white">{selectedShip.specialAbility.name}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                    {selectedShip.specialAbility.description}
                  </p>
                </div>
              </div>

            </div>

            {/* Deployment Action Bar */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                <span>ACTIVE CALLSIGN: </span>
                <strong className="text-cyan-400">{selectedShip.callsign}</strong>
              </div>

              <button
                onClick={() => {
                  audioSynth.playBoost();
                  handleDeploy(selectedShip);
                }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Deploy Spacecraft to Orbit</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
