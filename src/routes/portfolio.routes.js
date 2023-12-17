import { Router } from "express";

import portfolioController from "../controllers/portfolio.controller";
import authMiddleware from "../middlewares/auth.middleware";

const portfolioRoutes = Router();
portfolioRoutes.post("/portfolio/add", authMiddleware, portfolioController.add);

export { portfolioRoutes };
