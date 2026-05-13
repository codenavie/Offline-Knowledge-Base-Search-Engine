const searchService = require("../services/searchService");
const { extractText } = require("../services/documentParserService");
const { safeDelete } = require("../utils/fileUtils");
const { sanitizeQuery } = require("../utils/sanitize");

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const extractedText = await extractText(req.file);
    const result = searchService.upsertUserDocument(req.userId, {
      title: req.file.originalname,
      text: extractedText
    });

    safeDelete(req.file.path);

    return res.status(result.skipped ? 200 : 201).json({
      message: result.skipped ? "Duplicate content detected. Skipped indexing." : "Document indexed successfully.",
      document: {
        id: result.document.id,
        title: result.document.title,
        tokenCount: result.document.tokenCount,
        indexedAt: result.document.indexedAt
      }
    });
  } catch (error) {
    if (req.file?.path) safeDelete(req.file.path);
    next(error);
  }
}

function searchDocuments(req, res) {
  const q = sanitizeQuery(req.query.q);
  const started = Date.now();
  const results = searchService.searchUserDocuments(req.userId, q);
  const durationMs = Date.now() - started;

  res.json({
    query: q,
    count: results.length,
    durationMs,
    results
  });
}

function listDocuments(req, res) {
  res.json({ documents: searchService.getUserDocuments(req.userId) });
}

function getDocument(req, res) {
  const doc = searchService.getUserDocument(req.userId, req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found." });

  res.json({
    document: {
      id: doc.id,
      title: doc.title,
      text: doc.text,
      indexedAt: doc.indexedAt,
      tokenCount: doc.tokenCount
    }
  });
}

function deleteDocument(req, res) {
  const removed = searchService.deleteUserDocument(req.userId, req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Document not found." });
  }
  res.json({ message: "Document removed." });
}

module.exports = {
  uploadDocument,
  searchDocuments,
  listDocuments,
  getDocument,
  deleteDocument
};
