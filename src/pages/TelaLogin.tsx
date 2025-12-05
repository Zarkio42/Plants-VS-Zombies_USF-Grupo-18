import React, { useState } from 'react';
import { Skull, Leaf, User, Lock, Eye, EyeOff, Zap } from 
'lucide-react';
import { useNavigate } from "react-router-dom";

type Faction = 'zombie' | 'plant' | null;
type Screen = 'login' | 'register';

export default function PvZLoginScreen() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedFaction, setSelectedFaction] = useState<Faction>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const handleLogin = (): void => {
    if (username && password && selectedFaction) {
      alert(`Bem-vindo ao campo de batalha como ${selectedFaction === 'zombie' ? 'ZUMBI' : 'PLANTA'}! 🎮`);navigate('/batalha');
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleRegister = (): void => {
    if (username && email && password && confirmPassword && selectedFaction) {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }
      alert(`Conta criada com sucesso como ${selectedFaction === 'zombie' ? 'ZUMBI' : 'PLANTA'}! 🎮`);

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedFaction(null);
      setCurrentScreen('login');
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      if (currentScreen === 'login') {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeito de partículas de fundo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-600 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Card de Login */}
      <div className={`relative z-10 w-full max-w-md ${isShaking ? 'animate-bounce' : ''}`}>
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700 rounded-2xl shadow-2xl shadow-green-900/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-green-900 p-6 text-center relative">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative">
              <div className="flex justify-center gap-4 mb-3">
                <div className="p-3 bg-green-600/30 rounded-full animate-pulse">
                  <Leaf className="w-10 h-10 text-green-400" strokeWidth={2.5} />
                </div>
                <div className="p-3 bg-gray-700/30 rounded-full animate-pulse delay-500">
                  <Skull className="w-10 h-10 text-gray-400" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-wider">
                PLANTS VS ZOMBIES
              </h1>
              <p className="text-green-300 text-sm uppercase tracking-widest">
                {currentScreen === 'login' ? 'Card Battle Arena' : 'Criar Nova Conta'}
              </p>
            </div>
          </div>

          {/* Seleção de Facção */}
          <div className="p-6 pb-4">
            <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" />
              Escolha seu lado
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Botão Planta */}
              <button
                onClick={() => setSelectedFaction('plant')}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedFaction === 'plant'
                    ? 'border-green-500 bg-green-600/20 shadow-lg shadow-green-500/50'
                    : 'border-gray-700 bg-gray-800/50 hover:border-green-600'
                }`}
              >
                <Leaf className={`w-12 h-12 mx-auto mb-2 ${
                  selectedFaction === 'plant' ? 'text-green-400' : 'text-gray-500'
                }`} />
                <p className={`font-bold uppercase text-sm ${
                  selectedFaction === 'plant' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  Planta
                </p>
              </button>

              {/* Botão Zumbi */}
              <button
                onClick={() => setSelectedFaction('zombie')}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedFaction === 'zombie'
                    ? 'border-red-500 bg-red-600/20 shadow-lg shadow-red-500/50'
                    : 'border-gray-700 bg-gray-800/50 hover:border-red-600'
                }`}
              >
                <Skull className={`w-12 h-12 mx-auto mb-2 ${
                  selectedFaction === 'zombie' ? 'text-red-400' : 'text-gray-500'
                }`} />
                <p className={`font-bold uppercase text-sm ${
                  selectedFaction === 'zombie' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  Zumbi
                </p>
              </button>
            </div>
          </div>

          {/* Formulário */}
          <div className="px-6 pb-6 space-y-4">
            {currentScreen === 'login' ? (
              <>
                {/* Campo Username */}
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Usuário
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                      placeholder="Digite seu usuário"
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all pr-12"
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Opções */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-green-600 focus:ring-green-600" />
                    <span>Lembrar-me</span>
                  </label>
                  <button className="text-green-500 hover:text-green-400 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Botão de Login */}
                <button 
                  onClick={handleLogin}
                  className={`w-full font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                    selectedFaction === 'plant'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-green-900/50'
                      : selectedFaction === 'zombie'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-900/50'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedFaction}
                >
                  {selectedFaction ? 'Entrar na Batalha' : 'Escolha uma facção'}
                </button>

                {/* Divisor */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900/90 text-gray-400 uppercase tracking-wide">
                      Ou
                    </span>
                  </div>
                </div>

                {/* Botão de Registro */}
                <button
                  type="button"
                  onClick={() => setCurrentScreen('register')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg uppercase tracking-wider transition-all border-2 border-gray-700 hover:border-gray-600"
                >
                  Criar Nova Conta
                </button>
              </>
            ) : (
              <>
                {/* Formulário de Registro */}
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="Escolha um usuário"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all pr-12"
                      placeholder="Crie uma senha forte"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all pr-12"
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Botão de Criar Conta */}
                <button
                  onClick={handleRegister}
                  className={`w-full font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                    selectedFaction === 'plant'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-green-900/50'
                      : selectedFaction === 'zombie'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-900/50'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedFaction}
                >
                  {selectedFaction ? 'Criar Conta e Batalhar' : 'Escolha uma facção'}
                </button>

                {/* Botão Voltar */}
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg uppercase tracking-wider transition-all border-2 border-gray-700 hover:border-gray-600"
                >
                  Voltar ao Login
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-black/40 p-4 text-center text-xs text-gray-500 border-t border-gray-800">
            <p>Defenda ou invada!</p>
          </div>
        </div>

        {/* Texto decorativo */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {selectedFaction === 'plant' && 'Defenda seu jardim com estratégia!'}
            {selectedFaction === 'zombie' && 'Invada e conquiste o território!'}
            {!selectedFaction && 'Escolha seu lado e prepare seu deck'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}