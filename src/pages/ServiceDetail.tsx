import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, FlaskRound as Flask, Factory, Guitar as Hospital, Droplet, Thermometer } from 'lucide-react';
import Button from '../components/ui/Button';

const serviceDetails = {
  'btp': {
    title: "Services pour les BTP",
    description: "Solutions complètes de métrologie pour le secteur du bâtiment et des travaux publics.",
    longDescription: `Notre expertise en métrologie pour le secteur BTP garantit la précision et la fiabilité de vos mesures sur chantier. Nous proposons une gamme complète de services d'étalonnage, de vérification et de maintenance pour tous vos instruments de mesure.`,
    icon: <Building2 size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/585418/pexels-photo-585418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Étalonnage des instruments de mesure de chantier",
      "Vérification des équipements de topographie",
      "Maintenance préventive et corrective",
      "Formation aux bonnes pratiques de mesure",
      "Certification et documentation complète",
      "Support technique sur site"
    ],
    applications: [
      "Mesures topographiques",
      "Contrôle dimensionnel",
      "Mesures environnementales",
      "Tests de matériaux"
    ],
    gallery: [
      "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/544965/pexels-photo-544965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  },
  'laboratoires': {
    title: "Services pour les Laboratoires",
    description: "Services spécialisés pour les laboratoires d'analyse et de recherche.",
    longDescription: `Nos services de métrologie pour laboratoires garantissent la précision et la fiabilité de vos analyses. Nous proposons des solutions complètes d'étalonnage et de validation pour tous vos équipements de laboratoire.`,
    icon: <Flask size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Étalonnage d'instruments de précision",
      "Validation des équipements d'analyse",
      "Services de métrologie accrédités",
      "Support technique spécialisé",
      "Documentation et traçabilité",
      "Formation du personnel"
    ],
    applications: [
      "Analyses chimiques",
      "Recherche scientifique",
      "Contrôle qualité",
      "Tests de conformité"
    ],
    gallery: [
      "https://images.pexels.com/photos/3735710/pexels-photo-3735710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3735711/pexels-photo-3735711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3735712/pexels-photo-3735712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  },
  'industries': {
    title: "Services pour les Industries",
    description: "Solutions de métrologie pour l'optimisation des processus industriels.",
    longDescription: `Nos services de métrologie industrielle vous aident à maintenir la qualité et l'efficacité de votre production. Nous proposons des solutions complètes pour tous vos besoins en mesure et contrôle.`,
    icon: <Factory size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Calibration des instruments de production",
      "Audit des systèmes de mesure",
      "Maintenance des équipements",
      "Conseil en métrologie industrielle",
      "Formation du personnel",
      "Support technique 24/7"
    ],
    applications: [
      "Production industrielle",
      "Contrôle qualité",
      "Maintenance prédictive",
      "Optimisation des processus"
    ],
    gallery: [
      "https://images.pexels.com/photos/442151/pexels-photo-442151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/442153/pexels-photo-442153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  },
  'hopitaux': {
    title: "Services pour les Hôpitaux",
    description: "Solutions de métrologie pour le secteur médical.",
    longDescription: `Nos services de métrologie médicale garantissent la précision et la fiabilité de vos équipements de diagnostic et de traitement. Nous proposons des solutions complètes adaptées aux exigences du secteur médical.`,
    icon: <Hospital size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Étalonnage des appareils médicaux",
      "Vérification des équipements de diagnostic",
      "Maintenance préventive",
      "Formation du personnel médical",
      "Documentation normative",
      "Support technique urgent"
    ],
    applications: [
      "Diagnostic médical",
      "Soins intensifs",
      "Laboratoires médicaux",
      "Radiologie"
    ],
    gallery: [
      "https://images.pexels.com/photos/247787/pexels-photo-247787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/247788/pexels-photo-247788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/247789/pexels-photo-247789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  },
  'analyse-eau': {
    title: "Laboratoires d'Analyse de l'Eau",
    description: "Solutions de métrologie pour l'analyse de l'eau.",
    longDescription: `Nos services spécialisés en métrologie pour l'analyse de l'eau garantissent la précision de vos mesures et la conformité aux normes en vigueur. Nous proposons des solutions complètes pour tous vos besoins en analyse d'eau.`,
    icon: <Droplet size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Analyse de la qualité de l'eau",
      "Calibration des instruments de mesure",
      "Maintenance des équipements",
      "Formation aux techniques d'analyse",
      "Certification des résultats",
      "Support technique spécialisé"
    ],
    applications: [
      "Contrôle qualité de l'eau",
      "Analyses environnementales",
      "Traitement des eaux",
      "Surveillance sanitaire"
    ],
    gallery: [
      "https://images.pexels.com/photos/2280550/pexels-photo-2280550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2280551/pexels-photo-2280551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2280552/pexels-photo-2280552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  },
  'surveillance-temperature': {
    title: "Suivi Automatisé Température & Hygrométrie",
    description: "Solutions de surveillance environnementale en temps réel.",
    longDescription: `Nos systèmes de surveillance automatisée de la température et de l'hygrométrie vous permettent un contrôle continu et précis de vos conditions environnementales. Nous proposons des solutions complètes de monitoring avec alertes en temps réel.`,
    icon: <Thermometer size={40} className="text-primary-400" />,
    image: "https://images.pexels.com/photos/7722666/pexels-photo-7722666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    features: [
      "Surveillance continue 24/7",
      "Alertes en temps réel",
      "Rapports automatisés",
      "Installation et maintenance",
      "Calibration périodique",
      "Support technique permanent"
    ],
    applications: [
      "Entrepôts",
      "Salles blanches",
      "Laboratoires",
      "Chambres froides"
    ],
    gallery: [
      "https://images.pexels.com/photos/7722667/pexels-photo-7722667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7722668/pexels-photo-7722668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7722669/pexels-photo-7722669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ]
  }
};

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams();
  const service = serviceDetails[serviceId as keyof typeof serviceDetails];

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button
              variant="primary"
              icon={<ArrowLeft size={18} />}
            >
              Retour aux services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 min-h-screen pt-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour fixé en haut */}
        <div className="fixed top-24 left-4 z-50">
          <Link to="/services">
            <Button
              variant="ghost"
              className="bg-gray-800/90 hover:bg-gray-700 text-white backdrop-blur-sm shadow-lg"
              icon={<ArrowLeft size={18} />}
            >
              Retour aux services
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center mb-4">
                {service.icon}
                <h1 className="text-4xl font-bold text-white ml-4">{service.title}</h1>
              </div>
              <p className="text-xl text-gray-300">{service.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg prose-invert"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Description détaillée</h2>
              <p className="text-gray-300">{service.longDescription}</p>

              <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Applications</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.applications.map((application, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center bg-gray-800 rounded-lg p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                    <span className="text-gray-300">{application}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Gallery */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-8">Galerie</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative group rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <img
                      src={image}
                      alt={`${service.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-gray-800 rounded-xl p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Caractéristiques</h2>
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/contact">
                  <Button
                    variant="primary"
                    className="w-full"
                  >
                    Demander un devis
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;