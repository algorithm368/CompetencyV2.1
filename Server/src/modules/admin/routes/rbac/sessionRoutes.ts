import { Router } from "express";
import { SessionController } from "@/modules/admin/controllers/rbac/sessionController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/sessions", withAuth({ resource: "Session", action: "create" }, SessionController.createSession));

router.get("/sessions", withAuth({ resource: "Session", action: "read" }, SessionController.getAll));

router.get("/sessions/:id", withAuth({ resource: "Session", action: "read" }, SessionController.getSessionById));

router.get("/sessions/by-access-token", withAuth({ resource: "Session", action: "read" }, SessionController.getSessionByAccessToken));

router.get("/sessions/by-refresh-token", withAuth({ resource: "Session", action: "read" }, SessionController.getSessionByRefreshToken));

router.delete("/sessions/:id", withAuth({ resource: "Session", action: "delete" }, SessionController.deleteSessionById));

router.delete("/sessions/user/:userId", withAuth({ resource: "Session", action: "delete" }, SessionController.deleteSessionsByUserId));

router.get("/sessions/:id/expired", withAuth({ resource: "Session", action: "read" }, SessionController.isSessionExpired));

export default router;
