import { Router } from "express";
import adminRoutes from "./modules/admin/routes/adminRoutes";
import sfiaRoutes from "./modules/sfia/routes/sfiaRoutes";
import tpqiRoutes from "./modules/tpqi/routes/tpqiRoutes";
import competencyRoutes from "./modules/competency/routes/competencyRoutes";
import healthRoutes from "./modules/health/routes/healthRoutes";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/competency", competencyRoutes);
routes.use("/admin", adminRoutes);
routes.use("/sfia", sfiaRoutes);
routes.use("/tpqi", tpqiRoutes);

export { routes };
