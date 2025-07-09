import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import searchSkillRoutes from "@Competency/routes/searchSkillRoutes"


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});

router.use("/auth", authRoutes);
router.use("/skill", searchSkillRoutes);

export default router;
