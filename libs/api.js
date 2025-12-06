// API utility functions

const API_BASE = typeof window !== "undefined" ? "" : "http://localhost:3000";

export function getAuthHeaders(isAdmin = false) {
  const token = isAdmin
    ? (typeof window !== "undefined" ? localStorage.getItem("adminToken") : null)
    : (typeof window !== "undefined" ? localStorage.getItem("userToken") : null);

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function apiRequest(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(options.isAdmin),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

