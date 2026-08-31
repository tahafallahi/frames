import { Router } from "express";
import { getShow } from "controllers/shows";

const router = Router();

router.get("/:showId", getShow)

export default router;
