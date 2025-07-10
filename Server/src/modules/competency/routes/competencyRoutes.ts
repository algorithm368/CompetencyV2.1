import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import searchCompetencyRoutes from "@Competency/routes/searchCompetencyRoutes"


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});


router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/careers", searchCareerRoutes);
router.use("/search", searchCompetencyRoutes);

export default router;
