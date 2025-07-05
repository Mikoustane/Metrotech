import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import { actualitesService, Actualite } from '../lib/supabase';

const SupabaseNewsManager: React.FC = () => {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<Actualite | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    image_url: '',
    auteur: 'METROTECH',
    categorie: 'Actualité'
  });

  // Charger les actualités au montage du composant
  useEffect(() => {
    loadActualites();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.contenu) {
      showMessage('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingNews) {
        // Modifier une actualité existante
        await actualitesService.update(editingNews.id!, formData);
        showMessage('success', 'Actualité modifiée avec succès');
      } else {
        // Créer une nouvelle actualité
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
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;
    
    try {
      await actualitesService.delete(id);
      showMessage('success', 'Actualité supprimée avec succès');
      await loadActualites();
    } catch (error) {
      showMessage('error', 'Erreur lors de la suppression');
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Actualités</h1>
          <p className="text-gray-400">Connecté à Supabase - Base de données en temps réel</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nouvelle actualité
        </button>
      </div>

      {/* Message de statut */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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

      {/* Formulaire d'édition */}
      {isEditing && (
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
                  <option value="Actualité">Actualité</option>
                  <option value="Événement">Événement</option>
                  <option value="Formation">Formation</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Innovation">Innovation</option>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image
              </label>
              
              {/* Switch entre upload et URL */}
              <div className="mb-4">
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMethod"
                      value="upload"
                      className="text-primary-500"
                      defaultChecked
                    />
                    <span className="text-gray-300 text-sm">Upload fichier</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageMethod"
                      value="url"
                      className="text-primary-500"
                    />
                    <span className="text-gray-300 text-sm">URL externe</span>
                  </label>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                />
                
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Aperçu" 
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
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
      )}

      {/* Liste des actualités */}
      <div className="space-y-4">
        {actualites.length === 0 ? (
          <AnimatedCard className="text-center py-12">
            <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Aucune actualité
            </h3>
            <p className="text-gray-500">
              Créez votre première actualité pour commencer
            </p>
          </AnimatedCard>
        ) : (
          actualites.map((item, index) => (
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
                    onClick={() => handleDelete(item.id!)}
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
            <div className="text-2xl font-bold text-blue-400">{actualites.length}</div>
            <div className="text-gray-400 text-sm">Total actualités</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {actualites.filter(a => {
                try {
                  return new Date(a.created_at!).getMonth() === new Date().getMonth();
                } catch {
                  return false;
                }
              }).length}
            </div>
            <div className="text-gray-400 text-sm">Ce mois</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {new Set(actualites.map(a => a.categorie)).size}
            </div>
            <div className="text-gray-400 text-sm">Catégories</div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SupabaseNewsManager;