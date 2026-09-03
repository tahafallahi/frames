import { Router } from "express";
import { getMovie, getTv } from "controllers/shows";

const router = Router();

router.get("/movie/:movieId", getMovie)
router.get("/tv/:tvId", getTv)

export default router;
