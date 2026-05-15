"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchJobById,
  updateJobStatus,
  deleteJob,
  IJobRequest,
} from "@/services/api";

type Status = "Open" | "In Progress" | "Closed";

const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
  Open: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  "In Progress": {
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  Closed: {
    bg: "bg-red-100",
    text: "text-red-600",
    dot: "bg-red-500",
  },
};

const allStatuses: Status[] = ["Open", "In Progress", "Closed"];

const categoryIcons: Record<string, string> = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
};

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [job, setJob] = useState<IJobRequest | null>(null);
  const [status, setStatus] = useState<Status>("Open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isClosed = status === "Closed";

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const data = await fetchJobById(id);
        setJob(data);
        setStatus(data.status);
      } catch {
        setError("Job not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleStatusSelect = async (newStatus: Status) => {
    setDropdownOpen(false);
    if (newStatus === status) return;

    setUpdating(true);
    try {
      await updateJobStatus(id, newStatus);
      setStatus(newStatus);
    } catch {
      setStatus(status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${job?.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteJob(id);
      router.push("/");
    } catch {
      alert("Failed to delete job.");
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ── Error ──
  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <span className="text-5xl mb-4 block">😕</span>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {error || "Job not found"}
        </h2>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentStyle = statusConfig[status];
  const icon = categoryIcons[job.category || ""] || "🔨";
  const createdDate = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const createdTime = new Date(job.createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{icon}</span>
              <div>
                {job.category && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                )}
              </div>
            </div>

            {/* Custom Status Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (!isClosed) setDropdownOpen(!dropdownOpen);
                }}
                disabled={updating || isClosed}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  currentStyle.bg
                } ${currentStyle.text} ${
                  updating ? "opacity-50 cursor-wait" : ""
                } ${isClosed ? "cursor-default" : "hover:shadow-md"}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${currentStyle.dot}`}
                ></span>
                {status}
                {!isClosed && (
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 min-w-[160px]">
                  {allStatuses.map((s) => {
                    const style = statusConfig[s];
                    const isActive = s === status;

                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusSelect(s)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer mb-1 last:mb-0 ${
                          style.bg
                        } ${style.text} ${
                          isActive
                            ? "ring-2 ring-offset-1 ring-gray-300"
                            : "hover:scale-105 hover:shadow-sm"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${style.dot}`}
                        ></span>
                        {s}
                        {isActive && (
                          <svg
                            className="w-3 h-3 ml-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {job.location && (
              <span className="flex items-center gap-1">📍 {job.location}</span>
            )}
            <span className="flex items-center gap-1">
              📅 {createdDate} at {createdTime}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Contact Section */}
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Name</p>
              <p className="text-sm font-medium text-gray-900">
                {job.contactName || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm font-medium text-blue-600">
                {job.contactEmail || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="p-8 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Job ID: {job._id}
            </p>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold cursor-pointer hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-sm"
            >
              🗑️ Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}