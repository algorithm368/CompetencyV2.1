import { Router } from "express";
import getUnitcodeDetailRoutes from "./getUnitcodeDetailRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from tpqi");
});

router.use("/unit-code-details", getUnitcodeDetailRoutes);

export default router;
