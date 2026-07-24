import React from 'react';
import { CalculatedStats } from '../types';
import { formatPercentage } from '../utils/calc';
import { BarChart3, HelpCircle } from 'lucide-react';

interface SummaryCardProps {
  stats: CalculatedStats;
  activeRound: number;
  onSelectRound: (r: number) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  stats,
  activeRound,
  onSelectRound,
}) => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm p-5 shadow-xl space-y-4 font-sans text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-white/80" />
          <h2 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-widest">
            STATUS DA RODADA {activeRound}
          </h2>
        </div>
        <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider">
          38 Rodadas Totais
        </span>
      </div>

      {/* Spreadsheet List Format Matching Elegant Dark Theme */}
      <div className="divide-y divide-white/10 font-mono text-xs sm:text-sm">
        {/* Section 1: Progress */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-white/60 uppercase text-[11px] sm:text-xs tracking-wider">
              RODADA ATUAL
            </span>
            <div className="flex items-center space-x-1">
              <select
                value={activeRound}
                onChange={(e) => onSelectRound(Number(e.target.value))}
                className="font-bold text-white text-right bg-black border border-white/20 rounded-xs px-2 py-0.5 focus:outline-none focus:border-white text-xs cursor-pointer"
              >
                {Array.from({ length: 38 }, (_, i) => i + 1).map((r) => (
                  <option key={r} value={r}>
                    {r} / 38
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-white/60 uppercase text-[11px] sm:text-xs tracking-wider">
              RODADAS PENDENTES
            </span>
            <span className="font-mono font-bold text-white pr-1">
              {stats.pendingRounds}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-white/60 uppercase text-[11px] sm:text-xs tracking-wider">
              PONTOS FALTANTES
            </span>
            <span className="font-mono font-bold text-white pr-1">
              {stats.remainingPointsToBePlayed}
            </span>
          </div>
        </div>

        {/* Section 2: Conquered */}
        <div className="py-2.5 space-y-1.5 bg-white/5 -mx-5 px-5">
          <div className="flex justify-between items-center py-1 relative">
            <span className="font-bold text-white uppercase text-[11px] sm:text-xs tracking-wider">
              PONTOS CONQUISTADOS
            </span>
            <div className="relative pr-1">
              <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
                {stats.currentPoints}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-white/60 uppercase text-[11px] sm:text-xs tracking-wider">
              PONTOS DISPUTADOS
            </span>
            <span className="font-mono font-bold text-white pr-1">
              {stats.disputedPoints}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-white/60 uppercase text-[11px] sm:text-xs tracking-wider">
              APROVEITAMENTO
            </span>
            <span className="font-mono font-bold text-white pr-1">
              {formatPercentage(stats.currentYield)}
            </span>
          </div>
        </div>

        {/* Section 3: Projections */}
        <div className="py-2.5 space-y-1.5">
          <div className="flex justify-between items-center py-1 relative">
            <span className="font-bold text-white/90 uppercase text-[11px] sm:text-xs tracking-wider">
              PRECISA FAZER
            </span>
            <div className="relative pr-1">
              <span className="font-mono font-black text-amber-400 text-base sm:text-lg">
                {stats.neededPointsForMeta}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1 relative">
            <span className="font-bold text-white/90 uppercase text-[11px] sm:text-xs tracking-wider">
              ESTIMATIVA VITÓRIAS
            </span>
            <div className="relative pr-1">
              <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
                {stats.winsNeededForMeta}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white/90 uppercase text-[11px] sm:text-xs tracking-wider">
                SÓ PODE PERDER MAIS
              </span>
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5 text-white/40" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-black border border-white/20 text-white text-[11px] rounded shadow-2xl z-20 font-sans font-normal">
                  Número de jogos dos {stats.pendingRounds} restantes onde o Galo pode tropeçar sem comprometer a meta de {stats.neededPointsForMeta} pts.
                </div>
              </div>
            </div>
            <span className="font-mono font-black text-red-500 text-base sm:text-lg pr-1">
              {stats.lossesAllowed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
