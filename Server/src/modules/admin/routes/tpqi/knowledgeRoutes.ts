import { Router, RequestHandler } from "express";
import { KnowledgeController } from "@Admin/controllers/tpqi/knowledgeController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "knowledge", action: "view" }, KnowledgeController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "knowledge", action: "view" }, KnowledgeController.getById as RequestHandler));

router.post("/", withAuth({ resource: "knowledge", action: "create" }, KnowledgeController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "knowledge", action: "edit" }, KnowledgeController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "knowledge", action: "delete" }, KnowledgeController.delete as RequestHandler));

export default router;
