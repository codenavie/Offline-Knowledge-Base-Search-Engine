const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const documentRoutes = require("./routes/documentRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", documentRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
