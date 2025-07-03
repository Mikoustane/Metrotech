import React from 'react';
import { MapPin, Navigation, Phone, Mail, Copy, ExternalLink } from 'lucide-react';

const SimpleMap: React.FC = () => {
  const address = "Koumassi SOPIM, Abidjan, Côte d'Ivoire";
  const coordinates = "5.4295609,-4.0712912";
  
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(coordinates);
      alert('📍 Coordonnées GPS copiées dans le presse-papiers !');
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = coordinates;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('📍 Coordonnées GPS copiées dans le presse-papiers !');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
      {/* Header avec informations */}
      <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="text-white" size={24} />
          <h3 className="text-xl font-semibold text-white">Notre Localisation</h3>
        </div>
        <p className="text-white/90 text-sm">{address}</p>
        <p className="text-white/75 text-xs mt-1">📍 GPS: {coordinates}</p>
      </div>

      {/* Carte statique avec image de fond */}
      <div className="relative h-64 bg-gray-700">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
              <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" stroke-width="1"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="#1f2937"/>
                <rect width="100%" height="100%" fill="url(#grid)"/>
                
                <!-- Routes principales -->
                <path d="M 0 150 L 400 150" stroke="#4B5563" stroke-width="3"/>
                <path d="M 200 0 L 200 300" stroke="#4B5563" stroke-width="3"/>
                
                <!-- Marqueur METROTECH avec effet glow -->
                <circle cx="200" cy="150" r="12" fill="#F57C00" filter="url(#glow)"/>
                <circle cx="200" cy="150" r="25" fill="none" stroke="#F57C00" stroke-width="2" opacity="0.6">
                  <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Texte METROTECH -->
                <text x="200" y="135" text-anchor="middle" fill="#F57C00" font-size="10" font-family="Arial" font-weight="bold">METROTECH</text>
                <text x="200" y="170" text-anchor="middle" fill="#F57C00" font-size="8" font-family="Arial">Koumassi SOPIM</text>
                
                <!-- Points de repère -->
                <circle cx="120" cy="100" r="3" fill="#6B7280"/>
                <text x="125" y="105" fill="#9CA3AF" font-size="7" font-family="Arial">Marché</text>
                
                <circle cx="280" cy="200" r="3" fill="#6B7280"/>
                <text x="285" y="205" fill="#9CA3AF" font-size="7" font-family="Arial">École</text>
              </svg>
            `)}')`
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-3 mx-auto animate-pulse shadow-lg">
              <MapPin className="text-white" size={28} />
            </div>
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white font-semibold text-sm">
                METROTECH INSTRUMENT SARL
              </p>
              <p className="text-white/80 text-xs mt-1">Koumassi SOPIM, Abidjan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium group"
          >
            <MapPin size={16} />
            Voir sur Google Maps
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={getDirections}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium group"
          >
            <Navigation size={16} />
            Obtenir l'itinéraire
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:+22505468685"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Phone size={16} />
            Appeler
          </a>
          
          <a
            href="mailto:mikoustane0@gmail.com"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Mail size={16} />
            Email
          </a>

          <button
            onClick={copyCoordinates}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
            title="Copier les coordonnées GPS"
          >
            <Copy size={16} />
            GPS
          </button>
        </div>

        {/* Bouton Apple Maps pour iOS */}
        <button
          onClick={openInAppleMaps}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <MapPin size={16} />
          Ouvrir dans Apple Maps
        </button>
      </div>

      {/* Informations supplémentaires */}
      <div className="p-4 bg-gray-700/50 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            <strong>📍 Coordonnées GPS:</strong> {coordinates}
          </p>
          <p className="text-gray-400 text-xs">
            Cliquez sur les boutons ci-dessus pour ouvrir dans votre application de cartes préférée
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🚗 Parking disponible</span>
            <span>🏢 Accès PMR</span>
            <span>📞 Accueil 8h-17h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;