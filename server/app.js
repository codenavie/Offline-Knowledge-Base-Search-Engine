const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const documentRoutes = require("./routes/documentRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

function parseAllowedOrigins(raw) {
  if (!raw) return ["http://localhost:5173"];

  return raw
    .split(",")
    .map((origin) => origin.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, ""))
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins(process.env.CLIENT_URL);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Offline KB API is running.",
    health: "/health",
    apiBase: "/api"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api", (_req, res) => {
  res.json({
    name: "Offline Knowledge Base Search API",
    endpoints: [
      "GET /health",
      "GET /api",
      "GET /api/documents",
      "GET /api/documents/:id",
      "GET /api/search?q=<query>",
      "POST /api/upload",
      "DELETE /api/documents/:id"
    ]
  });
});

app.use("/api", documentRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
