const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadDocument,
  searchDocuments,
  listDocuments,
  getDocument,
  deleteDocument
} = require("../controllers/documentController");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/search", searchDocuments);
router.get("/documents", listDocuments);
router.get("/documents/:id", getDocument);
router.delete("/documents/:id", deleteDocument);

module.exports = router;
