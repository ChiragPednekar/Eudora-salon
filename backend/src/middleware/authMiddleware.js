import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      
      // Include token payload directly if needed
      req.authPayload = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin role middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Salon staff role middleware
export const salonOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'salon' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as salon staff' });
  }
};

// Outlet access middleware
export const outletAccess = (req, res, next) => {
  // Admin can access everything
  if (req.user.role === 'admin') return next();
  
  // Salon staff must match the outletId they are querying
  const requestOutletId = req.params.outletId || req.body.outletId;
  
  if (req.user.role === 'salon' && req.user.outletId.toString() === requestOutletId) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized for this outlet' });
  }
};
