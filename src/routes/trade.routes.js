import { Router } from "express";
import tradeController from "../controllers/trade.controller";
import authMiddleware from "../middlewares/auth.middleware";

const tradeRoutes = Router();
tradeRoutes.post("/trade", authMiddleware, tradeController.trade);

export { tradeRoutes };
