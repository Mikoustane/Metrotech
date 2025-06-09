import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import GoogleMapComponent from '../components/maps/GoogleMap';
import ContactForm from '../components/ui/ContactForm';
import SectionHeading from '../components/ui/SectionHeading';

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

  return (
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
              </div>

              {/* Map */}
              <div className="mt-12">
                <GoogleMapComponent />
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;