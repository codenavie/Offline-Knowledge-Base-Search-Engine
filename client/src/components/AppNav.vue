<template>
  <header class="nav-wrap section">
    <div class="brand">
      <span class="geo circle"></span>
      <span class="geo square"></span>
      <span class="geo tri"></span>
      <strong>Offline KB</strong>
    </div>

    <button class="bau-btn bau-white mobile-toggle" @click="open = !open">Menu</button>

    <nav :class="['links', { open }]">
      <RouterLink to="/" @click="open = false">Dashboard</RouterLink>
      <RouterLink to="/upload" @click="open = false">Upload</RouterLink>
      <RouterLink to="/search" @click="open = false">Search</RouterLink>
      <span class="user" v-if="userEmail">{{ userEmail }}</span>
      <button class="bau-btn bau-yellow logout" @click="$emit('logout')">Logout</button>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  userEmail: {
    type: String,
    default: ""
  }
});

defineEmits(["logout"]);

const open = ref(false);
</script>

<style scoped>
.nav-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  border-bottom-width: 4px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.geo {
  width: 14px;
  height: 14px;
  border: 2px solid #121212;
}

.circle { border-radius: 999px; background: var(--primary-red); }
.square { background: var(--primary-blue); }
.tri {
  background: var(--primary-yellow);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.mobile-toggle {
  display: inline-flex;
}

.links {
  grid-column: 1 / -1;
  display: none;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.links.open {
  display: flex;
}

.links a {
  border: 2px solid #121212;
  padding: 8px 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #fff;
}

.links a.router-link-active {
  background: var(--primary-yellow);
}

.user {
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.logout {
  padding: 8px 10px;
}

@media (min-width: 768px) {
  .nav-wrap {
    grid-template-columns: auto 1fr;
  }

  .mobile-toggle {
    display: none;
  }

  .links,
  .links.open {
    grid-column: auto;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
