
import React from 'react';
import { Hero, ResourceType, Resource } from '../types';
import { RANKS } from '../constants';
import { User, TrendingUp, Shield, Sword, Heart } from 'lucide-react';

interface HeroViewProps {
  heroes: Hero[];
  setHeroes: React.Dispatch<React.SetStateAction<Hero[]>>;
  resources: Record<ResourceType, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceType, number>>>;
}

const HeroView: React.FC<HeroViewProps> = ({ heroes, setHeroes, resources, setResources }) => {
  const handleUpgrade = (id: string) => {
    setHeroes(prev => prev.map(h => {
      if (h.id === id) {
        const currentRankIdx = RANKS.indexOf(h.rank);
        const nextRank = RANKS[currentRankIdx + 1] || h.rank;
        return { 
          ...h, 
          level: h.level + 1, 
          rank: h.level % 10 === 0 ? nextRank : h.rank,
          hp: h.hp + 10,
          atk: h.atk + 2
        };
      }
      return h;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <User className="text-yellow-500" size={20} />
        <h2 className="text-lg font-orbitron text-yellow-500">Hero Formation</h2>
      </div>

      <div className="space-y-4">
        {heroes.map(hero => (
          <div key={hero.id} className="glass p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
                   <User size={28} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">{hero.name}</h3>
                   <span className="text-xs text-slate-500 uppercase font-orbitron tracking-tighter">{hero.role} • {hero.profession}</span>
                 </div>
              </div>
              <div className="text-right">
                <div className="px-2 py-0.5 bg-yellow-500 text-black font-orbitron text-[10px] rounded mb-1">RANK {hero.rank}</div>
                <div className="text-xs text-slate-500 font-orbitron">LEVEL {hero.level}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <Stat icon={<Heart size={14} />} label="Health" value={hero.hp} color="text-emerald-400" />
              <Stat icon={<Sword size={14} />} label="Attack" value={hero.atk} color="text-red-400" />
              <Stat icon={<Shield size={14} />} label="Armor" value={Math.floor(hero.hp * 0.2)} color="text-cyan-400" />
            </div>

            <button 
              onClick={() => handleUpgrade(hero.id)}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-orbitron rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              <TrendingUp size={18} /> TRAINING MODULE [LV UP]
            </button>
          </div>
        ))}

        <div className="p-4 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center h-32 text-slate-600">
           <span className="text-sm font-orbitron">SQUAD SLOT EMPTY</span>
           <span className="text-[10px] mt-1">Unlock via Reputation Rank D</span>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800 flex flex-col items-center">
    <span className={`${color} mb-1`}>{icon}</span>
    <span className="text-xs font-bold font-orbitron tabular-nums">{value}</span>
    <span className="text-[8px] text-slate-600 uppercase font-orbitron mt-0.5">{label}</span>
  </div>
);

export default HeroView;
