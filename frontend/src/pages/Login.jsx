import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Auth.module.css';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (res.role === 'salon') {
        navigate('/salon-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className={styles.authCard}>
          <div className={styles.header}>
            <h2>Welcome Back</h2>
            <p>Sign in to manage your appointments</p>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>
            
            <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className={styles.footer}>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
