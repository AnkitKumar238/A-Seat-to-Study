import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import { findUserById } from './auth.controller.js';

// In-memory reservations database with rich realistic data aligned to Google Stitch screens
const mockReservations = [
  {
    _id: 'mock-res-001',
    id: 'mock-res-001',
    reservationCode: 'PASS-LPU-12513583-B07',
    userId: 'mock-user-ankit-001',
    userName: 'Ankit',
    studentId: '12513583',
    seatNumber: 'B07',
    deskCode: '#AT-207',
    floorLevel: 2,
    zoneName: 'Floor 2 • Silent Study Sanctuary (Center Atrium Collaborative Hub)',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '15:00',
    durationHours: 3.0,
    status: 'CHECKED_IN',
    holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    checkedInAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    academicPurpose: 'INDIVIDUAL',
    powerSpecs: 'Dual 100W USB-C PD + AC',
    features: ['Dual 100W USB-C PD', 'Glass Magnetic Whiteboard', 'Herman Miller Ergonomic Mesh', 'Wi-Fi 6E (1.2 Gbps dedicated)'],
    telemetry: {
      soundDb: 34,
      soundLabel: 'Whisper',
      climateTemp: '21.5°C',
      daylightPercent: 88,
    },
    rfidTapVerified: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-res-002',
    id: 'mock-res-002',
    reservationCode: 'PASS-LPU-12513583-A14',
    userId: 'mock-user-ankit-001',
    userName: 'Ankit',
    studentId: '12513583',
    seatNumber: 'A14',
    deskCode: '#A-14',
    floorLevel: 1,
    zoneName: 'Floor 1 • Academic Commons & Garden View',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '17:00',
    durationHours: 3.0,
    status: 'CONFIRMED',
    holdExpiresAt: new Date(Date.now() + 86400000 + 15 * 60 * 1000).toISOString(),
    academicPurpose: 'INDIVIDUAL',
    powerSpecs: 'Dual 120V AC Outlet',
    features: ['Dual Monitors (27")', 'Natural Daylight', 'Low Noise Zone', 'Standing Height-Adjustable Desk'],
    rfidTapVerified: false,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-res-003',
    id: 'mock-res-003',
    reservationCode: 'PASS-LPU-12513583-D04',
    userId: 'mock-user-ankit-001',
    userName: 'Ankit',
    studentId: '12513583',
    seatNumber: 'D04',
    deskCode: '#D-04',
    floorLevel: 3,
    zoneName: 'Floor 3 • Graduate Media & Data Science Lab',
    date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '13:00',
    durationHours: 4.0,
    status: 'CONFIRMED',
    holdExpiresAt: new Date(Date.now() + 4 * 86400000 + 15 * 60 * 1000).toISOString(),
    academicPurpose: 'RESEARCH_PROJECT',
    powerSpecs: 'Dual 100W USB-C + GPU Station',
    features: ['Dual 32" 4K Displays', 'High-Speed Fiber Ethernet', 'Sound Dampening Enclosure', 'GPU Workstation'],
    rfidTapVerified: false,
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-res-004',
    id: 'mock-res-004',
    reservationCode: 'PASS-LPU-12513583-C02',
    userId: 'mock-user-ankit-001',
    userName: 'Ankit',
    studentId: '12513583',
    seatNumber: 'C02',
    deskCode: '#C-02',
    floorLevel: 3,
    zoneName: 'Floor 3 • Creative Media Studio Suite',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    durationHours: 3.0,
    status: 'COMPLETED',
    academicPurpose: 'INDIVIDUAL',
    powerSpecs: 'Dual 100W USB-C PD',
    features: ['Dual 4K Monitors', 'Ergonomic Mesh Seating', 'Acoustic Wall Panels'],
    rfidTapVerified: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: 'mock-res-005',
    id: 'mock-res-005',
    reservationCode: 'PASS-LPU-12513583-B03',
    userId: 'mock-user-ankit-001',
    userName: 'Ankit',
    studentId: '12513583',
    seatNumber: 'B03',
    deskCode: '#AT-203',
    floorLevel: 2,
    zoneName: 'Floor 2 • Collaborative Hub',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '17:00',
    durationHours: 2.0,
    status: 'CANCELLED',
    academicPurpose: 'GROUP_STUDY',
    powerSpecs: 'Dual USB-C',
    features: ['Ergonomic Task Chair', 'Shared Whiteboard'],
    rfidTapVerified: false,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

/**
 * @desc    Create a new seat reservation
 * @route   POST /api/reservations
 * @access  Private / Semi-Public
 */
export const createReservation = async (req, res, next) => {
  try {
    const {
      seatNumber = 'B07',
      floorLevel = 2,
      durationHours = 2.0,
      startTime = '14:00',
      endTime = '16:00',
      date = new Date().toISOString().split('T')[0],
      academicPurpose = 'INDIVIDUAL',
      smsNotification = true,
      companionMode = false,
    } = req.body;

    const user = req.user || {
      id: 'mock-user-ankit-001',
      _id: 'mock-user-ankit-001',
      name: 'Ankit',
      studentId: '12513583',
    };

    const isDbConnected = mongoose.connection.readyState === 1;
    const reservationCode = `PASS-LPU-${user.studentId || '12513583'}-${seatNumber}-${Date.now().toString().slice(-4)}`;
    const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins grace period

    if (isDbConnected) {
      // Find seat
      const seat = await Seat.findOne({ seatNumber });
      if (seat && seat.currentStatus === 'OCCUPIED') {
        return res.status(409).json({
          success: false,
          message: `Seat ${seatNumber} is currently occupied by another student.`,
        });
      }

      const reservation = await Reservation.create({
        reservationCode,
        userId: user.id || user._id,
        seatId: seat ? seat._id : new mongoose.Types.ObjectId(),
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}:00`),
        endTime: new Date(`${date}T${endTime}:00`),
        durationHours: Number(durationHours),
        status: 'CONFIRMED',
        holdExpiresAt,
        academicPurpose,
        smsNotificationEnabled: smsNotification,
        companionModeEnabled: companionMode,
      });

      // Update seat status to RESERVED
      if (seat) {
        seat.currentStatus = 'RESERVED';
        seat.currentReservation = reservation._id;
        await seat.save();
      }

      // Update user quota
      await User.findByIdAndUpdate(user.id || user._id, {
        $inc: { usedQuotaHours: Number(durationHours) },
      });

      return res.status(201).json({
        success: true,
        message: 'Seat reservation confirmed and Digital Pass issued.',
        reservation: {
          ...reservation.toObject(),
          seatNumber,
          deskCode: seat ? seat.deskCode : `#AT-${seatNumber.slice(1)}`,
          floorLevel,
          zoneName: seat ? seat.zoneName : 'Zone B • Collaborative Study Hub',
        },
      });
    } else {
      // Dev Memory Store
      const newReservation = {
        _id: `mock-res-${Date.now()}`,
        id: `mock-res-${Date.now()}`,
        reservationCode,
        userId: user.id || user._id,
        userName: user.name || 'Ankit',
        studentId: user.studentId || '12513583',
        seatNumber,
        deskCode: `#AT-${seatNumber.slice(1)}`,
        floorLevel: Number(floorLevel),
        zoneName: 'Zone B • Collaborative Study Hub (Center Atrium)',
        date,
        startTime,
        endTime,
        durationHours: Number(durationHours),
        status: 'CONFIRMED',
        holdExpiresAt: holdExpiresAt.toISOString(),
        academicPurpose,
        smsNotification,
        companionMode,
        rfidTapVerified: false,
        createdAt: new Date().toISOString(),
      };

      mockReservations.unshift(newReservation);

      return res.status(201).json({
        success: true,
        message: 'Seat reservation confirmed and Digital Pass issued (Dev memory store).',
        reservation: newReservation,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's reservations
 * @route   GET /api/reservations/my
 * @access  Private / Semi-Public
 */
export const getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || 'mock-user-ankit-001';
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservations = await Reservation.find({ userId })
        .populate('seatId')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: reservations.length,
        reservations,
      });
    } else {
      return res.status(200).json({
        success: true,
        count: mockReservations.length,
        reservations: mockReservations,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check-in via RFID Badge or QR Code tap
 * @route   PATCH /api/reservations/:id/check-in
 * @access  Public / Private
 */
export const checkIn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservation = await Reservation.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { reservationCode: id }],
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      reservation.status = 'CHECKED_IN';
      reservation.checkedInAt = new Date();
      await reservation.save();

      if (reservation.seatId) {
        await Seat.findByIdAndUpdate(reservation.seatId, { currentStatus: 'OCCUPIED' });
      }

      return res.status(200).json({
        success: true,
        message: 'RFID verification successful! Desk power and dual 4K monitors unlocked.',
        reservation,
      });
    } else {
      const reservation = mockReservations.find(
        (r) => r.id === id || r._id === id || r.reservationCode === id
      );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      reservation.status = 'CHECKED_IN';
      reservation.rfidTapVerified = true;
      reservation.checkedInAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'RFID verification successful! Desk power and dual 4K monitors unlocked.',
        reservation,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel reservation & release desk
 * @route   PATCH /api/reservations/:id/cancel
 * @access  Public / Private
 */
export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservation = await Reservation.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { reservationCode: id }],
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      reservation.status = 'CANCELLED';
      await reservation.save();

      if (reservation.seatId) {
        await Seat.findByIdAndUpdate(reservation.seatId, {
          currentStatus: 'AVAILABLE',
          currentReservation: null,
        });
      }

      // Refund quota hours
      await User.findByIdAndUpdate(reservation.userId, {
        $inc: { usedQuotaHours: -reservation.durationHours },
      });

      return res.status(200).json({
        success: true,
        message: 'Reservation cancelled. Desk released back to available inventory.',
      });
    } else {
      const reservation = mockReservations.find(
        (r) => r.id === id || r._id === id || r.reservationCode === id
      );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      reservation.status = 'CANCELLED';

      return res.status(200).json({
        success: true,
        message: 'Reservation cancelled. Desk released back to available inventory.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    15-Minute Grace Period Auto-Release Sweep
 * @route   POST /api/reservations/sweep-grace-expired
 * @access  Private (Admin / System Cron)
 */
export const autoSweepGraceExpired = async (req, res, next) => {
  try {
    const now = new Date();
    const isDbConnected = mongoose.connection.readyState === 1;
    let releasedCount = 0;

    if (isDbConnected) {
      const expired = await Reservation.find({
        status: 'CONFIRMED',
        holdExpiresAt: { $lt: now },
      });

      for (const resItem of expired) {
        resItem.status = 'AUTO_RELEASED';
        await resItem.save();

        if (resItem.seatId) {
          await Seat.findByIdAndUpdate(resItem.seatId, {
            currentStatus: 'AVAILABLE',
            currentReservation: null,
          });
        }

        // Add 1 strike to student for no-show
        await User.findByIdAndUpdate(resItem.userId, {
          $inc: { noShowStrikes: 1 },
        });

        releasedCount++;
      }
    } else {
      mockReservations.forEach((r) => {
        if (r.status === 'CONFIRMED' && new Date(r.holdExpiresAt) < now) {
          r.status = 'AUTO_RELEASED';
          releasedCount++;
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fair Use Grace Sweep complete: ${releasedCount} unclaimed desks auto-recycled.`,
      releasedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Extend active reservation by additional minutes (e.g. +30 mins, +60 mins)
 * @route   PATCH /api/reservations/:id/extend
 * @access  Public / Private
 */
export const extendReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { additionalMinutes = 30 } = req.body;
    const addHours = Number(additionalMinutes) / 60;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const reservation = await Reservation.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { reservationCode: id }],
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      const currentEnd = new Date(reservation.endTime);
      const newEnd = new Date(currentEnd.getTime() + additionalMinutes * 60 * 1000);

      reservation.endTime = newEnd;
      reservation.durationHours = Number(reservation.durationHours) + addHours;
      await reservation.save();

      // Deduct quota hours
      await User.findByIdAndUpdate(reservation.userId, {
        $inc: { usedQuotaHours: addHours },
      });

      return res.status(200).json({
        success: true,
        message: `Desk reservation extended by +${additionalMinutes} minutes.`,
        reservation,
      });
    } else {
      const reservation = mockReservations.find(
        (r) => r.id === id || r._id === id || r.reservationCode === id
      );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation pass not found.',
        });
      }

      reservation.durationHours = Number(reservation.durationHours) + addHours;
      reservation.extendedMinutes = (reservation.extendedMinutes || 0) + additionalMinutes;

      return res.status(200).json({
        success: true,
        message: `Desk reservation extended by +${additionalMinutes} minutes.`,
        reservation,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comprehensive student dashboard analytics & quota metrics
 * @route   GET /api/reservations/analytics
 * @access  Public / Private
 */
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const user = req.user || {
      id: 'mock-user-ankit-001',
      name: 'Ankit',
      studentId: '12513583',
      department: 'Lovely Professional University — School of Computer Science & Engineering',
      weeklyQuotaHours: 25.0,
      usedQuotaHours: 8.5,
      noShowStrikes: 0,
    };

    const isDbConnected = mongoose.connection.readyState === 1;

    // Active reservation
    let activeBooking = null;
    let upcomingCount = 0;
    let completedCount = 0;

    if (isDbConnected) {
      const active = await Reservation.findOne({
        userId: user.id || user._id,
        status: 'CHECKED_IN',
      }).populate('seatId');

      if (active) {
        activeBooking = active;
      }
      upcomingCount = await Reservation.countDocuments({
        userId: user.id || user._id,
        status: 'CONFIRMED',
      });
      completedCount = await Reservation.countDocuments({
        userId: user.id || user._id,
        status: 'COMPLETED',
      });
    } else {
      activeBooking = mockReservations.find((r) => r.status === 'CHECKED_IN') || mockReservations[0];
      upcomingCount = mockReservations.filter((r) => r.status === 'CONFIRMED').length;
      completedCount = mockReservations.filter((r) => r.status === 'COMPLETED').length;
    }

    const weeklyTotal = user.weeklyQuotaHours || 25.0;
    const weeklyUsed = user.usedQuotaHours || 8.5;
    const weeklyBalance = Math.max(0, weeklyTotal - weeklyUsed);

    const analyticsData = {
      student: {
        id: user.studentId || '12513583',
        name: user.name || 'Ankit',
        department: user.department || 'Lovely Professional University — School of Computer Science & Engineering',
        honorTier: "Dean's Honor Tier",
        reliabilityScore: 100,
        strikes: user.noShowStrikes || 0,
        standing: 'Tier 1 Standing (72h priority booking window)',
      },
      quota: {
        weeklyMaxHours: weeklyTotal,
        weeklyUsedHours: weeklyUsed,
        weeklyRemainingHours: weeklyBalance,
        monthlyHoursLogged: 48.5,
        monthlyTargetHours: 60.0,
        monthlyProgressPercent: 81,
        pacing: '+3.2h / week',
        growthRate: '+14% vs. September',
      },
      libraryLoad: {
        totalDesks: 380,
        availableDesks: 142,
        occupiedDesks: 238,
        occupancyPercent: 63,
        capacityFreePercent: 37,
        peakProjectedTime: '3:00 PM',
        currentLibraryTime: 'Thu, Oct 24 • 14:32',
      },
      hourlyForecast: [
        { hour: '8a', percent: 18, label: '18%' },
        { hour: '9a', percent: 34, label: '34%' },
        { hour: '10a', percent: 52, label: '52%' },
        { hour: '11a', percent: 63, label: '63%', isCurrent: true },
        { hour: '12p', percent: 71, label: '71%' },
        { hour: '1p', percent: 78, label: '78%' },
        { hour: '2p', percent: 84, label: '84%' },
        { hour: '3p', percent: 92, label: '92%', isPeak: true },
        { hour: '4p', percent: 86, label: '86%' },
        { hour: '5p', percent: 70, label: '70%' },
        { hour: '6p', percent: 58, label: '58%' },
        { hour: '7p', percent: 64, label: '64%' },
        { hour: '8p', percent: 45, label: '45%' },
        { hour: '9p', percent: 30, label: '30%' },
        { hour: '10p', percent: 22, label: '22%' },
        { hour: '11p', percent: 12, label: '12%' },
      ],
      floorBreakdown: [
        {
          floorNumber: 1,
          name: 'Academic Commons & Café',
          occupancyPercent: 85,
          desksLeft: 21,
          statusBadge: 'BUSY',
          color: 'error',
        },
        {
          floorNumber: 2,
          name: 'Silent Study Sanctuary',
          occupancyPercent: 54,
          desksLeft: 68,
          statusBadge: 'OPTIMAL',
          color: 'secondary',
        },
        {
          floorNumber: 3,
          name: 'Graduate Tech Lab & Research',
          occupancyPercent: 42,
          desksLeft: 53,
          statusBadge: 'QUIET',
          color: 'tertiary-fixed-dim',
        },
      ],
      acousticSensor: {
        decibels: 32,
        label: 'Whisper Quiet • Optimal for Deep Focus',
        subtext: 'Floor 2 Silent Sanctuary has maintained sub-35 dB audio thresholds for 4 continuous hours today.',
      },
      activeBooking,
      counts: {
        upcoming: upcomingCount,
        completed: completedCount,
        cancelled: 1,
      },
      bulletins: [
        {
          tag: 'FACILITY UPGRADE',
          tagType: 'secondary',
          date: 'Yesterday',
          title: 'New Herman Miller ergonomic chairs installed',
          description: 'All 60 pods along Floor 2 South now feature adjustable lumbar seating and wireless charging pads.',
        },
        {
          tag: 'IT SERVICES',
          tagType: 'neutral',
          date: 'Oct 23',
          title: 'High-speed Wi-Fi 6E mesh roll-out complete',
          description: 'Connect seamlessly to "BYU-Secure-Study" with minimum 400 Mbps throughput for cloud datasets.',
        },
      ],
    };

    return res.status(200).json({
      success: true,
      analytics: analyticsData,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createReservation,
  getMyReservations,
  checkIn,
  cancelReservation,
  autoSweepGraceExpired,
  extendReservation,
  getStudentAnalytics,
};

