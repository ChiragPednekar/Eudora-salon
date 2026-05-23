import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import Booking from './pages/Booking';
import SalonLogin from './pages/SalonLogin';
import SalonDashboard from './pages/SalonDashboard';
import AdminDashboard from './pages/AdminDashboard';
import useAuthStore from './store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/book" element={<Booking />} />
        
        {/* Salon Routes */}
        <Route path="/salon-login" element={<SalonLogin />} />
        <Route path="/salon-dashboard" element={<SalonDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
