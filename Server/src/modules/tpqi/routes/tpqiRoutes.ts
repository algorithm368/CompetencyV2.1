import { Router } from "express";
import tpqiUnitcode  from "./tpqiUnitcodeRoutes"

const router = Router();

// example route: /api/tpqi
router.get("/", (req, res) => {
  res.send("Hello from tpqi");
});

router.use("/unitcodes", tpqiUnitcode);

export default router;
