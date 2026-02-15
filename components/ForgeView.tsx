
import React, { useState, useEffect, useMemo } from 'react';
import { RECIPES } from '../constants';
import { ResourceType, Recipe, Hero } from '../types';
import { Hammer, Clock, Info, X, ChevronRight, Package, Box, ArrowUpCircle, Sparkles, FlaskConical, Beaker } from 'lucide-react';

interface ForgeViewProps {
  resources: Record<ResourceType, number>;
  setResources: React.Dispatch<React.SetStateAction<Record<ResourceType, number>>>;
  addLog: (msg: string) => void;
  recipeLevels: Record<string, number>;
  setRecipeLevels: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  discoveredRecipeIds: Set<string>;
  setDiscoveredRecipeIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  heroes: Hero[];
}

interface ActiveCraft {
  recipe: Recipe;
  remainingTime: number;
}

type Tab = 'FABRICATION' | 'DISCOVERY';

const ForgeView: React.FC<ForgeViewProps> = ({ 
  resources, setResources, addLog, recipeLevels, setRecipeLevels, discoveredRecipeIds, setDiscoveredRecipeIds, heroes 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('FABRICATION');
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [queue, setQueue] = useState<Recipe[]>([]);
  const [currentCraft, setCurrentCraft] = useState<ActiveCraft | null>(null);

  const [primaryRes, setPrimaryRes] = useState<ResourceType | null>(null);
  const [secondaryRes, setSecondaryRes] = useState<ResourceType | null>(null);
  const [isInfusing, setIsInfusing] = useState(false);

  const QUEUE_LIMIT = 5;
  const DISCOVERY_COST = 50;

  // Calculate crafting speed bonus from heroes (Profession: Blacksmith)
  const craftSpeedMultiplier = useMemo(() => {
    let bonus = 1.0;
    heroes.forEach(h => { if (h.profession === 'Blacksmith') bonus += 0.1; });
    return 1 / bonus; // e.g., 10% faster means 0.909x duration
  }, [heroes]);

  const getEffectiveStats = (recipe: Recipe) => {
    const level = recipeLevels[recipe.id] || 1;
    const durationMultiplier = Math.max(0.2, (1 - (level - 1) * 0.1) * craftSpeedMultiplier);
    const costMultiplier = Math.max(0.5, 1 - (level - 1) * 0.05);

    const effectiveCosts: Partial<Record<ResourceType, number>> = {};
    Object.entries(recipe.costs).forEach(([res, amount]) => {
      effectiveCosts[res as ResourceType] = Math.max(1, Math.floor((amount || 0) * costMultiplier));
    });

    return {
      effectiveCosts,
      effectiveDuration: Math.max(1, Math.floor(recipe.duration * durationMultiplier)),
      upgradeCost: Math.floor(1000 * Math.pow(1.5, level - 1))
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentCraft) {
        if (currentCraft.remainingTime > 1) {
          setCurrentCraft({ ...currentCraft, remainingTime: currentCraft.remainingTime - 1 });
        } else {
          const finished = currentCraft.recipe;
          addLog(`FORGE COMPLETE: ${finished.resultItem}`);
          if (finished.id === 'RCP3') {
            setResources(prev => ({ ...prev, [ResourceType.FUEL]: prev[ResourceType.FUEL] + 20 }));
          }
          setCurrentCraft(null);
        }
      } else if (queue.length > 0) {
        const next = queue[0];
        setQueue(prev => prev.slice(1));
        const { effectiveDuration } = getEffectiveStats(next);
        setCurrentCraft({ recipe: next, remainingTime: effectiveDuration });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentCraft, queue, addLog, craftSpeedMultiplier, recipeLevels]);

  const canAfford = (costs: Partial<Record<ResourceType, number>>) => {
    return Object.entries(costs).every(([res, amount]) => resources[res as ResourceType] >= (amount || 0));
  };

  const addToQueue = (recipe: Recipe) => {
    const { effectiveCosts } = getEffectiveStats(recipe);
    if (!canAfford(effectiveCosts) || queue.length >= QUEUE_LIMIT) return;
    setResources(prev => {
      const next = { ...prev };
      Object.entries(effectiveCosts).forEach(([res, amount]) => { next[res as ResourceType] -= (amount || 0); });
      return next;
    });
    setQueue(prev => [...prev, recipe]);
    addLog(`Queue: ${recipe.name} fabrication scheduled.`);
  };

  const handleInfusion = () => {
    if (!primaryRes || !secondaryRes || isInfusing) return;
    if (resources[primaryRes] < DISCOVERY_COST || resources[secondaryRes] < DISCOVERY_COST) return;

    setIsInfusing(true);
    setResources(prev => ({
      ...prev,
      [primaryRes]: prev[primaryRes] - DISCOVERY_COST,
      [secondaryRes]: prev[secondaryRes] - DISCOVERY_COST,
    }));

    setTimeout(() => {
      const combos: Record<string, string> = {
        'CRYSTAL+IRON': 'RCP2', 'IRON+CRYSTAL': 'RCP2',
        'OBSIDIAN+IRON': 'RCP4', 'IRON+OBSIDIAN': 'RCP4',
        'OBSIDIAN+CRYSTAL': 'RCP5', 'CRYSTAL+OBSIDIAN': 'RCP5',
      };
      const key = `${primaryRes}+${secondaryRes}`;
      const foundId = combos[key];
      if (foundId && !discoveredRecipeIds.has(foundId)) {
        setDiscoveredRecipeIds(prev => new Set([...prev, foundId]));
        addLog(`DISCOVERY: ${RECIPES.find(r => r.id === foundId)?.name} blueprint recovered.`);
      } else {
        addLog(`Infusion unstable. No new pattern detected.`);
      }
      setIsInfusing(false);
      setPrimaryRes(null);
      setSecondaryRes(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
        <button onClick={() => setActiveTab('FABRICATION')} className={`flex-1 py-2 text-xs font-orbitron rounded transition-all ${activeTab === 'FABRICATION' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`}>FABRICATION</button>
        <button onClick={() => setActiveTab('DISCOVERY')} className={`flex-1 py-2 text-xs font-orbitron rounded transition-all ${activeTab === 'DISCOVERY' ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(219,39,119,0.5)]' : 'text-slate-500'}`}>DISCOVERY</button>
      </div>

      {activeTab === 'FABRICATION' ? (
        <div className="space-y-6">
          <div className="glass p-4 rounded-xl border border-cyan-500/30 relative overflow-hidden min-h-[100px] flex items-center justify-center">
            {currentCraft ? (
              <div className="w-full relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-lg font-bold text-white">{currentCraft.recipe.name}</h3>
                  <span className="text-cyan-400 font-orbitron text-xs">{currentCraft.remainingTime}s</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-500 transition-all duration-1000 ease-linear" style={{ width: `${((getEffectiveStats(currentCraft.recipe).effectiveDuration - currentCraft.remainingTime) / getEffectiveStats(currentCraft.recipe).effectiveDuration) * 100}%` }}></div>
                </div>
              </div>
            ) : <div className="text-slate-600 font-orbitron uppercase text-xs tracking-widest flex flex-col items-center gap-2"><Package size={24} className="opacity-20" /> Forge Idle</div>}
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-orbitron text-slate-500 uppercase flex items-center gap-2"><Clock size={12} /> Pending Queue</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {queue.length === 0 && <div className="w-full py-4 border border-dashed border-slate-800 rounded text-center text-[10px] text-slate-700 font-orbitron">EMPTY</div>}
              {queue.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-28 bg-slate-900 border border-slate-800 rounded p-2 flex items-center justify-between">
                  <div className="text-[9px] text-slate-300 truncate">{item.name}</div>
                  <X size={12} className="text-slate-600 cursor-pointer" onClick={() => setQueue(prev => prev.filter((_, i) => i !== idx))} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-orbitron text-slate-500 uppercase">Available Blueprints</h3>
            <div className="grid grid-cols-1 gap-2">
              {RECIPES.filter(r => discoveredRecipeIds.has(r.id)).map(recipe => {
                const selected = activeRecipeId === recipe.id;
                const stats = getEffectiveStats(recipe);
                const level = recipeLevels[recipe.id] || 1;
                return (
                  <div key={recipe.id} onClick={() => setActiveRecipeId(recipe.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${selected ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/40'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-200">{recipe.name}</span>
                          <span className="text-[9px] bg-cyan-950 text-cyan-400 px-1 py-0.5 rounded border border-cyan-500/20 font-orbitron">LV.{level}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          {Object.entries(stats.effectiveCosts).map(([res, amt]) => (
                            <span key={res} className={`text-[8px] ${resources[res as ResourceType] >= (amt || 0) ? 'text-emerald-500' : 'text-red-500'}`}>{amt} {res}</span>
                          ))}
                        </div>
                      </div>
                      {selected && (
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); if (resources[ResourceType.GOLD] >= stats.upgradeCost) { setResources(p => ({ ...p, [ResourceType.GOLD]: p[ResourceType.GOLD] - stats.upgradeCost })); setRecipeLevels(p => ({ ...p, [recipe.id]: (p[recipe.id] || 1) + 1 })); } }} className="p-1 border border-yellow-500/30 text-yellow-500 rounded"><ArrowUpCircle size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); addToQueue(recipe); }} className="px-2 py-1 bg-cyan-500 text-slate-950 text-[10px] font-orbitron rounded font-bold">FORGE</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <Sparkles className="mx-auto text-pink-500 animate-pulse" size={32} />
            <h3 className="text-lg font-orbitron text-pink-500">Pattern Infusion</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter italic">Combine raw essences to discover missing blueprint data.</p>
          </div>
          <div className="flex justify-center items-center gap-4">
            <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${primaryRes ? 'border-pink-500 bg-pink-500/10' : 'border-dashed border-slate-800'}`}>{primaryRes ? <span className="text-[10px] font-orbitron">{primaryRes}</span> : <FlaskConical size={20} className="text-slate-800" />}</div>
            <div className="text-pink-500 font-orbitron">+</div>
            <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${secondaryRes ? 'border-pink-500 bg-pink-500/10' : 'border-dashed border-slate-800'}`}>{secondaryRes ? <span className="text-[10px] font-orbitron">{secondaryRes}</span> : <Beaker size={20} className="text-slate-800" />}</div>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[ResourceType.IRON, ResourceType.WOOD, ResourceType.CRYSTAL, ResourceType.OBSIDIAN, ResourceType.GOLD].map(res => (
              <button key={res} disabled={resources[res] < DISCOVERY_COST || isInfusing} onClick={() => { if (!primaryRes) setPrimaryRes(res); else if (!secondaryRes && primaryRes !== res) setSecondaryRes(res); else if (primaryRes === res) setPrimaryRes(null); else if (secondaryRes === res) setSecondaryRes(null); }} className={`p-2 rounded border text-[8px] font-orbitron transition-all ${primaryRes === res || secondaryRes === res ? 'bg-pink-500 border-pink-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{res}</button>
            ))}
          </div>
          <button disabled={!primaryRes || !secondaryRes || isInfusing} onClick={handleInfusion} className={`w-full py-4 rounded-xl font-orbitron tracking-widest text-xs transition-all ${!primaryRes || !secondaryRes || isInfusing ? 'bg-slate-800 text-slate-600' : 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]'}`}>{isInfusing ? 'INFUSING...' : 'INITIALIZE INFUSION'}</button>
        </div>
      )}
    </div>
  );
};

export default ForgeView;
