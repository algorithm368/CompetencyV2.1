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
    userId: "c17b3cf5-f54a-46a1-945d-565d59978363",
    email: "siriwat.chr@gmail.com",
    role: "USER",
  };

  const token = generateToken(testPayload);
  res.json({ accessToken: token });
});

export { routes };
