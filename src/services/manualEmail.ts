// Service d'email manuel sans API externe
interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface EmailLog {
  id: string;
  status: 'prepared' | 'sent' | 'failed';
  from: string;
  subject: string;
  timestamp: string;
  method: 'mailto' | 'copy' | 'manual';
}

export const prepareEmail = (params: EmailParams): string => {
  const emailBody = `Bonjour METROTECH INSTRUMENT SARL,

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

  return emailBody;
};

export const generateMailtoLink = (params: EmailParams): string => {
  const subject = encodeURIComponent(`[METROTECH] ${params.subject}`);
  const body = encodeURIComponent(prepareEmail(params));
  return `mailto:mikoustane0@gmail.com?subject=${subject}&body=${body}`;
};

export const logEmailAction = (params: EmailParams, method: 'mailto' | 'copy' | 'manual'): void => {
  const emailLog: EmailLog = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'prepared',
    from: params.email,
    subject: params.subject,
    timestamp: new Date().toISOString(),
    method
  };

  // Sauvegarder dans localStorage pour l'admin
  const existingLogs = JSON.parse(localStorage.getItem('metrotech_email_logs') || '[]');
  existingLogs.unshift(emailLog);
  
  // Garder seulement les 100 derniers logs
  if (existingLogs.length > 100) {
    existingLogs.splice(100);
  }
  
  localStorage.setItem('metrotech_email_logs', JSON.stringify(existingLogs));
};

export const getEmailLogs = (): EmailLog[] => {
  const logs = localStorage.getItem('metrotech_email_logs');
  return logs ? JSON.parse(logs) : [];
};

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
      manual: logs.filter(log => log.method === 'manual').length
    }
  };
};