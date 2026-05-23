import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getOutletAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, salonOnly, outletAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createAppointment);
router.get('/myappointments', protect, getMyAppointments);

// Salon / Admin routes
// outletAccess middleware checks if params.outletId matches req.user.outletId for salon staff
router.get('/outlet/:outletId', protect, salonOnly, outletAccess, getOutletAppointments);

// update status (controller handles outlet authorization check for individual appointment)
router.put('/:id/status', protect, salonOnly, updateAppointmentStatus);

export default router;
