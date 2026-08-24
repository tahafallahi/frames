import { Router } from "express";
import { getSearchResult } from "../controllers/search";

const router = Router();

router.get("/", getSearchResult)

export default router;
