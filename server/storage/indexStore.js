const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "..");
const indexFile = path.join(storageDir, "index.json");

function ensureStorage() {
  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(
      indexFile,
      JSON.stringify({ terms: {}, documents: {}, totalDocuments: 0, updatedAt: new Date().toISOString() }, null, 2),
      "utf8"
    );
  }
}

function readIndex() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(indexFile, "utf8"));
}

function writeIndex(index) {
  ensureStorage();
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf8");
}

module.exports = {
  readIndex,
  writeIndex,
  ensureStorage,
  indexFile
};
