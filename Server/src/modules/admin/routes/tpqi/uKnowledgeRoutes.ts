import { Router, RequestHandler } from "express";
import { UKnowledgeController } from "@Admin/controllers/tpqi/uKnowledgeController";

const router: Router = Router();

router.get("/", UKnowledgeController.getAll as RequestHandler);
router.get("/:id", UKnowledgeController.getById as RequestHandler);
router.post("/", UKnowledgeController.create as RequestHandler);
router.put("/:id", UKnowledgeController.update as RequestHandler);
router.delete("/:id", UKnowledgeController.delete as RequestHandler);

export default router;
