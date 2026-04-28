function createEmptyIndex() {
  return {
    terms: {},
    documents: {},
    totalDocuments: 0,
    updatedAt: new Date().toISOString()
  };
}

function buildTermFrequencies(tokens) {
  const frequencies = {};
  tokens.forEach((token) => {
    frequencies[token] = (frequencies[token] || 0) + 1;
  });
  return frequencies;
}

function addDocumentToIndex(index, document) {
  const { id, tokens, tokenCount, title, checksum, text } = document;
  const positionsByTerm = {};

  tokens.forEach((term, position) => {
    if (!positionsByTerm[term]) positionsByTerm[term] = [];
    positionsByTerm[term].push(position);
  });

  Object.entries(positionsByTerm).forEach(([term, positions]) => {
    if (!index.terms[term]) index.terms[term] = {};
    index.terms[term][id] = positions;
  });

  index.documents[id] = {
    id,
    title,
    tokenCount,
    termFrequencies: buildTermFrequencies(tokens),
    checksum,
    text,
    indexedAt: new Date().toISOString()
  };

  index.totalDocuments = Object.keys(index.documents).length;
  index.updatedAt = new Date().toISOString();
}

function removeDocumentFromIndex(index, documentId) {
  Object.keys(index.terms).forEach((term) => {
    if (index.terms[term][documentId]) {
      delete index.terms[term][documentId];
      if (Object.keys(index.terms[term]).length === 0) {
        delete index.terms[term];
      }
    }
  });

  delete index.documents[documentId];
  index.totalDocuments = Object.keys(index.documents).length;
  index.updatedAt = new Date().toISOString();
}

function hasExactPhrase(index, documentId, phraseTokens) {
  if (!phraseTokens.length) return true;
  const [first, ...rest] = phraseTokens;
  const firstPositions = index.terms[first]?.[documentId] || [];
  if (!firstPositions.length) return false;

  return firstPositions.some((basePos) => {
    return rest.every((term, offset) => {
      const positions = index.terms[term]?.[documentId] || [];
      return positions.includes(basePos + offset + 1);
    });
  });
}

module.exports = {
  createEmptyIndex,
  addDocumentToIndex,
  removeDocumentFromIndex,
  hasExactPhrase
};
