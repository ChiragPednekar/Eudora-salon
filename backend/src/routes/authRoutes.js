import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  createStaff,
  staffRegister,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/staff-register', staffRegister);
router.get('/profile', protect, getUserProfile);
router.post('/staff', protect, adminOnly, createStaff);

export default router;
