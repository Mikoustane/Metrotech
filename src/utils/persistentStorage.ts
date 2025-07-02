// Système de stockage persistant pour les fichiers et données
export class PersistentStorage {
  private static instance: PersistentStorage;
  private storagePrefix = 'metrotech_';
  private maxFileSize = 10 * 1024 * 1024; // 10MB par fichier
  private maxTotalStorage = 50 * 1024 * 1024; // 50MB total

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): PersistentStorage {
    if (!PersistentStorage.instance) {
      PersistentStorage.instance = new PersistentStorage();
    }
    return PersistentStorage.instance;
  }

  private initializeStorage() {
    // Créer la structure de base si elle n'existe pas
    if (!this.getItem('initialized')) {
      const initialData = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        lastSync: null,
        files: {},
        forms: {
          drafts: [],
          completed: []
        },
        news: [],
        users: [],
        visits: [],
        connections: [],
        settings: {
          theme: 'dark',
          autoSave: true,
          language: 'fr'
        }
      };

      Object.keys(initialData).forEach(key => {
        this.setItem(key, initialData[key as keyof typeof initialData]);
      });

      this.setItem('initialized', true);
    }
  }

  // Méthodes de base pour localStorage avec préfixe
  private getItem(key: string): any {
    try {
      const item = localStorage.getItem(this.storagePrefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return null;
    }
  }

  private setItem(key: string, value: any): boolean {
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error);
      return false;
    }
  }

  // Gestion des fichiers
  public saveFile(fileId: string, fileData: string, fileName: string, fileType: string): boolean {
    try {
      // Vérifier la taille du fichier
      const fileSize = new Blob([fileData]).size;
      if (fileSize > this.maxFileSize) {
        throw new Error(`Fichier trop volumineux: ${Math.round(fileSize / 1024 / 1024)}MB (max: ${this.maxFileSize / 1024 / 1024}MB)`);
      }

      // Vérifier l'espace total disponible
      const currentStorage = this.getStorageSize();
      if (currentStorage + fileSize > this.maxTotalStorage) {
        throw new Error('Espace de stockage insuffisant');
      }

      const fileInfo = {
        id: fileId,
        name: fileName,
        type: fileType,
        data: fileData,
        size: fileSize,
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };

      const files = this.getItem('files') || {};
      files[fileId] = fileInfo;
      
      return this.setItem('files', files);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      return false;
    }
  }

  public getFile(fileId: string): any {
    const files = this.getItem('files') || {};
    const file = files[fileId];
    
    if (file) {
      // Mettre à jour la date de dernier accès
      file.lastAccessed = new Date().toISOString();
      files[fileId] = file;
      this.setItem('files', files);
    }
    
    return file || null;
  }

  public deleteFile(fileId: string): boolean {
    const files = this.getItem('files') || {};
    delete files[fileId];
    return this.setItem('files', files);
  }

  public getAllFiles(): any[] {
    const files = this.getItem('files') || {};
    return Object.values(files);
  }

  // Gestion des formulaires
  public saveForm(formData: any, isCompleted: boolean = false): boolean {
    const key = isCompleted ? 'completed' : 'drafts';
    const forms = this.getItem('forms') || { drafts: [], completed: [] };
    
    // Vérifier si le formulaire existe déjà
    const existingIndex = forms[key].findIndex((f: any) => f.id === formData.id);
    
    if (existingIndex !== -1) {
      forms[key][existingIndex] = { ...formData, updatedAt: new Date().toISOString() };
    } else {
      forms[key].push({ ...formData, createdAt: new Date().toISOString() });
    }
    
    return this.setItem('forms', forms);
  }

  public getForms(completed: boolean = false): any[] {
    const forms = this.getItem('forms') || { drafts: [], completed: [] };
    return completed ? forms.completed : forms.drafts;
  }

  public deleteForm(formId: string, isCompleted: boolean = false): boolean {
    const key = isCompleted ? 'completed' : 'drafts';
    const forms = this.getItem('forms') || { drafts: [], completed: [] };
    
    forms[key] = forms[key].filter((f: any) => f.id !== formId);
    return this.setItem('forms', forms);
  }

  // Gestion des actualités
  public saveNews(newsData: any): boolean {
    const news = this.getItem('news') || [];
    const existingIndex = news.findIndex((n: any) => n.id === newsData.id);
    
    if (existingIndex !== -1) {
      news[existingIndex] = { ...newsData, updatedAt: new Date().toISOString() };
    } else {
      news.push({ ...newsData, createdAt: new Date().toISOString() });
    }
    
    return this.setItem('news', news);
  }

  public getNews(): any[] {
    return this.getItem('news') || [];
  }

  public deleteNews(newsId: string): boolean {
    const news = this.getItem('news') || [];
    const filteredNews = news.filter((n: any) => n.id !== newsId);
    return this.setItem('news', filteredNews);
  }

  // Synchronisation et sauvegarde
  public createBackup(): string {
    const allData = {
      version: this.getItem('version'),
      timestamp: new Date().toISOString(),
      files: this.getItem('files'),
      forms: this.getItem('forms'),
      news: this.getItem('news'),
      visits: this.getItem('visits'),
      connections: this.getItem('connections'),
      settings: this.getItem('settings')
    };

    return JSON.stringify(allData, null, 2);
  }

  public restoreBackup(backupData: string): boolean {
    try {
      const data = JSON.parse(backupData);
      
      // Valider la structure des données
      if (!data.version || !data.timestamp) {
        throw new Error('Format de sauvegarde invalide');
      }

      // Restaurer chaque section
      Object.keys(data).forEach(key => {
        if (key !== 'version' && key !== 'timestamp') {
          this.setItem(key, data[key]);
        }
      });

      this.setItem('lastSync', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  }

  // Nettoyage et optimisation
  public cleanOldData(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;

    // Nettoyer les fichiers anciens
    const files = this.getItem('files') || {};
    Object.keys(files).forEach(fileId => {
      const file = files[fileId];
      if (new Date(file.lastAccessed) < cutoffDate) {
        delete files[fileId];
        deletedCount++;
      }
    });
    this.setItem('files', files);

    // Nettoyer les visites anciennes
    const visits = this.getItem('visits') || [];
    const filteredVisits = visits.filter((visit: any) => 
      new Date(visit.timestamp) > cutoffDate
    );
    this.setItem('visits', filteredVisits);

    return deletedCount;
  }

  public getStorageSize(): number {
    let totalSize = 0;
    for (let key in localStorage) {
      if (key.startsWith(this.storagePrefix)) {
        totalSize += localStorage[key].length;
      }
    }
    return totalSize;
  }

  public getStorageStats(): any {
    const totalSize = this.getStorageSize();
    const files = this.getAllFiles();
    const forms = this.getItem('forms') || { drafts: [], completed: [] };
    const news = this.getItem('news') || [];

    return {
      totalSize: `${Math.round(totalSize / 1024)} KB`,
      totalFiles: files.length,
      totalForms: forms.drafts.length + forms.completed.length,
      totalNews: news.length,
      usagePercentage: Math.round((totalSize / this.maxTotalStorage) * 100),
      lastSync: this.getItem('lastSync')
    };
  }

  // Méthodes de synchronisation cross-device (simulation)
  public syncToCloud(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulation d'une synchronisation cloud
      setTimeout(() => {
        this.setItem('lastSync', new Date().toISOString());
        resolve(true);
      }, 1000);
    });
  }

  public syncFromCloud(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulation de récupération depuis le cloud
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
}

// Instance singleton
export const persistentStorage = PersistentStorage.getInstance();