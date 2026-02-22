import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  outDir: "dist",
  noExternal: [/@ghost-chess-king\/.*/],
  esbuildOptions(options) {
    options.alias = {
      "@ghost-chess-king/shared": import.meta.dirname + "/../../packages/shared/src/index.ts",
      "@": import.meta.dirname + "/src",
    };
  },
});
