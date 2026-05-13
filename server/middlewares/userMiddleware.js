function getUserId(req, res, next) {
  const raw = req.headers["x-user-id"];
  const userId = typeof raw === "string" ? raw.trim() : "";

  if (!userId) {
    return res.status(400).json({ error: "Missing x-user-id header." });
  }

  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(userId)) {
    return res.status(400).json({ error: "Invalid x-user-id format." });
  }

  req.userId = userId;
  next();
}

module.exports = getUserId;
