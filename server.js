import express from "express";
import { env } from "node:process";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes/index.js";
import courseRoutes from "./src/routes/courseRoutes/index.js";
import chellengeRoutes from "./src/routes/chellengeRoutes/index.js";
import questionRoutes from "./src/routes/questionRoutes/index.js";
import authRoutes from "./src/routes/authRoutes/index.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://true-web-platforms.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

async function main() {
  app.use("/courses", courseRoutes);
  app.use("/users", userRoutes);
  app.use("/chellenges", chellengeRoutes);
  app.use("/questions", questionRoutes);
  app.use("/auth", authRoutes);
  app.use("/*splat", (req, res) => {
    return res.status(404).json("Not found !");
  });
  app.listen(process.env.PORT || 4200, () => {
    console.log(
      `Сервер запущен на порту: http://localhost:${process.env.PORT || 4200}`,
    );
  });
}
main();
