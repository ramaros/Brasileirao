import React, { useState } from 'react';
import { YearConfig, AppData } from '../types';
import { X, Settings, RotateCcw, Plus, Trash2, Calendar, Target } from 'lucide-react';

interface YearSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AppData;
  onUpdateMeta: (meta: number) => void;
  onUpdateZ4: (yearId: string, z4Points: number | null) => void;
  onAddYear: (yearLabel: string) => void;
  onRemoveYear: (yearId: string) => void;
  onResetToInitial: () => void;
}

export const YearSettingsModal: React.FC<YearSettingsModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateMeta,
  onUpdateZ4,
  onAddYear,
  onRemoveYear,
  onResetToInitial,
}) => {
  const [newYearLabel, setNewYearLabel] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleAddNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearLabel.trim()) return;
    onAddYear(newYearLabel.trim());
    setNewYearLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#0d0d0d] border border-white/20 rounded-sm max-w-lg w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#141414] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-5 h-5 text-white" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Configurações & Metas
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target / Meta Setting */}
          <div className="bg-[#141414] border border-white/10 rounded-xs p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                Meta de Pontos ({data.settings.activeYear}):
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="0"
                  max="114"
                  value={data.settings.metaPoints}
                  onChange={(e) => onUpdateMeta(Number(e.target.value) || 0)}
                  className="w-20 text-center font-mono font-black text-lg bg-black text-white border border-white/20 rounded-xs py-1 focus:outline-none focus:border-white"
                />
                <span className="text-xs font-bold text-white/50">pts</span>
              </div>
            </div>
            <p className="text-[11px] text-white/40">
              A meta padrão costuma ser 45–46 pontos para permanência ou 63–65 pontos para G4/Libertadores.
            </p>
          </div>

          {/* Manage Z4 per Year */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-white" />
              Pontuação "PRIMEIRO Z4" por Ano:
            </h4>

            <div className="space-y-2">
              {data.years.map((y) => (
                <div
                  key={y.id}
                  className="flex items-center justify-between bg-[#141414] p-3 rounded-xs border border-white/10"
                >
                  <span className="font-extrabold text-xs uppercase tracking-wider text-white">
                    Ano {y.label}
                  </span>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-[11px] text-white/40 uppercase">1º Z4:</span>
                      <input
                        type="number"
                        placeholder="?"
                        value={y.z4Points !== null ? y.z4Points : ''}
                        onChange={(e) => {
                          const val = e.target.value.trim() === '' ? null : Number(e.target.value);
                          onUpdateZ4(y.id, isNaN(val as number) ? null : val);
                        }}
                        className="w-16 text-center font-mono font-bold text-white bg-black border border-white/20 rounded-xs px-2 py-1 text-xs focus:outline-none focus:border-white"
                      />
                      <span className="text-[11px] text-white/40">pts</span>
                    </div>

                    {data.years.length > 1 && (
                      <button
                        onClick={() => onRemoveYear(y.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                        title="Remover este ano da tabela"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Year */}
          <form onSubmit={handleAddNewYear} className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider">
              Cadastrar Novo Ano / Coluna:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ex: 2027"
                value={newYearLabel}
                onChange={(e) => setNewYearLabel(e.target.value)}
                className="flex-1 bg-black border border-white/20 rounded-xs px-3 py-2 text-white font-mono font-bold text-xs focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="flex items-center space-x-1 bg-white text-black hover:bg-neutral-200 font-black text-xs uppercase tracking-tight px-4 py-2 rounded-xs transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </form>

          {/* Reset to Original Spreadsheet Data */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar dados iniciais da planilha</span>
              </button>
            ) : (
              <div className="bg-red-950/80 border border-red-500/40 p-3 rounded-xs space-y-2">
                <p className="text-xs text-red-200 font-medium">
                  Tem certeza? Isso vai restaurar os dados com os padrões da planilha.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onResetToInitial();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xs uppercase"
                  >
                    Confirmar Restauração
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-xs uppercase"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#141414] px-6 py-4 flex justify-end border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-bold transition-colors uppercase"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
