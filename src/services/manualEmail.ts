// Service d'email manuel sans API externe
export interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface EmailLog {
  id: string;
  status: 'prepared' | 'sent' | 'failed';
  from: string;
  subject: string;
  timestamp: string;
  method: 'mailto' | 'copy' | 'manual';
}

/**
 * Prépare le corps du mail au format texte.
 */
export const prepareEmail = (params: EmailParams): string => {
  return `Bonjour METROTECH INSTRUMENT SARL,

Nouveau message depuis le site web:

Nom: ${params.name}
Email: ${params.email}
Téléphone: ${params.phone || 'Non fourni'}

Objet: ${params.subject}

Message:
${params.message}

---
Message envoyé depuis le site web METROTECH
Date: ${new Date().toLocaleDateString('fr-FR')}
Heure: ${new Date().toLocaleTimeString('fr-FR')}`;
};

/**
 * Génère un lien mailto: pour ouvrir la messagerie avec sujet et corps pré-remplis.
 */
export const generateMailtoLink = (params: EmailParams): string => {
  const subject = encodeURIComponent(`[METROTECH] ${params.subject}`);
  const body = encodeURIComponent(prepareEmail(params));
  return `mailto:mikoustane0@gmail.com?subject=${subject}&body=${body}`;
};

/**
 * Enregistre une action d'envoi d'email dans localStorage.
 * Permet de suivre les emails préparés, envoyés ou copiés.
 */
export const logEmailAction = (
  params: EmailParams,
  method: 'mailto' | 'copy' | 'manual',
  status: 'prepared' | 'sent' | 'failed' = 'prepared'
): void => {
  const emailLog: EmailLog = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status,
    from: params.email,
    subject: params.subject,
    timestamp: new Date().toISOString(),
    method,
  };

  const existingLogs: EmailLog[] = JSON.parse(localStorage.getItem('metrotech_email_logs') || '[]');
  existingLogs.unshift(emailLog);

  // Garde seulement les 100 derniers logs
  if (existingLogs.length > 100) {
    existingLogs.splice(100);
  }

  localStorage.setItem('metrotech_email_logs', JSON.stringify(existingLogs));
};

/**
 * Récupère la liste des logs d'email dans localStorage.
 */
export const getEmailLogs = (): EmailLog[] => {
  const logs = localStorage.getItem('metrotech_email_logs');
  return logs ? JSON.parse(logs) : [];
};

/**
 * Calcule des statistiques basiques sur les logs d'email.
 */
export const getEmailStats = () => {
  const logs = getEmailLogs();
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  return {
    total: logs.length,
    today: logs.filter(log => new Date(log.timestamp).toDateString() === today).length,
    thisMonth: logs.filter(log => new Date(log.timestamp).getMonth() === thisMonth).length,
    thisYear: logs.filter(log => new Date(log.timestamp).getFullYear() === thisYear).length,
    byMethod: {
      mailto: logs.filter(log => log.method === 'mailto').length,
      copy: logs.filter(log => log.method === 'copy').length,
      manual: logs.filter(log => log.method === 'manual').length,
    },
  };
};

/**
 * Génère un message WhatsApp formaté
 */
export const generateWhatsAppMessage = (params: EmailParams): string => {
  return `Bonjour METROTECH,

Nom: ${params.name}
Email: ${params.email}
Téléphone: ${params.phone || 'Non fourni'}

Objet: ${params.subject}

Message: ${params.message}

---
Envoyé depuis le site web METROTECH`;
};

/**
 * Génère un lien WhatsApp
 */
export const generateWhatsAppLink = (params: EmailParams): string => {
  const message = generateWhatsAppMessage(params);
  return `https://wa.me/22505468685?text=${encodeURIComponent(message)}`;
};

/**
 * Sauvegarde un message dans localStorage pour l'admin
 */
export const saveMessageForAdmin = (params: EmailParams): void => {
  const messageData = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    timestamp: new Date().toISOString(),
    status: 'nouveau',
    source: 'site_web'
  };
  
  const existingMessages = JSON.parse(localStorage.getItem('metrotech_messages') || '[]');
  existingMessages.unshift(messageData);
  
  // Garder seulement les 200 derniers messages
  if (existingMessages.length > 200) {
    existingMessages.splice(200);
  }
  
  localStorage.setItem('metrotech_messages', JSON.stringify(existingMessages));
};

/**
 * Récupère les messages pour l'admin
 */
export const getMessagesForAdmin = () => {
  const messages = localStorage.getItem('metrotech_messages');
  return messages ? JSON.parse(messages) : [];
};

/**
 * Marque un message comme lu
 */
export const markMessageAsRead = (messageId: string): void => {
  const messages = getMessagesForAdmin();
  const updatedMessages = messages.map((msg: any) => 
    msg.id === messageId ? { ...msg, status: 'lu', readAt: new Date().toISOString() } : msg
  );
  localStorage.setItem('metrotech_messages', JSON.stringify(updatedMessages));
};

/**
 * Supprime un message
 */
export const deleteMessage = (messageId: string): void => {
  const messages = getMessagesForAdmin();
  const filteredMessages = messages.filter((msg: any) => msg.id !== messageId);
  localStorage.setItem('metrotech_messages', JSON.stringify(filteredMessages));
};

/**
 * Obtient les statistiques des messages
 */
export const getMessageStats = () => {
  const messages = getMessagesForAdmin();
  const today = new Date().toDateString();
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  return {
    total: messages.length,
    nouveaux: messages.filter((msg: any) => msg.status === 'nouveau').length,
    lus: messages.filter((msg: any) => msg.status === 'lu').length,
    aujourdhui: messages.filter((msg: any) => 
      new Date(msg.timestamp).toDateString() === today
    ).length,
    cetteSemaine: messages.filter((msg: any) => 
      new Date(msg.timestamp) >= thisWeek
    ).length
  };
};