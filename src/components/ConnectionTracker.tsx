import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Monitor, 
  Calendar, 
  MapPin, 
  Clock,
  Smartphone,
  Laptop,
  Tablet,
  RefreshCw
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';

interface ConnectionData {
  id: string;
  userId: string;
  userAgent: string;
  language: string;
  platform: string;
  timezone: string;
  timestamp: Date;
  country: string;
  browser: string;
  device: string;
  ip: string;
}

const ConnectionTracker: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [currentConnection, setCurrentConnection] = useState<ConnectionData | null>(null);

  useEffect(() => {
    // Charger les connexions existantes
    loadConnections();
    
    // Enregistrer la connexion actuelle
    recordCurrentConnection();
  }, []);

  const loadConnections = () => {
    const stored = localStorage.getItem('metrotech_connections');
    if (stored) {
      const parsed = JSON.parse(stored);
      setConnections(parsed.map((conn: any) => ({
        ...conn,
        timestamp: new Date(conn.timestamp)
      })));
    }
  };

  const recordCurrentConnection = async () => {
    try {
      // Obtenir l'IP publique
      let publicIP = 'Non disponible';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        publicIP = ipData.ip;
      } catch (error) {
        console.warn('Impossible d\'obtenir l\'IP publique:', error);
      }

      // Détecter le navigateur
      const detectBrowser = (userAgent: string): string => {
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
        if (userAgent.includes('Edg')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        return 'Autre';
      };

      // Détecter le type d'appareil
      const detectDevice = (userAgent: string): string => {
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
          if (/iPad/.test(userAgent)) return 'Tablette';
          return 'Mobile';
        }
        return 'Ordinateur';
      };

      // Obtenir le pays approximatif via timezone
      const getCountryFromTimezone = (timezone: string): string => {
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

      const connectionData: ConnectionData = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: JSON.parse(localStorage.getItem('metrotech_user') || '{}').id || 'unknown',
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date(),
        country: getCountryFromTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
        browser: detectBrowser(navigator.userAgent),
        device: detectDevice(navigator.userAgent),
        ip: publicIP
      };

      setCurrentConnection(connectionData);

      // Sauvegarder dans localStorage
      const existingConnections = JSON.parse(localStorage.getItem('metrotech_connections') || '[]');
      const updatedConnections = [connectionData, ...existingConnections].slice(0, 100); // Garder les 100 dernières
      localStorage.setItem('metrotech_connections', JSON.stringify(updatedConnections));
      setConnections(updatedConnections);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la connexion:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobile': return <Smartphone size={20} className="text-blue-400" />;
      case 'Tablette': return <Tablet size={20} className="text-green-400" />;
      default: return <Laptop size={20} className="text-purple-400" />;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'Côte d\'Ivoire': '🇨🇮',
      'Ghana': '🇬🇭',
      'Nigeria': '🇳🇬',
      'Sénégal': '🇸🇳',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'France': '🇫🇷',
      'Royaume-Uni': '🇬🇧',
      'États-Unis': '🇺🇸',
      'Japon': '🇯🇵',
      'Chine': '🇨🇳'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Suivi des Connexions</h1>
          <p className="text-gray-400">Informations détaillées sur les connexions utilisateur</p>
        </div>
        <button
          onClick={() => {
            loadConnections();
            recordCurrentConnection();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      {/* Connexion actuelle */}
      {currentConnection && (
        <AnimatedCard delay={0.1} className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Connexion Actuelle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Globe className="text-green-400" size={20} />
              <div>
                <p className="text-gray-400 text-sm">Adresse IP</p>
                <p className="text-white font-medium">{currentConnection.ip}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">{getCountryFlag(currentConnection.country)}</span>
              <div>
                <p className="text-gray-400 text-sm">Pays</p>
                <p className="text-white font-medium">{currentConnection.country}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getDeviceIcon(currentConnection.device)}
              <div>
                <p className="text-gray-400 text-sm">Appareil</p>
                <p className="text-white font-medium">{currentConnection.device}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-orange-400" size={20} />
              <div>
                <p className="text-gray-400 text-sm">Connexion</p>
                <p className="text-white font-medium">{formatDate(currentConnection.timestamp)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">Informations techniques :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Navigateur :</span>
                <span className="text-white ml-2">{currentConnection.browser}</span>
              </div>
              <div>
                <span className="text-gray-400">Plateforme :</span>
                <span className="text-white ml-2">{currentConnection.platform}</span>
              </div>
              <div>
                <span className="text-gray-400">Langue :</span>
                <span className="text-white ml-2">{currentConnection.language}</span>
              </div>
              <div>
                <span className="text-gray-400">Fuseau horaire :</span>
                <span className="text-white ml-2">{currentConnection.timezone}</span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Historique des connexions */}
      <AnimatedCard delay={0.2} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-purple-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Historique des Connexions</h2>
          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
            {connections.length} connexion(s)
          </span>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {connections.length > 0 ? (
            connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getCountryFlag(connection.country)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{connection.ip}</p>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                        {connection.browser}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{connection.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getDeviceIcon(connection.device)}
                  <div className="text-right">
                    <p className="text-white text-sm">{formatDate(connection.timestamp)}</p>
                    <p className="text-gray-400 text-xs">{connection.timezone}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Globe className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">Aucune connexion enregistrée</p>
            </div>
          )}
        </div>
      </AnimatedCard>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard delay={0.3} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Pays les plus fréquents</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(
              connections.reduce((acc, conn) => {
                acc[conn.country] = (acc[conn.country] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getCountryFlag(country)}</span>
                    <span className="text-gray-300 text-sm">{country}</span>
                  </div>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="text-green-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Navigateurs</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(
              connections.reduce((acc, conn) => {
                acc[conn.browser] = (acc[conn.browser] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([browser, count]) => (
                <div key={browser} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{browser}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.5} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-purple-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Types d'appareils</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(
              connections.reduce((acc, conn) => {
                acc[conn.device] = (acc[conn.device] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device)}
                    <span className="text-gray-300 text-sm">{device}</span>
                  </div>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default ConnectionTracker;