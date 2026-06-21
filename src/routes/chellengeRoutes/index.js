import { Router } from "express";
import {
  getChellanges,
  getChellange,
  completeChallenge,
} from "../../controllers/chellengesController/index.js";
import { verifyToken } from "../../middleware/auth.js";

const router = Router();

router.get("/", getChellanges);
router.patch("/complete", verifyToken, completeChallenge);
router.get("/:id", getChellange);

export default router;
