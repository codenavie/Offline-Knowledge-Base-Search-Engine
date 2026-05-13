const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "");

if (!API_BASE) {
  throw new Error("Missing VITE_API_BASE for production build.");
}

const USER_ID_KEY = "offline_kb_user_id";

function getUserId() {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, "");
  localStorage.setItem(USER_ID_KEY, generated);
  return generated;
}

async function request(path, options = {}) {
  const userId = getUserId();
  const headers = {
    "x-user-id": userId,
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export function listDocuments() {
  return request("/documents");
}

export function getDocument(id) {
  return request(`/documents/${id}`);
}

export function searchDocuments(query) {
  const encoded = encodeURIComponent(query);
  return request(`/search?q=${encoded}`);
}

export function deleteDocument(id) {
  return request(`/documents/${id}`, { method: "DELETE" });
}

export function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", body: formData });
}
