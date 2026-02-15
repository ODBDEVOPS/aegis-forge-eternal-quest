
import React from 'react';
import { ResourceType } from '../types';
import { RefreshCcw, Star, Zap } from 'lucide-react';
import { INITIAL_RESOURCES } from '../constants';

interface PrestigeViewProps {
  stage: number;
  setStage: (stage: number) => void;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceType, number>>>;
}

const PrestigeView: React.FC<PrestigeViewProps> = ({ stage, setStage, setResources }) => {
  const crystalGain = Math.floor(stage / 10);

  const handleReset = () => {
    if (stage < 20) return;
    setResources(prev => ({
      ...INITIAL_RESOURCES,
      [ResourceType.CRYSTAL]: prev[ResourceType.CRYSTAL] + crystalGain
    }));
    setStage(1);
  };

  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-10">
      <div className="w-24 h-24 rounded-full bg-cyan-950/30 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 neon-border animate-pulse">
        <RefreshCcw size={48} />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-orbitron text-cyan-400">Temporal Reset</h2>
        <p className="text-sm text-slate-400 px-6 leading-relaxed">
          Sacrifice current progress to reconstruct the timeline with advanced technology.
        </p>
      </div>

      <div className="w-full glass p-6 rounded-2xl border border-cyan-900/50 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-orbitron">Current Stage Bonus</span>
          <span className="text-cyan-400 font-bold">+{crystalGain} Crystals</span>
        </div>
        
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500" 
            style={{ width: `${Math.min(100, (stage/100)*100)}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <p className="text-[10px] text-slate-500 uppercase font-orbitron">Permanent Unlocks Required</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-slate-800 text-[10px] rounded border border-slate-700 opacity-50 italic">None Active</span>
          </div>
        </div>
      </div>

      <button 
        disabled={stage < 20}
        onClick={handleReset}
        className={`w-full max-w-xs py-4 rounded-xl font-orbitron transition-all relative overflow-hidden group ${
          stage >= 20 
            ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95' 
            : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {stage < 20 ? `LOCKED (REACH STG 20)` : 'INITIATE RESET'}
        </span>
      </button>

      <div className="flex items-center gap-2 text-xs text-slate-500 italic mt-4">
        <Star size={14} className="text-yellow-500" /> All items will be recycled. Hero ranks persist.
      </div>
    </div>
  );
};

export default PrestigeView;
