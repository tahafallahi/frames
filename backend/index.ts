import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { Router } from "express";
import session from "express-session";
import qs from "qs";

import searchRouter from "./routers/search.js";
import postsRouter from "./routers/posts.js";
import commentsRouter from "./routers/comment.js"
import tagsRouter from "./routers/tags.js";
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";
import showRouter from "./routers/show.js";
import trendingRouter from "./routers/trending.js";

import passport from "passport";

import "./lib/passport-google-oauth2.js";
import "./lib/passport-local.js";
import { errorHandler } from "./controllers/errorHandler.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";

if (!process.env.COOKIE_SECRET)
  throw new Error("COOKIE_SECRET is not provided in enviroment variables");

const app = express();
const router = Router();

//TODO: There's a lot about session save database and cors to be done here.

app.set("query parser", (str: string) => qs.parse(str));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use(passport.session());

router.use("/search", searchRouter);
router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/tags", tagsRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/shows", showRouter);
router.use("/trending", trendingRouter);

app.use("/api", router);
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.listen(3333, (err) => {
    if (err) throw err;
    console.log("Listening on port 3333");
  });
}

export default app;
