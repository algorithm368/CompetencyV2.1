import { Router, RequestHandler } from "express";
import { DatacollectionController } from "@Admin/controllers/sfia/datacollectionController";

const router: Router = Router();

router.get("/", DatacollectionController.getAll as RequestHandler);
router.get("/:id", DatacollectionController.getById as RequestHandler);
router.post("/", DatacollectionController.create as RequestHandler);
router.put("/:id", DatacollectionController.update as RequestHandler);
router.delete("/:id", DatacollectionController.delete as RequestHandler);

export default router;
