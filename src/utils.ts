import { Player, PlayerStats, PointAllocation, Manager } from './types';
import { POSITION_WEIGHTS } from './database/data';

// Map upgrade categories to the stats they influence
export const CATEGORY_STAT_MAP: Record<keyof PointAllocation, (keyof PlayerStats)[]> = {
  shooting: ['finishing', 'placeKicking', 'curl'],
  passing: ['lowPass', 'loftedPass'],
  dribbling: ['ballControl', 'dribbling', 'tightPossession'],
  dexterity: ['offensiveAwareness', 'acceleration', 'balance'],
  lowerBody: ['speed', 'kickingPower', 'stamina'],
  aerial: ['heading', 'jump', 'physicalContact'],
  defending: ['defensiveAwareness', 'defensiveEngagement', 'tackling', 'aggression'],
  gk1: ['gkAwareness', 'gkCatching'],
  gk2: ['gkParrying', 'gkReflexes'],
  gk3: ['gkReach', 'gkReflexes']
};

/**
 * Calculates current stats based on point allocation, boosters and manager boosts
 */
export function calculateStats(
  player: Player,
  points: PointAllocation,
  manager: Manager | null,
  boosterEnabled: boolean
): PlayerStats {
  const stats = { ...player.baseStats };

  // 1. Add progression points
  for (const catKey of Object.keys(points) as (keyof PointAllocation)[]) {
    const allocatedPoints = points[catKey];
    if (allocatedPoints <= 0) continue;

    // Stat increase is non-linear or linear representing stat increments
    // Let's do eFootball approach: each allocated point adds +1 up to 4, +2 from 5-8, +3 up to 12
    // For extreme realism: eFootball gives usually +1 output per category point
    const statsToBoost = CATEGORY_STAT_MAP[catKey];
    statsToBoost.forEach((stat) => {
      // In eFootball, stats add +1 up to a maximum cap of 99 (or 105 with boosters)
      stats[stat] = Math.min(105, stats[stat] + allocatedPoints);
    });
  }

  // 2. Add Booster effect
  if (boosterEnabled && player.booster) {
    player.booster.stats.forEach((stat) => {
      stats[stat] = Math.min(105, stats[stat] + (player.booster?.value || 3));
    });
  }

  // 3. Add Manager Bonus
  if (manager) {
    // If manager has high playstyle proficiency, they give a flat bonus to stats
    // E.g. Roman or Zeitzler gives +2 to all stats (if playstyle is active)
    // Let's apply a flat +2 to all stats as is standard in eFootball 2024/2025/2026 for high-tier managers, 
    // or specific categorical bonuses based on their bonusType.
    Object.keys(stats).forEach((statKey) => {
      const stat = statKey as keyof PlayerStats;
      let bonus = 2; // general high proficiency manager bonus (increases all stats by 2 on the pitch)
      if (manager.bonusType === 'all') {
        bonus = manager.bonusValue;
      } else if (manager.bonusType === 'speed' && (stat === 'speed' || stat === 'acceleration')) {
        bonus = manager.bonusValue;
      } else if (manager.bonusType === 'passing' && (stat === 'lowPass' || stat === 'loftedPass')) {
        bonus = manager.bonusValue;
      } else if (manager.bonusType === 'defending' && statKey.includes('defensive')) {
        bonus = manager.bonusValue;
      } else if (manager.bonusType === 'shooting' && stat === 'finishing') {
        bonus = manager.bonusValue;
      }
      stats[stat] = Math.min(105, stats[stat] + bonus);
    });
  }

  return stats;
}

/**
 * Calculates overall rating for a specific position based on weights
 */
export function calculateOverallRating(
  stats: PlayerStats,
  position: string,
  baseOverall: number,
  baseStats: PlayerStats
): number {
  const weights = POSITION_WEIGHTS[position];
  if (!weights) return baseOverall;

  let sumDiff = 0;
  Object.keys(weights).forEach((statKey) => {
    const stat = statKey as keyof PlayerStats;
    const diff = stats[stat] - baseStats[stat];
    sumDiff += diff * weights[stat];
  });

  // eFootball scaling multiplier for ratings: 
  // typically, rating improves by 1 for each ~1 to 1.5 weighted stat value increment
  const ratingDelta = sumDiff * 1.55;
  const newRating = Math.round(baseOverall + ratingDelta);
  return Math.max(baseOverall, Math.min(105, newRating));
}

