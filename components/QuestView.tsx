
import React from 'react';
import { Hero, Region } from '../types';
import { Shield, Swords, Activity } from 'lucide-react';

interface QuestViewProps {
  stage: number;
  heroes: Hero[];
  logs: string[];
  region: Region;
}

const QuestView: React.FC<QuestViewProps> = ({ stage, heroes, logs, region }) => {
  return (
    <div className="space-y-4">
      {/* Environment Header */}
      <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-800 neon-border bg-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
        <img 
          src={`https://picsum.photos/seed/${region.id}/400/200`} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
          alt="Biome"
        />
        <div className="relative z-20 text-center">
          <h2 className="text-xl font-orbitron text-cyan-400 neon-text">{region.name}</h2>
          <p className="text-xs text-slate-400 italic">Biome: {region.biome}</p>
          <div className="mt-2 flex gap-1 justify-center">
            {region.effects.map((eff, i) => (
              <span key={i} className="px-2 py-0.5 bg-red-950/40 text-[10px] text-red-400 border border-red-500/30 rounded">
                {eff}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Simulation Area */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col items-center gap-6 min-h-[12rem] relative">
        <div className="flex w-full justify-between items-center">
           <div className="flex flex-col items-center animate-pulse">
             <div className="w-16 h-16 rounded-full border-2 border-cyan-500 flex items-center justify-center bg-cyan-950/40">
               <Shield size={32} className="text-cyan-400" />
             </div>
             <span className="text-[10px] font-orbitron mt-1">SQUAD</span>
           </div>

           <div className="flex-1 px-4">
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-1/2 animate-[shimmer_2s_infinite]"></div>
              </div>
           </div>

           <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center bg-red-950/40">
               <Swords size={32} className="text-red-400" />
             </div>
             <span className="text-[10px] font-orbitron mt-1">THREAT</span>
           </div>
        </div>
        
        <div className="text-xs font-mono text-cyan-500/70">NEURAL COMBAT DATA STREAMING...</div>
      </div>

      {/* Hero Stats Mini-Cards */}
      <div className="grid grid-cols-1 gap-2">
        {heroes.map(hero => (
          <div key={hero.id} className="glass p-3 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-cyan-950/30 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{hero.name} <span className="text-xs text-slate-500 font-normal">LV.{hero.level}</span></span>
                <span className="text-[10px] font-orbitron text-yellow-500 px-1 bg-yellow-500/10 rounded border border-yellow-500/20">RANK {hero.rank}</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
                </div>
                <span className="text-[10px] text-slate-400">80/100 HP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-black/40 rounded-lg p-3 border border-slate-800/50">
        <h3 className="text-[10px] font-orbitron text-slate-500 uppercase mb-2">Combat Log</h3>
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className={`text-xs ${i === 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
              <span className="opacity-50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestView;
