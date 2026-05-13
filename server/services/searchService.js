const crypto = require("crypto");
const { parseQuery, tokenize } = require("../core/parser");
const { createEmptyIndex, addDocumentToIndex, removeDocumentFromIndex, hasExactPhrase } = require("../core/indexer");
const { rankDocuments } = require("../core/ranker");
const { readIndex, writeIndex, ensureStorage } = require("../storage/indexStore");
const { escapeRegExp } = require("../utils/sanitize");

class SearchService {
  constructor() {
    ensureStorage();
    this.index = readIndex() || createEmptyIndex();
  }

  persist() {
    writeIndex(this.index);
  }

  getUserDocuments(userId) {
    return Object.values(this.index.documents)
      .filter((doc) => doc.userId === userId)
      .map((doc) => ({
        id: doc.id,
        title: doc.title,
        tokenCount: doc.tokenCount,
        indexedAt: doc.indexedAt
      }));
  }

  getUserDocument(userId, documentId) {
    const doc = this.index.documents[documentId] || null;
    if (!doc || doc.userId !== userId) return null;
    return doc;
  }

  upsertUserDocument(userId, { title, text }) {
    const tokens = tokenize(text);
    if (!tokens.length) {
      throw new Error("Document has no searchable text after normalization.");
    }

    const checksum = crypto.createHash("sha256").update(text).digest("hex");
    const existing = Object.values(this.index.documents).find((doc) => doc.userId === userId && doc.checksum === checksum);

    if (existing) {
      return { document: existing, skipped: true };
    }

    const id = crypto.randomUUID();
    const doc = {
      id,
      userId,
      title,
      text,
      tokens,
      tokenCount: tokens.length,
      checksum
    };

    addDocumentToIndex(this.index, doc);
    this.persist();

    return { document: this.index.documents[id], skipped: false };
  }

  deleteUserDocument(userId, documentId) {
    const doc = this.index.documents[documentId];
    if (!doc || doc.userId !== userId) return false;
    removeDocumentFromIndex(this.index, documentId);
    this.persist();
    return true;
  }

  searchUserDocuments(userId, rawQuery) {
    const query = parseQuery(rawQuery);
    if (!query.terms.length && !query.phrases.length) {
      return [];
    }

    const termDocSets = query.terms.map((term) => new Set(Object.keys(this.index.terms[term] || {})));
    let candidateDocIds = new Set();

    if (termDocSets.length) {
      candidateDocIds = new Set(termDocSets.flatMap((set) => [...set]));
    } else {
      candidateDocIds = new Set(Object.keys(this.index.documents));
    }

    candidateDocIds = new Set(
      [...candidateDocIds].filter((docId) => {
        const doc = this.index.documents[docId];
        return doc && doc.userId === userId;
      })
    );

    if (query.phrases.length) {
      const phraseTokenized = query.phrases.map((phrase) => tokenize(phrase));
      candidateDocIds = new Set(
        [...candidateDocIds].filter((docId) => phraseTokenized.every((phraseTokens) => hasExactPhrase(this.index, docId, phraseTokens)))
      );
    }

    const ranked = rankDocuments({
      index: this.index,
      candidateDocIds: [...candidateDocIds],
      queryTerms: query.terms.length ? query.terms : tokenize(query.phrases.join(" "))
    });

    const highlightTerms = [...new Set([...query.terms, ...tokenize(query.phrases.join(" "))])];

    return ranked.map((doc) => ({
      id: doc.id,
      title: doc.title,
      snippet: this.createSnippet(doc.text, highlightTerms),
      score: doc.score
    }));
  }

  createSnippet(text, terms) {
    const source = text || "";
    if (!source) return "";

    let index = 0;
    const normalized = source.toLowerCase();

    for (const term of terms) {
      const pos = normalized.indexOf(term.toLowerCase());
      if (pos >= 0) {
        index = pos;
        break;
      }
    }

    const start = Math.max(index - 80, 0);
    const end = Math.min(index + 160, source.length);
    let snippet = source.slice(start, end).trim();

    terms.forEach((term) => {
      const pattern = new RegExp(`(${escapeRegExp(term)})`, "gi");
      snippet = snippet.replace(pattern, "<mark>$1</mark>");
    });

    return snippet;
  }
}

module.exports = new SearchService();
