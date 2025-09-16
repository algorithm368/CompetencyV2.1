import { Router, RequestHandler } from "express";
import { UKnowledgeController } from "@Admin/controllers/tpqi/uKnowledgeController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "uKnowledge", action: "view" }, UKnowledgeController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "uKnowledge", action: "view" }, UKnowledgeController.getById as RequestHandler));

router.post("/", withAuth({ resource: "uKnowledge", action: "create" }, UKnowledgeController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "uKnowledge", action: "edit" }, UKnowledgeController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "uKnowledge", action: "delete" }, UKnowledgeController.delete as RequestHandler));

export default router;
