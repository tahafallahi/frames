import { Router } from "express";
import { createSignedUploadUrl } from "../controllers/supabase.js";
import { requireLogin } from "../middlewares/require-login.js";

const router = Router();

router.get("/", requireLogin, createSignedUploadUrl )

export default router;
