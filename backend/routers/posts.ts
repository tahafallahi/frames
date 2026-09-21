import { Router } from "express";
import { getPosts, getPost, getComments, createPost, updateReaction, getReaction } from "controllers/posts";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.get("/", getPosts)
router.get("/:postId", getPost)
router.get("/:postId/comments", getComments)
router.get("/:postId/likes", requireLogin, getReaction)

router.post("/", requireLogin, createPost)
router.post("/:postId/likes", requireLogin, updateReaction)


export default router;
