import { Router } from "express";
import {
  getPosts,
  getPost,
  getComments,
  createPost,
  updateReaction,
  getComment,
} from "controllers/posts";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/:postId/comments", getComments);
router.get("/:postId/comments/:commentId", getComment);

router.post("/", requireLogin, createPost);
router.post("/:postId/reaction", requireLogin, updateReaction);
router.post(
  "/:postId/comments/:commentId/reaction",
  requireLogin,
  updateReaction,
);

export default router;
