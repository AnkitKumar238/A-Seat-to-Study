import { verifyToken } from '../utils/generateToken.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { normalizeUser } from '../utils/supabaseAdapter.js';
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

    // 1. Try Supabase PostgreSQL
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sbUser, error } = await supabase
          .from('users')
          .select('*')
          .or(`id.eq.${decoded.id},student_id.eq.${decoded.studentId || decoded.id}`)
          .maybeSingle();

        if (!error && sbUser) {
          req.user = normalizeUser(sbUser);
          return next();
        }
      } catch (err) {
        // Fall through to memory store if table not created or query fails
      }
    }

    // 2. Fallback in-memory store
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid or user no longer exists. Please log in again.',
      });
    }

    req.user = user;
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
