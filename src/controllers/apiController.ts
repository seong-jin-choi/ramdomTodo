import { Request, Response } from "express";

export const getTodo = (req: Request, res: Response) => {
  return res.sendStatus(200);
};
