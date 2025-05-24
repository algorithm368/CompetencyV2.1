import { Router, RequestHandler } from "express";
import { CategoryController } from "@Admin/controllers/sfia/categoryController";

const router: Router = Router();

router.get("/:id", CategoryController.getById as RequestHandler);
router.get("/", CategoryController.getAll as RequestHandler);
router.post("/", CategoryController.create as RequestHandler);
router.put("/:id", CategoryController.update as RequestHandler);
router.delete("/:id", CategoryController.delete as RequestHandler);

export default router;
