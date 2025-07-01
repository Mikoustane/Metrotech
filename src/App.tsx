import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layouts
import Layout from './layouts/Layout';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

// Internal App Components
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import InternalApp from './components/InternalApp';

// Context
import { ThemeProvider } from './context/ThemeContext';

// UI Components
import LoadingSpinner from './components/ui/LoadingSpinner';

// Hooks
import { useVisitTracker } from './hooks/useVisitTracker';

// Internal App Wrapper
const InternalAppWrapper: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <InternalApp /> : <Login />;
};

// Main App Component with visit tracking
const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // Tracker les visites
  useVisitTracker();

  useEffect(() => {
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
              <LoadingSpinner size="sm" />
              <span className="text-sm">Chargement...</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Site principal */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/services" element={
            <Layout>
              <Services />
            </Layout>
          } />
          <Route path="/services/:serviceId" element={
            <Layout>
              <ServiceDetail />
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <About />
            </Layout>
          } />
          <Route path="/contact" element={
            <Layout>
              <Contact />
            </Layout>
          } />
          
          {/* Application interne */}
          <Route path="/login" element={<InternalAppWrapper />} />
          
          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          } />
        </Routes>
      </AnimatePresence>
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