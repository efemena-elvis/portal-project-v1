import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log(`[VITE] Loaded Variant: ${env.VITE_APP_VARIANT}`);
  console.log(`[VITE] Loaded Port: ${env.VITE_LOCAL_PORT}`);

  return {
    plugins: [vue()],
    server: {
      port: parseInt(env.VITE_LOCAL_PORT || "5174"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "../../packages/assets/scss"),
        "@images": path.resolve(__dirname, "../../packages/assets/images"),
      },
    },
  };
});
