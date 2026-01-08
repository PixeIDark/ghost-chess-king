import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["stockfish"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ghost-chess-king/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
});
