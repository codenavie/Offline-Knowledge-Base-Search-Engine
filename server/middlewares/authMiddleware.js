const authService = require("../services/authService");

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid authorization token." });
  }

  try {
    const decoded = authService.verifyToken(token);
    const user = authService.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = requireAuth;
