"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchJobs, IJobRequest } from "@/services/api";
import JobCard from "@/components/JobCard";
import JobFormModal from "@/components/JobFormModal";

const categories = ["All", "Plumbing", "Electrical", "Painting", "Joinery"];

export default function HomePage() {
  const [jobs, setJobs] = useState<IJobRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const category =
        selectedCategory === "All" ? undefined : selectedCategory;
      const data = await fetchJobs(category);
      setJobs(data);
      setError("");
    } catch {
      setError("Failed to load jobs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Open Requests
          </h1>
          <p className="text-gray-500">
            Browse service requests from homeowners in your area
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          + New Request
        </button>
      </div>

      {/* ── Category Filter ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ── Error State ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">📋</span>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No requests found
          </h3>
          <p className="text-gray-500">
            No service requests match the current filter.
          </p>
        </div>
      )}

      {/* ── Job Cards Grid ── */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobCreated={loadJobs}
      />
    </div>
  );
}