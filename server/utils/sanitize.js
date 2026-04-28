function sanitizeQuery(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw.trim().slice(0, 300);
}

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  sanitizeQuery,
  escapeRegExp
};
