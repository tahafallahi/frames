import { Router } from "express";
import { createComment } from "../controllers/comments.js";
import { requireLogin } from "../middlewares/require-login.js";

const router = Router();

router.post("/", requireLogin, createComment)

export default router;
