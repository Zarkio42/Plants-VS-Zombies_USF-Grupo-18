import { useState, useEffect } from "react";
import type { Card } from "../interfaces/cards";

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "pvz_decks";

function loadDecksFromStorage(): Deck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as any;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((deck: any, index: number): Deck => {
      const createdAt =
        typeof deck.createdAt === "string"
          ? deck.createdAt
          : new Date().toISOString();

      const updatedAt =
        typeof deck.updatedAt === "string" ? deck.updatedAt : createdAt;

      return {
        id: typeof deck.id === "string" ? deck.id : `deck-${index}`,
        name: typeof deck.name === "string" ? deck.name : `Deck #${index + 1}`,
        cards: Array.isArray(deck.cards) ? deck.cards : [],
        createdAt,
        updatedAt,
      };
    });
  } catch {
    return [];
  }
}

function saveDecksToStorage(decks: Deck[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {
    // se der erro, apenas ignora (sem quebrar a aplicação)
  }
}

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const loaded = loadDecksFromStorage();
    setDecks(loaded);
  }, []);

  const addDeck = (name: string, cards: Card[]) => {
    const now = new Date().toISOString();
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      cards,
      createdAt: now,
      updatedAt: now,
    };

    setDecks((prev) => {
      const next = [...prev, newDeck];
      saveDecksToStorage(next);
      return next;
    });

    return newDeck;
  };

  const updateDeck = (id: string, data: Partial<Omit<Deck, "id">>) => {
    setDecks((prev) => {
      const next = prev.map((deck) =>
        deck.id === id
          ? {
              ...deck,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : deck
      );
      saveDecksToStorage(next);
      return next;
    });
  };

  const deleteDeck = (id: string) => {
    setDecks((prev) => {
      const next = prev.filter((deck) => deck.id !== id);
      saveDecksToStorage(next);
      return next;
    });
  };

  return {
    decks,
    addDeck,
    updateDeck,
    deleteDeck,
  };
}