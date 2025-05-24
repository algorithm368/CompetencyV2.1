import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import datacollectionRoutes from "./datacollectionRoutes";
import descriptionRoutes from "./descriptionRoutes";
import educationRoutes from "./educationRoutes";
import experienceRoutes from "./experienceRoutes";
import informationRoutes from "./informationRoutes";
import jobRoutes from "./jobRoutes";
import levelRoutes from "./levelRoutes";
import portfolioRoutes from "./portfolioRoutes";
import skillRoutes from "./skillRoutes";
import subcategoryRoutes from "./subcategoryRoutes";
import summaryDataRoutes from "./summaryDataRoutes";

const router = Router();

router.use("/category", categoryRoutes);
router.use("/description", descriptionRoutes);
router.use("/datacollection", datacollectionRoutes);
router.use("/education", educationRoutes);
router.use("/experience", experienceRoutes);
router.use("/information", informationRoutes);
router.use("/job", jobRoutes);
router.use("/level", levelRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/skill", skillRoutes);
router.use("/subcategory", subcategoryRoutes);
router.use("/summary-data", summaryDataRoutes);

export default router;
