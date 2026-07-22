import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5172,
  },
  build: {
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "../../packages/assets/scss"),
      "@images": path.resolve(__dirname, "../../packages/assets/images"),
      "@packages": path.resolve(__dirname, "../../packages"),
    },
  },
});
