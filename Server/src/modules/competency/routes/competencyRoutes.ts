import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from competency");
});

router.use("/auth", authRoutes);

export default router;
