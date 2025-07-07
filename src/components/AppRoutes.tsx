import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from '../layouts/Layout';

// Components UI
import LoadingScreen from './ui/LoadingScreen';
import ErrorBoundary from './ui/ErrorBoundary';

// Auth Context
import { useAuth as useAuthContext } from '../context/AuthContext';

// Lazy loading des pages pour éviter les bundles trop lourds
const Home = React.lazy(() => import('../pages/Home'));
const Services = React.lazy(() => import('../pages/Services'));
const About = React.lazy(() => import('../pages/About'));
const Contact = React.lazy(() => import('../pages/Contact'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const ServiceDetail = React.lazy(() => import('../pages/ServiceDetail'));

// Internal App Components (lazy loaded)
const Login = React.lazy(() => import('./Login'));
const InternalApp = React.lazy(() => import('./InternalApp'));

// Private Route Component avec gestion d'erreur
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen variant="component" message="Chargement de la connexion..." />}>
        <Login />
      </Suspense>
    );
  }
  
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl mb-4">Erreur dans l'application interne</h2>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    }>
      {children}
    </ErrorBoundary>
  );
};

// Hook d'authentification avec fallback
const useAuth = () => {
  try {
    return useAuthContext();
  } catch (error) {
    console.error('Auth context error:', error);
    return { isAuthenticated: false };
  }
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Site principal avec lazy loading */}
          <Route path="/" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement de l'accueil..." />}>
                <Home />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/services" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement des services..." />}>
                <Services />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/services/:serviceId" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement du service..." />}>
                <ServiceDetail />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/about" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement de la présentation..." />}>
                <About />
              </Suspense>
            </Layout>
          } />
          
          <Route path="/contact" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement du contact..." />}>
                <Contact />
              </Suspense>
            </Layout>
          } />
          
          {/* Application interne protégée */}
          <Route path="/login" element={
            <PrivateRoute>
              <Suspense fallback={<LoadingScreen message="Chargement de l'application..." />}>
                <InternalApp />
              </Suspense>
            </PrivateRoute>
          } />
          
          {/* 404 avec lazy loading */}
          <Route path="*" element={
            <Layout>
              <Suspense fallback={<LoadingScreen variant="component" message="Chargement..." />}>
                <NotFound />
              </Suspense>
            </Layout>
          } />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default AppRoutes;