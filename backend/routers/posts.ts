import { Router } from "express";
import { getSearchResult } from "../controllers/search";
import { getPosts, getPost, getComments } from "controllers/posts";

const router = Router();

router.get("/", getPosts)
router.get("/:postId", getPost)
router.get("/:postId/comments", getComments)

export default router;
