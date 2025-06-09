import { useEffect } from 'react';

interface VisitData {
  timestamp: Date;
  page: string;
  userAgent: string;
  referrer: string;
  ip: string;
  country: string;
}

export const useVisitTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Obtenir l'IP réelle du visiteur
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Obtenir le pays basé sur l'IP
        let country = 'Inconnu';
        try {
          const geoResponse = await fetch(`https://ipapi.co/${userIP}/country_name/`);
          if (geoResponse.ok) {
            country = await geoResponse.text();
          }
        } catch (geoError) {
          console.warn('Impossible de récupérer la géolocalisation:', geoError);
        }

        const visitData: VisitData = {
          timestamp: new Date(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          ip: userIP,
          country: country
        };

        // Récupérer les visites existantes
        const existingVisits = localStorage.getItem('site_visits');
        const visits = existingVisits ? JSON.parse(existingVisits) : [];
        
        // Vérifier si cette visite n'est pas un doublon récent (même IP, même page, moins de 5 minutes)
        const recentVisit = visits.find((visit: VisitData) => 
          visit.ip === userIP && 
          visit.page === visitData.page && 
          (new Date().getTime() - new Date(visit.timestamp).getTime()) < 300000 // 5 minutes
        );

        if (!recentVisit) {
          // Ajouter la nouvelle visite
          visits.push(visitData);
          
          // Garder seulement les 1000 dernières visites pour éviter de surcharger le localStorage
          if (visits.length > 1000) {
            visits.splice(0, visits.length - 1000);
          }
          
          // Sauvegarder
          localStorage.setItem('site_visits', JSON.stringify(visits));

          // Mettre à jour les statistiques
          updateVisitStats(visits);

          // Envoyer à Google Analytics si configuré
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'dimension1': country,
                'dimension2': userIP
              }
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors du tracking de visite:', error);
        
        // Fallback: enregistrer sans IP/géolocalisation
        const fallbackVisitData: VisitData = {
          timestamp: new Date(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          ip: 'Inconnu',
          country: 'Inconnu'
        };

        const existingVisits = localStorage.getItem('site_visits');
        const visits = existingVisits ? JSON.parse(existingVisits) : [];
        visits.push(fallbackVisitData);
        
        if (visits.length > 1000) {
          visits.splice(0, visits.length - 1000);
        }
        
        localStorage.setItem('site_visits', JSON.stringify(visits));
        updateVisitStats(visits);
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
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('visit_stats', JSON.stringify(stats));
    };

    // Tracker la visite actuelle avec un délai pour s'assurer que la page est chargée
    const timeoutId = setTimeout(trackVisit, 1000);

    // Tracker les changements de page (pour les SPAs)
    const handlePopState = () => {
      setTimeout(trackVisit, 100);
    };

    const handleBeforeUnload = () => {
      // Sauvegarder les données avant de quitter la page
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