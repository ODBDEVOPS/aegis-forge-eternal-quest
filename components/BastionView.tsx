
import React from 'react';
import { REGIONS, POIS } from '../constants';
import { ResourceType, Region, POI } from '../types';
import { MapPin, ArrowRight, Zap, ShieldAlert, Lock, TrendingUp, Pickaxe, Hammer, Crosshair } from 'lucide-react';

interface BastionViewProps {
  currentRegion: Region;
  setCurrentRegion: (region: Region) => void;
  resources: Record<ResourceType, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceType, number>>>;
  addLog: (msg: string) => void;
  stage: number;
  conqueredPoiIds: Set<string>;
  setConqueredPoiIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const BastionView: React.FC<BastionViewProps> = ({ 
  currentRegion, setCurrentRegion, resources, setResources, addLog, stage, conqueredPoiIds, setConqueredPoiIds 
}) => {
  const moveCost = 25;

  const handleTravel = (region: Region) => {
    if (resources[ResourceType.FUEL] < moveCost || stage < region.requiredStage) return;
    setResources(prev => ({ ...prev, [ResourceType.FUEL]: prev[ResourceType.FUEL] - moveCost }));
    setCurrentRegion(region);
    addLog(`Bastion jumped to sector: ${region.name}.`);
  };

  const conquerPOI = (poiId: string) => {
    setConqueredPoiIds(prev => {
      const next = new Set(prev);
      next.add(poiId);
      return next;
    });
    addLog(`POI Conquered: Automated resource extraction active.`);
  };

  const currentRegionPois = POIS.filter(p => p.regionId === currentRegion.id);

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <MapPin className="text-pink-500" size={20} />
        <h2 className="text-lg font-orbitron text-pink-500 uppercase tracking-wider">Tactical Navigation</h2>
      </div>

      <div className="glass p-4 rounded-xl border border-pink-500/30 relative overflow-hidden group">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-orbitron mb-1">Active Sector</div>
            <div className="text-xl font-bold text-slate-100 neon-text">{currentRegion.name}</div>
            <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Yield Mult: {currentRegion.multiplier}x</span>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] text-slate-500 uppercase font-orbitron">Jump Cost</div>
             <div className="flex items-center gap-1 justify-end text-pink-400 font-bold font-orbitron"><Zap size={14} /> {moveCost}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-orbitron text-slate-500 uppercase flex items-center gap-2"><Crosshair size={12} /> Regional POIs</h3>
        <div className="grid grid-cols-1 gap-2">
          {currentRegionPois.map(poi => {
            const isConquered = conqueredPoiIds.has(poi.id);
            return (
              <div key={poi.id} className={`p-3 rounded-lg border flex justify-between items-center ${isConquered ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{poi.name}</h4>
                  <p className="text-[10px] text-slate-500">Yields: {poi.ratePerHour} {poi.resourceProduced}/hr</p>
                </div>
                {isConquered ? (
                  <span className="text-[10px] font-orbitron text-emerald-400 uppercase">Automated</span>
                ) : (
                  <button onClick={() => conquerPOI(poi.id)} className="px-3 py-1 bg-cyan-600 text-white text-[10px] font-orbitron rounded hover:bg-cyan-500 transition-colors uppercase">Conquer</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-orbitron text-slate-500 uppercase">Jump Destinations</h3>
        {REGIONS.map(region => {
          const isLocked = stage < region.requiredStage;
          const isCurrent = currentRegion.id === region.id;
          return (
            <div key={region.id} className={`p-3 rounded-xl border relative transition-all duration-300 ${isCurrent ? 'bg-pink-950/20 border-pink-500/50' : isLocked ? 'bg-slate-900/50 border-slate-800/50 opacity-60' : 'bg-slate-900 border-slate-700 hover:border-pink-500/30'}`}>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${isCurrent ? 'text-pink-400' : 'text-slate-200'}`}>{region.name}</h3>
                    {isLocked && <Lock size={12} className="text-slate-600" />}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-orbitron"><TrendingUp size={10} /> {region.multiplier}x</div>
                    <div className="text-[9px] text-slate-500 uppercase font-orbitron">REQ. STG {region.requiredStage}</div>
                  </div>
                </div>
                {!isCurrent && !isLocked && (
                  <button disabled={resources[ResourceType.FUEL] < moveCost} onClick={() => handleTravel(region)} className={`p-2 rounded-lg border transition-all ${resources[ResourceType.FUEL] >= moveCost ? 'border-pink-500/50 bg-pink-500/10 text-pink-400' : 'border-slate-800 text-slate-700'}`}><ArrowRight size={16} /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BastionView;
