import Link from "next/link";
import { IJobRequest } from "@/services/api";

interface JobCardProps {
  job: IJobRequest;
}

const statusStyles: Record<string, string> = {
  Open: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
  Closed: "bg-gray-100 text-gray-600 border border-gray-200",
};

const categoryIcons: Record<string, string> = {
  Plumbing: "🔧",
  Electrical: "⚡",
  Painting: "🎨",
  Joinery: "🪚",
};

export default function JobCard({ job }: JobCardProps) {
  const icon = categoryIcons[job.category || ""] || "🔨";

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-2xl">{icon}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              statusStyles[job.status]
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
          {job.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {job.category && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {job.category}
            </span>
          )}
          {job.location && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              📍 {job.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}