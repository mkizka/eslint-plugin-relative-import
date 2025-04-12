import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/flat.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
