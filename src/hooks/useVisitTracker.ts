import { useEffect } from 'react';

interface VisitData {
  timestamp: Date;
  page: string;
  userAgent: string;
  referrer: string;
  ip: string;
  country: string;
  sessionId: string;
}

export const useVisitTracker = () => {
  useEffect(() => {
    const trackVisit = () => {
      try {
        // Générer un ID de session unique
        let sessionId = sessionStorage.getItem('metrotech_session');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('metrotech_session', sessionId);
        }

        // Détecter le pays approximatif via timezone
        const getCountryFromTimezone = (): string => {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const timezoneCountryMap: Record<string, string> = {
            'Africa/Abidjan': 'Côte d\'Ivoire',
            'Africa/Accra': 'Ghana',
            'Africa/Lagos': 'Nigeria',
            'Africa/Dakar': 'Sénégal',
            'Africa/Bamako': 'Mali',
            'Africa/Ouagadougou': 'Burkina Faso',
            'Europe/Paris': 'France',
            'Europe/London': 'Royaume-Uni',
            'America/New_York': 'États-Unis',
            'America/Los_Angeles': 'États-Unis',
            'Asia/Tokyo': 'Japon',
            'Asia/Shanghai': 'Chine'
          };
          return timezoneCountryMap[timezone] || 'Inconnu';
        };

        // Générer une IP fictive basée sur la session
        const generateFakeIP = (): string => {
          const hash = sessionId.split('_')[1];
          const num = parseInt(hash.substr(0, 8), 36);
          const a = (num % 255) + 1;
          const b = ((num >> 8) % 255) + 1;
          const c = ((num >> 16) % 255) + 1;
          const d = ((num >> 24) % 255) + 1;
          return `${a}.${b}.${c}.${d}`;
        };

        const visitData: VisitData = {
          timestamp: new Date(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          ip: generateFakeIP(),
          country: getCountryFromTimezone(),
          sessionId
        };

        // Récupérer les visites existantes
        const existingVisits = localStorage.getItem('site_visits');
        const visits = existingVisits ? JSON.parse(existingVisits) : [];
        
        // Vérifier si cette visite n'est pas un doublon récent (même session, même page, moins de 5 minutes)
        const recentVisit = visits.find((visit: VisitData) => 
          visit.sessionId === sessionId && 
          visit.page === visitData.page && 
          (new Date().getTime() - new Date(visit.timestamp).getTime()) < 300000 // 5 minutes
        );

        if (!recentVisit) {
          // Ajouter la nouvelle visite
          visits.push(visitData);
          
          // Garder seulement les 1000 dernières visites
          if (visits.length > 1000) {
            visits.splice(0, visits.length - 1000);
          }
          
          // Sauvegarder
          localStorage.setItem('site_visits', JSON.stringify(visits));

          // Mettre à jour les statistiques
          updateVisitStats(visits);
        }
      } catch (error) {
        console.error('Erreur lors du tracking de visite:', error);
      }
    };

    const updateVisitStats = (visits: VisitData[]) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisYear = new Date(now.getFullYear(), 0, 1);

      const stats = {
        today: visits.filter((visit: VisitData) => new Date(visit.timestamp) >= today).length,
        thisMonth: visits.filter((visit: VisitData) => new Date(visit.timestamp) >= thisMonth).length,
        thisYear: visits.filter((visit: VisitData) => new Date(visit.timestamp) >= thisYear).length,
        totalVisits: visits.length,
        uniqueVisitors: new Set(visits.map((visit: VisitData) => visit.sessionId)).size,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('visit_stats', JSON.stringify(stats));
    };

    // Tracker la visite actuelle avec un délai
    const timeoutId = setTimeout(trackVisit, 1000);

    // Tracker les changements de page
    const handlePopState = () => {
      setTimeout(trackVisit, 100);
    };

    const handleBeforeUnload = () => {
      // Sauvegarder les données avant de quitter
      const visits = JSON.parse(localStorage.getItem('site_visits') || '[]');
      updateVisitStats(visits);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

// Fonctions utilitaires pour les statistiques
export const getVisitStats = () => {
  const stats = localStorage.getItem('visit_stats');
  return stats ? JSON.parse(stats) : {
    today: 0,
    thisMonth: 0,
    thisYear: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    lastUpdated: new Date().toISOString()
  };
};

export const getVisitHistory = () => {
  const visits = localStorage.getItem('site_visits');
  return visits ? JSON.parse(visits) : [];
};

export const getPopularPages = () => {
  const visits = getVisitHistory();
  const pageCount: Record<string, number> = {};
  
  visits.forEach((visit: VisitData) => {
    pageCount[visit.page] = (pageCount[visit.page] || 0) + 1;
  });
  
  return Object.entries(pageCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));
};

export const getCountryStats = () => {
  const visits = getVisitHistory();
  const countryCount: Record<string, number> = {};
  
  visits.forEach((visit: VisitData) => {
    countryCount[visit.country] = (countryCount[visit.country] || 0) + 1;
  });
  
  return Object.entries(countryCount)
    .sort(([,a], [,b]) => b - a)
    .map(([country, count]) => ({ country, count }));
};