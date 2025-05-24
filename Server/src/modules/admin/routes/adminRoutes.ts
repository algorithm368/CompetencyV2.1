import { Router } from "express";
import sfiaRoutes from "./sfia/index";
import tpqiRoutes from "./tpqi/index";

const router = Router();

router.use("/sfia", sfiaRoutes);
router.use("/tpqi", tpqiRoutes);

router.get("/", (req, res) => {
  res.send("Hello from Admin");
});

export default router;
