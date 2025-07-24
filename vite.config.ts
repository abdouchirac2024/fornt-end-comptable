import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      // L'alias que vous aviez déjà
      "@": path.resolve(__dirname, "./src"),
      
      // === LA LIGNE CRUCIALE À AJOUTER ===
      // Force toutes les dépendances à utiliser la même instance de React
      // que votre application principale.
      react: path.resolve(__dirname, './node_modules/react'),
    },
  },
}));