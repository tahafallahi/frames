import { getTrendingShows } from "controllers/trending";
import { Router } from "express";
import { MediaType } from "generated/prisma/enums";

const router = Router();

router.get("/movie", getTrendingShows(MediaType.MOVIE))
router.get("/tv", getTrendingShows(MediaType.TV_SHOW))

// router.get("/movie-titles", getTrendingMovies)
// router.get("/tv-titles", getTrendingTvs)

export default router;
