import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import Button from '../ui/Button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          EUDORA
        </Link>

        <div className={styles.desktopMenu}>
          <Link to="/services" className={styles.navLink}>Services</Link>
          <Link to="/outlets" className={styles.navLink}>Outlets</Link>
          <Link to="/login" className={styles.navLink}>Sign In</Link>
          <Link to="/book">
            <Button variant="primary" size="sm">Book Appointment</Button>
          </Link>
        </div>

        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={styles.mobileMenu}
        >
          <Link to="/services" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Services</Link>
          <Link to="/outlets" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Outlets</Link>
          <Link to="/login" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link to="/book" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" size="md" className={styles.mobileBookBtn}>Book Appointment</Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
