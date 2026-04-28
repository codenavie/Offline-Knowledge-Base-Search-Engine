<template>
  <section class="section search-head">
    <h1 class="section-title">Search</h1>
    <p class="section-sub">Keyword or "Exact Phrase" Query</p>
  </section>

  <section class="section search-panel">
    <input class="bau-input" v-model="query" placeholder='Search keywords or "exact phrase"' />

    <div class="toolbar">
      <span class="muted" v-if="meta">{{ meta.count }} results in {{ meta.durationMs }}ms</span>
      <button class="bau-btn bau-blue" @click="exportResults" :disabled="!results.length">Export JSON</button>
    </div>

    <div class="results">
      <article v-for="item in results" :key="item.id" class="result card">
        <div class="row">
          <RouterLink :to="`/documents/${item.id}`"><strong>{{ item.title }}</strong></RouterLink>
          <span class="score">{{ item.score }}</span>
        </div>
        <p v-html="item.snippet"></p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { searchDocuments } from "../api";

const query = ref("");
const results = ref([]);
const meta = ref(null);
let timer;

watch(query, (value) => {
  clearTimeout(timer);
  if (!value.trim()) {
    results.value = [];
    meta.value = null;
    return;
  }

  timer = setTimeout(async () => {
    try {
      const data = await searchDocuments(value);
      results.value = data.results;
      meta.value = { count: data.count, durationMs: data.durationMs };
    } catch (_error) {
      results.value = [];
      meta.value = null;
    }
  }, 180);
});

function exportResults() {
  const blob = new Blob([JSON.stringify(results.value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "search-results.json";
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.search-head {
  background: var(--primary-blue);
  color: #fff;
}

.search-panel {
  background: #fff;
}

.toolbar {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.results {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.result {
  padding: 14px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.row a {
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.score {
  border: 2px solid #121212;
  padding: 2px 8px;
  font-weight: 700;
  background: var(--primary-yellow);
}

.result p {
  color: var(--text-muted);
  line-height: 1.5;
}

@media (min-width: 768px) {
  .toolbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

@media (min-width: 1024px) {
  .score {
    border-width: 4px;
  }
}
</style>
