import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SalonDashboard.module.css';
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SalonDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [outlet, setOutlet] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'salon') {
        navigate('/salon-login');
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated && user?.outletId) {
          const [apptRes, outletRes] = await Promise.all([
            axios.get(`/api/appointments/outlet/${user.outletId}`),
            axios.get(`/api/outlets/${user.outletId}`)
          ]);
          setAppointments(apptRes.data);
          setOutlet(outletRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch salon data', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (isLoading || loadingData) return <div className={styles.loading}>Loading Dashboard...</div>;
  if (!user || user.role !== 'salon') return null;

  return (
    <div className={styles.dashboardContainer}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        <div className={styles.header}>
          <div>
            <h1>{outlet?.name || 'Outlet'} Dashboard</h1>
            <p>Manage appointments and schedule</p>
          </div>
          <Button variant="secondary" onClick={() => { useAuthStore.getState().logout(); navigate('/salon-login'); }}>
            Log Out
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <h3>Total Appointments</h3>
            <p className={styles.statValue}>{appointments.length}</p>
          </Card>
          <Card className={styles.statCard}>
            <h3>Pending</h3>
            <p className={styles.statValue}>{appointments.filter(a => a.status === 'pending').length}</p>
          </Card>
          <Card className={styles.statCard}>
            <h3>Completed</h3>
            <p className={styles.statValue}>{appointments.filter(a => a.status === 'completed').length}</p>
          </Card>
        </div>

        <Card className={styles.tableCard}>
          <h2>Today's Appointments</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td>
                      <div>
                        <p className={styles.customerName}>{appt.userId?.name}</p>
                        <p className={styles.customerEmail}>{appt.userId?.email}</p>
                      </div>
                    </td>
                    <td>{appt.service}</td>
                    <td>{new Date(appt.appointmentDate).toLocaleDateString()} <br/> {appt.appointmentTime}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[appt.status]}`}>
                        {appt.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select 
                        className={styles.actionSelect}
                        value={appt.status}
                        onChange={(e) => updateStatus(appt._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <p className={styles.empty}>No appointments found.</p>}
          </div>
        </Card>

      </motion.div>
    </div>
  );
};

export default SalonDashboard;
