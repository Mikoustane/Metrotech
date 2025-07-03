import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Components
import AppRoutes from './components/AppRoutes';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Hooks
import { useVisitTracker } from './hooks/useVisitTracker';
import { useLanguageDetection } from './hooks/useLanguageDetection';

// Utils
import { initializeElectronOptimizations, shouldLoadAnalytics } from './utils/electronUtils';

// Main App Component with optimizations
const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks
  useVisitTracker();
  useLanguageDetection();

  useEffect(() => {
    // Initialiser les optimisations Electron
    initializeElectronOptimizations();

    // Initialiser Google Analytics seulement en environnement web
    if (shouldLoadAnalytics() && typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID');
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }

    // Initialiser Facebook Pixel seulement en environnement web
    if (shouldLoadAnalytics() && typeof fbq !== 'undefined') {
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    }

    // Simuler le chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 no-scrollbar">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-t-primary-500 border-r-transparent border-b-secondary-500 border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-primary-500 border-b-transparent border-l-secondary-500 rounded-full animate-spin-slow"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <img 
              src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
              alt="METROTECH Logo" 
              className="h-12 mx-auto mb-4"
            />
            <div className="flex items-center gap-2 text-gray-400">
              <LoadingSpinner size="sm" aria-label="Application en cours de chargement" />
              <span className="text-sm">Chargement...</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar">
      <AppRoutes />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;