// src/pages/DeckBuilder.tsx

import { useMemo, useState, useEffect } from "react";
import { Leaf, Plus, Save, Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCards } from "../hooks/useCards";
import type { Card, PlantCard, ZombieCard } from "../interfaces/cards";
import type { SavedDeck } from "../interfaces/saveDeck";

const CARDS_PER_DECK = 12;

const getTypeStyles = (type: "Plant" | "Zombie") => {
  if (type === "Zombie") {
    return {
      iconColor: "text-red-400",
      badgeBg: "bg-red-700",
      title: "ZUMBI",
    };
  }
  return {
    iconColor: "text-green-400",
    badgeBg: "bg-green-700",
    title: "PLANTA",
  };
};

const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) return imagePath;
  return `https://pvz-2-api.vercel.app${imagePath}`;
};

export default function DeckBuilder() {
  const navigate = useNavigate();
  const { cards, loading } = useCards();

  const [slots, setSlots] = useState<(Card | null)[]>(
    () => Array(CARDS_PER_DECK).fill(null)
  );
  const [deckName, setDeckName] = useState("");

  // NOVOS ESTADOS
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [selectorSearch, setSelectorSearch] = useState("");
  const [selectorFilterType, setSelectorFilterType] = useState<
    "All" | "Plant" | "Zombie"
  >("All");

  const selectedCount = useMemo(
    () => slots.filter((s) => s !== null).length,
    [slots]
  );

  const selectorCards = useMemo(() => {
    const term = selectorSearch.toLowerCase().trim();
    return cards
      .filter(
        (card) =>
          selectorFilterType === "All" || card.type === selectorFilterType
      )
      .filter((card) =>
        term ? card.name.toLowerCase().includes(term) : true
      );
  }, [cards, selectorFilterType, selectorSearch]);

  // Helper para preencher os 12 slots a partir de um deck salvo
  const loadDeckToState = (deck?: SavedDeck) => {
    if (!deck) {
      setDeckName("");
      setSlots(Array(CARDS_PER_DECK).fill(null));
      return;
    }

    setDeckName(deck.name);

    const newSlots: (Card | null)[] = Array(CARDS_PER_DECK).fill(null);
    deck.cards.forEach((card, index) => {
      if (index < CARDS_PER_DECK) {
        newSlots[index] = card;
      }
    });
    setSlots(newSlots);
  };

  // Carrega decks do localStorage ao montar
  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem("pvz_decks");
      if (!storedRaw) return;

      const parsed: SavedDeck[] = JSON.parse(storedRaw);
      const limited = parsed.slice(0, 3);

      setSavedDecks(limited);

      // Se havia mais de 3, já normaliza o localStorage
      if (parsed.length !== limited.length) {
        localStorage.setItem("pvz_decks", JSON.stringify(limited));
      }

      if (limited[0]) {
        setActiveDeckIndex(0);
        loadDeckToState(limited[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar decks salvos:", error);
    }
  }, []);

  const handleSlotClick = (index: number) => {
    if (loading || cards.length === 0) return;
    setActiveSlotIndex(index);
    setSelectorOpen(true);
  };

  const handleSelectCardForSlot = (card: Card) => {
    if (activeSlotIndex === null) return;

    const alreadyInDeck = slots.some(
      (slot) => slot && slot.name === card.name
    );
    if (alreadyInDeck) {
      alert("Essa carta já está no deck.");
      return;
    }

    setSlots((prev) => {
      const clone = [...prev];
      clone[activeSlotIndex] = card;
      return clone;
    });
    setSelectorOpen(false);
    setActiveSlotIndex(null);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => {
      const clone = [...prev];
      clone[index] = null;
      return clone;
    });
  };

  // Selecionar qual deck (1, 2 ou 3) está ativo
  const handleSelectDeckIndex = (index: number) => {
    setActiveDeckIndex(index);
    const deck = savedDecks[index];
    loadDeckToState(deck);
  };

  // Salvar deck no slot atual (editar ou criar)
  const handleSaveDeck = () => {
    if (selectedCount !== CARDS_PER_DECK) {
      alert(`Seu deck precisa ter exatamente ${CARDS_PER_DECK} cartas.`);
      return;
    }

    if (!deckName.trim()) {
      alert("Dê um nome para o seu deck antes de salvar.");
      return;
    }

    try {
      const nowIso = new Date().toISOString();
      let newSavedDecks: SavedDeck[] = [];

      const existingDeck = savedDecks[activeDeckIndex];

      if (existingDeck) {
        // Atualiza deck existente (edição)
        const updatedDeck: SavedDeck = {
          ...existingDeck,
          name: deckName.trim(),
          cards: slots.filter(Boolean) as Card[],
          updatedAt: nowIso,
        };

        newSavedDecks = savedDecks.map((deck, idx) =>
          idx === activeDeckIndex ? updatedDeck : deck
        );
      } else {
        // Criar novo deck nesse índice (se ainda houver espaço)
        if (savedDecks.length >= 3) {
          alert("Você já possui 3 decks salvos. Exclua um para criar outro.");
          return;
        }

        const newDeck: SavedDeck = {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}`,
          name: deckName.trim(),
          cards: slots.filter(Boolean) as Card[],
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        const insertIndex =
          activeDeckIndex > savedDecks.length
            ? savedDecks.length
            : activeDeckIndex;

        const clone = [...savedDecks];
        clone.splice(insertIndex, 0, newDeck);
        newSavedDecks = clone;
      }

      setSavedDecks(newSavedDecks);
      localStorage.setItem("pvz_decks", JSON.stringify(newSavedDecks));
      alert("Deck salvo com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível salvar o deck. Tente novamente.");
    }
  };

  // Excluir o deck do slot atual
  const handleDeleteCurrentDeck = () => {
    const current = savedDecks[activeDeckIndex];
    if (!current) {
      // Não há deck salvo nesse índice, só limpa a edição
      loadDeckToState(undefined);
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o deck "${current.name}"?`
    );
    if (!confirmDelete) return;

    const newSavedDecks = savedDecks.filter(
      (_, idx) => idx !== activeDeckIndex
    );

    // Ajusta índice ativo
    const newIndex = Math.max(0, activeDeckIndex - 1);

    setSavedDecks(newSavedDecks);
    setActiveDeckIndex(newIndex);
    localStorage.setItem("pvz_decks", JSON.stringify(newSavedDecks));

    const nextDeck = newSavedDecks[newIndex];
    loadDeckToState(nextDeck);
  };

  const isSaveDisabled =
    selectedCount !== CARDS_PER_DECK || !deckName.trim();

  const canDelete = !!savedDecks[activeDeckIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30l30-30v60z' fill='%2310b981' fill-opacity='0.4'/%3E%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header (mesma estética) */}
      <header className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b-2 border-green-500 shadow-2xl z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl shadow-lg shadow-green-500/50">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                  Lawn of the Dead - Deck Builder
                </h1>
                <p className="text-gray-400 text-sm">
                  Monte seu deck com 12 cartas
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/batalha")}
              className="hidden sm:inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-5 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-200"
            >
              <span>Voltar para batalha</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sm:p-8">
          {/* Topo: nome do deck + contador + índice 1/2/3 */}
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Crie seu deck personalizado
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Escolha{" "}
                <span className="font-semibold text-green-400">
                  12 cartas
                </span>{" "}
                de plantas e zumbis para usar em suas batalhas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="deckName"
                  className="block text-xs font-semibold text-gray-400 mb-1"
                >
                  Nome do deck
                </label>
                <input
                  id="deckName"
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Ex: Anti-Zumbi Clássico"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between sm:justify-center gap-2 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700">
                  <span className="text-xs text-gray-400">
                    Cartas selecionadas
                  </span>
                  <span className="text-lg font-extrabold text-green-400">
                    {selectedCount}/{CARDS_PER_DECK}
                  </span>
                </div>

                {/* Índice 1 / 2 / 3 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Deck atual:
                  </span>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((idx) => {
                      const isActive = activeDeckIndex === idx;
                      const deck = savedDecks[idx];

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectDeckIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg border text-xs text-center min-w-[52px] ${
                            isActive
                              ? "bg-green-600 border-green-400 text-white"
                              : "bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800"
                          }`}
                        >
                          <span className="block font-semibold">
                            {idx + 1}
                          </span>
                          {deck && (
                            <span className="block text-[10px] text-gray-300 truncate max-w-[72px]">
                              {deck.name}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slots do deck */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {slots.map((slot, index) => {
              if (!slot) {
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className="group relative aspect-[3/4] w-full rounded-xl border-2 border-dashed border-gray-600 bg-gray-900/40 hover:border-green-500 hover:bg-gray-900/70 transition-all flex flex-col items-center justify-center"
                  >
                    <Plus className="w-8 h-8 sm:w-9 sm:h-9 text-gray-500 group-hover:text-green-400 transition-colors" />
                    <span className="mt-2 text-xs sm:text-sm font-semibold text-gray-300">
                      Adicionar carta
                    </span>
                    <span className="mt-1 text-[10px] text-gray-500">
                      Slot {index + 1}
                    </span>
                  </button>
                );
              }

              const styles = getTypeStyles(slot.type);
              const isPlant = slot.type === "Plant";
              const plantCard = isPlant ? (slot as PlantCard) : null;
              const zombieCard = !isPlant ? (slot as ZombieCard) : null;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSlotClick(index)}
                  className="group relative aspect-[3/4] w-full rounded-xl border border-gray-700 bg-gray-900/90 hover:border-green-500 hover:shadow-[0_0_22px_rgba(34,197,94,0.35)] transition-all overflow-hidden flex flex-col"
                >
                  {/* Badge tipo */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`${styles.badgeBg} px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md uppercase tracking-wider`}
                    >
                      {styles.title}
                    </span>
                  </div>

                  {/* Remover da slot */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlot(index);
                    }}
                    className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-gray-200 hover:text-white rounded-full p-1 transition-colors"
                    aria-label="Remover carta do slot"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Conteúdo */}
                  <div className="flex-1 flex flex-col items-center justify-center p-3">
                    {slot.image ? (
                      <img
                        src={getImageUrl(slot.image)}
                        alt={slot.name}
                        className="h-16 sm:h-20 w-auto object-contain drop-shadow-xl mb-2"
                      />
                    ) : (
                      <div
                        className={`h-16 sm:h-20 flex items-center justify-center text-5xl ${styles.iconColor}`}
                      >
                        {slot.type === "Zombie" ? "💀" : "🌿"}
                      </div>
                    )}
                    <p className="text-xs sm:text-sm font-bold text-white text-center truncate w-full">
                      {slot.name}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400 text-center max-h-10 overflow-hidden">
                      {slot.description}
                    </p>
                  </div>

                  {/* Rodapé stats rápidos */}
                  <div className="px-3 py-2 bg-gray-950/80 border-t border-gray-800 text-[11px] flex items-center justify-between">
                    <span className="text-gray-400">
                      {isPlant
                        ? `Custo: ${plantCard?.cost ?? "N/A"} | Recarga: ${
                            plantCard?.recharge ?? "N/A"
                          }`
                        : `Toughness: ${
                            zombieCard?.toughness ?? "N/A"
                          } | Veloc.: ${zombieCard?.speed ?? "N/A"}`}
                    </span>
                    <span className="font-semibold text-green-400">
                      #{index + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ações */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/batalha")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-700 text-sm font-semibold text-gray-200 bg-gray-900 hover:bg-gray-800 hover:border-green-500 transition-all"
            >
              Voltar para batalha
            </button>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDeleteCurrentDeck}
                disabled={!canDelete}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  !canDelete
                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                    : "bg-transparent text-red-400 border-red-500 hover:bg-red-500/10"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir deck atual</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDeck}
                disabled={isSaveDisabled}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-500/30 transition-all ${
                  isSaveDisabled
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-700"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border border-green-400"
                }`}
              >
                <Save className="w-4 h-4" />
                <span>Salvar deck</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de seleção de carta */}
      {selectorOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center px-3 sm:px-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col">
            {/* Cabeçalho modal */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Escolha uma carta
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                  Clique em uma carta para adicioná-la ao slot{" "}
                  <span className="font-semibold text-green-400">
                    #{(activeSlotIndex ?? 0) + 1}
                  </span>
                  .
                </p>
              </div>
              <button
                onClick={() => setSelectorOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtros modal */}
            <div className="px-4 sm:px-6 py-3 border-b border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectorFilterType}
                  onChange={(e) =>
                    setSelectorFilterType(
                      e.target.value as "All" | "Plant" | "Zombie"
                    )
                  }
                  className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-500"
                >
                  <option value="All">Todos os tipos</option>
                  <option value="Plant">Apenas plantas</option>
                  <option value="Zombie">Apenas zumbis</option>
                </select>

                <div className="hidden sm:flex items-center px-3 py-2.5 rounded-lg border border-gray-700 text-xs text-gray-400">
                  {selectorCards.length} cartas encontradas
                </div>
              </div>
            </div>

            {/* Lista de cartas */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {selectorCards.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-gray-400">
                    Nenhuma carta encontrada com os filtros atuais.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectorCards.map((card) => {
                    const styles = getTypeStyles(card.type);
                    const isPlant = card.type === "Plant";
                    const plantCard = isPlant ? (card as PlantCard) : null;
                    const zombieCard = !isPlant ? (card as ZombieCard) : null;
                    const disabled = slots.some(
                      (slot) => slot && slot.name === card.name
                    );

                    return (
                      <button
                        key={card.name}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelectCardForSlot(card)}
                        className={`group relative rounded-xl border bg-gray-900/80 px-3 py-3 text-left flex flex-col items-stretch hover:border-green-500 hover:shadow-[0_0_18px_rgba(34,197,94,0.3)] transition-all ${
                          disabled
                            ? "opacity-40 cursor-not-allowed border-gray-700"
                            : "border-gray-700 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className={`${styles.badgeBg} px-2 py-0.5 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider`}
                          >
                            {styles.title}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {isPlant
                              ? `Custo: ${plantCard?.cost ?? "N/A"}`
                              : `Toughness: ${
                                  zombieCard?.toughness ?? "N/A"
                                }`}
                          </span>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1">
                          {card.image ? (
                            <img
                              src={getImageUrl(card.image)}
                              alt={card.name}
                              className="h-14 w-auto object-contain drop-shadow-lg mb-2"
                            />
                          ) : (
                            <div
                              className={`h-14 flex items-center justify-center text-4xl ${styles.iconColor} mb-2`}
                            >
                              {card.type === "Zombie" ? "💀" : "🌿"}
                            </div>
                          )}
                          <p className="w-full text-xs font-bold text-white text-center truncate">
                            {card.name}
                          </p>
                        </div>

                        <p className="mt-2 text-[10px] text-gray-400 max-h-10 overflow-hidden">
                          {card.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}