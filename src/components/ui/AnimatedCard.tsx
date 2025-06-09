import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  hover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  hover = true
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 }
  };

  const hoverVariants = hover ? {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.3 }
  } : {};

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hoverVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;