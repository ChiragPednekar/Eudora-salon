import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClass = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClass}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
