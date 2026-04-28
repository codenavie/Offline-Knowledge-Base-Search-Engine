function rankDocuments({ index, candidateDocIds, queryTerms }) {
  const totalDocs = Math.max(index.totalDocuments, 1);
  const uniqueTerms = [...new Set(queryTerms)];

  return candidateDocIds
    .map((docId) => {
      const doc = index.documents[docId];
      if (!doc) return null;

      let score = 0;

      uniqueTerms.forEach((term) => {
        const postings = index.terms[term];
        if (!postings || !postings[docId]) return;

        const tf = (doc.termFrequencies[term] || 0) / Math.max(doc.tokenCount, 1);
        const df = Object.keys(postings).length;
        const idf = Math.log((1 + totalDocs) / (1 + df)) + 1;

        score += tf * idf;
      });

      return {
        ...doc,
        score: Number(score.toFixed(6))
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  rankDocuments
};
