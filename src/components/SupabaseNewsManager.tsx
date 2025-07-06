import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  X,
  Calendar,
  Eye,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader,
  Search,
  Filter,
  Link as LinkIcon
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import { actualitesService, Actualite } from '../lib/supabase';

// Composant Modal de confirmation personnalisée
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${typeStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SupabaseNewsManager: React.FC = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [filteredActualites, setFilteredActualites] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<Actualite | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // États pour la modal de confirmation
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // État pour le mode d'image (upload ou URL)
  const [imageMethod, setImageMethod] = useState<'upload' | 'url'>('upload');
  
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    image_url: '',
    auteur: 'METROTECH',
    categorie: 'Actualité'
  });

  // Catégories disponibles
  const categories = ['Actualité', 'Événement', 'Formation', 'Partenariat', 'Innovation'];

  // Charger les actualités au montage du composant
  useEffect(() => {
    loadActualites();
  }, []);

  // Filtrer les actualités quand les critères changent
  useEffect(() => {
    let filtered = actualites;

    if (searchTerm) {
      filtered = filtered.filter(actu => 
        actu.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actu.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actu.auteur.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(actu => actu.categorie === selectedCategory);
    }

    setFilteredActualites(filtered);
  }, [actualites, searchTerm, selectedCategory]);

  const loadActualites = async () => {
    try {
      setIsLoading(true);
      const data = await actualitesService.getAll();
      setActualites(data);
    } catch (error) {
      showMessage('error', 'Erreur lors du chargement des actualités');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Validation sécurisée des URLs d'images
  const validateImageUrl = (url: string): boolean => {
    if (!url) return true; // URL vide autorisée
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.contenu) {
      showMessage('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'URL d'image si fournie
    if (formData.image_url && !validateImageUrl(formData.image_url)) {
      showMessage('error', 'URL d\'image invalide. Utilisez une URL HTTPS valide.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingNews) {
        await actualitesService.update(editingNews.id!, formData);
        showMessage('success', 'Actualité modifiée avec succès');
      } else {
        await actualitesService.create(formData);
        showMessage('success', 'Actualité créée avec succès');
      }
      
      await loadActualites();
      resetForm();
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      contenu: '',
      image_url: '',
      auteur: 'METROTECH',
      categorie: 'Actualité'
    });
    setIsEditing(false);
    setEditingNews(null);
    setImageMethod('upload');
  };

  const handleEdit = (actualite: Actualite) => {
    setEditingNews(actualite);
    setFormData({
      titre: actualite.titre,
      contenu: actualite.contenu,
      image_url: actualite.image_url || '',
      auteur: actualite.auteur,
      categorie: actualite.categorie
    });
    setIsEditing(true);
    // Détecter le mode d'image basé sur le contenu
    setImageMethod(actualite.image_url?.startsWith('data:') ? 'upload' : 'url');
  };

  const handleDelete = (id: number, titre: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer l\'actualité',
      message: `Êtes-vous sûr de vouloir supprimer l'actualité "${titre}" ? Cette action est irréversible.`,
      onConfirm: async () => {
        try {
          await actualitesService.delete(id);
          showMessage('success', 'Actualité supprimée avec succès');
          await loadActualites();
        } catch (error) {
          showMessage('error', 'Erreur lors de la suppression');
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date non disponible';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        showMessage('error', 'Fichier trop volumineux (max 5MB)');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Veuillez sélectionner une image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image_url: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Statistiques optimisées (calculées une seule fois)
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const totalThisMonth = actualites.filter(a => {
      try {
        const date = new Date(a.created_at!);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      } catch {
        return false;
      }
    }).length;

    const categoriesCount = new Set(actualites.map(a => a.categorie)).size;

    return {
      total: actualites.length,
      thisMonth: totalThisMonth,
      categories: categoriesCount
    };
  }, [actualites]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={24} />
          <span className="text-white">Chargement des actualités...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec recherche et filtres */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Actualités</h1>
          <p className="text-gray-400">Connecté à Supabase - Base de données en temps réel</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter size={18} />
            Filtres
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nouvelle actualité
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de statut */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-2 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulaire d'édition */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingNews ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contenu *
                  </label>
                  <textarea
                    value={formData.contenu}
                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Image
                  </label>
                  
                  {/* Switch entre upload et URL */}
                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="imageMethod"
                        value="upload"
                        checked={imageMethod === 'upload'}
                        onChange={() => setImageMethod('upload')}
                        className="text-primary-500"
                      />
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-gray-300 text-sm">Upload fichier</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="imageMethod"
                        value="url"
                        checked={imageMethod === 'url'}
                        onChange={() => setImageMethod('url')}
                        className="text-primary-500"
                      />
                      <LinkIcon size={16} className="text-gray-400" />
                      <span className="text-gray-300 text-sm">URL externe</span>
                    </label>
                  </div>

                  {imageMethod === 'upload' && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                  
                  {imageMethod === 'url' && (
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://exemple.com/image.jpg"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}

                  {formData.image_url && (
                    <div className="mt-3">
                      <img 
                        src={formData.image_url} 
                        alt="Aperçu" 
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={formData.auteur}
                    onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isSubmitting ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSubmitting ? 'Sauvegarde...' : (editingNews ? 'Mettre à jour' : 'Créer')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des actualités */}
      <div className="space-y-4">
        {filteredActualites.length === 0 ? (
          <AnimatedCard className="text-center py-12">
            <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm || selectedCategory ? 'Aucun résultat trouvé' : 'Aucune actualité'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Créez votre première actualité pour commencer'
              }
            </p>
          </AnimatedCard>
        ) : (
          filteredActualites.map((item, index) => (
            <AnimatedCard
              key={item.id}
              delay={index * 0.1}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-white">{item.titre}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.categorie}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.contenu}
                  </p>
                  
                  {item.image_url && (
                    <div className="mb-3">
                      <img 
                        src={item.image_url} 
                        alt={item.titre}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Par {item.auteur}</span>
                    {item.created_at && (
                      <span> • Créé le {formatDate(item.created_at)}</span>
                    )}
                    {item.updated_at && item.updated_at !== item.created_at && (
                      <span> • Modifié le {formatDate(item.updated_at)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!, item.titre)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>

      {/* Statistiques */}
      <AnimatedCard className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques Supabase</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total actualités</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{stats.thisMonth}</div>
            <div className="text-gray-400 text-sm">Ce mois</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">{stats.categories}</div>
            <div className="text-gray-400 text-sm">Catégories</div>
          </div>
        </div>
      </AnimatedCard>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Supprimer"
        type="danger"
      />
    </div>
  );
};

export default SupabaseNewsManager;