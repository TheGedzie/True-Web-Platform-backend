export const calculateNewLevel = (currentLevel, currentXP) => {
  const XP_PER_LEVEL = 100; // сколько XP нужно для одного уровня

  const newLevel = currentLevel + Math.floor(currentXP / XP_PER_LEVEL);
  const newXP = currentXP % XP_PER_LEVEL;

  return { level: newLevel, totalXP: newXP };
};
