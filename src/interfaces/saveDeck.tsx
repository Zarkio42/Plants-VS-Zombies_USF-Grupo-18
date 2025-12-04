import type { Card } from "./cards";

export interface SavedDeck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: string;
  updatedAt?: string;
}