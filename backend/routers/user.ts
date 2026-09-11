import { addFavorite, getLoggedInUser, getUser } from "controllers/user";
import { Router } from "express";

const router = Router();

router.get("/:userId", getUser);
router.get("/", getLoggedInUser);

router.post("/favorites", addFavorite);

export default router;
