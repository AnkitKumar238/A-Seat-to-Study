import express from 'express';
import {
  createReservation,
  getMyReservations,
  checkIn,
  cancelReservation,
  autoSweepGraceExpired,
  extendReservation,
  getStudentAnalytics,
} from '../controllers/reservation.controller.js';

const router = express.Router();

router.get('/analytics', getStudentAnalytics);
router.get('/my', getMyReservations);
router.post('/', createReservation);
router.patch('/:id/check-in', checkIn);
router.patch('/:id/extend', extendReservation);
router.patch('/:id/cancel', cancelReservation);
router.post('/sweep-grace-expired', autoSweepGraceExpired);

export default router;

