import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import searchJobRoutes from "@Competency/routes/searchJobRoutes"


const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Competency API");
});

router.use("/auth", authRoutes);
router.use("/jobs", searchJobRoutes);

export default router;
