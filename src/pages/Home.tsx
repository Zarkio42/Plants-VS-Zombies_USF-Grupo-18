import { useState, useMemo, useEffect } from "react";
import type { FC, SyntheticEvent } from "react";
import {
  Leaf,
  Users,
  Plus,
  Search,
  Zap,
  Sun,
  Clock,
  Skull,
  X,
  Shield,
  FastForward,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCards } from "../hooks/useCards";
import type { Card, PlantCard, ZombieCard } from "../interfaces/cards";

const BASE_API_URL = "/api";

// -----------------------------------------------------------
// MODAL DE DETALHES
// -----------------------------------------------------------

interface CardDetailsModalProps {
  card: Card;
  onClose: () => void;
  getImageUrl: (path: string) => string;
}

const CardDetailsModal: FC<CardDetailsModalProps> = ({
  card,
  onClose,
  getImageUrl,
}) => {
  const styles =
    card.type === "Zombie"
      ? {
          primary: "bg-red-700",
          secondary: "text-red-400",
          border: "border-red-600",
        }
      : {
          primary: "bg-green-700",
          secondary: "text-green-400",
          border: "border-green-600",
        };

  const PlantDetails = card.type === "Plant" ? (card as PlantCard) : null;
  const ZombieDetails = card.type === "Zombie" ? (card as ZombieCard) : null;

  const renderAttribute = (
    label: string,
    value: string | number | undefined
  ) => {
    if (value === undefined || value === "N/A" || value === "PLANTA" || value === 0) return null;
    return (
      <div className="flex justify-between py-2 border-b border-gray-700/50">
        <span className="text-gray-400 font-semibold">{label}</span>
        <span className={`${styles.secondary} font-bold text-right`}>
          {value}
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 border-2 border-green-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div
          className={`relative ${styles.primary} rounded-t-lg p-6 flex justify-between items-start border-b-2 ${styles.border}`}
        >
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider">
            {card.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            {/* Imagem */}
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-4 shadow-inner">
              <img
                src={getImageUrl(card.image)}
                alt={card.name}
                className="h-24 w-auto object-contain drop-shadow-lg"
              />
            </div>

            {/* Stats Principais */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-200 mb-2">
                Estatísticas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Custo / Toughness */}
                <div className="flex items-center space-x-2">
                  {ZombieDetails ? (
                    <Shield className="w-5 h-5 text-red-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-gray-500 text-xs">
                      {ZombieDetails ? "Resistência" : "Custo Solar"}
                    </p>
                    <p
                      className={`font-bold ${styles.secondary}`}
                    >
                      {ZombieDetails
                        ? ZombieDetails.toughness
                        : PlantDetails?.cost}
                    </p>
                  </div>
                </div>
                {/* Recarga / Velocidade */}
                <div className="flex items-center space-x-2">
                  {ZombieDetails ? (
                    <FastForward className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <p className="text-gray-500 text-xs">
                      {ZombieDetails ? "Velocidade" : "Recarga"}
                    </p>
                    <p
                      className={`font-bold ${styles.secondary}`}
                    >
                      {ZombieDetails
                        ? ZombieDetails.speed
                        : PlantDetails?.recharge}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-gray-300 border-b border-gray-700/50 pb-4 mb-4 italic">
            {card.description}
          </p>

          {/* Atributos Adicionais */}
          <h3 className="text-xl font-bold text-gray-200 mb-2 mt-4">
            Atributos Extras
          </h3>
          <div className="space-y-1">
            {PlantDetails && (
              <>
                {renderAttribute("Produção", PlantDetails["sun-production"])}
                {renderAttribute("Família", PlantDetails.family)}
                {renderAttribute("Área de Efeito", PlantDetails.area)}
                {renderAttribute("Uso", PlantDetails.usage)}
                {renderAttribute("Especial", PlantDetails.special)}
                {renderAttribute("Alcance", PlantDetails.range)}
              </>
            )}
            {ZombieDetails && (
              <>
                {renderAttribute("Estamina", ZombieDetails.stamina)}
                {renderAttribute("Fraqueza", ZombieDetails.weakness)}
              </>
            )}
            {!(PlantDetails || ZombieDetails) && (
              <p className="text-gray-500">
                Nenhuma informação adicional disponível.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-b-xl text-right">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------
// FUNÇÃO PRINCIPAL
// -----------------------------------------------------------

const CARDS_PER_PAGE = 12;

export default function PvZDeckHome() {
  const { cards, loading } = useCards();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Plant" | "Zombie">(
    "All"
  );
  const [sortBy, setSortBy] = useState<
    | "name-asc"
    | "name-desc"
    | "cost-asc"
    | "cost-desc"
    | "recharge-asc"
    | "recharge-desc"
    | "plant-first"
    | "zombie-first"
  >("name-asc");

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, sortBy]);

  // -----------------------------------------------------------
  // Lógica de Filtro e Classificação
  // -----------------------------------------------------------

  const isCardComplete = (card: Card): boolean => {
    if (card.type === "Plant") {
      const plantCard = card as PlantCard;
      return (
        plantCard.cost !== undefined &&
        plantCard.recharge !== "N/A" &&
        plantCard["sun-production"] !== "N/A"
      );
    } else {
      const zombieCard = card as ZombieCard;
      return (
        zombieCard.toughness !== "N/A" && zombieCard.speed !== "N/A"
      );
    }
  };

  const getRechargeNumericValue = (card: PlantCard): number => {
    if (!card.recharge || typeof card.recharge !== "string") {
      return 99;
    }

    const rechargeStr = card.recharge.toLowerCase();

    if (rechargeStr.includes("muito rápida")) return 1;
    if (rechargeStr.includes("rápida")) return 2;
    if (rechargeStr.includes("normal")) return 3;
    if (rechargeStr.includes("lenta")) return 4;
    if (rechargeStr.includes("muito lenta")) return 5;
    return 99;
  };

  const processedCards = useMemo(() => {
    const filteredAndSearchedCards = cards
      .filter(isCardComplete)
      .filter((card) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;
        return card.name.toLowerCase().includes(term);
      })
      .filter((card) => filterType === "All" || card.type === filterType);

    const sortableCards = [...filteredAndSearchedCards];

    sortableCards.sort((a, b) => {
      if (sortBy === "plant-first" || sortBy === "zombie-first") {
        const isA_Plant = a.type === "Plant";
        const isB_Plant = b.type === "Plant";

        let typeComparison = 0;

        if (isA_Plant && !isB_Plant) {
          typeComparison = sortBy === "plant-first" ? -1 : 1;
        } else if (!isA_Plant && isB_Plant) {
          typeComparison = sortBy === "plant-first" ? 1 : -1;
        }

        if (typeComparison !== 0) return typeComparison;
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);

      const costA = a.type === "Plant" ? (a as PlantCard).cost : Infinity;
      const costB = b.type === "Plant" ? (b as PlantCard).cost : Infinity;

      if (sortBy === "cost-asc" || sortBy === "cost-desc") {
        if (costA === Infinity && costB === Infinity)
          return a.name.localeCompare(b.name);
        if (costA === Infinity) return 1;
        if (costB === Infinity) return -1;

        const comparison = costA - costB;
        return sortBy === "cost-asc" ? comparison : -comparison;
      }

      if (sortBy === "recharge-asc" || sortBy === "recharge-desc") {
        if (a.type !== "Plant" && b.type !== "Plant")
          return a.name.localeCompare(b.name);
        if (a.type !== "Plant") return 1;
        if (b.type !== "Plant") return -1;

        const rechargeA = getRechargeNumericValue(a as PlantCard);
        const rechargeB = getRechargeNumericValue(b as PlantCard);

        const comparison = rechargeA - rechargeB;
        return sortBy === "recharge-asc" ? comparison : -comparison;
      }

      return 0;
    });

    return sortableCards;
  }, [cards, searchTerm, filterType, sortBy]);

  const filteredCards = processedCards;

  // -----------------------------------------------------------
  // Paginação baseada em filteredCards
  // -----------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    return filteredCards.slice(start, end);
  }, [filteredCards, currentPage]);

  const MAX_VISIBLE_PAGES = 4;

  const visiblePages = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - MAX_VISIBLE_PAGES + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, currentPage]);

  // -----------------------------------------------------------
  // Funções Auxiliares
  // -----------------------------------------------------------

  const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith("http")) return imagePath;
    return `https://pvz-2-api.vercel.app${imagePath}`;
  };

  const getTypeStyles = (type: "Plant" | "Zombie") => {
    if (type === "Zombie") {
      return {
        icon: Skull,
        iconColor: "text-red-400",
        badgeBg: "bg-red-700",
        shadow: "shadow-[0_0_20px_0_rgba(220,38,38,0.5)]",
        title: "ZUMBI",
      };
    }
    return {
      icon: Leaf,
      iconColor: "text-green-400",
      badgeBg: "bg-green-700",
      shadow: "shadow-[0_0_20px_0_rgba(16,185,129,0.5)]",
      title: "PLANTA",
    };
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleCreateDeck = () => {
  navigate('/deck');
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30l30-30v60z' fill='%2310b981' fill-opacity='0.4'/%3E%3E")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Header */}
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
                  Plants vs Zombies 2 - Deck Collection
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-5 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                <span>Entrar</span>
              </button>

              <button
                onClick={handleCreateDeck}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg shadow-green-500/30 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Deck</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section e Busca */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* 1. Search Bar */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                id="cardSearch"
                name="cardSearch"
                placeholder="Busque por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* 2. Filtro por Tipo */}
            <div className="w-full max-w-[10rem]">
              <label htmlFor="filterType" className="sr-only">
                Filtrar por Tipo
              </label>
              <select
                id="filterType"
                name="filterType"
                value={filterType}
                onChange={(e) =>
                  setFilterType(
                    e.target.value as "All" | "Plant" | "Zombie"
                  )
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="All">Todos os Tipos</option>
                <option value="Plant">Plantas</option>
                <option value="Zombie">Zumbis</option>
              </select>
            </div>

            {/* 3. Classificar Por */}
            <div className="w-full max-w-[14rem]">
              <label htmlFor="sortBy" className="sr-only">
                Classificar por
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "name-asc"
                      | "name-desc"
                      | "cost-asc"
                      | "cost-desc"
                      | "recharge-asc"
                      | "recharge-desc"
                      | "plant-first"
                      | "zombie-first"
                  )
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option disabled>──────────</option>
                <option value="plant-first">Plantas Primeiro</option>
                <option value="zombie-first">Zumbis Primeiro</option>
                <option disabled>──────────</option>
                <option value="cost-asc">Custo Solar (Crescente)</option>
                <option value="cost-desc">Custo Solar (Decrescente)</option>
                <option disabled>──────────</option>
                <option value="recharge-asc">Recarga (Mais Rápida)</option>
                <option value="recharge-desc">Recarga (Mais Lenta)</option>
              </select>
            </div>
          </div>

          {/* Estatísticas de Cards */}
          <div className="flex justify-center md:justify-end space-x-4 mt-6">
            <div className="bg-gray-900/80 border border-green-500/30 px-6 py-3 rounded-lg text-center">
              <p className="text-green-400 font-bold text-2xl">
                {filteredCards.length}
              </p>
              <p className="text-gray-400 text-xs">Exibidas</p>
            </div>
            <div className="bg-gray-900/80 border border-purple-500/30 px-6 py-3 rounded-lg text-center">
              <p className="text-purple-400 font-bold text-2xl">
                {cards.length}
              </p>
              <p className="text-gray-400 text-xs">Totais</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500"></div>
              <p className="text-gray-400 text-lg mt-4">
                Carregando cartas...
              </p>
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-2xl font-bold text-red-500 mb-2">
              🚫 Nenhuma Carta Encontrada
            </p>
            <p className="text-sm text-yellow-500 mt-4">
              Verifique se a API ({BASE_API_URL}) está online ou ajuste seus
              filtros/busca.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {paginatedCards.map((card) => {
                const styles = getTypeStyles(card.type);
                const cardName =
                  card.name?.toUpperCase() || "CARTA DESCONHECIDA";
                const plantCard =
                  card.type === "Plant" ? (card as PlantCard) : null;
                const zombieCard =
                  card.type === "Zombie" ? (card as ZombieCard) : null;

                return (
                  <div
                    key={cardName}
                    onClick={() => handleCardClick(card)}
                    className={`group relative bg-gray-900 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 overflow-hidden cursor-pointer hover:${styles.shadow}`}
                  >
                    {/* Topo */}
                    <div className="relative pt-6 pb-2 px-4 flex flex-col items-center justify-center bg-gray-800/80">
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`${styles.badgeBg} px-3 py-1 rounded-full text-white text-xs font-bold shadow-md uppercase tracking-wider flex items-center space-x-1`}
                        >
                          <styles.icon className="w-3 h-3" />
                          <span>
                            {plantCard
                              ? plantCard["sun-production"]
                              : styles.title}
                          </span>
                        </span>
                      </div>

                      {card.image ? (
                        <img
                          src={getImageUrl(card.image)}
                          alt={card.name}
                          className="h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                          onError={(
                            e: SyntheticEvent<HTMLImageElement, Event>
                          ) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerHTML = `<div class="h-32 flex items-center justify-center text-7xl ${styles.iconColor}">${
                                card.type === "Zombie" ? "💀" : "🌿"
                              }</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div
                          className={`h-32 flex items-center justify-center text-7xl ${styles.iconColor}`}
                        >
                          {card.type === "Zombie" ? "💀" : "🌿"}
                        </div>
                      )}

                      <h3 className="text-white font-extrabold text-xl mt-2 text-center truncate uppercase tracking-widest">
                        • {cardName} •
                      </h3>
                    </div>

                    {/* Base */}
                    <div className="p-4 bg-gray-900 border-t border-gray-700/50">
                      <div className="flex justify-between items-center mb-4 bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center space-x-2">
                          {zombieCard ? (
                            <Skull className="w-5 h-5 text-red-500" />
                          ) : (
                            <Sun className="w-5 h-5 text-yellow-400" />
                          )}
                          <div className="text-left">
                            <p className="text-gray-500 text-xs">
                              {zombieCard ? "Toughness" : "Custo"}
                            </p>
                            <p
                              className={`font-extrabold text-lg ${
                                zombieCard
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {zombieCard
                                ? zombieCard.toughness
                                : plantCard?.cost || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="w-px h-10 bg-gray-700" />

                        <div className="flex items-center space-x-2">
                          {zombieCard ? (
                            <Zap className="w-5 h-5 text-red-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-400" />
                          )}
                          <div className="text-left">
                            <p className="text-gray-500 text-xs">
                              {zombieCard ? "Velocidade" : "Recarga"}
                            </p>
                            <p
                              className={`font-bold text-lg truncate ${
                                zombieCard
                                  ? "text-red-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {zombieCard
                                ? zombieCard.speed
                                : plantCard?.recharge || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20">
                        <Zap className="w-4 h-4" />
                        <span>Mais detalhes</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação numérica */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              {/* Botão Anterior */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold border border-gray-700 ${
                  currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Primeira página + reticências à esquerda, se necessário */}
              {visiblePages[0] > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 rounded-md text-sm font-semibold border ${
                      currentPage === 1
                        ? "bg-green-600 border-green-400 text-white"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    1
                  </button>
                  {visiblePages[0] > 2 && (
                    <span className="text-gray-400 text-sm px-1">...</span>
                  )}
                </>
              )}

              {/* Páginas visíveis (janela de até 5 páginas) */}
              {visiblePages.map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md text-sm font-semibold border ${
                      isActive
                        ? "bg-green-600 border-green-400 text-white"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Reticências à direita + última página, se necessário */}
              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <span className="text-gray-400 text-sm px-1">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-md text-sm font-semibold border ${
                      currentPage === totalPages
                        ? "bg-green-600 border-green-400 text-white"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Botão Próxima */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold border border-gray-700 ${
                  currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
        
      </section>

      {/* MODAL DE DETALHES */}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={closeModal}
          getImageUrl={getImageUrl}
        />
      )}

      {/* CTA Section e Footer */}
      <div className="mt-12 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700 p-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para montar seu deck?
          </h2>
          <p className="text-gray-400 mb-6">
            Selecione suas 12 plantas favoritas e crie estratégias imbatíveis
            contra os zumbis!
          </p>
          <button
            onClick={handleCreateDeck}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-200 inline-flex items-center space-x-3"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Meu Deck</span>
          </button>
        </div>
      </div>
      <footer className="relative border-t border-gray-800 bg-black/50 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Lawn of the Dead - Deck Builder - Projeto Universitário USF |
            Grupo 18
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Powered by PvZ 2 API | Plants vs Zombies 2
          </p>
        </div>
      </footer>
    </div>
  );
}
