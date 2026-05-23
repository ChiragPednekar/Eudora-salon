import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user/login
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id, user.role, user.outletId);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      outletId: user.outletId,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user', 
    });

    if (user) {
      generateToken(res, user._id, user.role, null);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      outletId: user.outletId,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Create Salon Staff Account
// @route   POST /api/auth/staff
// @access  Private/Admin
export const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, outletId } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Staff email already exists' });
    }

    if (!outletId) {
      return res.status(400).json({ message: 'Outlet ID is required for staff accounts' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'salon',
      outletId,
    });

    if (staff) {
      res.status(201).json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        outletId: staff.outletId,
      });
    } else {
      res.status(400).json({ message: 'Invalid staff data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Public Salon Staff Registration (Hidden Route)
// @route   POST /api/auth/staff-register
// @access  Public
export const staffRegister = async (req, res, next) => {
  try {
    const { name, email, password, outletId } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Staff email already exists' });
    }

    if (!outletId) {
      return res.status(400).json({ message: 'Outlet ID is required for staff accounts' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'salon',
      outletId,
    });

    if (staff) {
      res.status(201).json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        outletId: staff.outletId,
      });
    } else {
      res.status(400).json({ message: 'Invalid staff data' });
    }
  } catch (error) {
    next(error);
  }
};
