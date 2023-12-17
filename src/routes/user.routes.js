import { Router } from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoutes = Router();
userRoutes.post("/user", userController.add);
userRoutes.put("/user", authMiddleware, userController.update);
userRoutes.delete("/user/:id", userController.delete);

//Portfolio
userRoutes.post("/user/portfolio/create", authMiddleware, userController.createPortfolio);

export { userRoutes };
