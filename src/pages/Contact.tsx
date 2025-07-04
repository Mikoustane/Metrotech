import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
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
      description: "Appelez-nous maintenant",
      action: () => window.open('tel:+22505468685', '_self'),
      icon: <Phone size={24} />,
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "WhatsApp",
      description: "Chattez avec nous",
      action: () => window.open('https://wa.me/22505468685', '_blank'),
      icon: <MessageSquare size={24} />,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Email direct",
      description: "Envoyez-nous un email",
      action: () => window.open('mailto:mikoustane0@gmail.com', '_blank'),
      icon: <Mail size={24} />,
      color: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <>
      <SEOHelmet 
        title="Contact - METROTECH Devis Métrologie Abidjan"
        description="Contactez METROTECH INSTRUMENT SARL à Abidjan pour vos besoins en métrologie. Devis gratuit, étalonnage, vérification. Koumassi SOPIM."
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
              <p className="text-xl text-gray-200 mb-8">
                Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets de métrologie
              </p>
              
              {/* Actions rapides */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </motion.button>
                ))}
              </div>
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

                  <ContactInfo icon={<Clock size={24} />} title="Horaires d'ouverture">
                    <div className="space-y-1 text-sm">
                      <p><strong>Lundi - Vendredi:</strong> 8h00 - 17h00</p>
                      <p><strong>Samedi:</strong> 8h00 - 12h00</p>
                      <p><strong>Dimanche:</strong> Fermé</p>
                      <p className="text-green-400 mt-2">📞 Urgences: 24h/7j</p>
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

        {/* FAQ Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              title="Questions Fréquentes"
              subtitle="Trouvez rapidement les réponses à vos questions"
              centered
              light
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <motion.div
                className="bg-gray-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Quels sont vos délais d'intervention ?</h3>
                <p className="text-gray-300 text-sm">
                  Nous intervenons généralement sous 48h pour les demandes urgentes et sous 1 semaine pour les interventions planifiées.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Proposez-vous des devis gratuits ?</h3>
                <p className="text-gray-300 text-sm">
                  Oui, tous nos devis sont gratuits et sans engagement. Contactez-nous pour une évaluation personnalisée.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Intervenez-vous dans toute la Côte d'Ivoire ?</h3>
                <p className="text-gray-300 text-sm">
                  Oui, nous intervenons sur tout le territoire ivoirien. Des frais de déplacement peuvent s'appliquer selon la distance.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Vos certificats sont-ils reconnus ?</h3>
                <p className="text-gray-300 text-sm">
                  Tous nos certificats d'étalonnage sont traçables aux étalons nationaux et internationaux et reconnus par les organismes de certification.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Contact;