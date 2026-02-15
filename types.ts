
export enum ResourceType {
  GOLD = 'GOLD',
  IRON = 'IRON',
  WOOD = 'WOOD',
  OBSIDIAN = 'OBSIDIAN',
  CRYSTAL = 'CRYSTAL',
  FUEL = 'FUEL'
}

export enum GameView {
  QUEST = 'QUEST',
  FORGE = 'FORGE',
  BASTION = 'BASTION',
  HEROES = 'HEROES',
  PRESTIGE = 'PRESTIGE'
}

export interface Resource {
  type: ResourceType;
  amount: number;
  perSec: number;
}

export interface Hero {
  id: string;
  name: string;
  level: number;
  rank: string;
  hp: number;
  atk: number;
  speed: number;
  role: 'Tank' | 'DPS' | 'Support';
  profession?: 'Blacksmith' | 'Alchemist' | 'Miner' | 'Scout';
}

export interface Recipe {
  id: string;
  name: string;
  costs: Partial<Record<ResourceType, number>>;
  resultItem: string;
  duration: number; // in seconds
}

export interface Region {
  id: string;
  name: string;
  biome: string;
  minRank: string;
  requiredStage: number;
  multiplier: number;
  effects: string[];
}

export interface POI {
  id: string;
  regionId: string;
  name: string;
  type: 'RESOURCE' | 'QUEST' | 'DUNGEON';
  resourceProduced?: ResourceType;
  ratePerHour?: number;
  requiredPower?: number;
  unlockedAtStage?: number;
}
