<template>
  <section class="section upload-head">
    <h1 class="section-title">Upload</h1>
    <p class="section-sub">PDF DOCX TXT</p>
  </section>

  <section class="section upload-main">
    <div class="drop" :class="{ active: dragActive }" @dragover.prevent="dragActive = true" @dragleave.prevent="dragActive = false" @drop.prevent="onDrop">
      <p>{{ selectedFile ? selectedFile.name : "Drop file or choose manually" }}</p>
      <input class="bau-input" type="file" accept=".pdf,.docx,.txt" @change="onFileChange" />
      <button class="bau-btn bau-red" @click="submit" :disabled="!selectedFile || loading">{{ loading ? "Uploading" : "Upload and Index" }}</button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { uploadDocument } from "../api";

const selectedFile = ref(null);
const dragActive = ref(false);
const loading = ref(false);
const message = ref("");

function onFileChange(event) {
  selectedFile.value = event.target.files?.[0] || null;
}

function onDrop(event) {
  dragActive.value = false;
  selectedFile.value = event.dataTransfer.files?.[0] || null;
}

async function submit() {
  if (!selectedFile.value) return;
  loading.value = true;
  message.value = "";
  try {
    const result = await uploadDocument(selectedFile.value);
    message.value = result.message;
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.upload-head {
  background: var(--primary-red);
  color: #fff;
}

.upload-main {
  background: #fff;
}

.drop {
  border: 2px dashed #121212;
  background: var(--muted);
  padding: 20px;
  display: grid;
  gap: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.drop.active {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0 0 #121212;
  background: var(--primary-yellow);
}

.message {
  margin-top: 10px;
  border: 2px solid #121212;
  background: #fff9c4;
  padding: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

@media (min-width: 1024px) {
  .drop,
  .message {
    border-width: 4px;
  }
}
</style>
