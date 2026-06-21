import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { generateToken } from "../../middleware/auth.js";

// Читаем базу данных
const data = fs.readFileSync("./src/database.json", "utf-8");
const database = JSON.parse(data);
const { writeFileSync } = fs;

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = database.users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Пользователь уже существует" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: randomUUID(),
    username,
    email,
    password: hashedPassword,
    level: 1,
    totalXP: 0,
    completedCourses: [],
    rewardClaimed: false,
    registrationDate: new Date().toISOString(),
    bio: "",
    skills: [],
    social: { github: "", telegram: "", website: "" },
    settings: { theme: "dark", notifications: true, language: "ru" },
    avatar: "/avatars/default.png",
  };

  database.users.push(newUser);
  writeFileSync("./src/database.json", JSON.stringify(database, null, 2));

  const token = generateToken(newUser.id);

  res.status(201).json({ token, user: { id: newUser.id, username, email } });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Ищем пользователя
  const user = database.users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "Неверный email или пароль" });
  }

  // Проверяем пароль
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ error: "Неверный email или пароль" });
  }

  // Генерируем токен
  const token = generateToken(user.id);

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
};
