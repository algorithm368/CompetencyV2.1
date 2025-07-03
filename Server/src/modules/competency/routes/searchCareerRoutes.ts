import { Router } from "express";
import { searchCareerNamesHandler } from "@Competency/controllers/searchCareerController";

const router = Router();

router.post("/careers/search-names", searchCareerNamesHandler);

export default router;
