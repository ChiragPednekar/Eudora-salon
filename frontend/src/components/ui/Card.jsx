import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : {}}
      className={`${styles.card} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
