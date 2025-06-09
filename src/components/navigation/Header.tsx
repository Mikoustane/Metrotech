import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prévenir le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const navLinks = [
    { name: t('navigation.home'), path: '/' },
    { name: t('navigation.services'), path: '/services' },
    { name: t('navigation.about'), path: '/about' },
    { name: t('navigation.contact'), path: '/contact' }
  ];

  return (
    <header 
      className={`nav-mobile transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-900/90 backdrop-blur-md shadow-mobile' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 lg:py-6">
          <Logo />

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({ isActive }) => 
                  `relative text-sm font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-primary-400' 
                      : 'text-gray-300 hover:text-primary-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.span 
                        className="absolute -bottom-1 left-0 h-0.5 bg-primary-400 w-full"
                        layoutId="underline"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
              aria-label="Changer de langue"
            >
              <Globe size={20} />
            </button>
            
            {/* Bouton de connexion */}
            <Link 
              to="/login"
              className="btn-primary flex items-center gap-2"
            >
              <LogIn size={18} />
              <span>Connexion</span>
            </Link>
          </div>

          <button 
            className="lg:hidden p-3 rounded-md text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay-mobile lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu mobile */}
            <motion.div 
              className="lg:hidden bg-dark-900/95 backdrop-blur-md shadow-mobile border-t border-dark-700 absolute top-full left-0 right-0 z-40"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6 safe-area-inset">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <NavLink 
                      key={link.path} 
                      to={link.path}
                      className={({ isActive }) => 
                        `text-base font-medium py-3 px-4 rounded-lg transition-colors touch-manipulation ${
                          isActive 
                            ? 'text-primary-400 bg-primary-400/10' 
                            : 'text-gray-300 hover:text-light hover:bg-dark-800'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </nav>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-700">
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 p-3 rounded-full text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
                    aria-label="Changer de langue"
                  >
                    <Globe size={20} />
                    <span className="text-sm">{i18n.language.toUpperCase()}</span>
                  </button>
                  
                  {/* Bouton de connexion mobile */}
                  <Link 
                    to="/login"
                    className="btn-primary flex items-center gap-2"
                  >
                    <LogIn size={18} />
                    <span>Connexion</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;