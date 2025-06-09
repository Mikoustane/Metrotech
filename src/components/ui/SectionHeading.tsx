import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  light = false
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const textAlign = centered ? 'text-center' : 'text-left';
  const textColor = light 
    ? 'text-white' 
    : 'text-gray-900 dark:text-white';
  const subtitleColor = light 
    ? 'text-gray-200' 
    : 'text-gray-600 dark:text-gray-300';

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        delay: 0.2 
      } 
    }
  };

  return (
    <div ref={ref} className={`mb-12 ${textAlign}`}>
      <motion.h2 
        className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}
        variants={titleVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          className={`text-lg md:text-xl ${subtitleColor} max-w-3xl ${centered ? 'mx-auto' : ''}`}
          variants={subtitleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;