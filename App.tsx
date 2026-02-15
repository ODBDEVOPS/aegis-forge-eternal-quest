
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameView, ResourceType, Resource, Hero } from './types';
import { INITIAL_RESOURCES, REGIONS, RECIPES, POIS } from './constants';
import Topbar from './components/Topbar';
import Navigation from './components/Navigation';
import QuestView from './components/QuestView';
import ForgeView from './components/ForgeView';
import BastionView from './components/BastionView';
import HeroView from './components/HeroView';
import PrestigeView from './components/PrestigeView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.QUEST);
  const [resources, setResources] = useState<Record<ResourceType, number>>(INITIAL_RESOURCES);
  const [stage, setStage] = useState(1);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [currentRegion, setCurrentRegion] = useState(REGIONS[0]);
  const [heroes, setHeroes] = useState<Hero[]>([
    { id: 'h1', name: 'Thorin', level: 1, rank: 'F', hp: 100, atk: 15, speed: 1.0, role: 'Tank', profession: 'Blacksmith' }
  ]);
  const [recipeLevels, setRecipeLevels] = useState<Record<string, number>>(
    Object.fromEntries(RECIPES.map(r => [r.id, 1]))
  );
  
  const [conqueredPoiIds, setConqueredPoiIds] = useState<Set<string>>(new Set());
  const [discoveredRecipeIds, setDiscoveredRecipeIds] = useState<Set<string>>(new Set(['RCP1', 'RCP3']));
  const [logs, setLogs] = useState<string[]>(['Neural link established. System online.']);

  const addLog = useCallback((msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10)), []);

  const discoverRecipe = useCallback((id: string) => {
    setDiscoveredRecipeIds(prev => {
      if (prev.has(id)) return prev;
      const recipe = RECIPES.find(r => r.id === id);
      if (recipe) addLog(`NEW BLUEPRINT: ${recipe.name} recovered.`);
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [addLog]);

  // Calculate passive bonuses from heroes
  const passives = useMemo(() => {
    let craftSpeed = 1.0;
    let yieldBonus = 1.0;
    heroes.forEach(h => {
      if (h.profession === 'Blacksmith') craftSpeed += 0.1;
      if (h.profession === 'Miner') yieldBonus += 0.15;
    });
    return { craftSpeed, yieldBonus };
  }, [heroes]);

  // Game Tick - Every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setResources(prev => {
        const mult = currentRegion.multiplier;
        const regionYield = passives.yieldBonus;
        
        // Base passive gains
        const newResources = { ...prev };
        newResources[ResourceType.GOLD] += (stage * 0.5 * mult);
        
        // POI based gains
        POIS.forEach(poi => {
          if (conqueredPoiIds.has(poi.id) && poi.type === 'RESOURCE' && poi.resourceProduced) {
            const gainPerSec = (poi.ratePerHour || 0) / 3600;
            newResources[poi.resourceProduced] += gainPerSec * regionYield;
          }
        });

        return newResources;
      });

      // Simulate Quest Progression
      if (Math.random() > 0.85) {
        setStage(s => {
          const next = s + 1;
          if (next % 5 === 0) setPlayerLevel(lv => lv + 1);
          
          if (Math.random() > 0.95) {
            const undiscovered = RECIPES.filter(r => !discoveredRecipeIds.has(r.id));
            if (undiscovered.length > 0) {
              const randomRecipe = undiscovered[Math.floor(Math.random() * undiscovered.length)];
              discoverRecipe(randomRecipe.id);
            }
          }

          return next;
        });
        
        if (stage % 10 === 0) {
          addLog(`Reached Stage ${stage + 1}`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, currentRegion, conqueredPoiIds, passives, discoveredRecipeIds, discoverRecipe, addLog]);

  const renderView = () => {
    switch (currentView) {
      case GameView.QUEST:
        return <QuestView stage={stage} heroes={heroes} logs={logs} region={currentRegion} />;
      case GameView.FORGE:
        return (
          <ForgeView 
            resources={resources} 
            setResources={setResources} 
            addLog={addLog} 
            recipeLevels={recipeLevels}
            setRecipeLevels={setRecipeLevels}
            discoveredRecipeIds={discoveredRecipeIds}
            setDiscoveredRecipeIds={setDiscoveredRecipeIds}
            heroes={heroes}
          />
        );
      case GameView.BASTION:
        return (
          <BastionView 
            currentRegion={currentRegion} 
            setCurrentRegion={setCurrentRegion} 
            resources={resources} 
            setResources={setResources} 
            addLog={addLog} 
            stage={stage}
            conqueredPoiIds={conqueredPoiIds}
            setConqueredPoiIds={setConqueredPoiIds}
          />
        );
      case GameView.HEROES:
        return <HeroView heroes={heroes} setHeroes={setHeroes} resources={resources} setResources={setResources} />;
      case GameView.PRESTIGE:
        return <PrestigeView stage={stage} setStage={setStage} setResources={setResources} />;
      default:
        return <QuestView stage={stage} heroes={heroes} logs={logs} region={currentRegion} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-slate-950 text-slate-100 overflow-hidden relative border-x border-slate-800">
      <Topbar resources={resources} level={playerLevel} stage={stage} />
      
      <main className="flex-1 overflow-y-auto pb-24 p-4 scrollbar-hide">
        {renderView()}
      </main>

      <Navigation activeView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
