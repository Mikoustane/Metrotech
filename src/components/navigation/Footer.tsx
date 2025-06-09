import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div>
            <Logo variant="light" />
            <p className="text-gray-400 text-sm mt-4">
              METROTECH INSTRUMENTS SARL est une entreprise spécialisée dans la métrologie industrielle, les équipements de mesure, la calibration, la vente et la maintenance. Basée à Abidjan, elle accompagne les industries vers l'excellence technique.
            </p>
            <div className="flex mt-4 space-x-4">
              <a
                href="https://www.linkedin.com/company/metrotech-instruments/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:mikoustane0@gmail.com"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nos services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Vente d’équipements de mesure</li>
              <li>Étude & Conseil en métrologie</li>
              <li>Maintenance et Réparation</li>
              <li>Étalonnage & Calibration</li>
              <li>Formations spécialisées</li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-orange-400">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-orange-400">Services</Link></li>
              <li><Link to="/about" className="hover:text-orange-400">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nous contacter</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-1" size={18} />
                Koumassi SOPIM, Abidjan – Côte d’Ivoire
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:mikoustane0@gmail.com" className="hover:text-orange-400">mikoustane0@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+2250707070707" className="hover:text-orange-400">+225 07 07 07 07 07</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {currentYear} METROTECH INSTRUMENTS SARL – Tous droits réservés.</p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-orange-400">Politique de confidentialité</a>
            <a href="#" className="hover:text-orange-400">Conditions générales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
