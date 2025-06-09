import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import { sendEmail } from '../../services/email';

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
    
    try {
      await sendEmail(formState);
      setStatus('success');
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-xl shadow-lg p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {status === 'success' ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Message envoyé avec succès !
          </h3>
          <p className="text-gray-300">
            Nous vous répondrons dans les plus brefs délais.
          </p>
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
                } bg-gray-700 text-white focus:outline-none focus:ring-2`}
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
                } bg-gray-700 text-white focus:outline-none focus:ring-2`}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
              Objet *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formState.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.subject 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-600 focus:ring-blue-500'
              } bg-gray-700 text-white focus:outline-none focus:ring-2`}
            />
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
              } bg-gray-700 text-white focus:outline-none focus:ring-2`}
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
            {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer le message'}
          </Button>
        </>
      )}
    </motion.form>
  );
};

export default ContactForm;