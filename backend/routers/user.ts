import { addFavorite, getLoggedInUser, getUser, removeFavorite } from "controllers/user";
import { Router } from "express";
import { requireLogin } from "middlewares/require-login";

const router = Router();

router.get("/:userId", getUser);
router.get("/", requireLogin, getLoggedInUser);

router.post("/favorites", requireLogin, addFavorite);
router.post("/favorites-remove", requireLogin, removeFavorite);

export default router;
