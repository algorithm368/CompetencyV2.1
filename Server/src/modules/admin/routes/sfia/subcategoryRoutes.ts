import { Router, RequestHandler } from "express";
import { SubcategoryController } from "@Admin/controllers/sfia/subcategoryController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "subcategory", action: "view" }, SubcategoryController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "subcategory", action: "view" }, SubcategoryController.getById as RequestHandler));

router.post("/", withAuth({ resource: "subcategory", action: "create" }, SubcategoryController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "subcategory", action: "edit" }, SubcategoryController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "subcategory", action: "delete" }, SubcategoryController.delete as RequestHandler));

export default router;
