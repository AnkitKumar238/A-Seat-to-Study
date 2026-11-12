import express from 'express';
import {
  getSeats,
  getSeatById,
  getFloorTelemetry,
} from '../controllers/seat.controller.js';

const router = express.Router();

router.get('/telemetry', getFloorTelemetry);
router.get('/', getSeats);
router.get('/:seatNumber', getSeatById);

export default router;

