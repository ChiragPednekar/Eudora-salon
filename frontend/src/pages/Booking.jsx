import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './Booking.module.css';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useAuthStore from '../store/authStore';

const SERVICES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Keratin Treatment",
  "Facial & Skincare",
  "Manicure & Pedicure",
  "Bridal Makeup",
  "Beard Grooming"
];

const Booking = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await axios.get('/api/outlets');
        setOutlets(res.data);
      } catch (err) {
        console.error('Failed to fetch outlets', err);
      }
    };
    fetchOutlets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/appointments', {
        outletId: selectedOutlet,
        service: selectedService,
        appointmentDate,
        appointmentTime,
        notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getActiveSlots = () => {
    if (!selectedOutlet) return [];
    const outlet = outlets.find(o => o._id === selectedOutlet);
    return outlet?.activeSlots?.length > 0 ? outlet.activeSlots : [
      "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
    ]; // Default fallback slots
  };

  if (isLoading || !isAuthenticated) return null;

  if (success) {
    return (
      <div className={styles.bookingContainer}>
        <Card className={styles.successCard}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={styles.successContent}
          >
            <h2>Booking Confirmed!</h2>
            <p>Your appointment has been successfully scheduled.</p>
            <p className={styles.redirectText}>Redirecting to dashboard...</p>
          </motion.div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.header}>
          <h1>Book an Appointment</h1>
          <p>Select your preferences below</p>
        </div>

        <Card className={styles.bookingCard}>
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label>Select Outlet</label>
              <select 
                value={selectedOutlet} 
                onChange={(e) => setSelectedOutlet(e.target.value)}
                required
                className={styles.input}
              >
                <option value="">-- Choose an Outlet --</option>
                {outlets.map(outlet => (
                  <option key={outlet._id} value={outlet._id}>
                    {outlet.name} - {outlet.location}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Select Service</label>
              <select 
                value={selectedService} 
                onChange={(e) => setSelectedService(e.target.value)}
                required
                className={styles.input}
              >
                <option value="">-- Choose a Service --</option>
                {SERVICES.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  value={appointmentDate} 
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Time</label>
                <select 
                  value={appointmentTime} 
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                  className={styles.input}
                  disabled={!selectedOutlet}
                >
                  <option value="">-- Choose Time --</option>
                  {getActiveSlots().map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Additional Notes (Optional)</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                className={styles.input}
                rows="3"
                placeholder="Any special requests?"
              ></textarea>
            </div>

            <Button type="submit" variant="primary" size="lg" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Booking;
