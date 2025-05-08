import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS necessary for segment analytics lib to work
    global: {},
  },
});
