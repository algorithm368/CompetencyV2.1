import { RequestHandler, Router } from "express";
import { getUnitCodeDetailController } from "../controllers/getUnitcodeDetailController";

const router = Router();

// example route: /api/tpqi/unitcodes
router.get("/", (req, res) => {
  res.send("Hello from tpqi unit code routes");
});

// example route: /api/tpqi/unitcodes/:unitCode
router.get("/:unitCode", getUnitCodeDetailController as RequestHandler);

export default router;
