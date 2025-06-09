import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FlaskRound as Flask, 
  Factory, 
  Guitar as Hospital, 
  Droplet, 
  Thermometer 
} from 'lucide-react';

import SectionHeading from '../components/ui/SectionHeading';

interface ServiceItemProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  features: string[];
  index: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ id, title, description, icon, image, features, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      className="py-20 border-b border-gray-700 last:border-b-0"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
          <div className="w-full lg:w-1/2">
            <Link to={`/services/${id}`}>
              <motion.div 
                className="relative group cursor-pointer overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <span className="text-white text-lg font-medium">En savoir plus →</span>
                </div>
              </motion.div>
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-lg ${isEven ? 'bg-primary-900/30' : 'bg-secondary-900/30'} mr-4`}>
                {React.cloneElement(icon as React.ReactElement, { 
                  size: 32,
                  className: isEven ? 'text-primary-400' : 'text-secondary-400'
                })}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
            </div>
            
            <p className="text-lg text-gray-300 mb-6">{description}</p>
            
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex items-start"
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                  viewport={{ once: true }}
                >
                  <div className={`mr-3 mt-1.5 w-2 h-2 rounded-full ${
                    isEven ? 'bg-primary-500' : 'bg-secondary-500'
                  }`} />
                  <span className="text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            <Link to={`/services/${id}`}>
              <motion.button
                className={`mt-8 px-6 py-3 rounded-lg ${
                  isEven 
                    ? 'bg-primary-500 hover:bg-primary-600' 
                    : 'bg-secondary-500 hover:bg-secondary-600'
                } text-white font-medium transition-colors duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Découvrir ce service
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const services = [
    {
      id: 'btp',
      title: "Services pour les BTP",
      description: "Solutions de mesure robustes et fiables pour les chantiers de construction.",
      icon: <Building2 />,
      image: "https://images.pexels.com/photos/585418/pexels-photo-585418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Étalonnage des instruments de mesure de chantier",
        "Vérification des équipements de topographie",
        "Maintenance préventive et corrective",
        "Formation aux bonnes pratiques de mesure"
      ]
    },
    {
      id: 'laboratoires',
      title: "Services pour les Laboratoires",
      description: "Équipements de métrologie pour analyses scientifiques précises.",
      icon: <Flask />,
      image: "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Étalonnage d'instruments de précision",
        "Validation des équipements d'analyse",
        "Services de métrologie accrédités",
        "Support technique spécialisé"
      ]
    },
    {
      id: 'industries',
      title: "Services pour les Industries",
      description: "Instruments de mesure pour optimiser les chaînes de production.",
      icon: <Factory />,
      image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Calibration des instruments de production",
        "Audit des systèmes de mesure",
        "Maintenance des équipements",
        "Conseil en métrologie industrielle"
      ]
    },
    {
      id: 'hopitaux',
      title: "Services pour les Hôpitaux",
      description: "Solutions de contrôle qualité pour équipements médicaux.",
      icon: <Hospital />,
      image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Étalonnage des appareils médicaux",
        "Vérification des équipements de diagnostic",
        "Maintenance préventive",
        "Formation du personnel médical"
      ]
    },
    {
      id: 'analyse-eau',
      title: "Laboratoires d'Analyse de l'Eau",
      description: "Appareils spécialisés pour assurer la conformité de l'eau.",
      icon: <Droplet />,
      image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Analyse de la qualité de l'eau",
        "Calibration des instruments de mesure",
        "Maintenance des équipements",
        "Formation aux techniques d'analyse"
      ]
    },
    {
      id: 'surveillance-temperature',
      title: "Suivi Automatisé Température & Hygrométrie",
      description: "Systèmes intelligents pour surveiller en temps réel les conditions environnementales.",
      icon: <Thermometer />,
      image: "https://images.pexels.com/photos/7722666/pexels-photo-7722666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      features: [
        "Surveillance continue 24/7",
        "Alertes en temps réel",
        "Rapports automatisés",
        "Installation et maintenance"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 pt-24"
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-gray-900 to-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nos Services
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Des solutions de métrologie complètes et professionnelles pour tous vos besoins de mesure et de contrôle.
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section>
        {services.map((service, index) => (
          <ServiceItem 
            key={service.id}
            {...service}
            index={index}
          />
        ))}
      </section>
    </motion.div>
  );
};

export default Services;