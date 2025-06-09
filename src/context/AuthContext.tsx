import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { USERS } from '../data/users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('metrotech_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Vérifier que l'utilisateur existe toujours dans la base
        const currentUser = USERS.find(u => u.id === parsedUser.id);
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Utilisateur supprimé, déconnecter
          localStorage.removeItem('metrotech_user');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('metrotech_user');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Récupérer les utilisateurs mis à jour (incluant les changements de mot de passe)
    const storedUsers = localStorage.getItem('metrotech_users');
    const currentUsers = storedUsers ? JSON.parse(storedUsers) : USERS;
    
    const foundUser = currentUsers.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('metrotech_user', JSON.stringify(foundUser));
      
      // Logger la connexion
      const loginLog = {
        userId: foundUser.id,
        email: foundUser.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      const existingLogs = localStorage.getItem('metrotech_login_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(loginLog);
      
      // Garder seulement les 100 derniers logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('metrotech_login_logs', JSON.stringify(logs));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (user) {
      // Logger la déconnexion
      const logoutLog = {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        action: 'logout'
      };
      
      const existingLogs = localStorage.getItem('metrotech_logout_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logoutLog);
      
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('metrotech_logout_logs', JSON.stringify(logs));
    }
    
    setUser(null);
    localStorage.removeItem('metrotech_user');
    
    // Sauvegarder automatiquement les formulaires en cours
    const drafts = localStorage.getItem('metrotech_drafts');
    if (drafts) {
      console.log('Sauvegarde automatique effectuée lors de la déconnexion');
      
      // Créer un backup avec timestamp
      const backup = {
        drafts: JSON.parse(drafts),
        timestamp: new Date().toISOString(),
        userId: user?.id
      };
      
      const existingBackups = localStorage.getItem('metrotech_auto_backups');
      const backups = existingBackups ? JSON.parse(existingBackups) : [];
      backups.push(backup);
      
      // Garder seulement les 10 derniers backups
      if (backups.length > 10) {
        backups.splice(0, backups.length - 10);
      }
      
      localStorage.setItem('metrotech_auto_backups', JSON.stringify(backups));
    }
  };

  const updateUserPassword = (userId: string, newPassword: string): boolean => {
    try {
      const storedUsers = localStorage.getItem('metrotech_users');
      const currentUsers = storedUsers ? JSON.parse(storedUsers) : [...USERS];
      
      const userIndex = currentUsers.findIndex((u: User) => u.id === userId);
      if (userIndex === -1) return false;
      
      currentUsers[userIndex].password = newPassword;
      localStorage.setItem('metrotech_users', JSON.stringify(currentUsers));
      
      // Logger le changement de mot de passe
      const passwordChangeLog = {
        targetUserId: userId,
        changedBy: user?.id,
        timestamp: new Date().toISOString()
      };
      
      const existingLogs = localStorage.getItem('metrotech_password_changes');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(passwordChangeLog);
      
      localStorage.setItem('metrotech_password_changes', JSON.stringify(logs));
      
      return true;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUserPassword,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};