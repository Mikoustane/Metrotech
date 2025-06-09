import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  CheckCircle,
  Download,
  Eye,
  SortAsc,
  SortDesc
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import SearchBar from './ui/SearchBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FormData } from '../types';

const Historique: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'service'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [completedForms] = useLocalStorage<FormData[]>('metrotech_completed', []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const filteredAndSortedForms = completedForms
    .filter(form => 
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.data.client && form.data.client.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'service':
          comparison = a.service.localeCompare(b.service);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewForm = (formId: string) => {
    alert(`Ouverture du formulaire ${formId} en lecture seule`);
  };

  const handleDownloadForm = (formId: string) => {
    alert(`Téléchargement du formulaire ${formId} en PDF`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Historique</h1>
        <p className="text-gray-400">
          Consultez tous vos formulaires terminés
        </p>
      </motion.div>

      {/* Search and Filters */}
      <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <SearchBar
            onSearch={setSearchTerm}
            onFilter={() => setShowFilters(!showFilters)}
            placeholder="Rechercher par titre, service ou client..."
            showFilter
            className="flex-1"
          />

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'service')}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Trier par date</option>
              <option value="name">Trier par nom</option>
              <option value="service">Trier par service</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tous les services</option>
                  <option value="BTP">BTP</option>
                  <option value="Laboratoire">Laboratoire</option>
                  <option value="Industrie">Industrie</option>
                  <option value="Hôpital">Hôpital</option>
                  <option value="Analyse Eau">Analyse Eau</option>
                  <option value="Surveillance T°/H">Surveillance T°/H</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatedCard>

      {/* Forms List */}
      {filteredAndSortedForms.length === 0 ? (
        <AnimatedCard className="text-center py-12">
          <FileText className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucun formulaire terminé'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Vos formulaires terminés apparaîtront ici'
            }
          </p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedForms.map((form, index) => (
            <AnimatedCard
              key={form.id}
              delay={index * 0.1}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <h3 className="text-lg font-semibold text-white">{form.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getServiceColor(form.service)}`}>
                      {form.service}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Client:</span>
                      <div className="text-white font-medium">{form.data.client || 'Non spécifié'}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Créé le:</span>
                      <div className="text-white">{formatDate(form.createdAt.toString())}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Terminé le:</span>
                      <div className="text-white">{formatDate(form.updatedAt.toString())}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Statut:</span>
                      <div className="text-green-400 font-medium">Terminé</div>
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
                    onClick={() => handleViewForm(form.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Voir"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} className="text-white" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDownloadForm(form.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    title="Télécharger"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={16} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}

      {/* Statistics */}
      <AnimatedCard
        delay={0.4}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{completedForms.length}</div>
            <div className="text-gray-400 text-sm">Total formulaires</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {completedForms.filter(f => 
                new Date(f.updatedAt).getMonth() === new Date().getMonth()
              ).length}
            </div>
            <div className="text-gray-400 text-sm">Ce mois</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {new Set(completedForms.map(f => f.service)).size}
            </div>
            <div className="text-gray-400 text-sm">Services utilisés</div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Historique;