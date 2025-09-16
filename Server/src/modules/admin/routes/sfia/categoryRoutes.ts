import { Router, RequestHandler } from "express";
import { CategoryController } from "@Admin/controllers/sfia/categoryController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "category", action: "view" }, CategoryController.getAll as RequestHandler));
router.get("/:id", withAuth({ resource: "category", action: "view" }, CategoryController.getById as RequestHandler));
router.post("/", withAuth({ resource: "category", action: "create" }, CategoryController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "category", action: "edit" }, CategoryController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "category", action: "delete" }, CategoryController.delete as RequestHandler));

export default router;
