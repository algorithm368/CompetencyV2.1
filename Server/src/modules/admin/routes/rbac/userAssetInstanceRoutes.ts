import { Router } from "express";
import { UserAssetInstanceController } from "@/modules/admin/controllers/rbac/userAssetInstanceController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/user-asset-instances", withAuth({ resource: "UserAssetInstance", action: "create" }, UserAssetInstanceController.assign));

router.delete("/user-asset-instances", withAuth({ resource: "UserAssetInstance", action: "delete" }, UserAssetInstanceController.revoke));

router.get("/user-asset-instances/user/:userId", withAuth({ resource: "UserAssetInstance", action: "read" }, UserAssetInstanceController.getForUser));

router.get("/user-asset-instances", withAuth({ resource: "UserAssetInstance", action: "read" }, UserAssetInstanceController.getAll));

export default router;
