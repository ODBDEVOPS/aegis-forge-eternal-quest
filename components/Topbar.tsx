
import React from 'react';
import { ResourceType } from '../types';
import { Coins, Pickaxe, Trees, Zap } from 'lucide-react';

interface TopbarProps {
  resources: Record<ResourceType, number>;
  level: number;
  stage: number;
}

const Topbar: React.FC<TopbarProps> = ({ resources, level, stage }) => {
  return (
    <header className="glass border-b border-cyan-900/50 p-3 sticky top-0 z-40">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded bg-slate-900 border border-cyan-500/50 flex items-center justify-center font-orbitron text-xs text-cyan-400">
            {level}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-orbitron uppercase leading-none">Aegis Core</div>
            <div className="text-sm font-bold text-cyan-400">STAGE {stage}</div>
          </div>
        </div>
        <div className="flex gap-3">
           <ResourceItem icon={<Coins size={14} />} value={resources[ResourceType.GOLD]} color="text-yellow-400" />
           <ResourceItem icon={<Zap size={14} />} value={resources[ResourceType.FUEL]} color="text-pink-500" />
        </div>
      </div>
      
      <div className="flex justify-around bg-slate-900/50 rounded-lg p-1 border border-slate-800">
        <ResourceItem icon={<Pickaxe size={14} />} value={resources[ResourceType.IRON]} color="text-slate-400" />
        <ResourceItem icon={<Trees size={14} />} value={resources[ResourceType.WOOD]} color="text-emerald-400" />
      </div>
    </header>
  );
};

const ResourceItem = ({ icon, value, color }: { icon: React.ReactNode, value: number, color: string }) => (
  <div className="flex items-center gap-1.5 px-2 py-0.5">
    <span className={color}>{icon}</span>
    <span className="text-xs font-bold font-orbitron tabular-nums">{Math.floor(value)}</span>
  </div>
);

export default Topbar;
