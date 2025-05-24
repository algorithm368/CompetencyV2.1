import { Router, RequestHandler } from "express";
import { UsersKnowledgeController } from "@Admin/controllers/tpqi/usersKnowledgeController";

const router: Router = Router();

router.get("/", UsersKnowledgeController.getAll as RequestHandler);
router.get("/:id", UsersKnowledgeController.getById as RequestHandler);
router.post("/", UsersKnowledgeController.create as RequestHandler);
router.put("/:id", UsersKnowledgeController.update as RequestHandler);
router.delete("/:id", UsersKnowledgeController.delete as RequestHandler);

export default router;
