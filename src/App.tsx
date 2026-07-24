import React, { useState, useEffect, useMemo } from 'react';
import { AppData } from './types';
import { INITIAL_APP_DATA } from './data/initialData';
import { calculateStats } from './utils/calc';
import { Header } from './components/Header';
import { GoalDashboard } from './components/GoalDashboard';
import { SummaryCard } from './components/SummaryCard';
import { PointsTable } from './components/PointsTable';
import { EditRoundModal } from './components/EditRoundModal';
import { YearSettingsModal } from './components/YearSettingsModal';
import galoVolpiImg from './assets/images/galo_volpi_1784906646668.jpg';
import {
  auth,
  loginWithGoogle,
  logoutFirebase,
  saveToFirestore,
  loadFromFirestore,
} from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { AlertCircle, ArrowUpRight, Trophy, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'brasileirao_galo_app_data_v1';

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rounds && parsed.years) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read local storage, using initial data", e);
    }
    return INITIAL_APP_DATA;
  });

  const [user, setUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Monitor Auth State & Load initial Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsSyncing(true);
        const cloudData = await loadFromFirestore(currentUser.uid);
        if (cloudData && cloudData.rounds) {
          setAppData(cloudData);
          setIsFirestoreConnected(true);
        } else {
          // Push current local data to new user account
          await saveToFirestore(appData, currentUser.uid);
          setIsFirestoreConnected(true);
        }
        setIsSyncing(false);
      } else {
        // Try loading global default doc from Firestore
        const globalData = await loadFromFirestore();
        if (globalData && globalData.rounds) {
          setIsFirestoreConnected(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to LocalStorage & Firestore when data updates
  const updateAppData = (newFuncOrData: AppData | ((prev: AppData) => AppData)) => {
    setAppData((prev) => {
      const nextData = typeof newFuncOrData === 'function' ? newFuncOrData(prev) : newFuncOrData;

      // Save locally
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextData));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // Sync to cloud
      setIsSyncing(true);
      saveToFirestore(nextData, user?.uid)
        .then((success) => setIsFirestoreConnected(success))
        .finally(() => setIsSyncing(false));

      return nextData;
    });
  };

  // Calculated Statistics
  const stats = useMemo(() => calculateStats(appData), [appData]);

  // Handlers
  const handleSelectYear = (yearId: string) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        activeYear: yearId,
      },
    }));
  };

  const handleSelectRound = (roundNumber: number) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        activeRound: roundNumber,
      },
    }));
  };

  const handleUpdateMeta = (newMeta: number) => {
    updateAppData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        metaPoints: newMeta,
      },
    }));
  };

  const handleUpdatePoint = (roundNumber: number, yearId: string, value: number | null) => {
    updateAppData((prev) => {
      const newRounds = prev.rounds.map((r) => {
        if (r.round === roundNumber) {
          return {
            ...r,
            points: {
              ...r.points,
              [yearId]: value,
            },
          };
        }
        return r;
      });

      return {
        ...prev,
        rounds: newRounds,
      };
    });
  };

  const handleUpdateZ4 = (yearId: string, value: number | null) => {
    updateAppData((prev) => {
      const newYears = prev.years.map((y) => (y.id === yearId ? { ...y, z4Points: value } : y));
      return {
        ...prev,
        years: newYears,
      };
    });
  };

  const handleAddYear = (yearLabel: string) => {
    updateAppData((prev) => {
      const id = yearLabel.toLowerCase().replace(/\s+/g, '_');
      if (prev.years.some((y) => y.id === id)) return prev;

      const newYearObj = {
        id,
        label: yearLabel,
        z4Points: null,
        colorScheme: 'purple' as const,
      };

      const updatedRounds = prev.rounds.map((r) => ({
        ...r,
        points: {
          ...r.points,
          [id]: null,
        },
      }));

      return {
        ...prev,
        years: [...prev.years, newYearObj],
        rounds: updatedRounds,
        settings: {
          ...prev.settings,
          activeYear: id,
        },
      };
    });
  };

  const handleRemoveYear = (yearId: string) => {
    updateAppData((prev) => {
      if (prev.years.length <= 1) return prev;
      const newYears = prev.years.filter((y) => y.id !== yearId);
      const newActiveYear = prev.settings.activeYear === yearId ? newYears[0].id : prev.settings.activeYear;

      return {
        ...prev,
        years: newYears,
        settings: {
          ...prev.settings,
          activeYear: newActiveYear,
        },
      };
    });
  };

  const handleResetToInitial = () => {
    updateAppData(INITIAL_APP_DATA);
  };

  const activeYearConfig = appData.years.find((y) => y.id === appData.settings.activeYear) || appData.years[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-white selection:text-black">
      {/* Sticky Top Header */}
      <Header
        years={appData.years}
        activeYear={appData.settings.activeYear}
        activeRound={appData.settings.activeRound}
        onSelectYear={handleSelectYear}
        onSelectRound={handleSelectRound}
        onOpenQuickUpdate={() => setIsEditModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        user={user}
        isSyncing={isSyncing}
        onLogin={loginWithGoogle}
        onLogout={logoutFirebase}
        isFirestoreConnected={isFirestoreConnected}
      />

      {/* Main Container - Desktop Focused */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Active Season Banner */}
        <div className="bg-[#111111] text-white rounded-sm p-4 sm:p-5 border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-1 bg-black text-white rounded-sm font-black shadow-md border border-white/20 flex items-center justify-center overflow-hidden">
              <img src={galoVolpiImg} alt="Galo Volpi" referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-xs" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-white/80 uppercase tracking-widest">
                  Campeonato Brasileiro {activeYearConfig.label}
                </span>
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-xs border border-white/10 font-mono">
                  Rodada {appData.settings.activeRound} de 38
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tight">
                Acompanhamento de Performance do Galo
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-black px-4 py-2.5 rounded-sm border border-white/10">
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Pontos Atuais</p>
              <p className="text-xl font-black text-emerald-400 font-mono">{stats.currentPoints} pts</p>
            </div>
            <div className="h-7 w-px bg-white/10"></div>
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Meta Atual</p>
              <p className="text-xl font-black text-white font-mono">{appData.settings.metaPoints} pts</p>
            </div>
            <div className="h-7 w-px bg-white/10"></div>
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Faltam</p>
              <p className="text-xl font-black text-amber-400 font-mono">{stats.neededPointsForMeta} pts</p>
            </div>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Dashboards & Summaries) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* FIGURA 2: Target & Goal Dashboard */}
            <GoalDashboard
              stats={stats}
              metaPoints={appData.settings.metaPoints}
              onUpdateMeta={handleUpdateMeta}
              activeYearLabel={activeYearConfig.label}
            />

            {/* FIGURA 3: Round Summary Card */}
            <SummaryCard
              stats={stats}
              activeRound={appData.settings.activeRound}
              onSelectRound={handleSelectRound}
            />

            {/* Z4 Safety Margin Alert */}
            {activeYearConfig.z4Points !== null && (
              <div className="bg-[#111111] border border-white/10 rounded-sm p-4 flex items-center justify-between text-white font-sans shadow-xl">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Margem em relação ao 1º Z4 ({activeYearConfig.label})
                    </p>
                    <p className="text-xs font-black uppercase text-white/90">
                      Pontos Z4: <span className="font-mono">{activeYearConfig.z4Points} pts</span>
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className={`text-sm sm:text-base font-black px-2.5 py-1 rounded-xs ${
                    stats.z4Difference !== null && stats.z4Difference >= 0
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-400 border border-red-500/40'
                  }`}>
                    {stats.z4Difference !== null && stats.z4Difference >= 0 ? `+${stats.z4Difference}` : stats.z4Difference} pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (FIGURA 1: Full Points Table) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="font-black text-white text-xs uppercase tracking-widest">
                  Tabela de Pontuação por Rodada (38 Rodadas)
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                Clique numa célula para editar
              </span>
            </div>

            <PointsTable
              years={appData.years}
              rounds={appData.rounds}
              activeYear={appData.settings.activeYear}
              activeRound={appData.settings.activeRound}
              onUpdatePoint={handleUpdatePoint}
              onUpdateZ4={handleUpdateZ4}
              onSelectActiveRound={handleSelectRound}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white/40 border-t border-white/10 py-5 mt-10 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Brasileirão • Atlético Mineiro (Galo). Sincronizado no Firebase & Local.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSettingsModalOpen(true)} className="hover:text-white transition-colors uppercase tracking-wider text-[11px] font-bold">
              Configurações
            </button>
            <button onClick={handleResetToInitial} className="hover:text-white transition-colors uppercase tracking-wider text-[11px] font-bold">
              Restaurar Dados
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditRoundModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        years={appData.years}
        rounds={appData.rounds}
        activeYear={appData.settings.activeYear}
        activeRound={appData.settings.activeRound}
        onSavePoints={handleUpdatePoint}
        onAutoPropagate={() => {}}
      />

      <YearSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        data={appData}
        onUpdateMeta={handleUpdateMeta}
        onUpdateZ4={handleUpdateZ4}
        onAddYear={handleAddYear}
        onRemoveYear={handleRemoveYear}
        onResetToInitial={handleResetToInitial}
      />
    </div>
  );
}