/**
 * Utility to calculate training points cost
 * level limit usually consumes points:
 * levels 1-4 cost 1 point each
 * levels 5-8 cost 2 points each
 * levels 9-12 cost 3 points each
 * levels 13-16 cost 4 points each
 */
export function getPointCostForLevel(points: number): number {
  let cost = 0;
  for (let i = 1; i <= points; i++) {
    if (i <= 4) cost += 1;
    else if (i <= 8) cost += 2;
    else if (i <= 12) cost += 3;
    else cost += 4;
  }
  return cost;
}

/**
 * Automatically allocates progression points using a greedy hill-climbing search 
 * to achieve the maximum overall rating for a player's primary position, 
 * simulating eFootball's "Auto-Design" feature.
 */
export function generateAutoBuild(player: Player, totalAvailablePoints: number = 70): PointAllocation {
  const points: PointAllocation = {
    shooting: 0,
    passing: 0,
    dribbling: 0,
    dexterity: 0,
    lowerBody: 0,
    aerial: 0,
    defending: 0,
    gk1: 0,
    gk2: 0,
    gk3: 0
  };

  const isGK = player.position === 'GK';
  const activeCategories: (keyof PointAllocation)[] = isGK
    ? ['gk1', 'gk2', 'gk3', 'passing', 'dexterity', 'lowerBody', 'defending']
    : ['shooting', 'passing', 'dribbling', 'dexterity', 'lowerBody', 'aerial', 'defending'];

  let pointsRemaining = totalAvailablePoints;

  // Simple greedy algorithm: repeatedly find the category upgrade that produces the highest 
  // weighted rating increase for the primary position, respecting the point budgets.
  while (pointsRemaining > 0) {
    let bestCategory: keyof PointAllocation | null = null;
    let bestScore = -1;
    let bestCost = 999;

    for (const cat of activeCategories) {
      const currentVal = points[cat];
      if (currentVal >= 16) continue; // limit max allocation in a category to 16

      // point cost to upgrade this category by 1 level
      let levelCost = 1;
      if (currentVal < 4) levelCost = 1;
      else if (currentVal < 8) levelCost = 2;
      else if (currentVal < 12) levelCost = 3;
      else levelCost = 4;

      if (levelCost > pointsRemaining) continue;

      // evaluate weight multiplier of stats in this category
      const affectedStats = CATEGORY_STAT_MAP[cat];
      const weights = POSITION_WEIGHTS[player.position] || {};
      let catScore = 0;
      affectedStats.forEach((stat) => {
        catScore += weights[stat] || 0.01;
      });

      // prioritize categories with higher value for the money
      const normScore = catScore / levelCost;
      if (normScore > bestScore) {
        bestScore = normScore;
        bestCategory = cat;
        bestCost = levelCost;
      }
    }

    if (!bestCategory) break; // no affordable moves left

    points[bestCategory]++;
    pointsRemaining -= bestCost;
  }

  return points;
}

/**
 * Returns a score color class in hex for eFootball style:
 * 90+ - Vibrant Green (excellent)
 * 80-89 - Soft Green (very good)
 * 70-79 - Yellow/Orange (good)
 * <70 - Red/Orange (medicore)
 */
export function getStatColor(score: number): string {
  if (score >= 90) return '#00FF00'; // S-Class vibrant green
  if (score >= 80) return '#a3e635'; // A-Class light green (equivalent to lime-400)
  if (score >= 70) return '#facc15'; // B-Class yellow (equivalent to yellow-400)
  return '#f97316'; // C-Class orange (equivalent to orange-500)
}

export function getStatBgClass(score: number): string {
  if (score >= 90) return 'rgba(0, 255, 0, 0.1)';
  if (score >= 80) return 'rgba(163, 230, 53, 0.1)';
  if (score >= 70) return 'rgba(250, 204, 21, 0.1)';
  return 'rgba(249, 115, 22, 0.1)';
}

export function getStatBorderClass(score: number): string {
  if (score >= 90) return 'border-[#00FF00]';
  if (score >= 80) return 'border-[#a3e635]';
  if (score >= 70) return 'border-[#facc15]';
  return 'border-[#f97316]';
}
