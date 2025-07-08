import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import rbacRoutes from "@Competency/routes/rbacRoutes";
import searchCareerRoutes from "@Competency/routes/searchCareerRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});

router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/careers", searchCareerRoutes);

export default router;
