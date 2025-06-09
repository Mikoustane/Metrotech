import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedCard from './ui/AnimatedCard';
import ProgressBar from './ui/ProgressBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FormData } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [drafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [completedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);

  const stats = [
    {
      title: 'Formulaires en cours',
      value: drafts.filter(d => d.status === 'in-progress').length.toString(),
      icon: Clock,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400',
      trend: '+12%'
    },
    {
      title: 'Formulaires terminés',
      value: completedForms.length.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      trend: '+8%'
    },
    {
      title: 'En attente',
      value: drafts.filter(d => d.status === 'draft').length.toString(),
      icon: AlertCircle,
      color: 'bg-secondary-500',
      bgColor: 'bg-secondary-500/10',
      textColor: 'text-secondary-400',
      trend: '-3%'
    },
    {
      title: 'Total ce mois',
      value: (drafts.length + completedForms.length).toString(),
      icon: TrendingUp,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400',
      trend: '+15%'
    }
  ];

  const recentActivity = [
    { action: 'Formulaire créé', item: 'Étalonnage balance', time: '2 min', type: 'create' },
    { action: 'Formulaire terminé', item: 'Vérification pH-mètre', time: '1h', type: 'complete' },
    { action: 'Sauvegarde auto', item: 'Maintenance thermomètre', time: '2h', type: 'save' },
    { action: 'Formulaire modifié', item: 'Calibration manomètre', time: '3h', type: 'edit' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <FileText size={16} className="text-primary-400" />;
      case 'complete': return <CheckCircle size={16} className="text-green-400" />;
      case 'save': return <Clock size={16} className="text-secondary-400" />;
      case 'edit': return <AlertCircle size={16} className="text-primary-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 overflow-x-hidden safe-area-inset">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-light mb-2">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-gray-400 text-base">
          Bienvenue dans votre espace de travail METROTECH
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <AnimatedCard
              key={stat.title}
              delay={index * 0.1}
              className="card-mobile hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-light mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </AnimatedCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <AnimatedCard
          delay={0.4}
          className="card-mobile"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold text-light">Activité récente</h2>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-light text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-gray-400 text-xs truncate">{activity.item}</p>
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        {/* Progress Overview */}
        <AnimatedCard
          delay={0.6}
          className="card-mobile"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold text-light">Progression</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Formulaires complétés</span>
                <span className="text-light text-sm font-medium">
                  {completedForms.length}/{drafts.length + completedForms.length}
                </span>
              </div>
              <ProgressBar 
                progress={drafts.length + completedForms.length > 0 
                  ? (completedForms.length / (drafts.length + completedForms.length)) * 100 
                  : 0
                }
                color="green"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Objectif mensuel</span>
                <span className="text-light text-sm font-medium">75%</span>
              </div>
              <ProgressBar progress={75} color="blue" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Efficacité</span>
                <span className="text-light text-sm font-medium">92%</span>
              </div>
              <ProgressBar progress={92} color="orange" />
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Welcome Message */}
      <AnimatedCard
        delay={0.8}
        className="bg-gradient-to-r from-primary-600/10 to-secondary-600/10 border border-primary-500/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-primary-400" size={24} />
          <h2 className="text-xl font-semibold text-light">Commencer</h2>
        </div>

        <div className="text-gray-300">
          <p className="mb-4 text-base">
            Vous pouvez maintenant commencer à utiliser l'application METROTECH pour :
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Créer et gérer vos formulaires de service</li>
            <li>• Consulter l'historique de vos interventions</li>
            <li>• Sauvegarder automatiquement vos travaux en cours</li>
            <li>• Rechercher rapidement vos documents</li>
          </ul>
        </div>
      </AnimatedCard>

      {/* Quick Actions */}
      <AnimatedCard
        delay={1.0}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-light mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button 
            className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText size={24} className="mb-2 mx-auto" />
            <span className="block font-medium text-sm">Nouveau formulaire</span>
          </motion.button>
          <motion.button 
            className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Clock size={24} className="mb-2 mx-auto" />
            <span className="block font-medium text-sm">Reprendre un brouillon</span>
          </motion.button>
          <motion.button 
            className="bg-light/10 hover:bg-light/20 text-light p-4 rounded-lg transition-all text-center touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle size={24} className="mb-2 mx-auto" />
            <span className="block font-medium text-sm">Voir l'historique</span>
          </motion.button>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Dashboard;