import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res) => {
  const { outletId, service, appointmentDate, appointmentTime, notes } = req.body;

  if (!outletId || !service || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const appointment = new Appointment({
    userId: req.user._id,
    outletId,
    service,
    appointmentDate,
    appointmentTime,
    notes,
  });

  const createdAppointment = await appointment.save();
  
  res.status(201).json(createdAppointment);
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id }).populate('outletId', 'name location');
  res.json(appointments);
};

// @desc    Get appointments for an outlet
// @route   GET /api/appointments/outlet/:outletId
// @access  Private/Salon/Admin
export const getOutletAppointments = async (req, res) => {
  const appointments = await Appointment.find({ outletId: req.params.outletId })
    .populate('userId', 'name email')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
  
  res.json(appointments);
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Salon/Admin
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Basic authorization check to ensure the salon worker updating it belongs to the outlet
    if (req.user.role === 'salon' && req.user.outletId.toString() !== appointment.outletId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status || appointment.status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
};
