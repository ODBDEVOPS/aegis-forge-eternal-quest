
import { ResourceType, Region, Recipe, POI } from './types';

export const INITIAL_RESOURCES = {
  [ResourceType.GOLD]: 500,
  [ResourceType.IRON]: 50,
  [ResourceType.WOOD]: 50,
  [ResourceType.OBSIDIAN]: 0,
  [ResourceType.CRYSTAL]: 0,
  [ResourceType.FUEL]: 100
};

export const REGIONS: Region[] = [
  { 
    id: 'R1', 
    name: 'Emerald Plains', 
    biome: 'Plains', 
    minRank: 'F', 
    requiredStage: 1, 
    multiplier: 1.0, 
    effects: ['Abundant Wood', 'Low Danger'] 
  },
  { 
    id: 'R2', 
    name: 'Cobalt Spires', 
    biome: 'Canyon', 
    minRank: 'D', 
    requiredStage: 15, 
    multiplier: 1.5, 
    effects: ['+50% Iron Yield', 'High Gravity'] 
  },
  { 
    id: 'R3', 
    name: 'Frozen Peak', 
    biome: 'Mountain', 
    minRank: 'B', 
    requiredStage: 50, 
    multiplier: 2.2, 
    effects: ['-20% Attack Speed', 'Crystal Deposits'] 
  },
  { 
    id: 'R4', 
    name: 'Scorched Lands', 
    biome: 'Volcano', 
    minRank: 'S', 
    requiredStage: 120, 
    multiplier: 4.0, 
    effects: ['DOT Damage: 50/s', 'Obsidian Found'] 
  }
];

export const POIS: POI[] = [
  { id: 'P1', regionId: 'R1', name: 'Oak Forest', type: 'RESOURCE', resourceProduced: ResourceType.WOOD, ratePerHour: 120 },
  { id: 'P2', regionId: 'R1', name: 'Scrap Mine', type: 'RESOURCE', resourceProduced: ResourceType.IRON, ratePerHour: 60 },
  { id: 'P3', regionId: 'R2', name: 'Deep Canyon Mine', type: 'RESOURCE', resourceProduced: ResourceType.IRON, ratePerHour: 300 },
  { id: 'P4', regionId: 'R3', name: 'Crystal Cave', type: 'RESOURCE', resourceProduced: ResourceType.CRYSTAL, ratePerHour: 50 },
  { id: 'P5', regionId: 'R4', name: 'Magma Core', type: 'RESOURCE', resourceProduced: ResourceType.OBSIDIAN, ratePerHour: 40 },
];

export const RECIPES: Recipe[] = [
  { id: 'RCP1', name: 'Iron Sword', costs: { [ResourceType.IRON]: 50, [ResourceType.WOOD]: 20 }, resultItem: 'Iron Sword (+150% DMG)', duration: 5 },
  { id: 'RCP2', name: 'Ice Armor', costs: { [ResourceType.CRYSTAL]: 10, [ResourceType.IRON]: 100 }, resultItem: 'Ice Armor (+20% RES)', duration: 15 },
  { id: 'RCP3', name: 'Bastion Fuel', costs: { [ResourceType.WOOD]: 50, [ResourceType.GOLD]: 100 }, resultItem: 'Fuel x20', duration: 10 },
  { id: 'RCP4', name: 'Dark Plate', costs: { [ResourceType.OBSIDIAN]: 20, [ResourceType.IRON]: 200 }, resultItem: 'Dark Plate (+40% HP)', duration: 30 },
  { id: 'RCP5', name: 'Void Core', costs: { [ResourceType.OBSIDIAN]: 50, [ResourceType.CRYSTAL]: 50 }, resultItem: 'Void Core (+50% ATK Speed)', duration: 60 }
];

export const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'GOD'];
