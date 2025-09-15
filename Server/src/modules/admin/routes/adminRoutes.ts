import { Router } from "express";
import { DashboardController } from "@Admin/controllers/dashboardController";
import { BackupController } from "@Admin/controllers/backup/backupController";

import rbacRoutes from "./rbac/rbacRoutes";
import sfiaRoutes from "./sfia/index";
import tpqiRoutes from "./tpqi/index";

const router = Router();

router.use("/sfia", sfiaRoutes);
router.use("/tpqi", tpqiRoutes);
router.use("/rbac", rbacRoutes);
router.get("/dashboard", DashboardController.getSummary);
router.get("/backup/databases", BackupController.getAvailableDatabases);
router.post("/backup", BackupController.createBackup);
router.get("/backup/:filename", BackupController.downloadBackup);

router.get("/", (req, res) => {
  res.send("Hello from Admin");
});

export default router;
