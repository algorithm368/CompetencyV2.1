import { Router, RequestHandler } from "express";
import { DescriptionController } from "@Admin/controllers/sfia/descriptionController";
import { authenticate, authorizePermission } from "@Middlewares/authMiddleware";

const router: Router = Router();

const withPermission = (action: string) => [authenticate, authorizePermission(`description:${action}`) as RequestHandler];

router.get("/", ...withPermission("view"), DescriptionController.getAll as RequestHandler);
router.get("/:id", ...withPermission("view"), DescriptionController.getById as RequestHandler);
router.post("/", ...withPermission("create"), DescriptionController.create as RequestHandler);
router.put("/:id", ...withPermission("edit"), DescriptionController.update as RequestHandler);
router.delete("/:id", ...withPermission("delete"), DescriptionController.delete as RequestHandler);

export default router;
