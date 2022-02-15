import { Router } from "express";

const routes = Router();

import status from "../controller/status";
routes.use("/status", status);

export default routes;
