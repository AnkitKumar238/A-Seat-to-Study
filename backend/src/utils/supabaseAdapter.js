/**
 * Supabase Data Adapter & Normalizer
 * Bridges PostgreSQL snake_case columns to camelCase expected by the React frontend
 * and harmonizes id/_id for MongoDB backwards compatibility.
 */

export const normalizeUser = (user) => {
  if (!user) return null;
  const id = user.id || user._id;
  let userName = user.name;
  if (!userName || userName === 'Ankit' || userName === 'Dr. Arthur Pendelton') userName = 'Ankit Singh Rathore';
  let avatar = user.avatar_url || user.avatarUrl || '';
  if (!avatar || avatar.includes('googleusercontent')) avatar = '/assets/ankit-singh-rathore.jpg';
  return {
    id,
    _id: id,
    studentId: user.student_id || user.studentId,
    name: userName,
    email: user.email,
    role: user.role || 'STUDENT',
    department: user.department || 'Lovely Professional University — School of Computer Science & Engineering',
    academicStanding: user.academic_standing || user.academicStanding || 'Undergraduate',
    rfidCardUid: user.rfid_card_uid || user.rfidCardUid || '',
    weeklyQuotaHours: Number(user.weekly_quota_hours ?? user.weeklyQuotaHours ?? 25.0),
    usedQuotaHours: Number(user.used_quota_hours ?? user.usedQuotaHours ?? 0.0),
    noShowStrikes: Number(user.no_show_strikes ?? user.noShowStrikes ?? 0),
    avatarUrl: avatar,
    createdAt: user.created_at || user.createdAt,
    updatedAt: user.updated_at || user.updatedAt,
  };
};

export const normalizeSeat = (seat) => {
  if (!seat) return null;
  const id = seat.id || seat._id;
  return {
    id,
    _id: id,
    seatNumber: seat.seat_number || seat.seatNumber,
    deskCode: seat.desk_code || seat.deskCode,
    floorLevel: Number(seat.floor_level ?? seat.floorLevel ?? 2),
    zoneId: seat.zone_id || seat.zoneId,
    zoneName: seat.zone_name || seat.zoneName,
    currentStatus: seat.current_status || seat.currentStatus || 'AVAILABLE',
    amenities: seat.amenities || {
      powerSocket: true,
      dualMonitor: false,
      ergonomicChair: true,
      naturalLight: false,
      whiteboardAccess: false,
      powerSpecs: 'Dual 100W USB-C PD + AC',
    },
    noiseRating: seat.noise_rating || seat.noiseRating || 'Whisper Quiet (<35 dB)',
    currentReservation: seat.current_reservation_id || seat.currentReservation || null,
    createdAt: seat.created_at || seat.createdAt,
    updatedAt: seat.updated_at || seat.updatedAt,
  };
};

export const normalizeReservation = (res) => {
  if (!res) return null;
  const id = res.id || res._id;
  return {
    id,
    _id: id,
    reservationCode: res.reservation_code || res.reservationCode,
    userId: res.user_id || res.userId,
    userName: res.userName || (res.users && res.users.name) || 'Ankit Singh Rathore',
    studentId: res.student_id || res.studentId || (res.users && res.users.student_id) || '12513583',
    seatId: res.seat_id || res.seatId,
    seatNumber: res.seat_number || res.seatNumber,
    deskCode: res.desk_code || res.deskCode,
    floorLevel: Number(res.floor_level ?? res.floorLevel ?? 2),
    zoneName: res.zone_name || res.zoneName,
    date: res.date ? String(res.date).split('T')[0] : new Date().toISOString().split('T')[0],
    startTime: res.start_time || res.startTime,
    endTime: res.end_time || res.endTime,
    durationHours: Number(res.duration_hours ?? res.durationHours ?? 2.0),
    status: res.status || 'CONFIRMED',
    holdExpiresAt: res.hold_expires_at || res.holdExpiresAt,
    checkedInAt: res.checked_in_at || res.checkedInAt,
    academicPurpose: res.academic_purpose || res.academicPurpose || 'INDIVIDUAL',
    smsNotification: Boolean(res.sms_notification_enabled ?? res.smsNotification ?? true),
    companionMode: Boolean(res.companion_mode_enabled ?? res.companionMode ?? false),
    rfidTapVerified: Boolean(res.rfid_tap_verified ?? res.rfidTapVerified ?? false),
    extendedMinutes: Number(res.extended_minutes ?? res.extendedMinutes ?? 0),
    powerSpecs: res.powerSpecs || 'Dual 100W USB-C PD + AC',
    features: res.features || ['Dual 100W USB-C PD', 'Ergonomic Seating', 'Wi-Fi 6E'],
    telemetry: res.telemetry || {
      soundDb: 34,
      soundLabel: 'Whisper',
      climateTemp: '21.5°C',
      daylightPercent: 88,
    },
    createdAt: res.created_at || res.createdAt,
    updatedAt: res.updated_at || res.updatedAt,
  };
};

export default {
  normalizeUser,
  normalizeSeat,
  normalizeReservation,
};

