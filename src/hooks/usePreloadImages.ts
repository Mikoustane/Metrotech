import { useEffect, useState } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low';
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const usePreloadImages = (imageUrls: string[], options: PreloadOptions = {}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    let failedCount = 0;

    const checkComplete = () => {
      if (loadedCount + failedCount === imageUrls.length) {
        setIsLoading(false);
        options.onLoad?.();
      }
    };

    const preloadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(url));
          loadedCount++;
          checkComplete();
          resolve();
        };
        
        img.onerror = () => {
          setFailedImages(prev => new Set(prev).add(url));
          failedCount++;
          const error = new Error(`Failed to load image: ${url}`);
          options.onError?.(error);
          checkComplete();
          reject(error);
        };
        
        img.src = url;
      });
    };

    // Précharger toutes les images
    Promise.allSettled(imageUrls.map(preloadImage));

  }, [imageUrls, options]);

  return {
    loadedImages,
    failedImages,
    isLoading,
    progress: imageUrls.length > 0 ? (loadedImages.size + failedImages.size) / imageUrls.length : 1
  };
};

// Hook pour précharger les images critiques de l'app
export const useCriticalImages = () => {
  const criticalImages = [
    'https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png',
    'https://image.noelshack.com/fichiers/2024/44/3/1730323091-metrotech-1.jpg'
  ];

  return usePreloadImages(criticalImages, {
    priority: 'high',
    onError: (error) => console.warn('Critical image failed to load:', error)
  });
};