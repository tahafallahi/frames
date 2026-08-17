
import express from "express";
import { Router } from "express";

import searchRouter from "../routes/search";


const app = express();
const router = Router();

router.use("/search", searchRouter);

app.use("/api", router);

if (process.env.NODE_ENV === "development") {
  app.listen(3333, (err) => {
    if (err) throw err;
    console.log("Listening on port 3333");
  });
}
export default app;
