import Outlet from '../models/Outlet.js';

// @desc    Get all outlets
// @route   GET /api/outlets
// @access  Public
export const getOutlets = async (req, res) => {
  const outlets = await Outlet.find({});
  res.json(outlets);
};

// @desc    Get outlet by ID
// @route   GET /api/outlets/:id
// @access  Public
export const getOutletById = async (req, res) => {
  const outlet = await Outlet.findById(req.params.id);
  if (outlet) {
    res.json(outlet);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
};

// @desc    Create an outlet
// @route   POST /api/outlets
// @access  Private/Admin
export const createOutlet = async (req, res) => {
  const { name, location, timings } = req.body;

  const outlet = new Outlet({
    name,
    location,
    timings,
  });

  const createdOutlet = await outlet.save();
  res.status(201).json(createdOutlet);
};

// @desc    Update outlet schedule/slots
// @route   PUT /api/outlets/:outletId/schedule
// @access  Private/Salon/Admin
export const updateOutletSchedule = async (req, res) => {
  const { timings, activeSlots, blockedDates } = req.body;
  const outlet = await Outlet.findById(req.params.outletId);

  if (outlet) {
    outlet.timings = timings || outlet.timings;
    outlet.activeSlots = activeSlots || outlet.activeSlots;
    outlet.blockedDates = blockedDates || outlet.blockedDates;

    const updatedOutlet = await outlet.save();
    res.json(updatedOutlet);
  } else {
    res.status(404).json({ message: 'Outlet not found' });
  }
};
