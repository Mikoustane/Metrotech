// Système de stockage persistant des données
export class DataStorage {
  private static instance: DataStorage;
  private storageKey = 'metrotech_data';
  
  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): DataStorage {
    if (!DataStorage.instance) {
      DataStorage.instance = new DataStorage();
    }
    return DataStorage.instance;
  }

  private initializeStorage() {
    // Créer la structure de données si elle n'existe pas
    const existingData = this.getAllData();
    if (!existingData) {
      const initialData = {
        forms: {
          drafts: [],
          completed: []
        },
        users: [],
        visits: [],
        news: [],
        connections: [],
        settings: {
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
        },
        logs: {
          emails: [],
          logins: [],
          formCreations: [],
          passwordChanges: []
        },
        lastBackup: null,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.saveAllData(initialData);
    }
  }

  // Récupérer toutes les données
  public getAllData(): any {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return null;
    }
  }

  // Sauvegarder toutes les données
  public saveAllData(data: any): boolean {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      return false;
    }
  }

  // Récupérer une section spécifique
  public getData(section: string): any {
    const allData = this.getAllData();
    return allData ? allData[section] : null;
  }

  // Sauvegarder une section spécifique
  public saveData(section: string, data: any): boolean {
    const allData = this.getAllData();
    if (allData) {
      allData[section] = data;
      return this.saveAllData(allData);
    }
    return false;
  }

  // Ajouter un élément à un tableau
  public addToArray(section: string, item: any): boolean {
    const currentData = this.getData(section) || [];
    currentData.push(item);
    return this.saveData(section, currentData);
  }

  // Supprimer un élément d'un tableau par ID
  public removeFromArray(section: string, itemId: string): boolean {
    const currentData = this.getData(section) || [];
    const filteredData = currentData.filter((item: any) => item.id !== itemId);
    return this.saveData(section, filteredData);
  }

  // Mettre à jour un élément dans un tableau
  public updateInArray(section: string, itemId: string, updatedItem: any): boolean {
    const currentData = this.getData(section) || [];
    const index = currentData.findIndex((item: any) => item.id === itemId);
    if (index !== -1) {
      currentData[index] = { ...currentData[index], ...updatedItem };
      return this.saveData(section, currentData);
    }
    return false;
  }

  // Exporter toutes les données
  public exportData(): string {
    const allData = this.getAllData();
    return JSON.stringify(allData, null, 2);
  }

  // Importer des données
  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      return this.saveAllData(data);
    } catch (error) {
      console.error('Erreur lors de l\'importation des données:', error);
      return false;
    }
  }

  // Créer une sauvegarde
  public createBackup(): string {
    const allData = this.getAllData();
    const backup = {
      ...allData,
      backupDate: new Date().toISOString(),
      backupVersion: allData.version
    };
    
    // Sauvegarder la date de dernière sauvegarde
    allData.lastBackup = new Date().toISOString();
    this.saveAllData(allData);
    
    return JSON.stringify(backup, null, 2);
  }

  // Nettoyer les anciennes données
  public cleanOldData(): boolean {
    const allData = this.getAllData();
    if (!allData) return false;

    const retentionDays = allData.settings?.dataRetention || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Nettoyer les visites anciennes
    if (allData.visits) {
      allData.visits = allData.visits.filter((visit: any) => 
        new Date(visit.timestamp) > cutoffDate
      );
    }

    // Nettoyer les logs anciens
    if (allData.logs) {
      Object.keys(allData.logs).forEach(logType => {
        if (Array.isArray(allData.logs[logType])) {
          allData.logs[logType] = allData.logs[logType].filter((log: any) => 
            new Date(log.timestamp) > cutoffDate
          );
        }
      });
    }

    return this.saveAllData(allData);
  }

  // Obtenir les statistiques de stockage
  public getStorageStats(): any {
    const allData = this.getAllData();
    if (!allData) return null;

    const dataString = JSON.stringify(allData);
    const sizeInBytes = new Blob([dataString]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);

    return {
      totalSize: `${sizeInKB} KB`,
      totalForms: (allData.forms?.drafts?.length || 0) + (allData.forms?.completed?.length || 0),
      totalVisits: allData.visits?.length || 0,
      totalNews: allData.news?.length || 0,
      lastUpdate: allData.updatedAt,
      version: allData.version
    };
  }
}

// Instance singleton
export const dataStorage = DataStorage.getInstance();