<template>
  <section class="section hero">
    <div>
      <h1 class="section-title">Knowledge Engine</h1>
      <p class="section-sub">Indexed documents overview</p>
    </div>
    <div class="hero-shapes">
      <span class="shape circle"></span>
      <span class="shape square"></span>
      <span class="shape tri"></span>
    </div>
  </section>

  <section class="section stats-band">
    <div class="stat card">
      <span class="mark" style="background: var(--primary-red)"></span>
      <p class="muted">Documents</p>
      <h2>{{ documents.length }}</h2>
    </div>
    <div class="stat card">
      <span class="mark" style="background: var(--primary-blue)"></span>
      <p class="muted">Status</p>
      <h2>{{ loading ? "Sync" : "Ready" }}</h2>
    </div>
  </section>

  <section class="section recent">
    <h2>Recent Documents</h2>
    <div v-if="loading">Loading...</div>
    <ul v-else-if="documents.length" class="list">
      <li v-for="doc in documents" :key="doc.id" class="row card">
        <RouterLink :to="`/documents/${doc.id}`">{{ doc.title }}</RouterLink>
        <span class="muted">{{ new Date(doc.indexedAt).toLocaleString() }}</span>
      </li>
    </ul>
    <p v-else class="muted">No documents indexed yet.</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { listDocuments } from "../api";

const documents = ref([]);
const loading = ref(true);

onMounted(async () => {
  const data = await listDocuments();
  documents.value = data.documents;
  loading.value = false;
});
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  background: #fff;
}

.hero-shapes {
  min-height: 130px;
  border: 2px solid #121212;
  background: var(--primary-blue);
  position: relative;
}

.shape {
  position: absolute;
  border: 2px solid #121212;
}

.circle {
  width: 68px;
  height: 68px;
  border-radius: 999px;
  background: var(--primary-yellow);
  top: 18px;
  left: 14px;
}

.square {
  width: 86px;
  height: 86px;
  background: #fff;
  transform: rotate(45deg);
  top: 22px;
  right: 30px;
}

.tri {
  width: 70px;
  height: 70px;
  background: var(--primary-red);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  bottom: 10px;
  left: 48%;
}

.stats-band {
  background: var(--primary-yellow);
  display: grid;
  gap: 12px;
}

.stat {
  padding: 14px;
}

.stat h2 {
  margin-top: 4px;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 900;
}

.list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.row {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row a {
  font-weight: 700;
  text-transform: uppercase;
}

@media (min-width: 800px) {
  .hero {
    grid-template-columns: 1.2fr 1fr;
    align-items: stretch;
  }

  .stats-band {
    grid-template-columns: repeat(2, 1fr);
  }

  .row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
