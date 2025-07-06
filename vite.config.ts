import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Optimisations pour éviter les pages blanches
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors pour un meilleur cache
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion'],
          ui: ['lucide-react'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    },
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 1000,
    // Optimiser les assets
    assetsInlineLimit: 4096
  },
  server: {
    // Configuration pour le développement
    hmr: {
      overlay: false // Éviter l'overlay d'erreur qui peut causer des pages blanches
    }
  },
  // Configuration pour la base URL (important pour le déploiement)
  base: './',
  // Préchargement des modules
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      } else {
        return { css: `/${filename}` };
      }
    }
  }
});