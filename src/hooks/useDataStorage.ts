import { useState, useEffect } from 'react';
import { dataStorage } from '../utils/dataStorage';

// Hook personnalisé pour utiliser le stockage de données
export function useDataStorage<T>(section: string, initialValue: T) {
  const [data, setData] = useState<T>(() => {
    const stored = dataStorage.getData(section);
    return stored !== null ? stored : initialValue;
  });

  const updateData = (newData: T | ((prev: T) => T)) => {
    const updatedData = typeof newData === 'function' ? (newData as Function)(data) : newData;
    setData(updatedData);
    dataStorage.saveData(section, updatedData);
  };

  const addItem = (item: any) => {
    if (Array.isArray(data)) {
      const newData = [...data, item] as T;
      setData(newData);
      dataStorage.saveData(section, newData);
    }
  };

  const removeItem = (itemId: string) => {
    if (Array.isArray(data)) {
      const newData = data.filter((item: any) => item.id !== itemId) as T;
      setData(newData);
      dataStorage.saveData(section, newData);
    }
  };

  const updateItem = (itemId: string, updatedItem: any) => {
    if (Array.isArray(data)) {
      const newData = data.map((item: any) => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      ) as T;
      setData(newData);
      dataStorage.saveData(section, newData);
    }
  };

  // Synchroniser avec les changements externes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = dataStorage.getData(section);
      if (stored !== null) {
        setData(stored);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [section]);

  return {
    data,
    setData: updateData,
    addItem,
    removeItem,
    updateItem
  };
}