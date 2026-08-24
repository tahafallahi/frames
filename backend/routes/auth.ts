import { signupUser } from "controllers/auth";
import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/oauth2/google/login", passport.authenticate("openid"));
router.get(
  "/oauth2/redirect",
  passport.authenticate("openid", {
    failureRedirect: "/api/auth/oauth2/google/login",
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect("/api/posts");
  },
);

router.post("/login", passport.authenticate("local"))
router.post("/signup", ...signupUser, passport.authenticate("local"))


export default router;
