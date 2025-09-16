import { Router, RequestHandler } from "express";
import { ClKnowledgeController } from "@Admin/controllers/tpqi/clKnowledgeController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "clKnowledge", action: "view" }, ClKnowledgeController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "clKnowledge", action: "view" }, ClKnowledgeController.getById as RequestHandler));

router.post("/", withAuth({ resource: "clKnowledge", action: "create" }, ClKnowledgeController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "clKnowledge", action: "edit" }, ClKnowledgeController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "clKnowledge", action: "delete" }, ClKnowledgeController.delete as RequestHandler));

export default router;
