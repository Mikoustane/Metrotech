import React, { useState } from 'react';
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
  Upload
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  legend: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

const NewsManager: React.FC = () => {
  const [news, setNews] = useLocalStorage<NewsItem[]>('metrotech_news', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image: '',
    legend: '',
    published: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNews) {
      // Modifier une actualité existante
      const updatedNews = news.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...formData, updatedAt: new Date() }
          : item
      );
      setNews(updatedNews);
    } else {
      // Créer une nouvelle actualité
      const newNewsItem: NewsItem = {
        id: `news_${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNews([newNewsItem, ...news]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      content: '',
      image: '',
      legend: '',
      published: false
    });
    setIsEditing(false);
    setEditingNews(null);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      subtitle: newsItem.subtitle,
      content: newsItem.content,
      image: newsItem.image,
      legend: newsItem.legend,
      published: newsItem.published
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      setNews(news.filter(item => item.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    const updatedNews = news.map(item =>
      item.id === id 
        ? { ...item, published: !item.published, updatedAt: new Date() }
        : item
    );
    setNews(updatedNews);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestion des Actualités</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nouvelle actualité
        </button>
      </div>

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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Ou URL de l'image"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {formData.image && (
                  <img 
                    src={formData.image} 
                    alt="Aperçu" 
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Légende de l'image
              </label>
              <input
                type="text"
                value={formData.legend}
                onChange={(e) => setFormData({ ...formData, legend: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="published" className="text-gray-300">
                Publier immédiatement
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingNews ? 'Mettre à jour' : 'Créer'}
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
        {news.length === 0 ? (
          <AnimatedCard className="text-center py-12">
            <Calendar className="mx-auto text-gray-600 mb-4\" size={48} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Aucune actualité
            </h3>
            <p className="text-gray-500">
              Créez votre première actualité pour commencer
            </p>
          </AnimatedCard>
        ) : (
          news.map((item, index) => (
            <AnimatedCard
              key={item.id}
              delay={index * 0.1}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.published 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {item.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  
                  {item.subtitle && (
                    <p className="text-gray-300 mb-2">{item.subtitle}</p>
                  )}
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.content}
                  </p>
                  
                  {item.image && (
                    <div className="mb-3">
                      <img 
                        src={item.image} 
                        alt={item.legend || item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      {item.legend && (
                        <p className="text-xs text-gray-500 mt-1">{item.legend}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    {item.updatedAt !== item.createdAt && (
                      <span> • Modifié le {new Date(item.updatedAt).toLocaleDateString('fr-FR')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => togglePublished(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.published 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    title={item.published ? 'Dépublier' : 'Publier'}
                  >
                    <Eye size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default NewsManager;