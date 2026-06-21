import fs from "node:fs";
import { writeFileSync } from "node:fs";

const data = fs.readFileSync("./src/database.json", "utf-8");
const database = JSON.parse(data);
const users = database.users;

// Словарь XP за курсы
const COURSE_XP = {
  1: 50,
  2: 50,
  3: 50,
  4: 100,
  5: 50,
  6: 50,
  7: 50,
  8: 50,
  9: 50,
};

export const getUsers = (req, res) => {
  if (!users) {
    return res
      .status(400)
      .json({ error: "Не удалось получить пользователей !" });
  }
  return res.status(200).json(users);
};

export const getUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  return res.status(200).json(user);
};

export const getMe = (req, res) => {
  const userId = req.userId;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const { password, ...userWithoutPassword } = user;
  return res.status(200).json(userWithoutPassword);
};

export const patchUser = (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const updates = req.body;
    const { courseId, rewardClaimed } = updates;

    // Проверка: не пройден ли курс
    if (courseId && users[userIndex].completedCourses.includes(courseId)) {
      return res.status(400).json({ error: "Пользователь уже прошел курс" });
    }

    // Начисляем XP
    if (courseId) {
      const xpReward = COURSE_XP[String(courseId)] || 50;
      users[userIndex].completedCourses.push(courseId);
      users[userIndex].totalXP += xpReward;
    }

    if (rewardClaimed !== undefined) {
      users[userIndex].rewardClaimed = rewardClaimed;
    }

    // Обновляем остальные поля (НЕ ТРОГАЕМ totalXP и level)
    Object.keys(updates).forEach((key) => {
      if (
        key !== "courseId" &&
        key !== "rewardClaimed" &&
        key !== "totalXP" &&
        key !== "level"
      ) {
        users[userIndex][key] = updates[key];
      }
    });

    writeFileSync(
      "./src/database.json",
      JSON.stringify(database, null, 2),
      "utf-8",
    );

    return res.status(200).json(users[userIndex]);
  } catch (error) {
    console.error("❌ Ошибка patchUser:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const patchMe = (req, res) => {
  try {
    const userId = req.userId;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const updates = req.body;
    const { courseId, rewardClaimed } = updates;

    if (courseId && users[userIndex].completedCourses.includes(courseId)) {
      return res.status(400).json({ error: "Пользователь уже прошел курс" });
    }

    if (courseId) {
      const xpReward = COURSE_XP[String(courseId)] || 50;
      users[userIndex].completedCourses.push(courseId);
      users[userIndex].totalXP += xpReward;
    }

    if (rewardClaimed !== undefined) {
      users[userIndex].rewardClaimed = rewardClaimed;
    }

    Object.keys(updates).forEach((key) => {
      if (
        key !== "courseId" &&
        key !== "rewardClaimed" &&
        key !== "totalXP" &&
        key !== "level"
      ) {
        users[userIndex][key] = updates[key];
      }
    });

    writeFileSync(
      "./src/database.json",
      JSON.stringify(database, null, 2),
      "utf-8",
    );

    return res.status(200).json(users[userIndex]);
  } catch (error) {
    console.error("❌ Ошибка patchMe:", error);
    return res.status(500).json({ error: error.message });
  }
};
