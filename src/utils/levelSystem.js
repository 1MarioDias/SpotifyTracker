
export const LEVEL_THRESHOLDS = [
  { level: 0, minXP: 0, maxXP: 199, name: 'Novice Listener' },
  { level: 1, minXP: 200, maxXP: 399, name: 'Casual Fan' },
  { level: 2, minXP: 400, maxXP: 599, name: 'Music Enthusiast' },
  { level: 3, minXP: 600, maxXP: 799, name: 'Audiophile' },
  { level: 4, minXP: 800, maxXP: Infinity, name: 'Music Legend' }
];

export const XP_REWARDS = {
  GOAL_COMPLETED: 20,
  CROWN_GAINED: 5
};

// calcula o nível do utilizador com base no seu XP total
export function calculateLevel(xp) {
  if (typeof xp !== 'number' || xp < 0) {
    return 0;
  }

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }

  return 0;
}

// obtem informações do nível para uma determinada quantidade de XP
export function getLevelInfo(xp) {
  const currentLevel = calculateLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1] || null;

  let progressToNext = 0;
  let xpNeededForNext = 0;

  if (nextThreshold) {
    const xpInCurrentLevel = xp - currentThreshold.minXP;
    const xpRangeForCurrentLevel = nextThreshold.minXP - currentThreshold.minXP;
    progressToNext = (xpInCurrentLevel / xpRangeForCurrentLevel) * 100;
    xpNeededForNext = nextThreshold.minXP - xp;
  } else {
    progressToNext = 100; // nivel máximo alcançado
  }

  return {
    level: currentLevel,
    levelName: currentThreshold.name,
    xp: xp,
    progressToNext: Math.min(progressToNext, 100),
    xpNeededForNext: Math.max(xpNeededForNext, 0),
    isMaxLevel: currentLevel === LEVEL_THRESHOLDS.length - 1,
    nextLevelName: nextThreshold ? nextThreshold.name : null
  };
}