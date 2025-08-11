import { Router } from "express";
import profileData from "./profileDataRoutes";
import profileBasic from "./profileBasicRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Profile API");
});

// example route: /api/competency/profile
// permission: authenticated users only
// body: { "firstNameTH": "string", "lastNameTH": "string", ... }
router.use("/profile", profileData);

// example route: /api/competency/profile/basic
// permission: authenticated users only
router.use("/profile/basic", profileBasic);

export default router;
