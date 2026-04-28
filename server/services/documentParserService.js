const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".txt") {
    return fs.readFileSync(file.path, "utf8");
  }

  if (ext === ".pdf") {
    const buffer = fs.readFileSync(file.path);
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  if (ext === ".docx") {
    const data = await mammoth.extractRawText({ path: file.path });
    return data.value || "";
  }

  throw new Error("Unsupported file type. Allowed: .txt, .pdf, .docx");
}

function checksumFromContent(content) {
  return crypto.createHash("sha256").update(content || "").digest("hex");
}

module.exports = {
  extractText,
  checksumFromContent
};
