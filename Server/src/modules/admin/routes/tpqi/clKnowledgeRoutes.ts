import { Router, RequestHandler } from "express";
import { ClKnowledgeController } from "@Admin/controllers/tpqi/clKnowledgeController";

const router: Router = Router();

router.get("/", ClKnowledgeController.getAll as RequestHandler);
router.get("/:id", ClKnowledgeController.getById as RequestHandler);
router.post("/", ClKnowledgeController.create as RequestHandler);
router.put("/:id", ClKnowledgeController.update as RequestHandler);
router.delete("/:id", ClKnowledgeController.delete as RequestHandler);

export default router;
