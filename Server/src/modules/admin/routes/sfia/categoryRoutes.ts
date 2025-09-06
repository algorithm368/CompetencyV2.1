import { Router, RequestHandler } from "express";
import { CategoryController } from "@Admin/controllers/sfia/categoryController";
import { authenticate, authorizePermission } from "@Middlewares/authMiddleware";

const router: Router = Router();

const withPermission = (action: string) => [authenticate, authorizePermission(`category:${action}`) as RequestHandler];

router.get("/", ...withPermission("view"), CategoryController.getAll as RequestHandler);
router.get("/:id", ...withPermission("view"), CategoryController.getById as RequestHandler);
router.post("/", ...withPermission("create"), CategoryController.create as RequestHandler);
router.put("/:id", ...withPermission("edit"), CategoryController.update as RequestHandler);
router.delete("/:id", ...withPermission("delete"), CategoryController.delete as RequestHandler);

export default router;
