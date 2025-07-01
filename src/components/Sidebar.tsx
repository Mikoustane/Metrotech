import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  History, 
  Save, 
  LogOut, 
  User,
  ChevronRight,
  Settings,
  Bell,
  Menu,
  X,
  Plus,
  Globe,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.id === '1';

  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, badge: null, shortLabel: 'Home' },
    { id: 'formulaires', label: 'Créer Formulaire', icon: Plus, badge: 'Nouveau', shortLabel: 'Forms' },
    { id: 'historique', label: 'Historique', icon: History, badge: null, shortLabel: 'History' },
    { id: 'sauvegarde', label: 'Sauvegarde', icon: Save, badge: '3', shortLabel: 'Save' },
    ...(isAdmin ? [
      { id: 'connexions', label: 'Connexions IP', icon: Globe, badge: null, shortLabel: 'IP' },
      { id: 'parametres', label: 'Paramètres', icon: Settings, badge: null, shortLabel: 'Settings' }
    ] : [])
  ];

  // Fermer le menu mobile quand on change de section
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  // Prévenir le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const handleMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Bouton menu mobile (visible uniquement sur mobile)
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed top-4 left-4 z-50 lg:hidden bg-primary-500 hover:bg-primary-600 text-light p-3 rounded-lg shadow-mobile transition-all duration-200 touch-manipulation"
      aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
    >
      {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  // Menu mobile en overlay
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overlay-mobile lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu mobile */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="sidebar-mobile lg:hidden shadow-2xl"
          >
            <div className="flex flex-col h-full safe-area-inset">
              {/* Header */}
              <div className="p-4 border-b border-dark-700 bg-primary-500">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
                    alt="METROTECH Logo" 
                    className="h-8"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-light hover:text-gray-200 p-2 touch-manipulation"
                    aria-label="Fermer le menu"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-light/20 rounded-full flex items-center justify-center">
                    {isAdmin ? <Shield size={20} className="text-light" /> : <User size={20} className="text-light" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-light font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-primary-100 text-xs">{user?.role}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleMenuItemClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation ${
                            isActive 
                              ? 'bg-primary-500 text-light shadow-mobile' 
                              : 'text-gray-300 hover:bg-dark-700 hover:text-light'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium flex-1 text-left">{item.label}</span>
                          
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isActive 
                                ? 'bg-light/20 text-light' 
                                : 'bg-primary-500 text-light'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Settings pour non-admin */}
                {!isAdmin && (
                  <div className="mt-8 pt-4 border-t border-dark-700">
                    <button 
                      onClick={() => handleMenuItemClick('parametres')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation ${
                        activeSection === 'parametres'
                          ? 'bg-primary-500 text-light shadow-mobile'
                          : 'text-gray-300 hover:bg-dark-700 hover:text-light'
                      }`}
                    >
                      <Settings size={20} />
                      <span className="font-medium">Paramètres</span>
                    </button>
                  </div>
                )}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-dark-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-light rounded-lg transition-all duration-200 touch-manipulation"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Sidebar desktop
  const DesktopSidebar = () => (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`hidden lg:flex flex-col h-screen bg-dark-800 shadow-xl border-r border-dark-700 overflow-y-auto transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-dark-700 flex-shrink-0 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        {!isCollapsed && (
          <motion.img 
            src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
            alt="METROTECH Logo" 
            className="h-10 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}
        
        <motion.div 
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            {isAdmin ? <Shield size={18} className="text-light" /> : <User size={18} className="text-light" />}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-light font-medium text-sm truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.role}</p>
            </div>
          )}
          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
        </motion.div>
      </div>

      {/* Menu */}
      <nav className={`flex-1 overflow-y-auto scrollbar-thin ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <motion.button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 relative ${
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'
                  } ${
                    isActive 
                      ? 'bg-primary-500 text-light shadow-mobile' 
                      : 'text-gray-300 hover:bg-dark-700 hover:text-light'
                  }`}
                  whileHover={{ x: isActive ? 0 : (isCollapsed ? 0 : 4) }}
                  whileTap={{ scale: 0.98 }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left text-sm truncate">{item.label}</span>
                      
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                          isActive 
                            ? 'bg-light/20 text-light' 
                            : 'bg-primary-500 text-light'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto flex-shrink-0" />
                      )}
                    </>
                  )}
                  
                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full text-xs flex items-center justify-center text-light">
                      {item.badge === 'Nouveau' ? '!' : item.badge}
                    </span>
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>

        {/* Settings pour non-admin */}
        {!isAdmin && !isCollapsed && (
          <motion.div 
            className="mt-8 pt-4 border-t border-dark-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button 
              onClick={() => setActiveSection('parametres')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm ${
                activeSection === 'parametres'
                  ? 'bg-primary-500 text-light shadow-mobile'
                  : 'text-gray-300 hover:bg-dark-700 hover:text-light'
              }`}
            >
              <Settings size={16} className="flex-shrink-0" />
              <span className="font-medium flex-1 text-left">Paramètres</span>
            </button>
          </motion.div>
        )}
      </nav>

      {/* Footer */}
      <div className={`border-t border-dark-700 flex-shrink-0 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <motion.button
          onClick={handleLogout}
          className={`w-full flex items-center rounded-lg transition-all duration-200 text-gray-300 hover:bg-red-600 hover:text-light ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'
          }`}
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          title={isCollapsed ? 'Déconnexion' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium flex-1 text-left text-sm">Déconnexion</span>}
        </motion.button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-dark-700 hover:bg-dark-600 text-light p-1 rounded-full shadow-lg transition-colors hidden xl:block"
      >
        <ChevronRight 
          size={14} 
          className={`transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
        />
      </button>
    </motion.div>
  );

  return (
    <>
      <MobileMenuButton />
      <MobileMenu />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;