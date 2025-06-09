import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulation d'un délai de connexion réaliste
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = login(email, password);
    if (!success) {
      setError('Email ou mot de passe incorrect');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-secondary-900 to-dark-900 flex items-center justify-center p-4 relative overflow-hidden safe-area-inset">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 lg:w-96 lg:h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Bouton retour */}
      <Link 
        to="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-4 py-3 bg-dark-800/80 hover:bg-dark-700 text-light rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 text-sm lg:text-base shadow-mobile touch-manipulation"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Retour au site</span>
        <span className="sm:hidden">Retour</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 lg:p-8 w-full max-w-md border border-dark-700/50 relative z-10 mx-4"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <img 
              src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
              alt="METROTECH Logo" 
              className="h-16 lg:h-20 mx-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="text-primary-400" size={20} />
              <h1 className="text-xl lg:text-2xl font-bold text-light">Connexion Sécurisée</h1>
            </div>
            <p className="text-gray-400 text-base lg:text-lg">METROTECH INSTRUMENT SARL</p>
            <p className="text-gray-500 text-sm lg:text-base mt-1">Espace employé</p>
          </motion.div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Adresse email professionnelle
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-700/50 border border-dark-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm text-base touch-manipulation"
                placeholder="votre.email@metrotech.ci"
                required
                autoComplete="email"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-14 py-4 bg-dark-700/50 border border-dark-600 rounded-lg text-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm text-base touch-manipulation"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1 touch-manipulation"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-light font-medium py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 text-base shadow-mobile touch-manipulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <LoadingSpinner size="sm\" color="text-light" />
                Connexion en cours...
              </div>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-secondary-600/10 border border-secondary-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-secondary-400" size={16} />
            <span className="text-secondary-400 text-sm font-medium">Sécurité</span>
          </div>
          <p className="text-xs text-gray-400">
            Cette connexion est sécurisée et réservée aux employés autorisés de METROTECH INSTRUMENT SARL.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;