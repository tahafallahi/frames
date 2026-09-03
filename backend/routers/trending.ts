import { getTrendingMovies, getTrendingTvs } from "controllers/trending";
import { Router } from "express";

const router = Router();

router.get("/movie", getTrendingMovies)
router.get("/tv", getTrendingTvs)

export default router;
