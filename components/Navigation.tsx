
import React from 'react';
import { GameView } from '../types';
import { Sword, Hammer, Map as MapIcon, Users, RefreshCcw } from 'lucide-react';

interface NavigationProps {
  activeView: GameView;
  setView: (view: GameView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setView }) => {
  const tabs = [
    { id: GameView.QUEST, label: 'Quest', icon: <Sword size={24} /> },
    { id: GameView.FORGE, label: 'Forge', icon: <Hammer size={24} /> },
    { id: GameView.BASTION, label: 'Bastion', icon: <MapIcon size={24} /> },
    { id: GameView.HEROES, label: 'Team', icon: <Users size={24} /> },
    { id: GameView.PRESTIGE, label: 'Reset', icon: <RefreshCcw size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto glass border-t border-cyan-900/50 flex justify-around items-center h-20 px-2 z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${
            activeView === tab.id ? 'text-cyan-400 border-t-2 border-cyan-400 bg-cyan-950/20' : 'text-slate-500'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-orbitron mt-1 uppercase">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
