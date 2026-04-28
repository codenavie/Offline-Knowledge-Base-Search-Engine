<template>
  <div class="main-shell">
    <div class="container">
      <AppNav />
      <main class="main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppNav from "./components/AppNav.vue";
</script>

<style scoped>
.main {
  margin-top: 14px;
  display: grid;
  gap: 14px;
}
</style>
