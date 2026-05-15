"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IJobRequest, updateJobStatus, deleteJob } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface JobCardProps {
  job: IJobRequest;
  onJobUpdated: () => void;
}

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

export default function JobCard({ job, onJobUpdated }: JobCardProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>(job.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const icon = categoryIcons[job.category || ""] || "🔨";
  const isClosed = status === "Closed";
  const isTradesperson = user?.role === "tradesperson";
  const currentStyle = statusConfig[status];

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
      await updateJobStatus(job._id, newStatus);
      setStatus(newStatus);
      onJobUpdated();
    } catch {
      setStatus(status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteJob(job._id);
      onJobUpdated();
    } catch {
      setDeleting(false);
    }
  };

  if (deleting) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex items-center justify-center opacity-50">
        <p className="text-sm text-gray-400">Deleting...</p>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 h-full flex flex-col relative ${
        isClosed
          ? "opacity-60 grayscale"
          : "hover:shadow-lg hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>

        {/* Tradesperson: Custom dropdown | Homeowner: Static badge */}
        {isTradesperson && !isClosed ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              disabled={updating}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                currentStyle.bg
              } ${currentStyle.text} ${
                updating ? "opacity-50 cursor-wait" : "hover:shadow-md"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStyle.dot}`}></span>
              {status}
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
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
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 min-w-[140px]">
                {allStatuses.map((s) => {
                  const style = statusConfig[s];
                  const isActive = s === status;
                  return (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusSelect(s);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer mb-1 last:mb-0 ${
                        style.bg
                      } ${style.text} ${
                        isActive
                          ? "ring-2 ring-offset-1 ring-gray-300"
                          : "hover:scale-105 hover:shadow-sm"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                      {s}
                      {isActive && (
                        <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
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
        ) : (
          /* Static badge for homeowner or closed */
          <span
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${currentStyle.bg} ${currentStyle.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentStyle.dot}`}></span>
            {status}
          </span>
        )}
      </div>

      {/* Title */}
      {isClosed ? (
        <h3 className="text-lg font-bold text-gray-400 mb-2 line-clamp-2">
          {job.title}
        </h3>
      ) : (
        <Link href={`/jobs/${job._id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer">
            {job.title}
          </h3>
        </Link>
      )}

      {/* Description */}
      <p
        className={`text-sm mb-4 line-clamp-2 flex-grow ${
          isClosed ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {job.category && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                isClosed ? "text-gray-300 bg-gray-50" : "text-gray-500 bg-gray-50"
              }`}
            >
              {job.category}
            </span>
          )}
          {job.location && (
            <span
              className={`text-xs flex items-center gap-1 ${
                isClosed ? "text-gray-300" : "text-gray-400"
              }`}
            >
              📍 {job.location}
            </span>
          )}
        </div>
        
        {/* Delete — visible for tradesperson and homeowner */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold cursor-pointer hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-sm"
          title="Delete request"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}