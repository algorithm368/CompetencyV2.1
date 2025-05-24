import { Router, RequestHandler } from "express";
import { DetailsController } from "@Admin/controllers/tpqi/detailsController";

const router: Router = Router();

router.get("/", DetailsController.getAll as RequestHandler);
router.get("/:id", DetailsController.getById as RequestHandler);
router.post("/", DetailsController.create as RequestHandler);
router.put("/:id", DetailsController.update as RequestHandler);
router.delete("/:id", DetailsController.delete as RequestHandler);

export default router;
