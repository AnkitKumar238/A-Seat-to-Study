import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['HOLD_PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'AUTO_RELEASED', 'CANCELLED'],
      default: 'HOLD_PENDING',
    },
    holdExpiresAt: {
      type: Date,
    },
    checkInDeadline: {
      type: Date,
    },
    checkedInAt: {
      type: Date,
    },
    academicPurpose: {
      type: String,
      enum: ['INDIVIDUAL', 'GROUP', 'EXAM', 'RESEARCH'],
      default: 'INDIVIDUAL',
    },
    smsNotificationEnabled: {
      type: Boolean,
      default: true,
    },
    companionModeEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Reservation = mongoose.model('Reservation', ReservationSchema);
export default Reservation;

