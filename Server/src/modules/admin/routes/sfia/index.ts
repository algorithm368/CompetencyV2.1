import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import descriptionRoutes from "./descriptionRoutes";
import informationRoutes from "./informationRoutes";
import skillRoutes from "./skillRoutes";
import levelRoutes from "./levelRoutes";
import subSkillRoutes from "./subSkillRoutes";
import subcategoryRoutes from "./subcategoryRoutes";
import summaryDataRoutes from "./summaryDataRoutes";

const router = Router();

router.use("/category", categoryRoutes);
router.use("/description", descriptionRoutes);
router.use("/information", informationRoutes);
router.use("/skill", skillRoutes);
router.use("/level", levelRoutes);
router.use("/sub-skill", subSkillRoutes);
router.use("/subcategory", subcategoryRoutes);
router.use("/summary-data", summaryDataRoutes);

export default router;
