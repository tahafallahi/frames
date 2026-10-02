import {
  addFavorite,
  followUser,
  getLoggedInUser,
  getUser,
  removeFavorite,
  unfollowUser,
} from "controllers/user";
import { Router } from "express";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.get("/:userId", getUser);
router.get("/", requireLogin, getLoggedInUser);

router.post("/:followeeUserId/follow", requireLogin, followUser);
router.delete("/:followeeUserId/follow", requireLogin, unfollowUser);
router.post("/favorites", requireLogin, addFavorite);
router.post("/favorites-remove", requireLogin, removeFavorite);

export default router;
