const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

function safeDelete(filePath) {
  if (!filePath) return;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = {
  uploadDir,
  safeDelete
};
