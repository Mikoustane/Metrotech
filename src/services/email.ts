import emailjs from 'emailjs-com';

interface EmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const sendEmail = async (params: EmailParams): Promise<void> => {
  try {
    // Vérifier que les variables d'environnement sont configurées
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      throw new Error('Configuration EmailJS manquante. Veuillez configurer les variables d\'environnement.');
    }

    const templateParams = {
      to_name: 'METROTECH INSTRUMENT SARL',
      from_name: params.name,
      from_email: params.email,
      phone: params.phone || 'Non fourni',
      subject: params.subject,
      message: params.message,
      timestamp: new Date().toLocaleString('fr-FR'),
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      userId
    );

    // Logger l'envoi d'email
    const emailLog = {
      status: 'success',
      from: params.email,
      subject: params.subject,
      timestamp: new Date().toISOString(),
      responseStatus: response.status,
      responseText: response.text
    };

    const existingLogs = localStorage.getItem('metrotech_email_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(emailLog);

    // Garder seulement les 50 derniers logs
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }

    localStorage.setItem('metrotech_email_logs', JSON.stringify(logs));

    console.log('Email envoyé avec succès:', response);
  } catch (error) {
    // Logger l'erreur
    const errorLog = {
      status: 'error',
      from: params.email,
      subject: params.subject,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };

    const existingLogs = localStorage.getItem('metrotech_email_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);

    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }

    localStorage.setItem('metrotech_email_logs', JSON.stringify(logs));

    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

export const getEmailLogs = () => {
  const logs = localStorage.getItem('metrotech_email_logs');
  return logs ? JSON.parse(logs) : [];
};