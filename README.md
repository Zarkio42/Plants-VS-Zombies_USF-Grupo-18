# Lawn of the Dead – Deck Builder 🧟🌿

SPA em **React + TypeScript + Vite** para explorar cartas de *Plants vs Zombies 2*, montar decks e salvar até **3 composições** no navegador.

<img width="1900" height="905" alt="image" src="https://github.com/user-attachments/assets/07bb73a5-a5e2-4d59-89cb-5d7f2902c19b" />


---

## 🌐 Visão Geral

- **Nome:** Lawn of the Dead – Deck Builder  
- **Tipo:** Single Page Application (SPA)  
- **Funções principais:**
  - Explorar cartas de plantas e zumbis.
  - Montar decks com **12 cartas**.
  - Salvar até **3 decks** no `localStorage` com opção de edição e exclusão.
- **Rotas:**
  - `/` e `/login` – Login/registro com escolha de facção (planta/zumbi).
  - `/batalha` – Listagem/consulta de cartas.
  - `/deck` – Construtor de deck com 12 slots e gerenciamento de até 3 decks.

---

## 📱 Tecnologias Utilizadas

- **Frontend**
  - React 19
  - TypeScript
  - Vite
  - React Router 7
  - React Query 5 (`@tanstack/react-query`)
  - Tailwind CSS
  - Ícones: `lucide-react`
- **API**
  - Proxy configurado em `vite.config.ts`  
    - Prefixo: `/api`  
    - Destino: `https://pvz-2-api.vercel.app`

---

## Dados & Hooks

- `src/hooks/useCards.tsx`
  - Busca listas de plantas e zumbis via React Query.
  - Consulta detalhes individuais de cartas.
  - Normaliza campos como: `cost`, `recharge`, `toughness`, `speed`, etc.
- `src/hooks/useDecks.tsx`
  - CRUD em `localStorage` usando a chave **`pvz_decks`**.
  - Controle de:
    - Criação, atualização e exclusão de decks.
    - `id` gerado (UUID/Date).
    - `createdAt`/`updatedAt` para exibir decks recentes.
- **Modelos**
  - `src/interfaces/cards.tsx`
  - `src/interfaces/saveDeck.tsx`

---

## Fluxo das Telas

### `/login` – Tela de Login/Registro
- Componente: `src/pages/TelaLogin.tsx`
- Funcionalidades:
  - Interface estilizada de login/registro.
  - Escolha de facção: **Plantas** ou **Zumbis**.
  - Mensagens de feedback básicas (simulação de auth).
  - Redireciona para `/batalha` após login.

### `/batalha` – Catálogo de Cartas (Home)
- Componente: `src/pages/Home.tsx`
- Recursos:
  - **Busca por nome**.
  - **Filtro por tipo**: Plant / Zombie / Todos.
  - **Ordenação**:
    - Nome (A–Z / Z–A)
    - Custo solar (crescente/decrescente)
    - Recarga (rápida/lenta)
    - Priorizar plantas ou zumbis.
  - **Paginação** com controle de páginas.
  - Card de cada carta com:
    - Imagem.
    - Custo/Toughness.
    - Recarga/Velocidade.
  - **Modal de detalhes**:
    - Imagem em destaque.
    - Custo/Resistência.
    - Recarga/Velocidade.
    - Atributos extras (família, alcance, especial, etc.).
  - **Decks recentes**:
    - Lê do `localStorage` (`pvz_decks`).
    - Exibe até 3 decks mais recentes para acesso rápido.
  - CTA para criação de deck: botão “Criar Deck”.

### `/deck` – Construtor de Deck
- Componente: `src/pages/Deck.tsx`
- Funcionalidades:
  - **12 slots** para cartas (plantas ou zumbis).
  - Impede **duplicatas** no mesmo deck.
  - Exibe estatísticas rápidas da carta no slot.
  - **Gerenciamento de até 3 decks:**
    - Alternar entre índices **1, 2 e 3**.
    - Carregar deck salvo no construtor.
    - Editar e salvar novamente.
    - Excluir deck para liberar slot.
  - Persistência em `localStorage` (chave `pvz_decks`).
  - **Modal de seleção**:
    - Busca por nome.
    - Filtro de tipo (All / Plant / Zombie).
    - Listagem com custo/toughness e imagem.

### `src/App.tsx` / `src/main.tsx`
- Define as **rotas** principais.
- Integra **React Query** e **React Query DevTools**.

---

## 📂 Estrutura do Projeto (Resumo)

- `src/pages`
  - `TelaLogin.tsx`
  - `Home.tsx` (batalha/listagem de cartas)
  - `Deck.tsx` (deck builder)
- `src/hooks`
  - `useCards.tsx`
  - `useDecks.tsx`
- `src/interfaces`
  - `cards.tsx`
  - `saveDeck.tsx`
- `src/assets` / `src/imagens`
  - Logos, fundos e outros visuais.
- Estilos globais: `src/index.css` (Tailwind configurado).

---

## Pré-requisitos

- **Node.js:** 18+ (recomendado)  
- **API PvZ 2:** acessível em  
  `https://pvz-2-api.vercel.app`  
  (proxy via `/api` já configurado para desenvolvimento local)

## Observações

- **Sem Back-End Próprio** autenticação é apenas simulada via alerts/fluxo de UI.
- Decks ficam apenas no navegador (localStorage); limpar storage perde os dados.
- Caso a API esteja offline ou CORS bloqueie, a listagem de cartas não será carregada.
