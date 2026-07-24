import React, { useState, useEffect } from 'react';
import { YearConfig, RoundEntry, MatchResult } from '../types';
import { X, Trophy, Check, Plus, Minus, RotateCcw } from 'lucide-react';

interface EditRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  years: YearConfig[];
  rounds: RoundEntry[];
  activeYear: string;
  activeRound: number;
  onSavePoints: (round: number, yearId: string, totalPoints: number | null) => void;
  onAutoPropagate: (startRound: number, yearId: string) => void;
}

export const EditRoundModal: React.FC<EditRoundModalProps> = ({
  isOpen,
  onClose,
  years,
  rounds,
  activeYear,
  activeRound,
  onSavePoints,
  onAutoPropagate,
}) => {
  const [selectedRound, setSelectedRound] = useState<number>(activeRound);
  const [selectedYear, setSelectedYear] = useState<string>(activeYear);
  const [customPoints, setCustomPoints] = useState<string>('');

  useEffect(() => {
    setSelectedRound(activeRound);
    setSelectedYear(activeYear);
  }, [activeRound, activeYear, isOpen]);

  useEffect(() => {
    const rObj = rounds.find((r) => r.round === selectedRound);
    const pts = rObj?.points[selectedYear];
    setCustomPoints(pts !== null && pts !== undefined ? String(pts) : '');
  }, [selectedRound, selectedYear, rounds]);

  if (!isOpen) return null;

  const prevRoundPoints =
    selectedRound > 1
      ? rounds.find((r) => r.round === selectedRound - 1)?.points[selectedYear] ?? 0
      : 0;

  const handleApplyResult = (result: MatchResult) => {
    let newTotal = prevRoundPoints;
    if (result === 'win') newTotal += 3;
    if (result === 'draw') newTotal += 1;
    if (result === 'loss') newTotal += 0;

    onSavePoints(selectedRound, selectedYear, newTotal);
    setCustomPoints(String(newTotal));
  };

  const handleSaveDirect = () => {
    const val = customPoints.trim() === '' ? null : Number(customPoints);
    onSavePoints(selectedRound, selectedYear, isNaN(val as number) ? null : val);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#0d0d0d] border border-white/20 rounded-sm max-w-md w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#141414] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-white" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Lançar Resultado da Rodada
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Round & Year Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase mb-1 tracking-wider">
                Ano:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xs px-3 py-2 text-white font-mono font-bold text-xs focus:outline-none focus:border-white"
              >
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase mb-1 tracking-wider">
                Rodada:
              </label>
              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(Number(e.target.value))}
                className="w-full bg-black border border-white/20 rounded-xs px-3 py-2 text-white font-mono font-bold text-xs focus:outline-none focus:border-white"
              >
                {Array.from({ length: 38 }, (_, i) => i + 1).map((r) => (
                  <option key={r} value={r}>
                    Rodada {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Match Result Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                Lançar Resultado do Jogo:
              </label>
              <span className="text-[11px] text-white/40 font-mono">
                Anterior: <strong className="text-white">{prevRoundPoints} pts</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleApplyResult('win')}
                className="flex flex-col items-center justify-center p-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-xs transition-all active:scale-95 group"
              >
                <span className="text-emerald-400 font-black text-xs uppercase tracking-wider group-hover:scale-105">
                  Vitória
                </span>
                <span className="text-[10px] text-emerald-300 font-mono font-bold mt-0.5">
                  +3 pts ({prevRoundPoints + 3})
                </span>
              </button>

              <button
                onClick={() => handleApplyResult('draw')}
                className="flex flex-col items-center justify-center p-3 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 rounded-xs transition-all active:scale-95 group"
              >
                <span className="text-amber-400 font-black text-xs uppercase tracking-wider group-hover:scale-105">
                  Empate
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">
                  +1 pt ({prevRoundPoints + 1})
                </span>
              </button>

              <button
                onClick={() => handleApplyResult('loss')}
                className="flex flex-col items-center justify-center p-3 bg-red-950/80 hover:bg-red-900 border border-red-500/40 rounded-xs transition-all active:scale-95 group"
              >
                <span className="text-red-400 font-black text-xs uppercase tracking-wider group-hover:scale-105">
                  Derrota
                </span>
                <span className="text-[10px] text-red-300 font-mono font-bold mt-0.5">
                  +0 pt ({prevRoundPoints})
                </span>
              </button>
            </div>
          </div>

          {/* Direct Point Input */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-[11px] font-bold text-white/50 uppercase tracking-wider">
              Ou digite o total acumulado diretamente:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                placeholder="Ex: 24"
                className="flex-1 bg-black border border-white/20 rounded-xs px-3 py-2 text-center text-white font-mono font-black text-lg focus:outline-none focus:border-white"
              />
              <button
                onClick={() => setCustomPoints('')}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xs text-xs font-bold transition-colors uppercase border border-white/10"
                title="Limpar campo"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#141414] px-6 py-4 flex items-center justify-between border-t border-white/10">
          <button
            onClick={() => {
              onSavePoints(selectedRound, selectedYear, null);
              setCustomPoints('');
            }}
            className="text-[11px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          >
            Remover
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-bold transition-colors uppercase"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveDirect}
              className="px-5 py-2 bg-white text-black hover:bg-neutral-200 rounded-xs text-xs font-black uppercase tracking-tight shadow transition-transform active:scale-95"
            >
              Salvar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
