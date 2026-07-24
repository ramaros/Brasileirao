import React from 'react';
import { CalculatedStats } from '../types';
import { formatPercentage } from '../utils/calc';
import { Target, Trophy, Flame, TrendingUp } from 'lucide-react';

interface GoalDashboardProps {
  stats: CalculatedStats;
  metaPoints: number;
  onUpdateMeta: (newMeta: number) => void;
  activeYearLabel: string;
}

export const GoalDashboard: React.FC<GoalDashboardProps> = ({
  stats,
  metaPoints,
  onUpdateMeta,
  activeYearLabel,
}) => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm p-5 space-y-5 text-white shadow-xl">
      {/* Title & Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-sm p-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-5 bg-white rounded-full"></div>
          <span className="font-extrabold text-white uppercase tracking-wider text-xs font-sans">
            META & APROVEITAMENTO ({activeYearLabel})
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold uppercase text-white/50 tracking-wider">Definir Meta:</label>
          <div className="relative flex items-center">
            <input
              type="number"
              min="0"
              max="114"
              value={metaPoints}
              onChange={(e) => onUpdateMeta(Number(e.target.value) || 0)}
              className="w-20 text-center font-mono font-black text-2xl text-white bg-black border-b-2 border-white rounded-none py-0.5 focus:outline-none"
            />
            <span className="ml-1.5 text-xs font-bold text-white/60">pts</span>
          </div>
        </div>
      </div>

      {/* Main Target Statements (Exact Replica of Figure 2) */}
      <div className="space-y-2.5 font-mono">
        {/* Point Target Statement */}
        <div className="bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-center text-white/90 font-bold text-xs sm:text-sm tracking-tight uppercase">
          PRECISA DE <span className="text-amber-400 font-mono font-black text-base sm:text-lg underline underline-offset-4 decoration-2">{stats.neededPointsForMeta}</span> DOS <span className="font-mono font-black text-white">{stats.remainingPointsToBePlayed}</span> PONTOS A SEREM DISPUTADOS
        </div>

        {/* Win Target Statement */}
        <div className="bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-center text-white/90 font-bold text-xs sm:text-sm tracking-tight uppercase">
          VENCER <span className="text-emerald-400 font-mono font-black text-base sm:text-lg underline underline-offset-4 decoration-2">{stats.winsNeededForMeta}</span> DOS <span className="font-mono font-black text-white">{stats.pendingRounds}</span> JOGOS RESTANTES
        </div>
      </div>

      {/* Yield Comparisons (Exact Replica of Figure 2 Bottom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Current Yield */}
        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-stretch">
          <div className="flex-1 p-3 flex items-center justify-start text-[11px] sm:text-xs font-extrabold text-white/70 uppercase tracking-tight">
            APROVEITAMENTO ATUAL
          </div>
          <div className="bg-red-600/90 text-white font-mono font-black text-sm sm:text-base px-4 flex items-center justify-center min-w-[95px] border-l border-red-500">
            {formatPercentage(stats.currentYield)}
          </div>
        </div>

        {/* Needed Yield to Reach Meta */}
        <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-stretch">
          <div className="flex-1 p-3 flex items-center justify-start text-[11px] sm:text-xs font-extrabold text-white/70 uppercase tracking-tight">
            APROVEITAMENTO PARA CHEGAR NA META
          </div>
          <div className="bg-amber-400 text-black font-mono font-black text-sm sm:text-base px-4 flex items-center justify-center min-w-[95px] border-l border-amber-300">
            {formatPercentage(stats.neededYield)}
          </div>
        </div>
      </div>

      {/* Target Presets Helper Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
        <span className="font-bold text-white/40 uppercase text-[10px] tracking-wider">Atalhos de Meta:</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { pts: 45, label: '45 pts (Permanência)' },
            { pts: 46, label: '46 pts (Segurança)' },
            { pts: 55, label: '55 pts (Sul-Americana)' },
            { pts: 63, label: '63 pts (G4 / Libertadores)' },
          ].map((item) => (
            <button
              key={item.pts}
              onClick={() => onUpdateMeta(item.pts)}
              className={`px-2.5 py-1 rounded-xs text-[11px] font-bold border transition-colors uppercase tracking-tight ${
                metaPoints === item.pts
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
