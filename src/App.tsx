import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import AppRoutes from './components/AppRoutes';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Hooks
import { useVisitTracker } from './hooks/useVisitTracker';
import { useLanguageDetection } from './hooks/useLanguageDetection';

// Utils
import { initializeElectronOptimizations, shouldLoadAnalytics } from './utils/electronUtils';

// Preload critical resources
const preloadCriticalResources = () => {
  const criticalImages = [
    'https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png',
    'https://image.noelshack.com/fichiers/2024/44/3/1730323091-metrotech-1.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Main App Component with comprehensive error handling
const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initialisation...');
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Hooks
  useVisitTracker();
  useLanguageDetection();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoadingMessage('Configuration de l\'environnement...');
        
        // Initialiser les optimisations Electron
        initializeElectronOptimizations();
        
        // Précharger les ressources critiques
        preloadCriticalResources();
        
        setLoadingMessage('Chargement des services...');
        
        // Initialiser Google Analytics seulement en environnement web
        if (shouldLoadAnalytics()) {
          try {
            if (typeof gtag !== 'undefined') {
              gtag('config', 'GA_MEASUREMENT_ID');
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
              });
            }
          } catch (error) {
            console.warn('Analytics initialization failed:', error);
          }
        }

        // Initialiser Facebook Pixel seulement en environnement web
        if (shouldLoadAnalytics()) {
          try {
            if (typeof fbq !== 'undefined') {
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            }
          } catch (error) {
            console.warn('Facebook Pixel initialization failed:', error);
          }
        }

        setLoadingMessage('Finalisation...');
        
        // Attendre un minimum pour éviter les flashs
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setHasInitialized(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error('App initialization failed:', error);
        setLoadingMessage('Erreur de chargement');
        
        // Retry après 2 secondes
        setTimeout(() => {
          setIsLoading(false);
          setHasInitialized(true);
        }, 2000);
      }
    };

    initializeApp();
  }, []);

  // Afficher le loading screen pendant l'initialisation
  if (isLoading || !hasInitialized) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="no-scrollbar"
      >
        <Suspense fallback={<LoadingScreen variant="component" message="Chargement de la page..." />}>
          <AppRoutes />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;