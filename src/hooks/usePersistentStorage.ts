import { useState, useEffect } from 'react';
import { persistentStorage } from '../utils/persistentStorage';

// Hook pour utiliser le stockage persistant
export function usePersistentStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = persistentStorage.getItem ? 
        persistentStorage.getItem(key) : 
        localStorage.getItem(`metrotech_${key}`);
      
      if (item) {
        return typeof item === 'string' ? JSON.parse(item) : item;
      }
      return initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (persistentStorage.setItem) {
        persistentStorage.setItem(key, valueToStore);
      } else {
        localStorage.setItem(`metrotech_${key}`, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error);
    }
  };

  // Synchroniser avec les changements externes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `metrotech_${key}` && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Erreur lors de la synchronisation:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

// Hook spécialisé pour les fichiers
export function useFileStorage() {
  const saveFile = async (file: File): Promise<string | null> => {
    try {
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Convertir le fichier en base64
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const fileData = reader.result as string;
          const success = persistentStorage.saveFile(fileId, fileData, file.name, file.type);
          resolve(success ? fileId : null);
        };
        reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du fichier:', error);
      return null;
    }
  };

  const getFile = (fileId: string) => {
    return persistentStorage.getFile(fileId);
  };

  const deleteFile = (fileId: string) => {
    return persistentStorage.deleteFile(fileId);
  };

  const getAllFiles = () => {
    return persistentStorage.getAllFiles();
  };

  return {
    saveFile,
    getFile,
    deleteFile,
    getAllFiles
  };
}

// Hook pour les formulaires
export function useFormStorage() {
  const [forms, setForms] = useState({
    drafts: persistentStorage.getForms(false),
    completed: persistentStorage.getForms(true)
  });

  const saveForm = (formData: any, isCompleted: boolean = false) => {
    const success = persistentStorage.saveForm(formData, isCompleted);
    if (success) {
      setForms({
        drafts: persistentStorage.getForms(false),
        completed: persistentStorage.getForms(true)
      });
    }
    return success;
  };

  const deleteForm = (formId: string, isCompleted: boolean = false) => {
    const success = persistentStorage.deleteForm(formId, isCompleted);
    if (success) {
      setForms({
        drafts: persistentStorage.getForms(false),
        completed: persistentStorage.getForms(true)
      });
    }
    return success;
  };

  return {
    forms,
    saveForm,
    deleteForm
  };
}