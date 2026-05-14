import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobRequest.controller";

const router = Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);

export default router;
