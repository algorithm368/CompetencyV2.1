import { Router, RequestHandler } from "express";
import { AllDetailsController } from "@Admin/controllers/tpqi/allDetailsController";

const router: Router = Router();

router.get("/", AllDetailsController.getAll as RequestHandler);
router.get("/:id", AllDetailsController.getById as RequestHandler);
router.post("/", AllDetailsController.create as RequestHandler);
router.put("/:id", AllDetailsController.update as RequestHandler);
router.delete("/:id", AllDetailsController.delete as RequestHandler);

export default router;
