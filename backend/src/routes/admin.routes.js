import express from 'express';
import {
  getAdminOverview,
  getAdminBookings,
  overrideSeatStatus,
  waiveStudentStrike,
  toggleTurnstileGate,
  exportAuditLog,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/overview', getAdminOverview);
router.get('/bookings', getAdminBookings);
router.patch('/seats/:seatNumber/status', overrideSeatStatus);
router.patch('/students/:studentId/waive-strike', waiveStudentStrike);
router.post('/turnstiles/:gateId/toggle', toggleTurnstileGate);
router.get('/export/audit.csv', exportAuditLog);

export default router;

