import { Router } from "express";
import { createComment } from "controllers/comments";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.post("/", requireLogin, createComment)

export default router;
