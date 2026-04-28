const multer = require("multer");
const path = require("path");
const { uploadDir } = require("../utils/fileUtils");

const maxSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 50);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  }
});

const allowedExtensions = new Set([".pdf", ".docx", ".txt"]);

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return cb(new Error("Invalid file type. Use PDF, DOCX, or TXT."));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: maxSizeMb * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
