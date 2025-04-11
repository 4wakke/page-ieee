import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  port: 5200,
  host: "0.0.0.0",
  server: {
    allowedHosts: ["ieeecolcaribeconference.com"],
  },
});
