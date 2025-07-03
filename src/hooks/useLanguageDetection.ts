import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageDetection = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Détecter la langue du navigateur
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language || navigator.languages?.[0] || 'fr';
      const supportedLanguages = ['fr', 'en'];
      
      // Extraire le code de langue (ex: 'fr-FR' -> 'fr')
      const langCode = browserLang.split('-')[0];
      
      // Vérifier si la langue est supportée
      const detectedLang = supportedLanguages.includes(langCode) ? langCode : 'fr';
      
      // Appliquer la langue si elle est différente de celle actuelle
      if (i18n.language !== detectedLang) {
        i18n.changeLanguage(detectedLang);
      }
    };

    // Détecter seulement au premier chargement
    if (!localStorage.getItem('i18nextLng')) {
      detectBrowserLanguage();
    }
  }, [i18n]);
};