export interface RawCardData {
  name: string;
  description: string;
  image: string;
  // Plantas
  cost?: number;
  "Sun cost"?: number;
  recharge?: string;
  Recharge?: string;
  "sun-production"?: string;
  // Zumbis
  toughness?: string | number;
  Toughness?: string | number;
  speed?: string;
  Speed?: string;
  // Extras
  area?: string;
  usage?: string;
  special?: string;
  range?: string;
  family?: string;
  duration?: string;
  weakness?: string;
  stamina?: string;
}

export interface PlantCard {
  type: "Plant";
  name: string;
  description: string;
  image: string;
  cost: number;
  recharge: string;
  "sun-production": string;
  area: string;
  usage: string;
  special: string;
  range: string;
  family: string;
}

export interface ZombieCard {
  type: "Zombie";
  name: string;
  description: string;
  image: string;
  toughness: string;
  speed: string;
  stamina: string;
  weakness: string;
}

export type Card = PlantCard | ZombieCard;