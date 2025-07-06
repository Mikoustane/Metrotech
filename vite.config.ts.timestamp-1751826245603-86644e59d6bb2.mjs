// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    // Optimisations pour éviter les pages blanches
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors pour un meilleur cache
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          animations: ["framer-motion"],
          ui: ["lucide-react"],
          i18n: ["react-i18next", "i18next"]
        }
      }
    },
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 1e3,
    // Optimiser les assets
    assetsInlineLimit: 4096
  },
  server: {
    // Configuration pour le développement
    hmr: {
      overlay: false
      // Éviter l'overlay d'erreur qui peut causer des pages blanches
    }
  },
  // Configuration pour la base URL (important pour le déploiement)
  base: "./",
  // Préchargement des modules
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === "js") {
        return { js: `/${filename}` };
      } else {
        return { css: `/${filename}` };
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gT3B0aW1pc2F0aW9ucyBwb3VyIFx1MDBFOXZpdGVyIGxlcyBwYWdlcyBibGFuY2hlc1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAvLyBTXHUwMEU5cGFyZXIgbGVzIHZlbmRvcnMgcG91ciB1biBtZWlsbGV1ciBjYWNoZVxuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIGFuaW1hdGlvbnM6IFsnZnJhbWVyLW1vdGlvbiddLFxuICAgICAgICAgIHVpOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICAgICAgICAgIGkxOG46IFsncmVhY3QtaTE4bmV4dCcsICdpMThuZXh0J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gUlx1MDBFOWR1aXJlIGxhIHRhaWxsZSBkZXMgY2h1bmtzXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIC8vIE9wdGltaXNlciBsZXMgYXNzZXRzXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTZcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgLy8gQ29uZmlndXJhdGlvbiBwb3VyIGxlIGRcdTAwRTl2ZWxvcHBlbWVudFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2UgLy8gXHUwMEM5dml0ZXIgbCdvdmVybGF5IGQnZXJyZXVyIHF1aSBwZXV0IGNhdXNlciBkZXMgcGFnZXMgYmxhbmNoZXNcbiAgICB9XG4gIH0sXG4gIC8vIENvbmZpZ3VyYXRpb24gcG91ciBsYSBiYXNlIFVSTCAoaW1wb3J0YW50IHBvdXIgbGUgZFx1MDBFOXBsb2llbWVudClcbiAgYmFzZTogJy4vJyxcbiAgLy8gUHJcdTAwRTljaGFyZ2VtZW50IGRlcyBtb2R1bGVzXG4gIGV4cGVyaW1lbnRhbDoge1xuICAgIHJlbmRlckJ1aWx0VXJsKGZpbGVuYW1lLCB7IGhvc3RUeXBlIH0pIHtcbiAgICAgIGlmIChob3N0VHlwZSA9PT0gJ2pzJykge1xuICAgICAgICByZXR1cm4geyBqczogYC8ke2ZpbGVuYW1lfWAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGNzczogYC8ke2ZpbGVuYW1lfWAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQTtBQUFBLFVBRVosUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixZQUFZLENBQUMsZUFBZTtBQUFBLFVBQzVCLElBQUksQ0FBQyxjQUFjO0FBQUEsVUFDbkIsTUFBTSxDQUFDLGlCQUFpQixTQUFTO0FBQUEsUUFDbkM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLG1CQUFtQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQTtBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUVBLE1BQU07QUFBQTtBQUFBLEVBRU4sY0FBYztBQUFBLElBQ1osZUFBZSxVQUFVLEVBQUUsU0FBUyxHQUFHO0FBQ3JDLFVBQUksYUFBYSxNQUFNO0FBQ3JCLGVBQU8sRUFBRSxJQUFJLElBQUksUUFBUSxHQUFHO0FBQUEsTUFDOUIsT0FBTztBQUNMLGVBQU8sRUFBRSxLQUFLLElBQUksUUFBUSxHQUFHO0FBQUEsTUFDL0I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
