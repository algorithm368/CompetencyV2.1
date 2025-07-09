import { Router } from "express";
import getJobLevelsRoutes from "./getJobLevelsRoutes";
import getJobDetailRoutes from "./getJobDetailRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

router.use("/job-levels", getJobLevelsRoutes);
router.use("/job-details", getJobDetailRoutes);

export default router;
