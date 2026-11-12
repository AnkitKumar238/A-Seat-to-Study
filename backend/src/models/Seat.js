import mongoose from 'mongoose';

const SeatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      unique: true,
      trim: true, // e.g. "B07"
    },
    deskCode: {
      type: String,
      required: [true, 'Desk hardware identifier is required'], // e.g. "#AT-207"
    },
    floorLevel: {
      type: Number,
      required: [true, 'Floor level is required'],
      enum: [1, 2, 3],
    },
    zoneId: {
      type: String,
      required: true, // "ZONE_A", "ZONE_B", "ZONE_C", "ZONE_D"
    },
    zoneName: {
      type: String,
      required: true, // "Zone B • Collaborative Study Hub"
    },
    currentStatus: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OFFLINE'],
      default: 'AVAILABLE',
    },
    amenities: {
      powerSocket: { type: Boolean, default: true },
      powerSpecs: { type: String, default: '2x 100W USB-C + Dual AC' },
      dualMonitor: { type: Boolean, default: false },
      ergonomicChair: { type: Boolean, default: true },
      naturalLight: { type: Boolean, default: false },
      whiteboardAccess: { type: Boolean, default: false },
    },
    noiseRating: {
      type: String,
      default: 'Moderate (Atrium)',
    },
    currentReservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Seat = mongoose.model('Seat', SeatSchema);
export default Seat;

