import React from 'react';
import { Shield, RefreshCw, LogIn, LogOut, Settings, CloudCheck, CloudOff, User as UserIcon, Calendar, Trophy } from 'lucide-react';
import { User } from 'firebase/auth';
import { YearConfig } from '../types';
import galoVolpiImg from '../assets/images/galo_volpi_1784906646668.jpg';

interface HeaderProps {
  years: YearConfig[];
  activeYear: string;
  activeRound: number;
  onSelectYear: (yearId: string) => void;
  onSelectRound: (round: number) => void;
  onOpenQuickUpdate: () => void;
  onOpenSettings: () => void;
  user: User | null;
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
  isFirestoreConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  years,
  activeYear,
  activeRound,
  onSelectYear,
  onSelectRound,
  onOpenQuickUpdate,
  onOpenSettings,
  user,
  isSyncing,
  onLogin,
  onLogout,
  isFirestoreConnected,
}) => {
  return (
    <header className="bg-[#0a0a0a] text-white border-b border-white/10 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 bg-white text-black font-black rounded-lg shadow-lg shadow-white/5 border border-white/20 group">
            <Trophy className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                Brasileirão <span className="text-white/60 font-light text-sm italic tracking-normal ml-1">Painel Alvinegro</span>
                <img
                  src={galoVolpiImg}
                  alt="Galo Volpi"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded border border-white/20 object-cover shadow-sm inline-block ml-1"
                />
              </h1>
            </div>
            <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold">
              Performance Galo • 2024–2026
            </p>
          </div>
        </div>

        {/* Controls: Year selector, Round Selector, Quick Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center bg-[#161616] rounded-md p-1 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              Ano:
            </span>
            <div className="flex space-x-1">
              {years.map((y) => (
                <button
                  key={y.id}
                  onClick={() => onSelectYear(y.id)}
                  className={`px-3 py-1 text-xs font-black tracking-wide uppercase transition-all rounded ${
                    activeYear === y.id
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Round Selector */}
          <div className="flex items-center bg-[#161616] rounded-md px-3 py-1 border border-white/10 space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Rodada:</span>
            <select
              value={activeRound}
              onChange={(e) => onSelectRound(Number(e.target.value))}
              className="bg-[#0a0a0a] text-white font-mono font-bold text-xs rounded border border-white/20 px-2 py-1 focus:outline-none focus:border-white"
            >
              {Array.from({ length: 38 }, (_, i) => i + 1).map((r) => (
                <option key={r} value={r}>
                  Rodada {r}
                </option>
              ))}
            </select>
          </div>

          {/* Action Button: Update Points */}
          <button
            onClick={onOpenQuickUpdate}
            className="flex items-center space-x-1.5 bg-white text-black hover:bg-neutral-200 font-black text-xs uppercase tracking-tight px-4 py-2 rounded-md shadow-lg transition-transform active:scale-95"
            title="Lançar/Atualizar resultado da rodada"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Pontos</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-white/60 hover:text-white bg-[#161616] hover:bg-white/10 rounded-md border border-white/10 transition-colors"
            title="Configurações e Metas"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sync & Auth Status */}
          <div className="flex items-center pl-2 border-l border-white/10 space-x-2">
            {isSyncing ? (
              <span className="flex items-center text-[10px] text-amber-400 font-mono animate-pulse">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Sync...
              </span>
            ) : isFirestoreConnected ? (
              <span className="flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full" title="Conectado ao Firebase Firestore">
                <CloudCheck className="w-3 h-3 mr-1" /> Firebase
              </span>
            ) : (
              <span className="flex items-center text-[10px] font-mono text-white/40 bg-[#161616] border border-white/10 px-2 py-0.5 rounded-full" title="Modo Local (Cache de Navegador)">
                <CloudOff className="w-3 h-3 mr-1" /> Local
              </span>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full border border-white/30" />
                ) : (
                  <div className="w-7 h-7 bg-white text-black font-extrabold rounded-full flex items-center justify-center text-xs">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                  title="Sair da conta Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1 text-xs font-bold text-white/80 hover:text-white bg-[#161616] hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition-colors"
                title="Login Google para sincronizar em múltiplos dispositivos"
              >
                <LogIn className="w-3.5 h-3.5 text-white" />
                <span className="hidden lg:inline uppercase text-[10px] tracking-wider">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
