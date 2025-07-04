import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Copy, Mail, Phone, MessageSquare } from 'lucide-react';
import Button from './Button';
import { prepareEmail, generateMailtoLink, logEmailAction } from '../../services/manualEmail';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formState.subject.trim()) {
      newErrors.subject = "L'objet est requis";
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Le message est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('submitting');
    
    // Simuler un délai de traitement
    setTimeout(() => {
      setShowEmailOptions(true);
      setStatus('success');
      
      // Sauvegarder le message dans localStorage pour l'admin
      const messageData = {
        id: `msg_${Date.now()}`,
        ...formState,
        timestamp: new Date().toISOString(),
        status: 'nouveau'
      };
      
      const existingMessages = JSON.parse(localStorage.getItem('metrotech_messages') || '[]');
      existingMessages.unshift(messageData);
      localStorage.setItem('metrotech_messages', JSON.stringify(existingMessages));
      
      // Reset après 8 secondes
      setTimeout(() => {
        setStatus('idle');
        setShowEmailOptions(false);
        setFormState({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 8000);
    }, 1500);
  };

  const openEmailClient = () => {
    const mailtoLink = generateMailtoLink(formState);
    logEmailAction(formState, 'mailto');
    window.open(mailtoLink, '_blank');
  };

  const copyToClipboard = async () => {
    const emailContent = `Email: mikoustane0@gmail.com
Objet: [METROTECH] ${formState.subject}

${prepareEmail(formState)}`;
    
    try {
      await navigator.clipboard.writeText(emailContent);
      logEmailAction(formState, 'copy');
      alert('✅ Contenu copié dans le presse-papiers !');
    } catch (err) {
      // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      logEmailAction(formState, 'copy');
      alert('✅ Contenu copié dans le presse-papiers !');
    }
  };

  const openWhatsApp = () => {
    const whatsappMessage = `Bonjour METROTECH,

Nom: ${formState.name}
Email: ${formState.email}
Téléphone: ${formState.phone || 'Non fourni'}

Objet: ${formState.subject}

Message: ${formState.message}`;

    const whatsappUrl = `https://wa.me/22505468685?text=${encodeURIComponent(whatsappMessage)}`;
    logEmailAction(formState, 'manual');
    window.open(whatsappUrl, '_blank');
  };

  const callPhone = () => {
    logEmailAction(formState, 'manual');
    window.open('tel:+22505468685', '_self');
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header avec logo */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-center">
        <img 
          src="https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png" 
          alt="Logo METROTECH" 
          className="h-12 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-white">Contactez METROTECH</h2>
        <p className="text-white/90 mt-2">Nous sommes là pour vous accompagner</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {status === 'success' && showEmailOptions ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">
              Message préparé avec succès !
            </h3>
            <p className="text-gray-300 mb-6">
              Choisissez votre méthode de contact préférée :
            </p>
            
            <div className="space-y-4 w-full max-w-md">
              <Button 
                onClick={openEmailClient}
                className="w-full bg-blue-600 hover:bg-blue-700"
                icon={<Mail size={18} />}
              >
                Ouvrir dans votre client email
              </Button>
              
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                icon={<Copy size={18} />}
              >
                Copier le message
              </Button>

              <Button 
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700"
                icon={<MessageSquare size={18} />}
              >
                Envoyer via WhatsApp
              </Button>
              
              <Button 
                onClick={callPhone}
                className="w-full bg-orange-600 hover:bg-orange-700"
                icon={<Phone size={18} />}
              >
                Appeler directement
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg w-full max-w-md">
              <p className="text-sm text-gray-300 text-center">
                <strong>📧 Email:</strong> mikoustane0@gmail.com<br />
                <strong>📞 Téléphone:</strong> +225 05 46 86 85 71<br />
                <strong>💬 WhatsApp:</strong> +225 05 46 86 85 71
              </p>
            </div>
          </motion.div>
        ) : status === 'error' ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Une erreur est survenue
            </h3>
            <p className="text-gray-300 mb-4">
              Veuillez réessayer ou nous contacter directement.
            </p>
            <Button onClick={() => setStatus('idle')}>
              Réessayer
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  } bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="Votre nom complet"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-600 focus:ring-blue-500'
                  } bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="votre.email@exemple.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="+225 XX XX XX XX XX"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                Objet *
              </label>
              <select
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.subject 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                } bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors`}
              >
                <option value="">Sélectionnez un objet</option>
                <option value="Demande de devis - Étalonnage">Demande de devis - Étalonnage</option>
                <option value="Demande de devis - Vérification">Demande de devis - Vérification</option>
                <option value="Demande de devis - Réparation">Demande de devis - Réparation</option>
                <option value="Information sur vos services">Information sur vos services</option>
                <option value="Support technique">Support technique</option>
                <option value="Partenariat commercial">Partenariat commercial</option>
                <option value="Autre demande">Autre demande</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.message 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-600 focus:ring-blue-500'
                } bg-gray-700 text-white focus:outline-none focus:ring-2 transition-colors resize-none`}
                placeholder="Décrivez votre demande en détail..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={status === 'submitting'}
              icon={<Send size={18} />}
              iconPosition="right"
            >
              {status === 'submitting' ? 'Préparation...' : 'Préparer le message'}
            </Button>
            
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm text-center">
                💡 Votre message sera préparé pour envoi via votre méthode préférée (email, WhatsApp, téléphone)
              </p>
            </div>

            {/* Contact rapide */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center mb-4">Ou contactez-nous directement :</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+22505468685"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Phone size={16} />
                  +225 05 46 86 85 71
                </a>
                <a
                  href="mailto:mikoustane0@gmail.com"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Mail size={16} />
                  mikoustane0@gmail.com
                </a>
                <a
                  href="https://wa.me/22505468685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageSquare size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </>
        )}
      </form>
    </motion.div>
  );
};

export default ContactForm;