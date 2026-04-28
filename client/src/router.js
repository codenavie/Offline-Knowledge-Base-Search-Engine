import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "./pages/DashboardPage.vue";
import UploadPage from "./pages/UploadPage.vue";
import SearchPage from "./pages/SearchPage.vue";
import DocumentViewerPage from "./pages/DocumentViewerPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: DashboardPage },
    { path: "/upload", component: UploadPage },
    { path: "/search", component: SearchPage },
    { path: "/documents/:id", component: DocumentViewerPage }
  ]
});

export default router;
