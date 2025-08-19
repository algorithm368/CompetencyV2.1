import { Router } from "express";
import adminRoutes from "./modules/admin/routes/adminRoutes";
import sfiaRoutes from "./modules/sfia/routes/sfiaRoutes";
import tpqiRoutes from "./modules/tpqi/routes/tpqiRoutes";
import competencyRoutes from "./modules/competency/routes/competencyRoutes";
import healthRoutes from "./modules/health/routes/healthRoutes";
import { generateToken } from "@Utils/tokenUtils";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/competency", competencyRoutes);
routes.use("/admin", adminRoutes);
routes.use("/sfia", sfiaRoutes);
routes.use("/tpqi", tpqiRoutes);

routes.get("/test-token", (req, res) => {
  const testPayload = {
    userId: "b1530e81-2b96-4c2c-9b0d-73a7ff9c3b34",
    email: "siriwat.chr@gmail.com",
    role: "USER",
  };

  const token = generateToken(testPayload);
  res.json({ accessToken: token });
});

export { routes };
