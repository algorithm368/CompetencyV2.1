import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "src/components"),
      "@Contexts": path.resolve(__dirname, "src/contexts"),
      "@Hooks": path.resolve(__dirname, "src/hooks"),
      "@Services": path.resolve(__dirname, "src/services"),
      "@Pages": path.resolve(__dirname, "src/pages"),
      "@Types": path.resolve(__dirname, "src/types"),
      "@Layouts": path.resolve(__dirname, "src/layouts"),
      "@Utils": path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    allowedHosts: ["client_app"],
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    allowedHosts: ["client_app", "localhost", "127.0.0.1", "nginx", "172.19.0.4"],
  },
  define: {
    "process.env": {},
  },
});
