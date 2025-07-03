// Utilitaires pour détecter et gérer l'environnement Electron
export const isElectron = (): boolean => {
  return !!(window as any)?.process?.versions?.electron;
};

export const isWebEnvironment = (): boolean => {
  return !isElectron();
};

export const adaptCSPForElectron = (): void => {
  if (isElectron()) {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (meta) {
      meta.setAttribute("content", 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https: blob:; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "connect-src 'self' https:;"
      );
    }
  }
};

export const shouldLoadAnalytics = (): boolean => {
  return isWebEnvironment();
};

export const getAssetPath = (path: string): string => {
  if (isElectron()) {
    // Convertir les chemins absolus en relatifs pour Electron
    return path.startsWith('/') ? `.${path}` : path;
  }
  return path;
};

export const initializeElectronOptimizations = (): void => {
  if (isElectron()) {
    // Adapter la CSP
    adaptCSPForElectron();
    
    // Désactiver le zoom par défaut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    });

    // Désactiver le menu contextuel par défaut
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Optimiser les performances pour Electron
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Précharger les ressources critiques
        const criticalImages = [
          './favicon.ico',
          './icon-192.png',
          './icon-512.png'
        ];
        
        criticalImages.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      });
    }
  }
};