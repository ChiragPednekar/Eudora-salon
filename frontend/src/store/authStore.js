import { create } from 'zustand';
import axios from 'axios';

// Ensure credentials (cookies) are sent with every request
axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      set({ user: res.data, isAuthenticated: true });
      return { success: true, role: res.data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error', error);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

export default useAuthStore;
