import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  HardDrive,
  FileText,
  Image,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import AnimatedCard from './ui/AnimatedCard';
import FileUploader from './ui/FileUploader';
import { dataStorage } from '../utils/dataStorage';
import { fileManager } from '../utils/fileManager';

const DataManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'backup' | 'files' | 'cleanup'>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = () => {
    setIsProcessing(true);
    try {
      const backupData = dataStorage.createBackup();
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `metrotech-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showMessage('success', 'Sauvegarde exportée avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de l\'exportation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportData = (fileData: string, fileName: string) => {
    setIsProcessing(true);
    try {
      // Extraire le JSON du base64
      const jsonData = atob(fileData.split(',')[1]);
      const success = dataStorage.importData(jsonData);
      
      if (success) {
        showMessage('success', 'Données importées avec succès');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showMessage('error', 'Erreur lors de l\'importation');
      }
    } catch (error) {
      showMessage('error', 'Fichier de sauvegarde invalide');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCleanupData = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir nettoyer les anciennes données ?')) return;
    
    setIsProcessing(true);
    try {
      const dataCleanup = dataStorage.cleanOldData();
      const filesCleanup = fileManager.cleanOldFiles();
      
      showMessage('success', `Nettoyage terminé. ${filesCleanup} fichiers supprimés.`);
    } catch (error) {
      showMessage('error', 'Erreur lors du nettoyage');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetData = () => {
    if (!window.confirm('ATTENTION: Cette action supprimera TOUTES les données. Êtes-vous sûr ?')) return;
    
    setIsProcessing(true);
    try {
      // Sauvegarder les utilisateurs
      const users = dataStorage.getData('users');
      
      // Vider le localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('metrotech_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Réinitialiser le stockage
      dataStorage.saveData('users', users);
      
      showMessage('success', 'Données réinitialisées');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      showMessage('error', 'Erreur lors de la réinitialisation');
    } finally {
      setIsProcessing(false);
    }
  };

  const storageStats = dataStorage.getStorageStats();
  const fileStats = fileManager.getFileStorageStats();

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'backup', label: 'Sauvegarde', icon: Database },
    { id: 'files', label: 'Fichiers', icon: FileText },
    { id: 'cleanup', label: 'Nettoyage', icon: Trash2 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedCard className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Database className="text-blue-400" size={24} />
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Taille totale</p>
                    <p className="text-white text-xl font-bold">{storageStats?.totalSize}</p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-green-400" size={24} />
                  <div>
                    <p className="text-green-400 text-sm font-medium">Formulaires</p>
                    <p className="text-white text-xl font-bold">{storageStats?.totalForms}</p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Image className="text-purple-400" size={24} />
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Fichiers</p>
                    <p className="text-white text-xl font-bold">{fileStats?.totalFiles}</p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="text-orange-400" size={24} />
                  <div>
                    <p className="text-orange-400 text-sm font-medium">Visites</p>
                    <p className="text-white text-xl font-bold">{storageStats?.totalVisits}</p>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Détails du stockage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Données principales</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Formulaires: {storageStats?.totalForms}</li>
                    <li>• Actualités: {storageStats?.totalNews}</li>
                    <li>• Visites: {storageStats?.totalVisits}</li>
                    <li>• Version: {storageStats?.version}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Fichiers stockés</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Total: {fileStats?.totalFiles} fichiers</li>
                    <li>• Taille: {fileStats?.totalSize}</li>
                    <li>• Images: {fileStats?.typeBreakdown?.image || 0}</li>
                    <li>• Documents: {fileStats?.typeBreakdown?.application || 0}</li>
                  </ul>
                </div>
              </div>
            </AnimatedCard>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Exporter les données</h3>
              <p className="text-gray-300 mb-4">
                Créez une sauvegarde complète de toutes vos données (formulaires, actualités, paramètres, etc.)
              </p>
              <button
                onClick={handleExportData}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Download size={18} />
                {isProcessing ? 'Exportation...' : 'Exporter la sauvegarde'}
              </button>
            </AnimatedCard>

            <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Importer les données</h3>
              <p className="text-gray-300 mb-4">
                Restaurez vos données à partir d'un fichier de sauvegarde
              </p>
              <FileUploader
                onFileUpload={handleImportData}
                acceptedTypes="documents"
                className="max-w-md"
              />
            </AnimatedCard>
          </div>
        );

      case 'files':
        return (
          <div className="space-y-6">
            <AnimatedCard className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Gestionnaire de fichiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Statistiques</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Total: {fileStats?.totalFiles} fichiers</li>
                    <li>• Taille: {fileStats?.totalSize}</li>
                    <li>• Images: {fileStats?.typeBreakdown?.image || 0}</li>
                    <li>• Documents: {fileStats?.typeBreakdown?.application || 0}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCleanupData()}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      Nettoyer les anciens fichiers
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        );

      case 'cleanup':
        return (
          <div className="space-y-6">
            <AnimatedCard className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-yellow-400" size={24} />
                <h3 className="text-lg font-semibold text-white">Nettoyage des données</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Supprimez les données anciennes pour libérer de l'espace de stockage.
              </p>
              <button
                onClick={handleCleanupData}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                {isProcessing ? 'Nettoyage...' : 'Nettoyer les anciennes données'}
              </button>
            </AnimatedCard>

            <AnimatedCard className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="text-red-400" size={24} />
                <h3 className="text-lg font-semibold text-white">Réinitialisation complète</h3>
              </div>
              <p className="text-gray-300 mb-4">
                <strong>ATTENTION:</strong> Cette action supprimera TOUTES les données de façon irréversible.
              </p>
              <button
                onClick={handleResetData}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                {isProcessing ? 'Réinitialisation...' : 'Réinitialiser toutes les données'}
              </button>
            </AnimatedCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestionnaire de Données</h1>
          <p className="text-gray-400">Gérez vos données, sauvegardes et fichiers</p>
        </div>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm">{message.text}</span>
          </motion.div>
        )}
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default DataManager;