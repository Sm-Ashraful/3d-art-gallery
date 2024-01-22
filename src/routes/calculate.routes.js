import { Router } from "express";
import { cURLHandler } from "../controllers/calculate.controllers.js";

const router = Router();

router.route("/calculate").post(cURLHandler);

export default router;
