// Optimiseur de performance pour éviter les pages blanches
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private criticalResourcesLoaded = false;
  private performanceMetrics: Record<string, number> = {};

  private constructor() {
    this.initializePerformanceMonitoring();
  }

  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private initializePerformanceMonitoring() {
    // Surveiller les métriques de performance
    if ('performance' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.performanceMetrics[entry.name] = entry.startTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics['LCP'] = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Précharger les ressources critiques
  public async preloadCriticalResources(): Promise<void> {
    if (this.criticalResourcesLoaded) return;

    const criticalResources = [
      'https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ];

    const preloadPromises = criticalResources.map(url => {
      if (url.includes('.css')) {
        return this.preloadCSS(url);
      } else {
        return this.preloadImage(url);
      }
    });

    try {
      await Promise.allSettled(preloadPromises);
      this.criticalResourcesLoaded = true;
    } catch (error) {
      console.warn('Some critical resources failed to preload:', error);
    }
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }

  private preloadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload CSS: ${url}`));
      document.head.appendChild(link);
    });
  }

  // Optimiser les images selon la connexion
  public getOptimizedImageUrl(originalUrl: string): string {
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' || 
      connection.effectiveType === '2g' ||
      connection.saveData
    );

    if (isSlowConnection && originalUrl.includes('pexels.com')) {
      return originalUrl.replace(/w=\d+/, 'w=400').replace(/h=\d+/, 'h=300');
    }

    return originalUrl;
  }

  // Détecter et gérer les erreurs de chargement
  public setupErrorHandling(): void {
    // Gérer les erreurs de ressources
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG') {
          this.handleImageError(target as HTMLImageElement);
        } else if (target.tagName === 'SCRIPT') {
          this.handleScriptError(target as HTMLScriptElement);
        }
      }
    }, true);

    // Gérer les erreurs JavaScript non capturées
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError('unhandled_rejection', event.reason);
    });
  }

  private handleImageError(img: HTMLImageElement): void {
    // Remplacer par une image de fallback
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
    img.alt = 'Image non disponible';
  }

  private handleScriptError(script: HTMLScriptElement): void {
    console.error('Script failed to load:', script.src);
    this.logError('script_load_error', script.src);
  }

  private logError(type: string, details: any): void {
    const errorLog = {
      type,
      details: typeof details === 'string' ? details : JSON.stringify(details),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      const existingLogs = JSON.parse(localStorage.getItem('metrotech_performance_errors') || '[]');
      existingLogs.unshift(errorLog);
      localStorage.setItem('metrotech_performance_errors', JSON.stringify(existingLogs.slice(0, 50)));
    } catch (e) {
      console.error('Failed to log performance error:', e);
    }
  }

  // Obtenir les métriques de performance
  public getPerformanceMetrics(): Record<string, number> {
    return { ...this.performanceMetrics };
  }

  // Vérifier si l'app est prête
  public isAppReady(): boolean {
    return this.criticalResourcesLoaded && document.readyState === 'complete';
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();