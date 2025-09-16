import { Router, RequestHandler } from "express";
import { CareerLevelController } from "@Admin/controllers/tpqi/careerLevelController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "careerLevel", action: "view" }, CareerLevelController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "careerLevel", action: "view" }, CareerLevelController.getById as RequestHandler));

router.post("/", withAuth({ resource: "careerLevel", action: "create" }, CareerLevelController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "careerLevel", action: "edit" }, CareerLevelController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "careerLevel", action: "delete" }, CareerLevelController.delete as RequestHandler));

export default router;
