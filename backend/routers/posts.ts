import { Router } from "express";
import { getSearchResult } from "../controllers/search";
import { getPosts } from "controllers/posts";

const router = Router();

router.get("/", getPosts)

export default router;
