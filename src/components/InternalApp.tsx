import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import FormCreator from './FormCreator';
import Historique from './Historique';
import Sauvegarde from './Sauvegarde';
import ConnectionTracker from './ConnectionTracker';
import SettingsManager from './SettingsManager';

const InternalApp: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');
  const { user } = useAuth();

  // Vérifier si l'utilisateur est l'admin (ID = 1)
  const isAdmin = user?.id === '1';

  const renderContent = () => {
    switch (activeSection) {
      case 'accueil':
        // Si l'utilisateur est admin (ID = 1), afficher le dashboard admin
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
      case 'formulaires':
        return <FormCreator />;
      case 'historique':
        return <Historique />;
      case 'sauvegarde':
        return <Sauvegarde />;
      case 'connexions':
        // Seulement accessible aux admins
        return isAdmin ? <ConnectionTracker /> : <Dashboard />;
      case 'parametres':
        return <SettingsManager />;
      default:
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden no-scrollbar">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 overflow-auto no-scrollbar">
        {/* Mobile padding to account for menu button */}
        <div className="sm:hidden h-16"></div>
        
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full no-scrollbar"
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default InternalApp;