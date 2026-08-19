
import express from "express";
import cors from "cors"
import { Router } from "express";

import searchRouter from "../routes/search";
import postsRouter from "../routes/posts";


const app = express();
app.use(cors())
const router = Router();

router.use("/search", searchRouter);
router.use("/posts", postsRouter);

app.use("/api", router);

if (process.env.NODE_ENV === "development") {
  app.listen(3333, (err) => {
    if (err) throw err;
    console.log("Listening on port 3333");
  });
}
export default app;
