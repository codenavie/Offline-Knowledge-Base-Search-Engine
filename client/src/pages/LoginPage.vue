<template>
  <section class="section auth-head">
    <h1 class="section-title">Login</h1>
    <p class="section-sub">Access your private knowledge base</p>
  </section>

  <section class="section auth-body">
    <form class="auth-form" @submit.prevent="submit">
      <label>
        <span>Email</span>
        <input class="bau-input" v-model="email" type="email" required />
      </label>

      <label>
        <span>Password</span>
        <input class="bau-input" v-model="password" type="password" required />
      </label>

      <button class="bau-btn bau-blue" :disabled="loading">{{ loading ? "Logging in" : "Login" }}</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
    <p class="muted switcher">No account yet? <RouterLink to="/register">Create one</RouterLink></p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { loginUser } from "../api";

const router = useRouter();
const email = ref("");
const password = ref("");
const message = ref("");
const loading = ref(false);

const emit = defineEmits(["auth-success"]);

async function submit() {
  loading.value = true;
  message.value = "";

  try {
    await loginUser({ email: email.value, password: password.value });
    emit("auth-success");
    router.push("/");
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-head { background: var(--primary-blue); color: #fff; }
.auth-body { background: #fff; }
.auth-form { display: grid; gap: 12px; max-width: 480px; }
label { display: grid; gap: 8px; font-weight: 700; text-transform: uppercase; }
.message { margin-top: 12px; border: 2px solid #121212; background: #fff9c4; padding: 10px; font-weight: 700; }
.switcher { margin-top: 12px; }
.switcher a { text-decoration: underline; font-weight: 700; }
</style>
