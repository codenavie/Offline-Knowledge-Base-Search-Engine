<template>
  <div class="main-shell">
    <div class="container">
      <AppNav
        v-if="showNav"
        :user-email="user?.email || ''"
        @logout="handleLogout"
      />
      <main class="main">
        <RouterView @auth-success="syncUser" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import AppNav from "./components/AppNav.vue";
import { fetchMe, getCurrentUser, isAuthenticated, logoutUser } from "./api";

const route = useRoute();
const router = useRouter();
const user = ref(getCurrentUser());

const showNav = computed(() => !route.meta.public);

async function syncUser() {
  user.value = getCurrentUser();
}

async function restoreSession() {
  if (!isAuthenticated()) return;

  try {
    const me = await fetchMe();
    user.value = me;
  } catch (_error) {
    logoutUser();
    user.value = null;
    router.push("/login");
  }
}

function handleLogout() {
  logoutUser();
  user.value = null;
  router.push("/login");
}

onMounted(restoreSession);
</script>

<style scoped>
.main {
  margin-top: 14px;
  display: grid;
  gap: 14px;
}
</style>
