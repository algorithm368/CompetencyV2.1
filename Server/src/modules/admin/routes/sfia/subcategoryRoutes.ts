import { Router, RequestHandler } from "express";
import { SubcategoryController } from "@Admin/controllers/sfia/subcategoryController";

const router: Router = Router();

// Subcategory routes
router.get("/", SubcategoryController.getAll as RequestHandler);
router.get("/:id", SubcategoryController.getById as RequestHandler);
router.post("/", SubcategoryController.create as RequestHandler);
router.put("/:id", SubcategoryController.update as RequestHandler);
router.delete("/:id", SubcategoryController.delete as RequestHandler);

export default router;
