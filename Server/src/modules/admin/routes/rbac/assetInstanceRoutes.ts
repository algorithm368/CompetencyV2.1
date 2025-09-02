import { Router } from "express";
import { AssetInstanceController } from "@/modules/admin/controllers/rbac/assetInstanceController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/asset-instances", withAuth({ resource: "AssetInstance", action: "create" }, AssetInstanceController.createInstance));

router.delete("/asset-instances/:id", withAuth({ resource: "AssetInstance", action: "delete" }, AssetInstanceController.deleteInstanceById));

router.delete("/asset-instances", withAuth({ resource: "AssetInstance", action: "delete" }, AssetInstanceController.deleteInstance));

router.get("/asset-instances/asset/:assetId", withAuth({ resource: "AssetInstance", action: "read" }, AssetInstanceController.getInstancesByAsset));

router.get("/asset-instances", withAuth({ resource: "AssetInstance", action: "read" }, AssetInstanceController.getAll));

router.get("/asset-instances/:id", withAuth({ resource: "AssetInstance", action: "read" }, AssetInstanceController.getInstanceById));

router.put("/asset-instances/:id", withAuth({ resource: "AssetInstance", action: "update" }, AssetInstanceController.updateInstanceRecord));

export default router;
