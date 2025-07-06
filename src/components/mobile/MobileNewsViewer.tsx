import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, Loader } from 'lucide-react';
import AnimatedCard from '../ui/AnimatedCard';
import { actualitesService, Actualite } from '../../lib/supabase';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Version mobile légère pour afficher les actualités (lecture seule)
const MobileNewsViewer: React.FC = () => {
  const [supabaseNews, setSupabaseNews] = useState<Actualite[]>([]);
  const [localNews] = useLocalStorage<any[]>('metrotech_news', []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await actualitesService.getAll();
        setSupabaseNews(data.slice(0, 5)); // Limiter à 5 actualités sur mobile
      } catch (error) {
        console.error('Erreur chargement actualités:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const displayNews = supabaseNews.length > 0 ? supabaseNews : localNews.slice(0, 5);

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Date inconnue';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="animate-spin text-blue-500" size={20} />
          <span className="text-white text-sm">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Actualités METROTECH</h2>
      
      {displayNews.length === 0 ? (
        <AnimatedCard className="text-center py-8">
          <Calendar className="mx-auto text-gray-600 mb-4" size={32} />
          <p className="text-gray-400">Aucune actualité disponible</p>
        </AnimatedCard>
      ) : (
        <div className="space-y-4">
          {displayNews.map((news, index) => {
            const isSupabase = 'titre' in news;
            const title = isSupabase ? news.titre : news.title;
            const content = isSupabase ? news.contenu : news.content;
            const author = isSupabase ? news.auteur : 'METROTECH';
            const category = isSupabase ? news.categorie : news.subtitle;
            const date = isSupabase ? news.created_at : news.createdAt;
            const image = isSupabase ? news.image_url : news.image;

            return (
              <AnimatedCard
                key={isSupabase ? news.id : news.id}
                delay={index * 0.1}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
              >
                {image && (
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {category && (
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs flex items-center gap-1">
                        <Tag size={12} />
                        {category}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {title}
                  </h3>
                  
                  <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                    {content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(date)}</span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileNewsViewer;