import { Router } from "express";
import authRoutes from "@Competency/routes/authRoutes";
import rbacRoutes from "@Competency/routes/rbacRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from competency");
});

router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);

export default router;
