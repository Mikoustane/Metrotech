import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Layout from '../layouts/Layout';

// Pages
import Home from '../pages/Home';
import Services from '../pages/Services';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import ServiceDetail from '../pages/ServiceDetail';

// Internal App Components
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import InternalApp from './InternalApp';

// Private Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Login />;
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
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
        
        {/* Application interne protégée */}
        <Route path="/login" element={
          <PrivateRoute>
            <InternalApp />
          </PrivateRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={
          <Layout>
            <NotFound />
          </Layout>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;