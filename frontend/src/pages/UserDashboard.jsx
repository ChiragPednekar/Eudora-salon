import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Dashboard.module.css';
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const UserDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (isAuthenticated) {
          const res = await axios.get('/api/appointments/myappointments');
          setAppointments(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoadingAppts(false);
      }
    };
    
    fetchAppointments();
  }, [isAuthenticated]);

  if (isLoading || loadingAppts) return <div className={styles.loading}>Loading...</div>;
  if (!user) return null;

  return (
    <div className={styles.dashboardContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your appointments and preferences</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainContent}>
            <Card className={styles.card}>
              <h2>Upcoming Appointments</h2>
              
              {appointments.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>You have no upcoming appointments.</p>
                  <Button variant="primary" onClick={() => navigate('/book')}>
                    Book Now
                  </Button>
                </div>
              ) : (
                <div className={styles.appointmentList}>
                  {appointments.map((appt) => (
                    <div key={appt._id} className={styles.appointmentItem}>
                      <div className={styles.apptDetails}>
                        <h3 className={styles.serviceName}>{appt.service}</h3>
                        <p className={styles.outletName}>{appt.outletId?.name || 'Unknown Outlet'}</p>
                        <p className={styles.apptTime}>
                          {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}
                        </p>
                      </div>
                      <div className={styles.apptStatus}>
                        <span className={`${styles.badge} ${styles[appt.status]}`}>
                          {appt.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
          
          <div className={styles.sidebar}>
            <Card className={styles.card}>
              <h2>Profile Summary</h2>
              <div className={styles.profileInfo}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Member Since:</strong> {new Date().getFullYear()}</p>
              </div>
              <Button 
                variant="secondary" 
                className={styles.logoutBtn}
                onClick={async () => {
                  await useAuthStore.getState().logout();
                  navigate('/');
                }}
              >
                Log Out
              </Button>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
