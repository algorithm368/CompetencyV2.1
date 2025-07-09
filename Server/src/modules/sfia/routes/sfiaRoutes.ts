import { Router } from "express";
import getJobLevelsRoutes from "./getJobLevelsRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from sfia");
});

router.use("/job-levels", getJobLevelsRoutes);

export default router;
