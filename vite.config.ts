import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configurations for library mode
  // https://ja.vitejs.dev/guide/build.html#%E3%83%A9%E3%82%A4%E3%83%95%E3%82%99%E3%83%A9%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%88%E3%82%99
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/cclg/index.ts"),
      name: "index",
      fileName: "index",
    },
  },
});
