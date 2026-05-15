import { Request, Response, NextFunction } from "express";
import JobRequest from "../models/jobRequest.model";
import AppError from "../middleware/AppError";

// GET /api/jobs — list all jobs with optional filters
export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, status, createdBy } = req.query;
    const filter: Record<string, string> = {};

    if (category && typeof category === "string") {
      filter.category = category;
    }
    if (status && typeof status === "string") {
      filter.status = status;
    }
    if (createdBy && typeof createdBy === "string") {
      filter.createdBy = createdBy;
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id — fetch a single job
export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new AppError("Job request not found", 404);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/jobs — create a new job
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, category, location, contactName, contactEmail } =
      req.body;

    if (!title || !title.trim()) {
      throw new AppError("Title is required", 400);
    }
    if (!description || !description.trim()) {
      throw new AppError("Description is required", 400);
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      createdBy: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/jobs/:id — update status ONLY
export const updateJobStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Open", "In Progress", "Closed"];

    if (!status) {
      throw new AppError("Status field is required", 400);
    }

    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        "Status must be one of: Open, In Progress, Closed",
        400
      );
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new AppError("Job request not found", 404);
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id — delete a job
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      throw new AppError("Job request not found", 404);
    }

    // Homeowners can only delete their own jobs
    if (
      req.user?.role === "homeowner" &&
      job.createdBy?.toString() !== req.user.userId
    ) {
      throw new AppError("You can only delete your own job requests", 403);
    }

    await JobRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};