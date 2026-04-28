const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
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
