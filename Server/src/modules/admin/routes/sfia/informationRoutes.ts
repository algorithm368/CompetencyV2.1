import { Router, RequestHandler } from "express";
import { InformationController } from "@Admin/controllers/sfia/informationController";

const router: Router = Router();

// Information routes
router.get("/", InformationController.getAll as RequestHandler);
router.get("/:id", InformationController.getById as RequestHandler);
router.post("", InformationController.create as RequestHandler);
router.put("/:id", InformationController.update as RequestHandler);
router.delete("/:id", InformationController.delete as RequestHandler);

export default router;
