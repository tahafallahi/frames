import { signupUser } from "controllers/auth";
import { Router, type Request, type Response } from "express";
import passport from "passport";

const router = Router();

router.get("/oauth2/google/login", passport.authenticate("openid"));
router.get(
  "/oauth2/redirect",
  passport.authenticate("openid"),
  function (req, res) {
    res.redirect("http://localhost:5173/");
  },
);

router.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response) => res.status(200).end(),
);
router.post("/signup", ...signupUser, passport.authenticate("local"));

export default router;
