import fs from "node:fs";
import { writeFileSync } from "node:fs";

const data = fs.readFileSync("./src/database.json", "utf-8");
const database = JSON.parse(data);
const chellenges = database.chellenges;

export const getChellanges = (req, res) => {
  if (!chellenges) {
    return res
      .status(400)
      .json({ error: "Не удалось получить список челленджей !" });
  }
  return res.status(200).json(chellenges);
};

export const getChellange = (req, res) => {
  if (!chellenges) {
    return res
      .status(400)
      .json({ error: "Не удалось получить список челленджей !" });
  }
  const { id } = req.params;
  const chellenge = chellenges.find((c) => c.id == id);
  if (!chellenge) {
    return res.status(400).json({ message: "Не удалось получить челлендж !" });
  }
  return res.status(200).json(chellenge);
};

export const completeChallenge = (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    console.log("📥 completeChallenge:", { userId, challengeId });

    const userIndex = database.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const user = database.users[userIndex];
    const challenge = database.chellenges.find(
      (c) => c.id === String(challengeId),
    );

    if (!challenge) {
      return res.status(404).json({ error: "Задание не найдено" });
    }

    // Проверка: не выполнено ли уже
    if (user.completedChallenges?.includes(Number(challengeId))) {
      return res.status(400).json({ error: "Задание уже выполнено" });
    }

    // Начисляем XP (БЕЗ ПЕРЕСЧЁТА УРОВНЯ!)
    user.completedChallenges = user.completedChallenges || [];
    user.completedChallenges.push(Number(challengeId));
    user.totalXP += challenge.xpReward;

    console.log("✅ Начислено XP:", challenge.xpReward);
    console.log("✅ Новый totalXP:", user.totalXP);

    writeFileSync("./src/database.json", JSON.stringify(database, null, 2));

    return res.status(200).json({
      message: "XP начислены",
      totalXP: user.totalXP,
      level: user.level,
    });
  } catch (error) {
    console.error("❌ Ошибка completeChallenge:", error);
    return res.status(500).json({ error: error.message });
  }
};
