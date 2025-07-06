// Utilitaires de détection mobile et optimisation des bundles
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
  
  return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
         window.innerWidth <= 768 ||
         ('ontouchstart' in window);
};

export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return (userAgent.includes('ipad') || 
          (userAgent.includes('android') && !userAgent.includes('mobile'))) ||
         (window.innerWidth > 768 && window.innerWidth <= 1024);
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

// Fonction pour charger conditionnellement les composants lourds
export const shouldLoadAdminComponents = (): boolean => {
  const deviceType = getDeviceType();
  const isAdmin = localStorage.getItem('metrotech_user')?.includes('"id":"1"');
  
  // Ne charger les composants admin que sur desktop ET si l'utilisateur est admin
  return deviceType === 'desktop' && !!isAdmin;
};

export const shouldLoadHeavyComponents = (): boolean => {
  const deviceType = getDeviceType();
  
  // Charger les composants lourds seulement sur desktop et tablet
  return deviceType !== 'mobile';
};

// Configuration des bundles par type d'appareil
export const getBundleConfig = () => {
  const deviceType = getDeviceType();
  
  return {
    loadDashboard: deviceType !== 'mobile',
    loadAdminDashboard: shouldLoadAdminComponents(),
    loadFormCreator: deviceType !== 'mobile',
    loadSettingsManager: shouldLoadAdminComponents(),
    loadConnectionTracker: shouldLoadAdminComponents(),
    loadDataManager: shouldLoadAdminComponents(),
    loadNewsManager: shouldLoadAdminComponents(),
    loadHistorique: deviceType !== 'mobile',
    loadSauvegarde: deviceType !== 'mobile',
    
    // Composants toujours chargés (essentiels)
    loadContactForm: true,
    loadHome: true,
    loadServices: true,
    loadAbout: true,
    loadContact: true,
    loadSidebar: true
  };
};

// Fonction pour optimiser les images selon l'appareil
export const getOptimizedImageUrl = (originalUrl: string, deviceType?: string): string => {
  const device = deviceType || getDeviceType();
  
  // Pour les images Pexels, on peut ajouter des paramètres de redimensionnement
  if (originalUrl.includes('pexels.com')) {
    const baseUrl = originalUrl.split('?')[0];
    switch (device) {
      case 'mobile':
        return `${baseUrl}?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`;
      case 'tablet':
        return `${baseUrl}?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`;
      default:
        return `${baseUrl}?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;
    }
  }
  
  return originalUrl;
};

// Fonction pour réduire la qualité des animations sur mobile
export const getAnimationConfig = () => {
  const deviceType = getDeviceType();
  
  return {
    duration: deviceType === 'mobile' ? 0.2 : 0.5,
    stagger: deviceType === 'mobile' ? 0.05 : 0.1,
    enableComplexAnimations: deviceType !== 'mobile',
    enableParallax: deviceType === 'desktop',
    enableHoverEffects: deviceType === 'desktop'
  };
};