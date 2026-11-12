import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import seatRoutes from './seat.routes.js';
import reservationRoutes from './reservation.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

// Mount root sub-routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/seats', seatRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

export default router;
