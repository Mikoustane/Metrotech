import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { Facebook, Linkedin, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';

interface ServiceItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, description, icon, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      className="bg-gray-800 rounded-xl p-6 flex items-start gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <div className="p-3 rounded-lg bg-primary-900/30 text-primary-400">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

const About: React.FC = () => {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const services = [
    {
      title: "Étalonnage des instruments",
      description: "Service professionnel d'étalonnage pour garantir la précision de vos instruments de mesure.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Vérification de conformité",
      description: "Vérification complète de la conformité de vos équipements aux normes en vigueur.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Ajustement de précision",
      description: "Ajustement minutieux pour optimiser la précision de vos instruments.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Réparations techniques",
      description: "Service de réparation expert pour tous vos équipements de métrologie.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Conseil en métrologie",
      description: "Expertise et conseils personnalisés pour vos besoins en métrologie.",
      icon: <CheckCircle size={24} />
    },
    {
      title: "Formations spécifiques",
      description: "Programmes de formation adaptés à vos équipes et vos équipements.",
      icon: <CheckCircle size={24} />
    }
  ];

  return (
    <>
      <Helmet>
        <title>À Propos - METROTECH Expert Métrologie Abidjan</title>
        <meta name="description" content="Découvrez METROTECH INSTRUMENT SARL, expert en métrologie à Abidjan. Notre histoire, équipe et services d'étalonnage en Côte d'Ivoire." />
        <meta name="keywords" content="METROTECH, métrologie Abidjan, expert étalonnage, Jean Paul Appoutri, Côte d'Ivoire, histoire entreprise" />
        <link rel="canonical" href="https://metrotech-ci.com/about" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />
            <motion.div 
              className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3912472/pexels-photo-3912472.jpeg')] bg-cover bg-center"
              style={{ opacity, scale }}
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                À Propos de METROTECH
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Votre partenaire de confiance en métrologie industrielle et de laboratoire en Côte d'Ivoire
              </motion.p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionHeading 
                  title="Notre Histoire"
                  subtitle="METROTECH INSTRUMENT SARL est une entreprise leader en métrologie basée à Abidjan"
                />
                
                <p className="text-gray-300 mb-6">
                  Spécialisée dans la métrologie industrielle et de laboratoire, METROTECH INSTRUMENT SARL 
                  offre une gamme complète de services pour garantir la précision et la fiabilité de vos 
                  instruments de mesure.
                </p>
                
                <div className="flex space-x-4">
                  <a 
                    href="https://www.facebook.com/METROTECHINSTRUMENT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href="https://ci.linkedin.com/in/jean-paul-appoutri-a192a1161" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-30 blur-lg"></div>
                <img 
                  src="https://images.pexels.com/photos/3912481/pexels-photo-3912481.jpeg"
                  alt="METROTECH facilities" 
                  className="rounded-lg shadow-lg relative z-10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              title="Nos Services"
              subtitle="Une gamme complète de services en métrologie"
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {services.map((service, index) => (
                <ServiceItem 
                  key={index}
                  {...service}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              title="Notre Équipe"
              subtitle="Des experts passionnés par la métrologie"
              centered
            />
            
            <div className="mt-12">
              <motion.div
                className="max-w-md mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/C5603AQGfUMnqckVHlg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1566294977800?e=2147483647&v=beta&t=q4c_jEdT9QDEyQBox7svc7zXiwKm3EruH4Q65BFUQnk"
                    alt="Jean Paul Appoutri"
                    className="w-40 h-40 rounded-full mx-auto shadow-lg"
                  />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-2">Jean Paul APPOUTRI</h3>
                <p className="text-gray-300 mb-4">Responsable METROTECH INSTRUMENT SARL</p>
                
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://ci.linkedin.com/in/jean-paul-appoutri-a192a1161"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href="mailto:mikoustane0@gmail.com"
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeading 
                title="Nous Contacter"
                subtitle="Retrouvez-nous à Abidjan"
                centered
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <MapPin size={32} className="text-primary-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Adresse</h3>
                  <p className="text-gray-300 text-center">Koumassi SOPIM, Abidjan, Côte d'Ivoire</p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Phone size={32} className="text-primary-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Téléphone</h3>
                  <p className="text-gray-300">+225 05 46 86 85 71</p>
                  <p className="text-gray-300">+225 07 09 09 53 54</p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Mail size={32} className="text-primary-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <a href="mailto:mikoustane0@gmail.com" className="text-gray-300 hover:text-primary-400 transition-colors">
                    mikoustane0@gmail.com
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default About;