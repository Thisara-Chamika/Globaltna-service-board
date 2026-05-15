"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchJobs, IJobRequest } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import JobCard from "@/components/JobCard";
import JobFormModal from "@/components/JobFormModal";

const categories = ["All", "Plumbing", "Electrical", "Painting", "Joinery"];

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<IJobRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isHomeowner = user?.role === "homeowner";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const category =
        selectedCategory === "All" ? undefined : selectedCategory;
      const createdBy =
        user?.role === "homeowner" ? user._id : undefined;
      const data = await fetchJobs(category, undefined, createdBy);
      setJobs(data);
      setError("");
    } catch {
      setError("Failed to load jobs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [loadJobs, user]);

  // Show nothing while checking auth
  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {isHomeowner ? "Your Service Requests" : "Available Jobs"}
          </h1>
          <p className="text-gray-500">
            {isHomeowner
              ? "Manage your posted service requests"
              : "Browse and manage open service requests"}
          </p>
        </div>
        {/* Only homeowners can create new requests */}
        {isHomeowner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            + New Request
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Empty */}
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

      {/* Job Cards */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onJobUpdated={loadJobs} />
          ))}
        </div>
      )}

      {/* Modal — only for homeowners */}
      {isHomeowner && (
        <JobFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onJobCreated={loadJobs}
        />
      )}
    </div>
  );
}