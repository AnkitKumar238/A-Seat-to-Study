import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
} from '../controllers/auth.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Role verification test route
router.get('/admin-check', protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized as Administrator.',
    admin: req.user,
  });
});

export default router;

