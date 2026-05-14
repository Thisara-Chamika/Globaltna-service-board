import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import jobRequestRoutes from "./routes/jobRequest.routes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.get("/", (req, res) => {
  res.json({ message: "GlobalTNA Service Board API" });
});

app.use("/api/jobs", jobRequestRoutes);

// ── 404 for unmatched routes ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Start Server ──
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});