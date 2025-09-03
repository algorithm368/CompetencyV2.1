import { Router, RequestHandler } from "express";
import { CategoryController } from "@Admin/controllers/sfia/categoryController";
import { withAuth } from "@/middlewares/withAuth";

const router: Router = Router();

router.get("/:id", withAuth({ resource: "Category", action: "create" }, CategoryController.getById as RequestHandler));
router.get("/", withAuth({ resource: "Category", action: "create" }, CategoryController.getAll as RequestHandler));
router.post("/", withAuth({ resource: "Category", action: "create" }, CategoryController.create as RequestHandler));
router.put("/:id", withAuth({ resource: "Category", action: "create" }, CategoryController.update as RequestHandler));
router.delete("/:id", withAuth({ resource: "Category", action: "create" }, CategoryController.delete as RequestHandler));

export default router;
