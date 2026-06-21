import { Router } from "express";
import {
  getUsers,
  getUser,
  patchUser,
  getMe,
  patchMe,
} from "../../controllers/userController/index.js";
import { verifyToken } from "../../middleware/auth.js";

const router = Router();

router.get("/", getUsers);
router.get("/me", verifyToken, getMe);
router.get("/:id", getUser);
router.patch("/me", verifyToken, patchMe);
router.patch("/:id", patchUser);

export default router;
