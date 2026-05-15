const API_BASE = "http://localhost:5000/api/jobs";

// ── Helper to get token ──
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      return user.token || null;
    }
  } catch {
    return null;
  }
  return null;
};

// ── Auth headers ──
const authHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ── TypeScript Interfaces ──
export interface IJobRequest {
  _id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  category?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
}

// ── GET all jobs ──
export const fetchJobs = async (
  category?: string,
  status?: string
): Promise<IJobRequest[]> => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}${query}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch jobs");

  const data = await res.json();
  return data.data;
};

// ── GET single job ──
export const fetchJobById = async (id: string): Promise<IJobRequest> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch job");

  const data = await res.json();
  return data.data;
};

// ── POST create a new job ──
export const createJob = async (
  payload: CreateJobPayload
): Promise<IJobRequest> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create job");
  }

  const data = await res.json();
  return data.data;
};

// ── PATCH update status only ──
export const updateJobStatus = async (
  id: string,
  status: "Open" | "In Progress" | "Closed"
): Promise<IJobRequest> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update job status");

  const data = await res.json();
  return data.data;
};

// ── DELETE a job ──
export const deleteJob = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete job");
};