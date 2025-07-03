import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = "METROTECH INSTRUMENT SARL - Expert en Métrologie Côte d'Ivoire",
  description = "Expert en métrologie à Abidjan, Côte d'Ivoire. Services d'étalonnage, vérification et réparation d'instruments de mesure pour tous secteurs.",
  keywords = "métrologie Côte d'Ivoire, étalonnage Abidjan, instruments de mesure, calibration, vérification, METROTECH",
  image = "https://image.noelshack.com/fichiers/2024/44/3/1730323042-logom1.png",
  url = "https://metrotech-ci.com/",
  type = "website",
  noIndex = false
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHelmet;