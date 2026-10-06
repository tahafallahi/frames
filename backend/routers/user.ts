import {
  addFavorite,
  followUser,
  getLoggedInUser,
  getNewFollows,
  getUser,
  removeFavorite,
  unfollowUser,
  dismissEveryFollow,
  getFollowings,
  editProfile
} from "controllers/user.js";
import { Router } from "express";
import { requireLogin } from "middlewares/require-login.js";

const router = Router();

router.get("/follow-notifications", requireLogin, getNewFollows)
router.get("/:userId", getUser);
router.get("/:userId/followers", requireLogin, getFollowings);
router.get("/", requireLogin, getLoggedInUser);

router.delete("/follow-notifications", requireLogin, dismissEveryFollow)
router.post("/:followeeUserId/follow", requireLogin, followUser);
router.delete("/:followeeUserId/follow", requireLogin, unfollowUser);
router.post("/favorites", requireLogin, addFavorite);
router.post("/favorites-remove", requireLogin, removeFavorite);
router.post("/", requireLogin, editProfile)

export default router;
