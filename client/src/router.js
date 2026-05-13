import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";
import UploadPage from "./pages/UploadPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import DocumentViewerPage from "./pages/DocumentViewerPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import { isAuthenticated } from "./api";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginPage, meta: { public: true } },
    { path: "/register", component: RegisterPage, meta: { public: true } },
    { path: "/", component: DashboardPage },
    { path: "/upload", component: UploadPage },
    { path: "/search", component: SearchPage },
    { path: "/documents/:id", component: DocumentViewerPage }
  ]
});

router.beforeEach((to) => {
  const authed = isAuthenticated();

  if (!to.meta.public && !authed) {
    return "/login";
  }

  if (to.meta.public && authed) {
    return "/";
  }

  return true;
});

export default router;
