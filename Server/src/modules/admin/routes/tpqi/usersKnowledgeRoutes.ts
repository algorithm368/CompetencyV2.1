import { Router, RequestHandler } from "express";
import { UsersKnowledgeController } from "@Admin/controllers/tpqi/usersKnowledgeController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "usersKnowledge", action: "view" }, UsersKnowledgeController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "usersKnowledge", action: "view" }, UsersKnowledgeController.getById as RequestHandler));

router.post("/", withAuth({ resource: "usersKnowledge", action: "create" }, UsersKnowledgeController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "usersKnowledge", action: "edit" }, UsersKnowledgeController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "usersKnowledge", action: "delete" }, UsersKnowledgeController.delete as RequestHandler));

export default router;
