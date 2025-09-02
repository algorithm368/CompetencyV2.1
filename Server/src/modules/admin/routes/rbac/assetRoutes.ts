import { Router } from "express";
import { AssetController } from "@/modules/admin/controllers/rbac/assetController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/assets", withAuth({ resource: "Asset", action: "create" }, AssetController.createAsset));

router.get("/assets", withAuth({ resource: "Asset", action: "read" }, AssetController.getAll));

router.put("/assets/:id", withAuth({ resource: "Asset", action: "update" }, AssetController.updateAsset));

router.delete("/assets/:id", withAuth({ resource: "Asset", action: "delete" }, AssetController.deleteAsset));

export default router;
