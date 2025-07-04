import { Router } from "express";
import {
  getJobs,
  searchCareer,
} from "@Competency/controllers/searchCareerController";

const router = Router();

// Route for check
router.get("/", (req, res) => {
  res.send("Hello from search career")
})

// Route to get all jobs/careers from the specified database
router.get("/:dbType", getJobs);

// Route to search for jobs/careers by name from the specified database
router.post("/:dbType/search", searchCareer);

export default router;
