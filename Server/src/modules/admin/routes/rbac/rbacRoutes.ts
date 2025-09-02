import { Router } from "express";
import assetInstanceRoutes from "./assetInstanceRoutes";
import assetRoutes from "./assetRoutes";
import logRoutes from "./logRoutes";
import operationRoutes from "./operationRoutes";
import permissionRoutes from "./permissionRoutes";
import roleRoutes from "./roleRoutes";
import rolePermissionRoutes from "./rolePermissionRoutes";
import sessionRoutes from "./sessionRoutes";
import userRoutes from "./userRoutes";
import userRoleRoutes from "./userRoleRoutes";
import userAssetInstanceRoutes from "./userAssetInstanceRoutes";

const rbacRoutes = Router();

rbacRoutes.get("/", (req, res) => res.send("Hello from RBAC API"));

rbacRoutes.use(assetInstanceRoutes);
rbacRoutes.use(assetRoutes);
rbacRoutes.use(logRoutes);
rbacRoutes.use(operationRoutes);
rbacRoutes.use(permissionRoutes);
rbacRoutes.use(roleRoutes);
rbacRoutes.use(rolePermissionRoutes);
rbacRoutes.use(sessionRoutes);
rbacRoutes.use(userRoutes);
rbacRoutes.use(userRoleRoutes);
rbacRoutes.use(userAssetInstanceRoutes);

export default rbacRoutes;
