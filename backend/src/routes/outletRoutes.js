import express from 'express';
import {
  getOutlets,
  getOutletById,
  createOutlet,
  updateOutletSchedule,
} from '../controllers/outletController.js';
import { protect, adminOnly, salonOnly, outletAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for booking flow
router.get('/', getOutlets);
router.get('/:id', getOutletById);

// Admin only
router.post('/', protect, adminOnly, createOutlet);

// Salon / Admin can update schedule (outletAccess ensures salon staff only updates their own)
router.put('/:outletId/schedule', protect, salonOnly, outletAccess, updateOutletSchedule);

export default router;
