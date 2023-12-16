import { Router } from "express";
import shareController from "../controllers/share.controller";

const shareRoutes = Router();
shareRoutes.post("/share", shareController.add);

export { shareRoutes };
