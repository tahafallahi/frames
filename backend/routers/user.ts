import { getLoggedInUser, getUser } from "controllers/user";
import { Router } from "express";

const router = Router();

router.get("/:userId", getUser);
router.get("/", getLoggedInUser);

export default router;
