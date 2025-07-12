import { Router } from "express";
import getSkillLevelsRoutes from "./getSkillLevelsRoutes";
import getSkillDetailRoutes from "./getSkillDetailRoutes";
// Keep old routes for backward compatibility

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

// New routes with updated names
router.use("/skill-levels", getSkillLevelsRoutes);
router.use("/skill-details", getSkillDetailRoutes);

export default router;
