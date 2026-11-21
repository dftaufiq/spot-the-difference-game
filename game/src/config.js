// config.js — the three levels of Lanternlight, in difficulty order.
// Each level names its scene module, its time limit and its scoring.
import { SCENE as MARKET } from './scenes/market.js';
import { SCENE as REEF } from './scenes/reef.js';
import { SCENE as CABIN } from './scenes/cabin.js';

export const GAME_TITLE = 'Lanternlight';
export const GAME_SUBTITLE = 'Spot the Difference';

export const LEVELS = [MARKET, REEF, CABIN];

export const SCORING = {
  findBase: 100,
  comboStep: 10,
  wrongPenalty: 25,
  hintCost: 50,
  timeBonusPerSecond: 5,
  maxCombo: 8,
};

export const HINTS_PER_LEVEL = 3;

// Stars at level end: 3 when no miss and plenty of time left,
// 2 when at most two misses, otherwise 1.
export function starsForLevel(misses, timeLeft, timeLimit) {
  if (misses === 0 && timeLeft >= timeLimit * 0.3) return 3;
  if (misses <= 2) return 2;
  return 1;
}
