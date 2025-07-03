import React from 'react';
import { MapPin, Navigation, Phone, Mail } from 'lucide-react';

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

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      {/* Header avec informations */}
      <div className="p-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="text-white" size={24} />
          <h3 className="text-xl font-semibold text-white">Notre Localisation</h3>
        </div>
        <p className="text-white/90 text-sm">{address}</p>
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
                </defs>
                <rect width="100%" height="100%" fill="#1f2937"/>
                <rect width="100%" height="100%" fill="url(#grid)"/>
                <circle cx="200" cy="150" r="8" fill="#F57C00"/>
                <circle cx="200" cy="150" r="20" fill="none" stroke="#F57C00" stroke-width="2" opacity="0.5"/>
                <text x="200" y="140" text-anchor="middle" fill="#F57C00" font-size="12" font-family="Arial">METROTECH</text>
              </svg>
            `)}')`
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-2 mx-auto animate-pulse">
              <MapPin className="text-white" size={24} />
            </div>
            <p className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded">
              METROTECH INSTRUMENT SARL
            </p>
            <p className="text-white/80 text-xs mt-1">Koumassi SOPIM</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <MapPin size={16} />
            Voir sur Google Maps
          </button>
          
          <button
            onClick={getDirections}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Navigation size={16} />
            Obtenir l'itinéraire
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            Envoyer un email
          </a>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="p-4 bg-gray-700/50 border-t border-gray-600">
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            <strong>Coordonnées GPS:</strong> {coordinates}
          </p>
          <p className="text-gray-400 text-xs">
            Cliquez sur les boutons ci-dessus pour ouvrir dans votre application de cartes préférée
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;