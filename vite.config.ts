import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Dedupe MUI X date-pickers to ensure only one version is bundled
    // This fixes "Can not find the date and time pickers localization context" error
    // when material-react-table uses date-range filters
    dedupe: [
      "@mui/x-date-pickers",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "react",
      "react-dom",
    ],
  },
});
