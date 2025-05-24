import { Router, RequestHandler } from "express";
import { PortfolioController } from "@Admin/controllers/sfia/portfolioController";

const router: Router = Router();

// Portfolio routes
router.get("/", PortfolioController.getAll as RequestHandler);
router.get("/:id", PortfolioController.getById as RequestHandler);
router.post("/", PortfolioController.create as RequestHandler);
router.put("/:id", PortfolioController.update as RequestHandler);
router.delete("/:id", PortfolioController.delete as RequestHandler);

export default router;
