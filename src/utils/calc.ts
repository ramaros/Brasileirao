import { AppData, CalculatedStats } from '../types';

export function calculateStats(data: AppData): CalculatedStats {
  const { settings, rounds, years } = data;
  const activeYear = settings.activeYear;
  const activeRound = settings.activeRound || 1;
  const metaPoints = settings.metaPoints || 46;

  // Find round entry
  const roundObj = rounds.find((r) => r.round === activeRound);
  const currentPoints = roundObj?.points[activeYear] ?? 0;

  const pendingRounds = Math.max(0, 38 - activeRound);
  const disputedPoints = activeRound * 3;
  const remainingPointsToBePlayed = pendingRounds * 3;

  const neededPointsForMeta = Math.max(0, metaPoints - currentPoints);
  const winsNeededForMeta = Math.ceil(neededPointsForMeta / 3);

  // Remaining games where points can be dropped
  const lossesAllowed = Math.max(0, pendingRounds - winsNeededForMeta);

  const currentYield = disputedPoints > 0 ? (currentPoints / disputedPoints) * 100 : 0;
  const neededYield =
    remainingPointsToBePlayed > 0
      ? (neededPointsForMeta / remainingPointsToBePlayed) * 100
      : 0;

  const activeYearConfig = years.find((y) => y.id === activeYear);
  const z4Points = activeYearConfig?.z4Points;
  const z4Difference = z4Points !== null && z4Points !== undefined ? currentPoints - z4Points : null;

  return {
    currentRound: activeRound,
    pendingRounds,
    currentPoints,
    disputedPoints,
    remainingPointsToBePlayed,
    neededPointsForMeta,
    winsNeededForMeta,
    lossesAllowed,
    currentYield,
    neededYield,
    z4Difference,
  };
}

export function formatPercentage(val: number): string {
  return val.toFixed(2).replace('.', ',') + '%';
}
