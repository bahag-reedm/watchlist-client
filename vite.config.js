import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "movies-client-max-630243095989.europe-west1.run.app",
      "movies-max-frontend-630243095989.europe-west1.run.app",
    ],
    host: "0.0.0.0",
    port: "8080",
  },
  plugins: [
    react({
      include: "**/*.jsx",
    }),
    tailwindcss(),
  ],
});
