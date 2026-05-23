import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SalonDashboard.module.css'; // Reusing dashboard styles
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // New Outlet Form State
  const [newOutletName, setNewOutletName] = useState('');
  const [newOutletLoc, setNewOutletLoc] = useState('');
  const [creating, setCreating] = useState(false);

  // New Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffOutletId, setStaffOutletId] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        navigate('/salon-login'); // Use same login
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        if (isAuthenticated && user?.role === 'admin') {
          const res = await axios.get('/api/outlets');
          setOutlets(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch outlets', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchOutlets();
  }, [isAuthenticated, user]);

  const handleCreateOutlet = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post('/api/outlets', { name: newOutletName, location: newOutletLoc });
      setOutlets([...outlets, res.data]);
      setNewOutletName('');
      setNewOutletLoc('');
    } catch (error) {
      console.error('Failed to create outlet', error);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setCreatingStaff(true);
    try {
      await axios.post('/api/auth/staff', { 
        name: staffName, 
        email: staffEmail, 
        password: staffPassword, 
        outletId: staffOutletId 
      });
      alert('Staff account created successfully!');
      setStaffName('');
      setStaffEmail('');
      setStaffPassword('');
      setStaffOutletId('');
    } catch (error) {
      console.error('Failed to create staff', error);
      alert(error.response?.data?.message || 'Failed to create staff');
    } finally {
      setCreatingStaff(false);
    }
  };

  if (isLoading || loadingData) return <div className={styles.loading}>Loading Admin...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className={styles.dashboardContainer}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        <div className={styles.header}>
          <div>
            <h1>Admin Control Center</h1>
            <p>Manage all salon outlets and staff</p>
          </div>
          <Button variant="secondary" onClick={() => { useAuthStore.getState().logout(); navigate('/salon-login'); }}>
            Log Out
          </Button>
        </div>

        <div className={styles.statsGrid}>
          <Card className={styles.statCard}>
            <h3>Total Outlets</h3>
            <p className={styles.statValue}>{outlets.length}</p>
          </Card>
          <Card className={styles.statCard}>
            <h3>System Status</h3>
            <p className={styles.statValue} style={{color: '#22c55e', fontSize: '32px'}}>Operational</p>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <Card>
            <h2>Create New Outlet</h2>
            <form onSubmit={handleCreateOutlet} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Outlet Name</label>
                <input 
                  type="text" 
                  value={newOutletName} 
                  onChange={(e) => setNewOutletName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Location</label>
                <input 
                  type="text" 
                  value={newOutletLoc} 
                  onChange={(e) => setNewOutletLoc(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <Button type="submit" variant="primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create Outlet'}
              </Button>
            </form>
          </Card>

          <Card>
            <h2>Create Staff Account</h2>
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={staffName} 
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Email</label>
                <input 
                  type="email" 
                  value={staffEmail} 
                  onChange={(e) => setStaffEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
                <input 
                  type="password" 
                  value={staffPassword} 
                  onChange={(e) => setStaffPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Assign to Outlet</label>
                <select 
                  value={staffOutletId} 
                  onChange={(e) => setStaffOutletId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', marginTop: '8px' }}
                >
                  <option value="">Select an Outlet...</option>
                  {outlets.map((outlet) => (
                    <option key={outlet._id} value={outlet._id}>{outlet.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="primary" disabled={creatingStaff}>
                {creatingStaff ? 'Creating...' : 'Create Staff'}
              </Button>
            </form>
          </Card>

          <Card className={styles.tableCard} style={{ gridColumn: '1 / -1' }}>
            <h2>Managed Outlets</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map((outlet) => (
                    <tr key={outlet._id}>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{outlet._id}</td>
                      <td style={{ fontWeight: 500 }}>{outlet.name}</td>
                      <td>{outlet.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {outlets.length === 0 && <p className={styles.empty}>No outlets found.</p>}
            </div>
          </Card>

        </div>

      </motion.div>
    </div>
  );
};

export default AdminDashboard;
