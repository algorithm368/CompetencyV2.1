import { Router, RequestHandler } from "express";
import { ClUcController } from "@Admin/controllers/tpqi/clUcController";

const router: Router = Router();

router.get("/", ClUcController.getAll as RequestHandler);
router.get("/:id", ClUcController.getById as RequestHandler);
router.post("/", ClUcController.create as RequestHandler);
router.put("/:id", ClUcController.update as RequestHandler);
router.delete("/:id", ClUcController.delete as RequestHandler);

export default router;
