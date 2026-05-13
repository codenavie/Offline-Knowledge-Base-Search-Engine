const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://localhost:4000/api" : "");

if (!API_BASE) {
  throw new Error("Missing VITE_API_BASE for production build.");
}

const TOKEN_KEY = "offline_kb_auth_token";
const USER_KEY = "offline_kb_auth_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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

export async function registerUser(payload) {
  const data = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  setSession(data.token, data.user);
  return data;
}

export async function loginUser(payload) {
  const data = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  setSession(data.token, data.user);
  return data;
}

export async function fetchMe() {
  const data = await request("/auth/me");
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export function logoutUser() {
  clearSession();
}

export function isAuthenticated() {
  return Boolean(getToken());
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

export { getCurrentUser };
