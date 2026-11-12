import mongoose from 'mongoose';
import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';

// Fallback in-memory user store for dev when MongoDB is not connected
import { findUserById } from '../controllers/auth.controller.js';

/**
 * Protect routes - verifies JWT from Authorization header
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // If MongoDB is connected, query DB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      // Use fallback memory store
      const user = findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Session invalid. Please log in again.',
        });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message,
    });
  }
};

/**
 * Restrict access to administrators only
 */
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator privileges required.',
    });
  }
  next();
};

/**
 * Restrict access to specified roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

export default { protect, adminOnly, authorize };

