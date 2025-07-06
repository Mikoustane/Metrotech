import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedCard from '../ui/AnimatedCard';
import { Link } from 'react-router-dom';

// Version mobile légère du Dashboard
const MobileDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Nouveau formulaire",
      description: "Créer un formulaire rapide",
      icon: <FileText size={20} />,
      action: () => alert('Fonctionnalité simplifiée mobile'),
      color: "bg-blue-600"
    },
    {
      title: "Mes brouillons",
      description: "Voir les formulaires en cours",
      icon: <Clock size={20} />,
      action: () => alert('Fonctionnalité simplifiée mobile'),
      color: "bg-orange-600"
    },
    {
      title: "Formulaires terminés",
      description: "Consulter l'historique",
      icon: <CheckCircle size={20} />,
      action: () => alert('Fonctionnalité simplifiée mobile'),
      color: "bg-green-600"
    }
  ];

  const contactInfo = [
    {
      icon: <Phone size={16} />,
      label: "Téléphone",
      value: "+225 05 46 86 85 71",
      action: () => window.open('tel:+22505468685', '_self')
    },
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: "mikoustane0@gmail.com",
      action: () => window.open('mailto:mikoustane0@gmail.com', '_blank')
    },
    {
      icon: <MapPin size={16} />,
      label: "Adresse",
      value: "Koumassi SOPIM, Abidjan",
      action: () => {}
    }
  ];

  return (
    <div className="p-4 space-y-6 safe-area-inset">
      {/* Header mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-light mb-2">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-gray-400 text-sm">
          Version mobile METROTECH
        </p>
      </motion.div>

      {/* Actions rapides */}
      <AnimatedCard className="card-mobile">
        <h2 className="text-lg font-semibold text-light mb-4">Actions rapides</h2>
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.action}
              className={`w-full flex items-center gap-3 p-4 ${action.color} rounded-lg transition-all`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              {action.icon}
              <div className="text-left flex-1">
                <h3 className="text-white font-medium text-sm">{action.title}</h3>
                <p className="text-white/80 text-xs">{action.description}</p>
              </div>
              <ArrowRight size={16} className="text-white/60" />
            </motion.button>
          ))}
        </div>
      </AnimatedCard>

      {/* Contact rapide */}
      <AnimatedCard className="card-mobile" delay={0.3}>
        <h2 className="text-lg font-semibold text-light mb-4">Contact METROTECH</h2>
        <div className="space-y-3">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer"
              onClick={contact.action}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-2 bg-primary-500/20 rounded-lg text-primary-400">
                {contact.icon}
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs">{contact.label}</p>
                <p className="text-white text-sm font-medium">{contact.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>

      {/* Navigation vers les pages principales */}
      <AnimatedCard className="card-mobile" delay={0.6}>
        <h2 className="text-lg font-semibold text-light mb-4">Navigation</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/services">
            <motion.div
              className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-center"
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={24} className="text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Services</p>
            </motion.div>
          </Link>
          
          <Link to="/contact">
            <motion.div
              className="p-4 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-lg text-center"
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={24} className="text-white mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Contact</p>
            </motion.div>
          </Link>
        </div>
      </AnimatedCard>

      {/* Informations de version */}
      <div className="text-center text-gray-500 text-xs">
        <p>Version mobile optimisée</p>
        <p>Bundle réduit pour de meilleures performances</p>
      </div>
    </div>
  );
};

export default MobileDashboard;