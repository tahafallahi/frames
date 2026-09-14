import { Router } from "express";
import { getPosts, getPost, getComments, createPost } from "controllers/posts";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.get("/", getPosts)
router.get("/:postId", getPost)
router.get("/:postId/comments", getComments)

router.post("/", requireLogin, createPost)

export default router;
