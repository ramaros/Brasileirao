export interface YearConfig {
  id: string; // e.g. "2024", "2025", "2026"
  label: string; // e.g. "2024"
  z4Points: number | null; // PRIMEIRO Z4
  colorScheme: 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
}

export type MatchResult = 'win' | 'draw' | 'loss' | 'pending';

export interface RoundEntry {
  round: number; // 1 to 38
  points: {
    [yearId: string]: number | null; // cumulative points at this round
  };
}

export interface SeasonSettings {
  activeYear: string; // e.g. "2026"
  activeRound: number; // e.g. 18
  metaPoints: number; // e.g. 46
}

export interface AppData {
  years: YearConfig[];
  rounds: RoundEntry[];
  settings: SeasonSettings;
  lastUpdated?: string;
}

export interface CalculatedStats {
  currentRound: number;
  pendingRounds: number;
  currentPoints: number;
  disputedPoints: number;
  remainingPointsToBePlayed: number;
  neededPointsForMeta: number;
  winsNeededForMeta: number;
  lossesAllowed: number;
  currentYield: number; // percentage 0-100
  neededYield: number; // percentage 0-100
  z4Difference: number | null;
}
