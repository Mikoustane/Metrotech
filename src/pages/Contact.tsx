import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import SimpleMap from '../components/maps/SimpleMap';
import ContactForm from '../components/ui/ContactForm';
import SectionHeading from '../components/ui/SectionHeading';
import SEOHelmet from '../components/SEOHelmet';

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, children }) => {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1 p-3 rounded-lg bg-blue-900/30 text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <div className="text-gray-300">{children}</div>
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const { t } = useTranslation();

  const quickActions = [
    {
      title: "Appel direct",
      description: "Contactez-nous immédiatement",
      action: () => window.open('tel:+22505468685', '_self'),
      icon: <Phone size={24} />,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Email direct",
      description: "Envoyez-nous un email",
      action: () => window.open('mailto:mikoustane0@gmail.com', '_blank'),
      icon: <Mail size={24} />,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "WhatsApp",
      description: "Chattez avec nous",
      action: () => window.open('https://wa.me/22505468685', '_blank'),
      icon: <MessageCircle size={24} />,
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Contact - METROTECH INSTRUMENT SARL | Devis Métrologie Abidjan Côte d'Ivoire"
        description="Contactez METROTECH INSTRUMENT SARL à Abidjan pour vos besoins en métrologie. Devis gratuit, étalonnage, vérification. Koumassi SOPIM, +225 05 46 86 85 71"
        keywords="contact METROTECH, devis métrologie, Abidjan, Koumassi SOPIM, téléphone, email, adresse"
        url="https://metrotech-ci.com/contact"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contactez METROTECH
              </h1>
              <p className="text-xl text-gray-200">
                Notre équipe est à votre disposition pour répondre à toutes vos questions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Actions rapides */}
        <section className="py-12 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-4">
                    {action.icon}
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Contact Information */}
              <div className="w-full lg:w-1/3">
                <SectionHeading 
                  title="Nos Coordonnées"
                  subtitle="Plusieurs moyens de nous contacter"
                />
                
                <div className="space-y-8 mt-8">
                  <ContactInfo icon={<MapPin size={24} />} title="Notre Adresse">
                    <address className="not-italic">
                      Koumassi SOPIM<br />
                      Abidjan, Côte d'Ivoire
                    </address>
                  </ContactInfo>
                  
                  <ContactInfo icon={<Phone size={24} />} title="Téléphones">
                    <div className="space-y-2">
                      <a href="tel:+22505468685" className="block hover:text-blue-400 transition-colors">
                        +225 05 46 86 85 71
                      </a>
                      <a href="tel:+22507090953" className="block hover:text-blue-400 transition-colors">
                        +225 07 09 09 53 54
                      </a>
                    </div>
                  </ContactInfo>
                  
                  <ContactInfo icon={<Mail size={24} />} title="Email">
                    <a href="mailto:mikoustane0@gmail.com" className="hover:text-blue-400 transition-colors">
                      mikoustane0@gmail.com
                    </a>
                  </ContactInfo>

                  <ContactInfo icon={<Clock size={24} />} title="Horaires">
                    <div className="space-y-1">
                      <p>Lundi - Vendredi: 8h00 - 17h00</p>
                      <p>Samedi: 8h00 - 12h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </ContactInfo>
                </div>

                {/* Map */}
                <div className="mt-12">
                  <SimpleMap />
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="w-full lg:w-2/3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Section informations supplémentaires */}
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-8">Informations Pratiques</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Devis Gratuit</h3>
                  <p className="text-gray-300">
                    Nous proposons des devis gratuits et détaillés pour tous nos services de métrologie. 
                    Contactez-nous avec vos besoins spécifiques.
                  </p>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Intervention Rapide</h3>
                  <p className="text-gray-300">
                    Notre équipe peut intervenir rapidement sur site à Abidjan et dans toute la Côte d'Ivoire 
                    pour vos urgences de métrologie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Contact;