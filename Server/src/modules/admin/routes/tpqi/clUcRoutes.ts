import { Router, RequestHandler } from "express";
import { ClUcController } from "@Admin/controllers/tpqi/clUcController";
import { withAuth } from "@Middlewares/withAuth";

const router: Router = Router();

router.get("/", withAuth({ resource: "clUc", action: "view" }, ClUcController.getAll as RequestHandler));

router.get("/:id", withAuth({ resource: "clUc", action: "view" }, ClUcController.getById as RequestHandler));

router.post("/", withAuth({ resource: "clUc", action: "create" }, ClUcController.create as RequestHandler));

router.put("/:id", withAuth({ resource: "clUc", action: "edit" }, ClUcController.update as RequestHandler));

router.delete("/:id", withAuth({ resource: "clUc", action: "delete" }, ClUcController.delete as RequestHandler));

export default router;
