import { signupUser } from "../controllers/auth.js";
import { Router, type Request, type Response } from "express";
import { requireLogin } from "../middlewares/require-login.js";
import passport from "passport";

const router = Router();

router.get("/oauth2/google/login", passport.authenticate("openid"));
router.get(
  "/oauth2/redirect",
  passport.authenticate("openid"),
  function (req, res) {
    if (!process.env.CLIENT_URL)
      throw new Error("CLIENT_URL is not provided in enviroment variables");

    res.redirect(process.env.CLIENT_URL);
  },
);
router.post("/logout", requireLogin, (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) res.status(500).json({ message: "Could not log out" });

    res.clearCookie("connect.sid", {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logged out" });
  });
});

router.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response) => res.status(200).end(),
);
router.post("/signup", ...signupUser, passport.authenticate("local"));

export default router;
