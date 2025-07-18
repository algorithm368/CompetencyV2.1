import { Router } from "express";

const router = Router();

// example route: /api/tpqi/unitcodes
router.get("/", (req, res) => {
  res.send("Hello from tpqi unit code routes");
});



export default router;

