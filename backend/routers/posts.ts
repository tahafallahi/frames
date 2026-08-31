import { Router } from "express";
import { getSearchResult } from "../controllers/search";
import { getPosts, getPost } from "controllers/posts";

const router = Router();

router.get("/", getPosts)
router.get("/:postId", getPost)

export default router;
