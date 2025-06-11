import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Building2, 
  FlaskRound, 
  Factory, 
  Droplet, 
  Thermometer, 
  Guitar as Hospital, 
  ArrowRight,
  Save,
  Clock,
  CheckCircle
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import SearchBar from './ui/SearchBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FormData } from '../types';
import { useAuth } from '../context/AuthContext';

const FormManager: React.FC = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drafts, setDrafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [completedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);

  const services = [
    {
      id: 'btp',
      title: 'Services BTP',
      description: 'Formulaires pour les chantiers et travaux publics',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      forms: [
        'Étalonnage instruments de chantier',
        'Vérification équipements topographie',
        'Maintenance préventive',
        'Formation équipes'
      ]
    },
    {
      id: 'laboratoire',
      title: 'Laboratoires',
      description: 'Formulaires pour analyses scientifiques',
      icon: FlaskRound,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      forms: [
        'Étalonnage instruments précision',
        'Validation équipements analyse',
        'Certification métrologie',
        'Support technique'
      ]
    },
    {
      id: 'industrie',
      title: 'Industries',
      description: 'Formulaires pour processus industriels',
      icon: Factory,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      forms: [
        'Calibration instruments production',
        'Audit systèmes mesure',
        'Maintenance équipements',
        'Conseil métrologie'
      ]
    },
    {
      id: 'hopital',
      title: 'Hôpitaux',
      description: 'Formulaires pour équipements médicaux',
      icon: Hospital,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      forms: [
        'Étalonnage appareils médicaux',
        'Vérification équipements diagnostic',
        'Maintenance préventive',
        'Formation personnel médical'
      ]
    },
    {
      id: 'eau',
      title: 'Analyse Eau',
      description: 'Formulaires pour laboratoires d\'eau',
      icon: Droplet,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      forms: [
        'Analyse qualité eau',
        'Calibration instruments mesure',
        'Maintenance équipements',
        'Formation techniques analyse'
      ]
    },
    {
      id: 'temperature',
      title: 'Surveillance T°/H',
      description: 'Formulaires pour monitoring environnemental',
      icon: Thermometer,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      forms: [
        'Installation capteurs',
        'Configuration alertes',
        'Maintenance système',
        'Rapports automatisés'
      ]
    }
  ];

  const handleCreateForm = (serviceId: string, formType: string) => {
    if (!user) {
      alert('Erreur: Utilisateur non connecté');
      return;
    }

    const newForm: FormData = {
      id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formType,
      service: services.find(s => s.id === serviceId)?.title || serviceId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      data: {
        client: '',
        instrument: '',
        progress: 0,
        serviceType: serviceId,
        formType: formType,
        createdByName: user.name,
        createdByEmail: user.email
      }
    };

    try {
      setDrafts(prev => [...prev, newForm]);
      
      // Logger la création du formulaire
      const formLog = {
        action: 'create',
        formId: newForm.id,
        formType: formType,
        service: serviceId,
        userId: user.id,
        timestamp: new Date().toISOString()
      };
      
      const existingLogs = localStorage.getItem('metrotech_form_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(formLog);
      
      if (logs.length > 200) {
        logs.splice(0, logs.length - 200);
      }
      
      localStorage.setItem('metrotech_form_logs', JSON.stringify(logs));
      
      alert(`Formulaire "${formType}" créé avec succès!\nID: ${newForm.id}`);
    } catch (error) {
      console.error('Erreur lors de la création du formulaire:', error);
      alert('Erreur lors de la création du formulaire. Veuillez réessayer.');
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.forms.some(form => form.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 no-scrollbar">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Gestionnaire de Formulaires</h1>
        <p className="text-gray-400">
          Créez et gérez vos formulaires par service - {drafts.length} brouillon(s), {completedForms.length} terminé(s)
        </p>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AnimatedCard delay={0.1} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-400" size={24} />
            <div>
              <p className="text-blue-400 text-sm font-medium">Brouillons</p>
              <p className="text-white text-xl font-bold">{drafts.length}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={24} />
            <div>
              <p className="text-green-400 text-sm font-medium">Terminés</p>
              <p className="text-white text-xl font-bold">{completedForms.length}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-400" size={24} />
            <div>
              <p className="text-orange-400 text-sm font-medium">En cours</p>
              <p className="text-white text-xl font-bold">
                {drafts.filter(d => d.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Rechercher un service ou type de formulaire..."
        className="max-w-md"
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          
          return (
            <AnimatedCard
              key={service.id}
              delay={index * 0.1}
              className={`
                bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer
                ${isSelected 
                  ? `${service.borderColor} ring-2 ring-blue-500/20 shadow-lg` 
                  : 'border-gray-700 hover:border-gray-600'
                }
              `}
              onClick={() => setSelectedService(isSelected ? null : service.id)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${service.bgColor}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </div>
                <ArrowRight 
                  size={20} 
                  className={`text-gray-400 transition-transform ${
                    isSelected ? 'rotate-90' : ''
                  }`} 
                />
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 mt-4 pt-4 border-t border-gray-700"
                >
                  {service.forms.map((form, formIndex) => (
                    <motion.button
                      key={formIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: formIndex * 0.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateForm(service.id, form);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left
                        bg-gradient-to-r ${service.color} hover:shadow-lg
                        transform hover:scale-105 active:scale-95
                      `}
                    >
                      <Plus size={16} className="text-white" />
                      <span className="text-white text-sm font-medium">{form}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatedCard>
          );
        })}
      </div>

      {searchQuery && filteredServices.length === 0 && (
        <AnimatedCard className="text-center py-12">
          <FileText className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            Aucun service trouvé
          </h3>
          <p className="text-gray-500">
            Aucun service ne correspond à votre recherche "{searchQuery}"
          </p>
        </AnimatedCard>
      )}

      {/* Instructions */}
      <AnimatedCard
        delay={0.6}
        className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <FileText className="text-blue-400" size={24} />
          <h2 className="text-lg font-semibold text-white">Guide d'utilisation</h2>
        </div>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• Cliquez sur un service pour voir les formulaires disponibles</li>
          <li>• Sélectionnez le type de formulaire à créer</li>
          <li>• Vos brouillons sont automatiquement sauvegardés</li>
          <li>• Retrouvez vos formulaires terminés dans l'historique</li>
          <li>• Utilisez la recherche pour trouver rapidement un service</li>
        </ul>
      </AnimatedCard>
    </div>
  );
};

export default FormManager;