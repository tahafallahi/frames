import express from "express";
import cors from "cors";
import { Router } from "express";
import session from "express-session";

import searchRouter from "../routes/search";
import postsRouter from "../routes/posts";
import tagsRouter from "../routes/tags";
import authRouter from "../routes/auth";

import passport from "passport";

import "../lib/passport";

if (!process.env.COOKIE_SECRET)
  throw new Error(
    "COOKIE_SECRET is not provided in enviroment variables",
  );


const app = express();
const router = Router();

app.use(cors());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
passport.use(passport.authenticate("session"));

router.use("/search", searchRouter);
router.use("/posts", postsRouter);
router.use("/tags", tagsRouter);
router.use("/auth", authRouter);

app.use("/api", router);

if (process.env.NODE_ENV === "development") {
  app.listen(3333, (err) => {
    if (err) throw err;
    console.log("Listening on port 3333");
  });
}
export default app;
