// Gestionnaire de fichiers pour images et PDF
export class FileManager {
  private static instance: FileManager;
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private allowedDocTypes = ['application/pdf', 'text/plain', 'application/msword'];

  private constructor() {}

  public static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  // Convertir un fichier en base64
  public async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.size > this.maxFileSize) {
        reject(new Error('Fichier trop volumineux (max 5MB)'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }

  // Valider un fichier image
  public validateImage(file: File): { valid: boolean; error?: string } {
    if (!this.allowedImageTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.' };
    }

    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'Fichier trop volumineux (max 5MB)' };
    }

    return { valid: true };
  }

  // Valider un fichier document
  public validateDocument(file: File): { valid: boolean; error?: string } {
    if (!this.allowedDocTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non supporté. Utilisez PDF, TXT ou DOC.' };
    }

    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'Fichier trop volumineux (max 5MB)' };
    }

    return { valid: true };
  }

  // Redimensionner une image
  public async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en base64
        const resizedBase64 = canvas.toDataURL(file.type, 0.8);
        resolve(resizedBase64);
      };

      img.onerror = () => reject(new Error('Erreur lors du redimensionnement'));

      // Charger l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Sauvegarder un fichier dans le stockage local
  public saveFile(fileId: string, fileData: string, fileName: string, fileType: string): boolean {
    try {
      const fileInfo = {
        id: fileId,
        name: fileName,
        type: fileType,
        data: fileData,
        size: new Blob([fileData]).size,
        createdAt: new Date().toISOString()
      };

      const existingFiles = this.getStoredFiles();
      existingFiles[fileId] = fileInfo;
      
      localStorage.setItem('metrotech_files', JSON.stringify(existingFiles));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      return false;
    }
  }

  // Récupérer un fichier du stockage local
  public getFile(fileId: string): any {
    const files = this.getStoredFiles();
    return files[fileId] || null;
  }

  // Récupérer tous les fichiers stockés
  public getStoredFiles(): any {
    try {
      const files = localStorage.getItem('metrotech_files');
      return files ? JSON.parse(files) : {};
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      return {};
    }
  }

  // Supprimer un fichier
  public deleteFile(fileId: string): boolean {
    try {
      const files = this.getStoredFiles();
      delete files[fileId];
      localStorage.setItem('metrotech_files', JSON.stringify(files));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      return false;
    }
  }

  // Nettoyer les fichiers anciens
  public cleanOldFiles(daysOld: number = 30): number {
    const files = this.getStoredFiles();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;
    Object.keys(files).forEach(fileId => {
      const file = files[fileId];
      if (new Date(file.createdAt) < cutoffDate) {
        delete files[fileId];
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      localStorage.setItem('metrotech_files', JSON.stringify(files));
    }

    return deletedCount;
  }

  // Obtenir les statistiques de stockage des fichiers
  public getFileStorageStats(): any {
    const files = this.getStoredFiles();
    const fileArray = Object.values(files);
    
    const totalSize = fileArray.reduce((sum: number, file: any) => sum + (file.size || 0), 0);
    const totalSizeKB = Math.round(totalSize / 1024);
    
    const typeStats = fileArray.reduce((stats: any, file: any) => {
      const type = file.type.split('/')[0]; // 'image', 'application', etc.
      stats[type] = (stats[type] || 0) + 1;
      return stats;
    }, {});

    return {
      totalFiles: fileArray.length,
      totalSize: `${totalSizeKB} KB`,
      typeBreakdown: typeStats,
      oldestFile: fileArray.length > 0 ? 
        Math.min(...fileArray.map((f: any) => new Date(f.createdAt).getTime())) : null
    };
  }

  // Télécharger un fichier
  public downloadFile(fileId: string): boolean {
    const file = this.getFile(fileId);
    if (!file) return false;

    try {
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      return false;
    }
  }
}

// Instance singleton
export const fileManager = FileManager.getInstance();