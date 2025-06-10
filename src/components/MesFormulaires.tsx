import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Building2, FlaskRound, Factory, Droplet, Thermometer, Guitar as Hospital, ArrowRight, Edit, Trash2 } from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import SearchBar from './ui/SearchBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FormData } from '../types';
import { useAuth } from '../context/AuthContext';

const MesFormulaires: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [drafts, setDrafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [completedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);

  const handleEditForm = (formId: string) => {
    alert(`Ouverture du formulaire ${formId} pour modification...`);
  };

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce formulaire ?')) {
      setDrafts(prev => prev.filter(form => form.id !== formId));
    }
  };

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (draft.data.client && draft.data.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getServiceColor = (service: string) => {
    const colors: Record<string, string> = {
      'Services BTP': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Laboratoires': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Industries': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Hôpitaux': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Analyse Eau': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Surveillance T°/H': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
    return colors[service] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 no-scrollbar">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Mes Formulaires</h1>
        <p className="text-gray-400">
          Gérez vos formulaires en cours - {drafts.length} brouillon(s), {completedForms.length} terminé(s)
        </p>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
            <FileText className="text-green-400" size={24} />
            <div>
              <p className="text-green-400 text-sm font-medium">Terminés</p>
              <p className="text-white text-xl font-bold">{completedForms.length}</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-orange-400" size={24} />
            <div>
              <p className="text-orange-400 text-sm font-medium">En cours</p>
              <p className="text-white text-xl font-bold">
                {drafts.filter(d => d.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4} className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-400" size={24} />
            <div>
              <p className="text-purple-400 text-sm font-medium">Total</p>
              <p className="text-white text-xl font-bold">{drafts.length + completedForms.length}</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchQuery}
        placeholder="Rechercher dans vos formulaires..."
        className="max-w-md"
      />

      {/* Liste des formulaires */}
      {filteredDrafts.length === 0 ? (
        <AnimatedCard className="text-center py-12">
          <FileText className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchQuery ? 'Aucun formulaire trouvé' : 'Aucun formulaire en cours'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? 'Essayez de modifier votre recherche'
              : 'Créez votre premier formulaire pour commencer'
            }
          </p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4">
          {filteredDrafts.map((form, index) => (
            <AnimatedCard
              key={form.id}
              delay={index * 0.1}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{form.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getServiceColor(form.service)}`}>
                      {form.service}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      form.status === 'draft' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {form.status === 'draft' ? 'Brouillon' : 'En cours'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Client:</span>
                      <div className="text-white font-medium">{form.data.client || 'Non spécifié'}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Créé le:</span>
                      <div className="text-white">{formatDate(form.createdAt)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Modifié le:</span>
                      <div className="text-white">{formatDate(form.updatedAt)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Progression:</span>
                      <div className="text-white">{form.data.progress || 0}%</div>
                    </div>
                  </div>

                  {form.data.instrument && (
                    <div className="text-sm text-gray-400 mb-2">
                      <span className="font-medium">Instrument:</span> {form.data.instrument}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <motion.button
                    onClick={() => handleEditForm(form.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Modifier"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={16} className="text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteForm(form.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Supprimer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
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
          <li>• Cliquez sur "Modifier" pour continuer un formulaire en cours</li>
          <li>• Vos brouillons sont automatiquement sauvegardés</li>
          <li>• Retrouvez vos formulaires terminés dans l'historique</li>
          <li>• Utilisez la recherche pour trouver rapidement un formulaire</li>
          <li>• Supprimez les formulaires dont vous n'avez plus besoin</li>
        </ul>
      </AnimatedCard>
    </div>
  );
};

export default MesFormulaires;