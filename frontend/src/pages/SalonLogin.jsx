import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './Auth.module.css';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAuthStore from '../store/authStore';

const SalonLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [outletId, setOutletId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [outlets, setOutlets] = useState([]);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await axios.get('/api/outlets');
        setOutlets(res.data);
      } catch (err) {
        console.error('Failed to fetch outlets');
      }
    };
    fetchOutlets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          const user = useAuthStore.getState().user;
          if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (user.role === 'salon') {
            navigate('/salon-dashboard');
          } else {
            setError('Unauthorized access. Staff only.');
            useAuthStore.getState().logout();
          }
        } else {
          setError(res.message);
        }
      } else {
        await axios.post('/api/auth/staff-register', { name, email, password, outletId });
        setSuccess('Staff account created! You can now log in from the main Sign In page.');
        setIsLogin(true); // switch back to login
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
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
            <h2>Staff Portal</h2>
            <p>Eudora Salon Management System</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => {setIsLogin(true); setError(''); setSuccess('');}}
              style={{ flex: 1, padding: '10px', background: isLogin ? 'var(--primary-color)' : 'transparent', color: isLogin ? '#000' : '#fff', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => {setIsLogin(false); setError(''); setSuccess('');}}
              style={{ flex: 1, padding: '10px', background: !isLogin ? 'var(--primary-color)' : 'transparent', color: !isLogin ? '#000' : '#fff', border: '1px solid var(--primary-color)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          {success && <div style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{success}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className={styles.input}
                  placeholder="Enter your name"
                />
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label>Staff Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your staff email"
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

            {!isLogin && (
              <div className={styles.formGroup}>
                <label>Assign Outlet</label>
                <select 
                  value={outletId} 
                  onChange={(e) => setOutletId(e.target.value)}
                  required={!isLogin}
                  className={styles.input}
                  style={{ background: '#111' }}
                >
                  <option value="">Select your outlet...</option>
                  {Array.isArray(outlets) ? outlets.map((outlet) => (
                    <option key={outlet._id} value={outlet._id}>{outlet.name}</option>
                  )) : <option disabled>Loading outlets failed</option>}
                </select>
              </div>
            )}
            
            <Button type="submit" variant="primary" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Secure Access' : 'Create Staff Account'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default SalonLogin;
