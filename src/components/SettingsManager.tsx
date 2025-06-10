import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Save, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  Shield,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  formCompletion: boolean;
  autoSave: boolean;
  systemAlerts: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number; // en minutes
  notifications: NotificationSettings;
  dataRetention: number; // en jours
  backupEnabled: boolean;
  language: 'fr' | 'en';
}

const SettingsManager: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useLocalStorage<AppSettings>('metrotech_settings', {
    theme: 'dark',
    autoSave: true,
    autoSaveInterval: 5,
    notifications: {
      enabled: true,
      sound: true,
      formCompletion: true,
      autoSave: true,
      systemAlerts: true
    },
    dataRetention: 30,
    backupEnabled: true,
    language: 'fr'
  });

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  useEffect(() => {
    // Charger la dernière sauvegarde
    const backup = localStorage.getItem('metrotech_last_backup');
    if (backup) {
      setLastBackup(new Date(backup));
    }

    // Charger les notifications
    const storedNotifications = localStorage.getItem('metrotech_notifications');
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotifications(parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })));
    }
  }, []);

  const addNotification = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      type,
      message,
      timestamp: new Date()
    };

    const updatedNotifications = [newNotification, ...notifications].slice(0, 50);
    setNotifications(updatedNotifications);
    localStorage.setItem('metrotech_notifications', JSON.stringify(updatedNotifications));

    // Jouer un son si activé
    if (settings.notifications.sound) {
      // Créer un son simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = type === 'error' ? 300 : 600;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const handleSettingsChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    addNotification('success', `Paramètre "${key}" mis à jour`);
  };

  const handleNotificationSettingsChange = (key: keyof NotificationSettings, value: boolean) => {
    const newNotifications = { ...settings.notifications, [key]: value };
    const newSettings = { ...settings, notifications: newNotifications };
    setSettings(newSettings);
    addNotification('info', `Notification "${key}" ${value ? 'activée' : 'désactivée'}`);
  };

  const exportData = () => {
    try {
      const data = {
        settings,
        forms: localStorage.getItem('metrotech_drafts'),
        completed: localStorage.getItem('metrotech_completed'),
        news: localStorage.getItem('metrotech_news'),
        connections: localStorage.getItem('metrotech_connections'),
        notifications: localStorage.getItem('metrotech_notifications'),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `metrotech-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastBackup(new Date());
      localStorage.setItem('metrotech_last_backup', new Date().toISOString());
      addNotification('success', 'Sauvegarde exportée avec succès');
    } catch (error) {
      addNotification('error', 'Erreur lors de l\'exportation');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.settings) setSettings(data.settings);
        if (data.forms) localStorage.setItem('metrotech_drafts', data.forms);
        if (data.completed) localStorage.setItem('metrotech_completed', data.completed);
        if (data.news) localStorage.setItem('metrotech_news', data.news);
        if (data.connections) localStorage.setItem('metrotech_connections', data.connections);
        if (data.notifications) localStorage.setItem('metrotech_notifications', data.notifications);

        addNotification('success', 'Données importées avec succès');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        addNotification('error', 'Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      const keysToKeep = ['metrotech_user', 'metrotech_users'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (key.startsWith('metrotech_') && !keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      addNotification('warning', 'Toutes les données ont été effacées');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      default: return <Bell size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-gray-400">Configuration et préférences de l'application</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Exporter
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
            <Upload size={18} />
            Importer
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <AnimatedCard delay={0.1} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-blue-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Paramètres Généraux</h2>
          </div>

          <div className="space-y-6">
            {/* Thème */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Thème</label>
              <div className="flex gap-3">
                {[
                  { value: 'light', icon: Sun, label: 'Clair' },
                  { value: 'dark', icon: Moon, label: 'Sombre' },
                  { value: 'auto', icon: Settings, label: 'Auto' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => handleSettingsChange('theme', value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      settings.theme === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sauvegarde automatique */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">Sauvegarde automatique</label>
                <button
                  onClick={() => handleSettingsChange('autoSave', !settings.autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              {settings.autoSave && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    Intervalle (minutes): {settings.autoSaveInterval}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={settings.autoSaveInterval}
                    onChange={(e) => handleSettingsChange('autoSaveInterval', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Rétention des données */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rétention des données (jours): {settings.dataRetention}
              </label>
              <input
                type="range"
                min="7"
                max="365"
                value={settings.dataRetention}
                onChange={(e) => handleSettingsChange('dataRetention', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </AnimatedCard>

        {/* Notifications */}
        <AnimatedCard delay={0.2} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-green-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {key === 'sound' ? (
                    value ? <Volume2 size={16} className="text-blue-400" /> : <VolumeX size={16} className="text-gray-400" />
                  ) : (
                    <Bell size={16} className={value ? 'text-green-400' : 'text-gray-400'} />
                  )}
                  <label className="text-sm text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                </div>
                <button
                  onClick={() => handleNotificationSettingsChange(key as keyof NotificationSettings, !value)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    value ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Sauvegarde et sécurité */}
        <AnimatedCard delay={0.3} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-purple-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Sauvegarde et Sécurité</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Dernière sauvegarde</p>
                <p className="text-gray-400 text-sm">
                  {lastBackup ? lastBackup.toLocaleDateString('fr-FR') : 'Aucune sauvegarde'}
                </p>
              </div>
              <Clock className="text-blue-400" size={20} />
            </div>

            <button
              onClick={exportData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save size={18} />
              Créer une sauvegarde
            </button>

            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Effacer toutes les données
            </button>
          </div>
        </AnimatedCard>

        {/* Notifications récentes */}
        <AnimatedCard delay={0.4} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-orange-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Notifications Récentes</h2>
            <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-sm">
              {notifications.length}
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-white text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs">
                      {notification.timestamp.toLocaleString('fr-FR')}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">Aucune notification</p>
              </div>
            )}
          </div>
        </AnimatedCard>
      </div>

      {/* Informations système */}
      <AnimatedCard delay={0.5} className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Informations Système</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Version de l'application</p>
            <p className="text-white font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Utilisateur connecté</p>
            <p className="text-white font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Stockage utilisé</p>
            <p className="text-white font-medium">
              {Math.round(JSON.stringify(localStorage).length / 1024)} KB
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SettingsManager;