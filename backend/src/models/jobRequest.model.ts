import { Schema, model, Document } from "mongoose";

// ── TypeScript Interface ──
export interface IJobRequest {
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Open" | "In Progress" | "Closed";
  createdBy?: string;
  createdAt: Date;
}

export interface IJobRequestDocument extends IJobRequest, Document {}

// ── Email regex ──
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Mongoose Schema ──
const jobRequestSchema = new Schema<IJobRequestDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function (value: string) {
          if (!value) return true;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "Status must be Open, In Progress, or Closed",
      },
      default: "Open",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const JobRequest = model<IJobRequestDocument>("JobRequest", jobRequestSchema);

export default JobRequest;
