import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Clock, 
  Trash2, 
  Edit, 
  AlertCircle,
  CheckCircle,
  FileText,
  Calendar,
  Play,
  Pause
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import ProgressBar from './ui/ProgressBar';
import SearchBar from './ui/SearchBar';
import { FormData } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Sauvegarde: React.FC = () => {
  const { user } = useAuth();
  const [drafts, setDrafts] = useLocalStorage<FormData[]>('metrotech_drafts', []);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Auto-save simulation
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      if (drafts.length > 0) {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        }, 1000);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [drafts, autoSaveEnabled]);

  const deleteDraft = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) {
      const newDrafts = drafts.filter(draft => draft.id !== id);
      setDrafts(newDrafts);
    }
  };

  const continueDraft = (id: string) => {
    alert(`Ouverture du formulaire ${id} pour continuer...`);
  };

  const duplicateDraft = (draft: FormData) => {
    const newDraft: FormData = {
      ...draft,
      id: `form_${Date.now()}`,
      title: `${draft.title} (Copie)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDrafts(prev => [...prev, newDraft]);
  };

  const getServiceColor = (service: string) => {
    const colors: Record<string, string> = {
      'Laboratoire': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Industrie': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Analyse Eau': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Surveillance T°/H': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'BTP': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Hôpital': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[service] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="text-gray-400" size={16} />;
      case 'in-progress': return <Clock className="text-yellow-400" size={16} />;
      default: return <FileText className="text-gray-400" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'in-progress': return 'En cours';
      default: return 'Inconnu';
    }
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

  const filteredDrafts = drafts.filter(draft =>
    draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (draft.data.client && draft.data.client.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sauvegarde</h1>
          <p className="text-gray-400">
            Reprenez vos formulaires en cours ou sauvegardés
          </p>
        </div>

        {/* Auto-save Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                autoSaveEnabled 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {autoSaveEnabled ? <Play size={16} className="text-white" /> : <Pause size={16} className="text-white" />}
            </button>
            <span className="text-sm text-gray-400">
              Sauvegarde auto: {autoSaveEnabled ? 'Activée' : 'Désactivée'}
            </span>
          </div>

          {/* Auto-save Status */}
          {autoSaveStatus === 'saving' && (
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
              <span className="text-sm">Sauvegarde...</span>
            </div>
          )}
          {autoSaveStatus === 'saved' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm">Sauvegardé</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Search Bar */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Rechercher dans vos brouillons..."
        className="max-w-md"
      />

      {/* Empty State */}
      {filteredDrafts.length === 0 && (
        <AnimatedCard className="text-center py-12">
          <Save className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm ? 'Aucun brouillon trouvé' : 'Aucun brouillon'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Essayez de modifier votre recherche'
              : 'Vos formulaires en cours apparaîtront ici automatiquement'
            }
          </p>
        </AnimatedCard>
      )}

      {/* Drafts List */}
      {filteredDrafts.length > 0 && (
        <div className="space-y-4">
          {filteredDrafts.map((draft, index) => (
            <AnimatedCard
              key={draft.id}
              delay={index * 0.1}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(draft.status)}
                    <h3 className="text-lg font-semibold text-white">{draft.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getServiceColor(draft.service)}`}>
                      {draft.service}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      {getStatusText(draft.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Client:</span>
                      <div className="text-white font-medium">{draft.data.client || 'Non spécifié'}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Créé le:</span>
                      <div className="text-white">{formatDate(draft.createdAt)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Modifié le:</span>
                      <div className="text-white">{formatDate(draft.updatedAt)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Progression:</span>
                      <ProgressBar 
                        progress={draft.data.progress || 0}
                        size="sm"
                        showPercentage={false}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {draft.data.instrument && (
                    <div className="text-sm text-gray-400 mb-2">
                      <span className="font-medium">Instrument:</span> {draft.data.instrument}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <motion.button
                    onClick={() => continueDraft(draft.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Continuer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={16} className="text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => duplicateDraft(draft)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    title="Dupliquer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileText size={16} className="text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => deleteDraft(draft.id)}
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

      {/* Auto-save Info */}
      <AnimatedCard
        delay={0.4}
        className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="text-blue-400" size={24} />
          <h2 className="text-lg font-semibold text-white">Sauvegarde automatique</h2>
        </div>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>• Vos formulaires sont sauvegardés automatiquement toutes les 30 secondes</li>
          <li>• Les données sont conservées même en cas de déconnexion</li>
          <li>• Vous pouvez reprendre votre travail à tout moment</li>
          <li>• Les brouillons sont supprimés automatiquement après 30 jours d'inactivité</li>
          <li>• Utilisez le bouton pause pour désactiver temporairement la sauvegarde</li>
        </ul>
      </AnimatedCard>
    </div>
  );
};

export default Sauvegarde;