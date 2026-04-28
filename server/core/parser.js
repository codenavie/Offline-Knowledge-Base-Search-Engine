const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"
]);

function stem(token) {
  if (token.length <= 3) return token;

  const rules = [
    [/(ing|edly|edly|edly)$/i, ""],
    [/(ed|ly)$/i, ""],
    [/(ies)$/i, "y"],
    [/(s)$/i, ""]
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(token)) {
      const stemmed = token.replace(pattern, replacement);
      if (stemmed.length >= 3) return stemmed;
    }
  }

  return token;
}

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "", options = {}) {
  const { removeStopWords = true, useStemming = true } = options;
  const normalized = normalizeText(text);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .filter(Boolean)
    .filter((token) => (removeStopWords ? !STOP_WORDS.has(token) : true))
    .map((token) => (useStemming ? stem(token) : token));
}

function parseQuery(rawQuery = "") {
  const phraseMatches = [...rawQuery.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const queryWithoutPhrases = rawQuery.replace(/"([^"]+)"/g, " ");

  return {
    original: rawQuery,
    phrases: phraseMatches,
    terms: tokenize(queryWithoutPhrases)
  };
}

module.exports = {
  STOP_WORDS,
  normalizeText,
  tokenize,
  parseQuery,
  stem
};
