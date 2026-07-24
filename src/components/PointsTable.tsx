import React, { useState } from 'react';
import { YearConfig, RoundEntry } from '../types';
import { Edit2, Check, X, ArrowUpRight, Minus, AlertTriangle } from 'lucide-react';

interface PointsTableProps {
  years: YearConfig[];
  rounds: RoundEntry[];
  activeYear: string;
  activeRound: number;
  onUpdatePoint: (roundNumber: number, yearId: string, value: number | null) => void;
  onUpdateZ4: (yearId: string, value: number | null) => void;
  onSelectActiveRound: (roundNumber: number) => void;
}

export const PointsTable: React.FC<PointsTableProps> = ({
  years,
  rounds,
  activeYear,
  activeRound,
  onUpdatePoint,
  onUpdateZ4,
  onSelectActiveRound,
}) => {
  const [editingCell, setEditingCell] = useState<{ round: number; yearId: string } | null>(null);
  const [editingZ4Year, setEditingZ4Year] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const handleStartEdit = (round: number, yearId: string, currentValue: number | null) => {
    setEditingCell({ round, yearId });
    setInputValue(currentValue !== null ? String(currentValue) : '');
  };

  const handleSaveEdit = (round: number, yearId: string) => {
    const parsed = inputValue.trim() === '' ? null : Number(inputValue);
    onUpdatePoint(round, yearId, isNaN(parsed as number) ? null : parsed);
    setEditingCell(null);
  };

  const handleStartEditZ4 = (yearId: string, currentValue: number | null) => {
    setEditingZ4Year(yearId);
    setInputValue(currentValue !== null ? String(currentValue) : '');
  };

  const handleSaveZ4 = (yearId: string) => {
    const parsed = inputValue.trim() === '' ? null : Number(inputValue);
    onUpdateZ4(yearId, isNaN(parsed as number) ? null : parsed);
    setEditingZ4Year(null);
  };

  // Get color classes for year columns matching Elegant Dark Theme
  const getYearBgHeader = (index: number) => {
    const colors = [
      'bg-white/10 text-white border-white/10',
      'bg-amber-400/15 text-amber-300 border-amber-400/20',
      'bg-emerald-400/15 text-emerald-300 border-emerald-400/20',
      'bg-purple-400/15 text-purple-300 border-purple-400/20',
    ];
    return colors[index % colors.length];
  };

  const getYearBgCell = (index: number, isActiveYear: boolean) => {
    if (isActiveYear) {
      return 'bg-white/5 text-white font-extrabold';
    }
    return 'bg-transparent text-white/80';
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm overflow-hidden shadow-2xl font-sans text-white">
      <div className="overflow-x-auto max-h-[720px] scrollbar-thin scrollbar-thumb-white/20">
        <table className="w-full text-center border-collapse">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-20 shadow-md">
            {/* Top Header Row */}
            <tr className="bg-[#0a0a0a] border-b border-white/10 text-white font-black text-xs sm:text-sm">
              <th className="py-2.5 px-3 border-r border-white/10 uppercase tracking-widest w-20 bg-[#141414]">
                RODADA
              </th>
              <th
                colSpan={years.length}
                className="py-2.5 px-3 uppercase tracking-widest bg-[#0a0a0a] text-xs font-black text-white/90"
              >
                TABELA COMPARATIVA DE PONTOS DA TEMPORADA
              </th>
            </tr>

            {/* Sub-Header Row: Years */}
            <tr className="border-b border-white/10 text-xs sm:text-sm font-bold">
              <th className="py-2 px-3 bg-[#141414] border-r border-white/10 text-white/50 font-mono">
                #
              </th>
              {years.map((y, idx) => {
                const isActive = y.id === activeYear;
                return (
                  <th
                    key={y.id}
                    className={`py-2 px-4 border-r border-white/10 uppercase tracking-widest font-black ${getYearBgHeader(
                      idx
                    )} ${isActive ? 'ring-2 ring-white z-10' : ''}`}
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <span>{y.label}</span>
                      {isActive && (
                        <span className="text-[9px] bg-white text-black px-1.5 py-0.2 rounded font-black tracking-normal">
                          Atual
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body: Rounds 1 to 38 */}
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm font-mono">
            {rounds.map((r) => {
              const isCurrentActiveRow = r.round === activeRound;

              return (
                <tr
                  key={r.round}
                  className={`transition-colors ${
                    isCurrentActiveRow
                      ? 'bg-white/10 font-black border-y border-white/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Round Number */}
                  <td
                    onClick={() => onSelectActiveRound(r.round)}
                    className={`py-2 px-3 border-r border-white/10 font-bold cursor-pointer transition-colors ${
                      isCurrentActiveRow
                        ? 'bg-white text-black font-black text-sm'
                        : 'bg-[#0d0d0d] text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    title="Clique para definir esta como a Rodada Atual"
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{r.round}</span>
                      {isCurrentActiveRow && (
                        <ArrowUpRight className="w-3 h-3 text-black" />
                      )}
                    </div>
                  </td>

                  {/* Points per Year Columns */}
                  {years.map((y, idx) => {
                    const pointsVal = r.points[y.id];
                    const isEditing =
                      editingCell?.round === r.round && editingCell?.yearId === y.id;

                    // Calculate point increase from previous round
                    const prevPoints =
                      r.round > 1 ? rounds[r.round - 2]?.points[y.id] : 0;
                    const diff =
                      pointsVal !== null && pointsVal !== undefined && prevPoints !== null && prevPoints !== undefined
                        ? pointsVal - prevPoints
                        : null;

                    return (
                      <td
                        key={y.id}
                        onClick={() => !isEditing && handleStartEdit(r.round, y.id, pointsVal)}
                        className={`py-2 px-3 border-r border-white/10 relative group cursor-pointer ${getYearBgCell(
                          idx,
                          y.id === activeYear
                        )}`}
                      >
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-1">
                            <input
                              type="number"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(r.round, y.id);
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              autoFocus
                              className="w-14 text-center font-bold text-black bg-white border border-white rounded px-1 py-0.5 text-xs focus:outline-none"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(r.round, y.id);
                              }}
                              className="p-1 bg-emerald-500 text-black rounded hover:bg-emerald-400 font-bold"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCell(null);
                              }}
                              className="p-1 bg-neutral-700 text-white rounded hover:bg-neutral-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-1">
                            <span className="font-mono font-extrabold text-sm sm:text-base text-white">
                              {pointsVal !== null && pointsVal !== undefined
                                ? pointsVal
                                : ''}
                            </span>

                            {/* Diff badge on hover or if recent win */}
                            {diff !== null && diff > 0 && (
                              <span
                                className={`text-[10px] px-1 rounded font-sans font-bold ml-1 ${
                                  diff === 3
                                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                                    : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                                }`}
                                title={`Ganhou +${diff} pt(s) nesta rodada`}
                              >
                                +{diff}
                              </span>
                            )}

                            {/* Pencil Icon on Hover */}
                            <Edit2 className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1.5 top-2.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Footer Row: PRIMEIRO Z4 (Matches Elegant Dark Theme) */}
          <tfoot>
            <tr className="bg-white text-black border-t-2 border-white font-black text-xs sm:text-sm shadow-2xl">
              <td className="py-3 px-3 uppercase tracking-widest text-left pl-4 border-r border-black/20">
                PRIMEIRO Z4
              </td>
              {years.map((y) => {
                const isEditing = editingZ4Year === y.id;
                const z4Val = y.z4Points;

                return (
                  <td
                    key={y.id}
                    onClick={() => !isEditing && handleStartEditZ4(y.id, z4Val)}
                    className="py-3 px-3 border-r border-black/20 text-center font-mono font-black text-sm sm:text-base cursor-pointer hover:bg-gray-200 relative group"
                  >
                    {isEditing ? (
                      <div className="flex items-center justify-center space-x-1">
                        <input
                          type="number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveZ4(y.id);
                            if (e.key === 'Escape') setEditingZ4Year(null);
                          }}
                          autoFocus
                          className="w-16 text-center font-bold text-white bg-black border border-black rounded px-1 py-0.5 text-xs"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveZ4(y.id);
                          }}
                          className="p-1 bg-black text-white rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-1">
                        <span>{z4Val !== null ? z4Val : '?'}</span>
                        <Edit2 className="w-3 h-3 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
