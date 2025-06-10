import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  FlaskRound as Flask,
  Factory,
  Guitar as Hospital,
  Droplet,
  Thermometer
} from 'lucide-react';

import Button from '../components/ui/Button';
import ServiceCard from '../components/ui/ServiceCard';
import SectionHeading from '../components/ui/SectionHeading';
import OptimizedImage from '../components/ui/OptimizedImage';
import AnimatedCard from '../components/ui/AnimatedCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  legend: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0]);

  // Récupérer les actualités publiées
  const [news] = useLocalStorage<NewsItem[]>('metrotech_news', []);
  const publishedNews = news.filter(item => item.published).slice(0, 3); // Afficher les 3 dernières actualités

  const services = [
    {
      title: "Services pour les BTP",
      description: "Solutions de mesure adaptées aux besoins des entreprises du bâtiment et des travaux publics.",
      icon: <Building2 className="text-primary-600\" size={24} />,
      link: "/services/btp"
    },
    {
      title: "Services pour les Laboratoires",
      description: "Fourniture d'équipements et de services pour garantir la précision dans les laboratoires d'analyse.",
      icon: <Flask className="text-primary-600" size={24} />,
      link: "/services/laboratoires"
    },
    {
      title: "Services pour les Industries",
      description: "Équipements de mesure pour optimiser les processus industriels et assurer la qualité.",
      icon: <Factory className="text-primary-600\" size={24} />,
      link: "/services/industries"
    },
    {
      title: "Services pour les Hôpitaux",
      description: "Fourniture de solutions de mesure pour garantir la sécurité et la qualité des soins.",
      icon: <Hospital className="text-primary-600" size={24} />,
      link: "/services/hopitaux"
    },
    {
      title: "Services pour les Laboratoires d'Analyse de l'Eau",
      description: "Équipements spécialisés pour des analyses d'eau précises et fiables.",
      icon: <Droplet className="text-primary-600\" size={24} />,
      link: "/services/analyse-eau"
    },
    {
      title: "Suivi Automatisé de la Température et de l'Hygrométrie",
      description: "Solutions de surveillance de la température et de l'humidité pour divers secteurs.",
      icon: <Thermometer className="text-primary-600" size={24} />,
      link: "/services/surveillance-temperature"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 no-scrollbar"
    >
      {/* Hero Section */}
      <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden container-stable">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-secondary-900/80 to-gray-900/90" />
          <motion.div
            className="absolute inset-0"
            style={{ y, opacity }}
          >
            <OptimizedImage
              src="https://image.noelshack.com/fichiers/2024/44/3/1730323091-metrotech-1.jpg"
              alt="METROTECH Hero"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 container-stable">
          <motion.div
            className="max-w-4xl hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-stable"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Expert en Métrologie en{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Côte d'Ivoire
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl text-stable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Solutions complètes d'étalonnage, vérification et maintenance d'instruments de mesure
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/services">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                  className="transform hover:scale-105 transition-transform w-full sm:w-auto"
                >
                  Découvrir Nos Services
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto"
                >
                  Nous Contacter
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-900 container-stable">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nos Services"
            subtitle="Des solutions adaptées à tous les secteurs d'activité"
            centered
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link to={service.link} key={index}>
                <AnimatedCard delay={index * 0.1} hover>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    delay={index}
                  />
                </AnimatedCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités dynamiques */}
      {publishedNews.length > 0 && (
        <section className="py-20 bg-gray-950 text-white container-stable">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              title="Actualités & Événements"
              subtitle="Suivez nos dernières participations et actions terrain"
              centered
              light
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedNews.map((newsItem, index) => (
                <AnimatedCard 
                  key={newsItem.id}
                  delay={0.2 + index * 0.1}
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-primary-500/50 transition-all duration-300"
                  hover
                >
                  {newsItem.image && (
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage 
                        src={newsItem.image}
                        alt={newsItem.legend || newsItem.title}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      />
                      {newsItem.legend && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white text-xs">{newsItem.legend}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{newsItem.title}</h3>
                    {newsItem.subtitle && (
                      <p className="text-primary-400 text-sm mb-3">{newsItem.subtitle}</p>
                    )}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{newsItem.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(newsItem.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded-full">
                        METROTECH
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section par défaut si pas d'actualités */}
      {publishedNews.length === 0 && (
        <section className="py-20 bg-gray-950 text-white container-stable">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading 
              title="Actualités & Événements"
              subtitle="Suivez nos dernières participations et actions terrain"
              centered
              light
            />
            <AnimatedCard 
              delay={0.2}
              className="bg-gray-800 rounded-2xl p-6 md:p-10 shadow-xl border border-gray-700"
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 text-stable">
                METROTECH INSTRUMENT SARL ÉTAIT PRÉSENT À LA MASTERCLASS ORGANISÉE PAR L'ASSOCIATION DES MÉTROLOGUES DU CREFSEM COMME PARTENAIRE ET AUSSI COMME PANELISTE. MERCI À TOUS POUR VOTRE IMPLICATION. 
                <span className="block mt-2 font-semibold text-white">(Présenté le 24 mai 2025)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatedCard delay={0.4} hover>
                  <OptimizedImage 
                    src="https://scontent.fabj7-1.fna.fbcdn.net/v/t39.30808-6/500207401_1056683716558058_8225420519230056849_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=AQCHl-BIRVAQ7kNvwHH7dwC&_nc_oc=AdkNVdFVDg8CabVp2vk-HZA0HmpRYs-huBke6LxKNP6vgYC9ES7DrZzMQt8CssS3FDU&_nc_zt=23&_nc_ht=scontent.fabj7-1.fna&_nc_gid=0RjnumVTkZbkTau2xOZ5nA&oh=00_AfPtqMh73Ut5kAIMQSRn8CJMuvPHzocv-g9JvbO84mHupg&oe=68472816"
                    alt="Événement Metrotech 1"
                    className="w-full h-64 object-cover object-center rounded-lg shadow-md"
                  />
                </AnimatedCard>
                <AnimatedCard delay={0.6} hover>
                  <OptimizedImage 
                    src="https://scontent.fabj7-1.fna.fbcdn.net/v/t39.30808-6/501058991_1056683673224729_4078049321040408501_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=TTv9M1HVCw0Q7kNvwEUfaj7&_nc_oc=Adm9jQtT5cPqbK7VWDX0AYHs_JpzhIO1ZrgZr5r0c8U3eeegntb26f4QZK4i2e8w1P8&_nc_zt=23&_nc_ht=scontent.fabj7-1.fna&_nc_gid=HZt_hNDRNvE8GVRog2QQrA&oh=00_AfMTDZ3n7-j_LdgUM3w_00bR5LpfR-FdFiiK3pJDDdE0Fg&oe=684743D4"
                    alt="Événement Metrotech 2"
                    className="w-full h-64 object-cover object-center rounded-lg shadow-md"
                  />
                </AnimatedCard>
              </div>
            </AnimatedCard>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white container-stable">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedCard delay={0.2}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-stable">Besoin d'un service de métrologie ?</h2>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-stable">
              Contactez-nous pour discuter de vos besoins en matière d'étalonnage, de vérification ou de maintenance d'instruments de mesure.
            </p>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Contactez-nous
              </Button>
            </Link>
          </AnimatedCard>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;

export default Home