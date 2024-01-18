import express from "express";
import { getTodo } from "../controllers/apiController";

const apiRouter = express.Router();

apiRouter.get("/getTodo", getTodo);

apiRouter.use((_, res) => {
  // 404 처리 부분
  res.sendStatus(404);
});

export default apiRouter;
