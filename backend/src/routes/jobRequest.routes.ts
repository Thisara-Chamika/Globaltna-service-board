import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobRequest.controller";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

// All job routes require authentication
router.use(protect);

// Any authenticated user can view jobs
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Only homeowners can create jobs
router.post("/", authorize("homeowner"), createJob);

// Only tradespeople can update status or delete
router.patch("/:id", authorize("tradesperson"), updateJobStatus);
router.delete("/:id", authorize("tradesperson", "homeowner"), deleteJob);

export default router;