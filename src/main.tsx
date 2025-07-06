import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import './i18n/i18n';
import { performanceOptimizer } from './utils/performanceOptimizer';

// Initialiser l'optimiseur de performance
performanceOptimizer.setupErrorHandling();

// Fonction d'initialisation de l'app
const initializeApp = async () => {
  try {
    // Précharger les ressources critiques
    await performanceOptimizer.preloadCriticalResources();
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    // Retirer la classe loading du body si elle existe
    document.body.classList.remove('loading');
    
    // Créer et monter l'application React
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </StrictMode>
    );

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Afficher un message d'erreur de fallback
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0f172a;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1 style="font-size: 24px; margin-bottom: 16px;">Erreur de chargement</h1>
            <p style="margin-bottom: 20px; color: #9ca3af;">
              L'application n'a pas pu se charger correctement.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="
                background-color: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
              "
            >
              Recharger la page
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Démarrer l'application
initializeApp();