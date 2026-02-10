/* eslint-disable @typescript-eslint/no-explicit-any */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss() as any],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true, // Importante ito para sa Docker volumes
    },
    host: true, // Kailangan para ma-access ng Nginx proxy
    strictPort: true,
    port: 5173,
  },
});
