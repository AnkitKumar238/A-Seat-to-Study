import mongoose from 'mongoose';

const TelemetryLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    floorLevel: {
      type: Number,
      enum: [1, 2, 3],
    },
    zoneId: {
      type: String,
    },
    category: {
      type: String,
      enum: ['CHECK_IN', 'AUTO_RELEASE', 'IOT_FAULT', 'RESERVATION', 'SANITIZED', 'SYSTEM'],
      default: 'SYSTEM',
    },
    eventDetail: {
      type: String,
      required: true,
    },
    targetSeatNumber: {
      type: String,
    },
    studentId: {
      type: String,
    },
    decibelLevel: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const TelemetryLog = mongoose.model('TelemetryLog', TelemetryLogSchema);
export default TelemetryLog;

