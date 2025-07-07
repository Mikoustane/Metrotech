import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { isMobileDevice, shouldLoadAdminComponents, getBundleConfig } from '../utils/mobileDetection';
import ErrorBoundary from './ui/ErrorBoundary';

// Lazy loading des composants lourds
const Dashboard = React.lazy(() => import('./Dashboard'));
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));
const FormCreator = React.lazy(() => import('./FormCreator'));
const Historique = React.lazy(() => import('./Historique'));
const Sauvegarde = React.lazy(() => import('./Sauvegarde'));
const ConnectionTracker = React.lazy(() => import('./ConnectionTracker'));
const SettingsManager = React.lazy(() => import('./SettingsManager'));
const DataManager = React.lazy(() => import('./DataManager'));

// Composants mobiles légers
const MobileDashboard = React.lazy(() => import('./mobile/MobileDashboard'));
const MobileNewsViewer = React.lazy(() => import('./mobile/MobileNewsViewer'));

const InternalApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [bundleConfig, setBundleConfig] = useState(getBundleConfig());
  const [hasError, setHasError] = useState(false);

  // Vérifier si l'utilisateur est l'admin (ID = 1)
  const isAdmin = user?.id === '1';

  useEffect(() => {
    const checkDevice = () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);
      setBundleConfig(getBundleConfig());
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Gestion d'erreur pour éviter les crashes
  const handleComponentError = (error: Error, errorInfo: any) => {
    console.error('Erreur dans l\'application interne:', error, errorInfo);
    setHasError(true);
    
    // Auto-récupération après 3 secondes
    setTimeout(() => {
      setHasError(false);
      setActiveSection('accueil');
    }, 3000);
  };

  const renderContent = () => {
    // Composant de fallback pour les fonctionnalités non disponibles sur mobile
    const MobileNotAvailable = () => (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Fonctionnalité non disponible</h2>
        <p className="text-gray-400 mb-6">
          Cette fonctionnalité n'est pas disponible sur mobile pour optimiser les performances.
        </p>
        <p className="text-gray-500 text-sm">
          Utilisez un ordinateur pour accéder à toutes les fonctionnalités.
        </p>
      </div>
    );

    // Composant de chargement
    const LoadingComponent = () => (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white">Chargement...</span>
        </div>
      </div>
    );

    // Composant d'erreur
    const ErrorComponent = () => (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">Erreur temporaire</h2>
        <p className="text-gray-400 mb-6">
          Une erreur est survenue. Retour automatique à l'accueil...
        </p>
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );

    if (hasError) {
      return <ErrorComponent />;
    }

    try {
      switch (activeSection) {
        case 'accueil':
          if (isMobile) {
            return (
              <React.Suspense fallback={<LoadingComponent />}>
                <MobileDashboard />
              </React.Suspense>
            );
          }
          
          if (isAdmin && bundleConfig.loadAdminDashboard) {
            return (
              <React.Suspense fallback={<LoadingComponent />}>
                <AdminDashboard />
              </React.Suspense>
            );
          }
          
          if (bundleConfig.loadDashboard) {
            return (
              <React.Suspense fallback={<LoadingComponent />}>
                <Dashboard />
              </React.Suspense>
            );
          }
          
          return <MobileNotAvailable />;

        case 'formulaires':
          if (!bundleConfig.loadFormCreator) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <FormCreator />
            </React.Suspense>
          );

        case 'historique':
          if (!bundleConfig.loadHistorique) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <Historique />
            </React.Suspense>
          );

        case 'sauvegarde':
          if (!bundleConfig.loadSauvegarde) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <Sauvegarde />
            </React.Suspense>
          );

        case 'connexions':
          if (!bundleConfig.loadConnectionTracker) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <ConnectionTracker />
            </React.Suspense>
          );

        case 'donnees':
          if (!bundleConfig.loadDataManager) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <DataManager />
            </React.Suspense>
          );

        case 'parametres':
          if (!bundleConfig.loadSettingsManager) {
            return <MobileNotAvailable />;
          }
          return (
            <React.Suspense fallback={<LoadingComponent />}>
              <SettingsManager />
            </React.Suspense>
          );

        case 'actualites':
          if (isMobile) {
            return (
              <React.Suspense fallback={<LoadingComponent />}>
                <MobileNewsViewer />
              </React.Suspense>
            );
          }
          return <MobileNotAvailable />;

        default:
          return isMobile ? (
            <React.Suspense fallback={<LoadingComponent />}>
              <MobileDashboard />
            </React.Suspense>
          ) : (
            isAdmin && bundleConfig.loadAdminDashboard ? (
              <React.Suspense fallback={<LoadingComponent />}>
                <AdminDashboard />
              </React.Suspense>
            ) : (
              bundleConfig.loadDashboard ? (
                <React.Suspense fallback={<LoadingComponent />}>
                  <Dashboard />
                </React.Suspense>
              ) : <MobileNotAvailable />
            )
          );
      }
    } catch (error) {
      console.error('Erreur lors du rendu du contenu:', error);
      setHasError(true);
      return <ErrorComponent />;
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-xl mb-4">Erreur dans l'application interne</h2>
            <p className="text-gray-400 mb-4">Une erreur inattendue s'est produite.</p>
            <button 
              onClick={() => {
                setHasError(false);
                setActiveSection('accueil');
              }}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      }
    >
      <div className="flex h-screen bg-gray-900 overflow-hidden no-scrollbar">
        {/* Sidebar - adapté selon l'appareil */}
        <ErrorBoundary
          fallback={
            <div className="w-64 bg-gray-800 p-4 text-white">
              <p>Erreur sidebar</p>
            </div>
          }
        >
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
            isMobile={isMobile}
            bundleConfig={bundleConfig}
          />
        </ErrorBoundary>
        
        <main className="flex-1 overflow-auto no-scrollbar">
          {/* Mobile padding to account for menu button */}
          <div className="sm:hidden h-16"></div>
          
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: isMobile ? 0.2 : 0.3 }}
            className="h-full no-scrollbar"
          >
            <ErrorBoundary
              fallback={
                <div className="p-6 text-center">
                  <h2 className="text-xl font-bold text-red-400 mb-4">Erreur de composant</h2>
                  <p className="text-gray-400 mb-4">
                    Le composant "{activeSection}" a rencontré une erreur.
                  </p>
                  <button 
                    onClick={() => setActiveSection('accueil')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              }
            >
              {renderContent()}
            </ErrorBoundary>
          </motion.div>
        </main>

        {/* Indicateur de version mobile */}
        {isMobile && (
          <div className="fixed bottom-4 right-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            📱 Version mobile
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InternalApp;