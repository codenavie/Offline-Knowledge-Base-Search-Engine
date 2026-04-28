<template>
  <section class="section viewer-head" v-if="doc">
    <h1 class="section-title">Document</h1>
    <p class="section-sub">{{ doc.title }}</p>
  </section>

  <section class="section viewer-body" v-if="doc">
    <div class="meta-row">
      <p class="muted">Indexed: {{ new Date(doc.indexedAt).toLocaleString() }}</p>
      <button class="bau-btn bau-yellow" @click="remove">Delete Document</button>
    </div>
    <article class="viewer card">{{ doc.text }}</article>
  </section>

  <section class="section" v-else>Loading...</section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deleteDocument, getDocument } from "../api";

const route = useRoute();
const router = useRouter();
const doc = ref(null);

onMounted(async () => {
  const data = await getDocument(route.params.id);
  doc.value = data.document;
});

async function remove() {
  await deleteDocument(route.params.id);
  router.push("/");
}
</script>

<style scoped>
.viewer-head {
  background: var(--primary-yellow);
}

.viewer-body {
  background: #fff;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.viewer {
  padding: 14px;
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 70vh;
  overflow: auto;
}

@media (min-width: 768px) {
  .meta-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
