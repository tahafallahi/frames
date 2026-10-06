import { Router } from "express";
import { getShow } from "../controllers/shows.js";
import { MediaType } from "../generated/prisma/enums.js";

const router = Router();

router.get("/movie/:showId", getShow(MediaType.MOVIE))
router.get("/tv/:showId", getShow(MediaType.TV_SHOW))

export default router;
