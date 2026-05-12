import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/Offline-Knowledge-Base-Search-Engine/",
  plugins: [vue()],
  server: { port: 5173 }
});
