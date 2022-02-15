import { Router, Request, Response, NextFunction } from "express";

import { returnResponse } from "../interface/";

const router = Router();

let resObject: returnResponse;

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  resObject = {
    statuscode: 200,
    data: {
      message: "Status Ok!",
    },
  };

  return res.status(resObject.statuscode).json(resObject.data);
});

export default router;
