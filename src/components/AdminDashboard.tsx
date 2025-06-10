import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Globe, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Key, 
  Settings,
  BarChart3,
  MapPin,
  Clock,
  UserCheck,
  Activity,
  Database,
  AlertCircle,
  CheckCircle,
  FileText,
  Newspaper,
  FormInput
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedCard from './ui/AnimatedCard';
import ProgressBar from './ui/ProgressBar';
import NewsManager from './NewsManager';
import { USERS } from '../data/users';

interface VisitStats {
  today: number;
  thisMonth: number;
  thisYear: number;
  totalVisits: number;
}

interface VisitorData {
  ip: string;
  country: string;
  timestamp: Date;
  page: string;
  userAgent: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitStats, setVisitStats] = useState<VisitStats>({
    today: 0,
    thisMonth: 0,
    thisYear: 0,
    totalVisits: 0
  });
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Récupération des vraies données de visite
  useEffect(() => {
    const loadVisitData = () => {
      const storedVisits = localStorage.getItem('site_visits');
      if (storedVisits) {
        const visits = JSON.parse(storedVisits);
        calculateStats(visits);
        setVisitors(visits.slice(-10).reverse()); // 10 derniers visiteurs
      }
    };

    loadVisitData();
    
    // Actualiser les données toutes les 30 secondes
    const interval = setInterval(loadVisitData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateStats = (visits: VisitorData[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const stats = {
      today: visits.filter(visit => new Date(visit.timestamp) >= today).length,
      thisMonth: visits.filter(visit => new Date(visit.timestamp) >= thisMonth).length,
      thisYear: visits.filter(visit => new Date(visit.timestamp) >= thisYear).length,
      totalVisits: visits.length
    };

    setVisitStats(stats);
  };

  const handlePasswordChange = async () => {
    if (!selectedUserId || !newPassword) {
      setPasswordChangeStatus('error');
      return;
    }

    try {
      // Récupérer les utilisateurs actuels
      const currentUsers = [...USERS];
      const userIndex = currentUsers.findIndex(u => u.id === selectedUserId);
      
      if (userIndex === -1) {
        setPasswordChangeStatus('error');
        return;
      }

      // Mettre à jour le mot de passe
      currentUsers[userIndex].password = newPassword;
      
      // Sauvegarder dans localStorage pour persistance
      localStorage.setItem('metrotech_users', JSON.stringify(currentUsers));
      
      setPasswordChangeStatus('success');
      setSelectedUserId('');
      setNewPassword('');
      
      // Reset status après 3 secondes
      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
    } catch (error) {
      setPasswordChangeStatus('error');
      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
    }
  };

  const exportData = () => {
    const data = {
      visits: localStorage.getItem('site_visits'),
      users: localStorage.getItem('metrotech_users'),
      forms: localStorage.getItem('metrotech_drafts'),
      completed: localStorage.getItem('metrotech_completed'),
      news: localStorage.getItem('metrotech_news'),
      connections: localStorage.getItem('metrotech_connections'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrotech-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'Côte d\'Ivoire': '🇨🇮',
      'Ivory Coast': '🇨🇮',
      'France': '🇫🇷',
      'Sénégal': '🇸🇳',
      'Senegal': '🇸🇳',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Ghana': '🇬🇭',
      'Nigeria': '🇳🇬',
      'Togo': '🇹🇬',
      'Benin': '🇧🇯'
    };
    return flags[country] || '🌍';
  };

  // Filtrer les utilisateurs (exclure l'admin actuel)
  const otherUsers = USERS.filter(u => u.id !== user?.id);

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'news', label: 'Actualités', icon: Newspaper }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsManager />;
      default:
        return (
          <div className="space-y-6">
            {/* Statistiques de visite réelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <AnimatedCard delay={0.1} className="card-mobile hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Eye size={24} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                    Aujourd'hui
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-light mb-1">{visitStats.today}</h3>
                <p className="text-gray-400 text-sm">Visites aujourd'hui</p>
              </AnimatedCard>

              <AnimatedCard delay={0.2} className="card-mobile hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Calendar size={24} className="text-green-400" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                    Ce mois
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-light mb-1">{visitStats.thisMonth}</h3>
                <p className="text-gray-400 text-sm">Visites ce mois</p>
              </AnimatedCard>

              <AnimatedCard delay={0.3} className="card-mobile hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <TrendingUp size={24} className="text-purple-400" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400">
                    Cette année
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-light mb-1">{visitStats.thisYear}</h3>
                <p className="text-gray-400 text-sm">Visites cette année</p>
              </AnimatedCard>

              <AnimatedCard delay={0.4} className="card-mobile hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <BarChart3 size={24} className="text-orange-400" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/10 text-orange-400">
                    Total
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-light mb-1">{visitStats.totalVisits}</h3>
                <p className="text-gray-400 text-sm">Total des visites</p>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visiteurs récents réels */}
              <AnimatedCard delay={0.5} className="card-mobile">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-blue-400" size={24} />
                  <h2 className="text-xl font-semibold text-light">Visiteurs Récents</h2>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
                  {visitors.length > 0 ? (
                    visitors.map((visitor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCountryFlag(visitor.country)}</span>
                          <div>
                            <p className="text-light text-sm font-medium">{visitor.ip}</p>
                            <p className="text-gray-400 text-xs">{visitor.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 text-xs">{visitor.page}</p>
                          <p className="text-gray-500 text-xs">{formatDate(visitor.timestamp)}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="mx-auto text-gray-600 mb-4" size={48} />
                      <p className="text-gray-400">Aucune visite enregistrée</p>
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Gestion des utilisateurs réelle */}
              <AnimatedCard delay={0.6} className="card-mobile">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="text-green-400" size={24} />
                  <h2 className="text-xl font-semibold text-light">Gestion des Utilisateurs</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sélectionner un utilisateur
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-light focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Choisir un utilisateur</option>
                      {otherUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-light focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Entrer le nouveau mot de passe"
                      minLength={8}
                    />
                  </div>

                  {passwordChangeStatus === 'success' && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm">Mot de passe modifié avec succès</span>
                    </div>
                  )}

                  {passwordChangeStatus === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle size={16} className="text-red-400" />
                      <span className="text-red-400 text-sm">Erreur lors de la modification</span>
                    </div>
                  )}

                  <motion.button
                    onClick={handlePasswordChange}
                    disabled={!selectedUserId || !newPassword || newPassword.length < 8}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-light rounded-lg transition-colors"
                    whileHover={{ scale: selectedUserId && newPassword ? 1.02 : 1 }}
                    whileTap={{ scale: selectedUserId && newPassword ? 0.98 : 1 }}
                  >
                    <Key size={18} />
                    Changer le mot de passe
                  </motion.button>
                </div>
              </AnimatedCard>
            </div>

            {/* Statistiques détaillées réelles */}
            <AnimatedCard delay={0.7} className="card-mobile">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-purple-400" size={24} />
                <h2 className="text-xl font-semibold text-light">Statistiques du Système</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Utilisateurs actifs</span>
                    <span className="text-light text-sm font-medium">{USERS.length}</span>
                  </div>
                  <ProgressBar progress={(USERS.length / 10) * 100} color="green" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Formulaires créés</span>
                    <span className="text-light text-sm font-medium">
                      {JSON.parse(localStorage.getItem('metrotech_drafts') || '[]').length}
                    </span>
                  </div>
                  <ProgressBar 
                    progress={Math.min(100, (JSON.parse(localStorage.getItem('metrotech_drafts') || '[]').length / 50) * 100)} 
                    color="blue" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">Actualités publiées</span>
                    <span className="text-light text-sm font-medium">
                      {JSON.parse(localStorage.getItem('metrotech_news') || '[]').filter((n: any) => n.published).length}
                    </span>
                  </div>
                  <ProgressBar 
                    progress={Math.min(100, (JSON.parse(localStorage.getItem('metrotech_news') || '[]').filter((n: any) => n.published).length / 20) * 100)} 
                    color="orange" 
                  />
                </div>
              </div>
            </AnimatedCard>

            {/* Actions rapides fonctionnelles */}
            <AnimatedCard delay={0.8} className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 border border-primary-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="text-primary-400" size={24} />
                <h2 className="text-xl font-semibold text-light">Actions Rapides</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.button 
                  onClick={exportData}
                  className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Database size={24} className="mb-2 mx-auto" />
                  <span className="block font-medium text-sm">Exporter données</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => window.location.reload()}
                  className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity size={24} className="mb-2 mx-auto" />
                  <span className="block font-medium text-sm">Actualiser données</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => setActiveTab('news')}
                  className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Newspaper size={24} className="mb-2 mx-auto" />
                  <span className="block font-medium text-sm">Gérer actualités</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => window.open('/login', '_blank')}
                  className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText size={24} className="mb-2 mx-auto" />
                  <span className="block font-medium text-sm">Voir site public</span>
                </motion.button>
              </div>
            </AnimatedCard>
          </div>
        );
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden safe-area-inset no-scrollbar">
      {/* Header Admin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-red-400" size={32} />
          <h1 className="text-2xl lg:text-3xl font-bold text-light">
            Panneau d'Administration
          </h1>
        </div>
        <p className="text-gray-400 text-base">
          Bienvenue {user?.name}, vous avez accès aux fonctionnalités d'administration
        </p>
      </motion.div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;