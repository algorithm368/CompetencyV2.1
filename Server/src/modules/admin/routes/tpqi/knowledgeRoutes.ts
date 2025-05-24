import { Router, RequestHandler } from "express";
import { KnowledgeController } from "@Admin/controllers/tpqi/knowledgeController";

const router: Router = Router();

router.get("/", KnowledgeController.getAll as RequestHandler);
router.get("/:id", KnowledgeController.getById as RequestHandler);
router.post("/", KnowledgeController.create as RequestHandler);
router.put("/:id", KnowledgeController.update as RequestHandler);
router.delete("/:id", KnowledgeController.delete as RequestHandler);

export default router;
