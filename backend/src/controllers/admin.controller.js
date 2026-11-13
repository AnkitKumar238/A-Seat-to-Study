import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { normalizeReservation } from '../utils/supabaseAdapter.js';

// In-memory turnstile gates state fallback
const turnstileGates = [
  { id: 'gate-1', name: 'Turnstile Gate 01 (North Lobby)', status: 'OPERATIONAL', latencyMs: 8, totalSwipesToday: 412 },
  { id: 'gate-2', name: 'Turnstile Gate 02 (Center Atrium)', status: 'OPERATIONAL', latencyMs: 11, totalSwipesToday: 518 },
  { id: 'gate-3', name: 'Turnstile Gate 03 (South Commons)', status: 'OPERATIONAL', latencyMs: 9, totalSwipesToday: 214 },
  { id: 'gate-4', name: 'Turnstile Gate 04 (Graduate East Wing)', status: 'OPERATIONAL', latencyMs: 12, totalSwipesToday: 104 },
];

// In-memory operational logs fallback
let operationalLogs = [
  {
    id: 'log-001',
    time: '14:32',
    category: 'Check-In',
    studentName: 'Ankit Singh Rathore',
    studentId: '12513583',
    eventDetail: 'Authenticated via RFID Turnstile Gate 02',
    targetUnit: 'Desk B07',
    floorName: 'Floor 2 Sanctuary',
    statusColor: 'tertiary',
  },
  {
    id: 'log-002',
    time: '14:28',
    category: 'Auto-Release',
    studentName: 'Julian Ray (2023-4109)',
    studentId: '2023-4109',
    eventDetail: '15-minute grace period expired • Desk returned to public booking pool',
    targetUnit: 'Seat C12',
    floorName: 'Floor 2 Sanctuary',
    statusColor: 'error',
  },
  {
    id: 'log-003',
    time: '14:20',
    category: 'IoT Fault',
    studentName: 'System Monitor',
    studentId: 'SYSTEM',
    eventDetail: 'Smart Power Outlet Offline • Zero voltage telemetry reported by hardware switch',
    targetUnit: 'Desk A04',
    floorName: 'Floor 1 Commons',
    statusColor: 'warning',
  },
  {
    id: 'log-004',
    time: '14:15',
    category: 'Reservation',
    studentName: 'Liam Chen',
    studentId: '2025-1102',
    eventDetail: 'Booked duration: 3.0 Hours (16:00 – 19:00)',
    targetUnit: 'Pod D02',
    floorName: 'Floor 3 Tech Lab',
    statusColor: 'secondary',
  },
  {
    id: 'log-005',
    time: '14:02',
    category: 'Sanitized',
    studentName: 'Custodial Team B',
    studentId: 'STAFF-104',
    eventDetail: 'Custodial Routine Complete • Cleared maintenance lock • Re-enabled in student portal',
    targetUnit: 'Pod D04',
    floorName: 'Floor 3 Tech Lab',
    statusColor: 'tertiary',
  },
];

// In-memory alerts fallback
let adminAlerts = [
  {
    id: 'alert-001',
    type: 'WARNING',
    title: 'Outlet Hardware Fault',
    detail: 'Desk A04 (Floor 1 Commons) smart socket dropped electrical feed.',
    targetSeat: 'A04',
    actionRequired: 'Assign Work Order',
  },
  {
    id: 'alert-002',
    type: 'NOTICE',
    title: 'High Pod Demand Surge',
    detail: 'Level 02 Silent Pods projected 95% capacity between 15:00 - 18:00.',
    targetZone: 'Floor 2 Pods',
    actionRequired: 'Enable Overflow Zone',
  },
  {
    id: 'alert-003',
    type: 'POLICY',
    title: 'Repeat No-Show Flag',
    detail: 'Student 2024-5519 logged 3 consecutive automated booking forfeits this week.',
    targetStudent: '2024-5519',
    actionRequired: 'Review Standing',
  },
];

/**
 * @desc    Get complete administrative overview metrics, IoT health, and hourly demand
 * @route   GET /api/admin/overview
 * @access  Private (Admin Only)
 */
export const getAdminOverview = async (req, res, next) => {
  try {
    let seatStats = {
      totalCapacity: 450,
      occupiedDesks: 284,
      occupancyPercent: 63.1,
      availableDesks: 166,
      holdsNext2Hours: 74,
      holdsArrived: 18,
      holdsGraceWindow: 56,
      peakWindow: '14:00 – 17:30',
      peakProjectedPercent: 89,
      studentsToday: 1248,
    };

    let activeGates = turnstileGates;
    let activeLogs = operationalLogs;

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbSeats } = await supabase.from('seats').select('current_status');
        if (dbSeats && dbSeats.length > 0) {
          const totalCount = dbSeats.length;
          const occupiedCount = dbSeats.filter((s) => s.current_status === 'OCCUPIED').length;
          const reservedCount = dbSeats.filter((s) => s.current_status === 'RESERVED').length;
          seatStats.totalCapacity = totalCount;
          seatStats.occupiedDesks = occupiedCount;
          seatStats.occupancyPercent = Number(((occupiedCount / totalCount) * 100).toFixed(1));
          seatStats.availableDesks = Math.max(0, totalCount - occupiedCount - reservedCount);
        }

        const { data: dbGates } = await supabase.from('turnstile_gates').select('*');
        if (dbGates && dbGates.length > 0) {
          activeGates = dbGates.map((g) => ({
            id: g.id,
            name: g.name,
            status: g.status,
            latencyMs: g.latency_ms,
            totalSwipesToday: g.total_swipes_today,
          }));
        }

        const { data: dbLogs } = await supabase
          .from('operational_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (dbLogs && dbLogs.length > 0) {
          activeLogs = dbLogs.map((l) => ({
            id: l.id,
            time: l.time_label,
            category: l.category,
            studentName: l.student_name,
            studentId: l.student_id,
            eventDetail: l.event_detail,
            targetUnit: l.target_unit,
            floorName: l.floor_name,
            statusColor: l.status_color,
          }));
        }
      } catch (sbError) {
        // Fallback
      }
    }

    const overviewData = {
      facility: {
        name: 'LPU Central Library (Lovely Professional University)',
        systemStatus: 'NOMINAL',
        nodeId: 'HL-MAIN-B2',
        serverTime: 'Thu, Oct 24 • 14:35',
      },
      kpi: seatStats,
      floorLoads: [
        {
          floorNumber: 1,
          name: 'Academic Commons & Cafe',
          totalDesks: 120,
          inUse: 102,
          holds: 12,
          open: 6,
          occupancyPercent: 85,
          loadBadge: '85% High Load',
          sensors: {
            noiseDb: 54,
            noiseLabel: 'Conversational',
            airQualityAqi: 28,
            airQualityLabel: 'Good',
            tempCelsius: '22.0°C',
          },
        },
        {
          floorNumber: 2,
          name: 'Silent Study Sanctuary',
          totalDesks: 180,
          inUse: 98,
          holds: 44,
          open: 38,
          occupancyPercent: 54,
          loadBadge: '54% Optimal',
          sensors: {
            noiseDb: 32,
            noiseLabel: 'Whisper Quiet',
            airQualityAqi: 22,
            airQualityLabel: 'Pristine',
            tempCelsius: '21.2°C',
          },
        },
        {
          floorNumber: 3,
          name: 'Graduate Tech & Media Lab',
          totalDesks: 150,
          inUse: 63,
          holds: 18,
          open: 69,
          occupancyPercent: 42,
          loadBadge: '42% Quiet',
          sensors: {
            noiseDb: 38,
            noiseLabel: 'Low Activity',
            airQualityAqi: 24,
            airQualityLabel: 'Good',
            tempCelsius: '20.8°C',
          },
        },
      ],
      hourlyForecast: [
        { hour: '08h', livePercent: 16, bufferPercent: 8, total: 24 },
        { hour: '09h', livePercent: 27, bufferPercent: 11, total: 38 },
        { hour: '10h', livePercent: 40, bufferPercent: 14, total: 54 },
        { hour: '11h', livePercent: 54, bufferPercent: 14, total: 68 },
        { hour: '12h', livePercent: 60, bufferPercent: 15, total: 75 },
        { hour: '13h', livePercent: 59, bufferPercent: 20, total: 79 },
        { hour: '14h', livePercent: 47, bufferPercent: 16, total: 63.1, isNow: true },
        { hour: '15h', livePercent: 60, bufferPercent: 28, total: 88, isPeak: true },
        { hour: '16h', livePercent: 61, bufferPercent: 24, total: 85 },
        { hour: '17h', livePercent: 57, bufferPercent: 25, total: 82 },
        { hour: '18h', livePercent: 55, bufferPercent: 16, total: 71 },
        { hour: '19h', livePercent: 57, bufferPercent: 30, total: 87, isPeak: true },
        { hour: '20h', livePercent: 53, bufferPercent: 13, total: 66 },
        { hour: '21h', livePercent: 41, bufferPercent: 7, total: 48 },
        { hour: '22h', livePercent: 26, bufferPercent: 3, total: 29 },
        { hour: '23h', livePercent: 11, bufferPercent: 1, total: 12 },
      ],
      safeCapacityThresholdPercent: 85,
      systemHealth: {
        soundShield: { status: 'ACTIVE', threshold: '<35 dB enforced Sanctuary' },
        turnstiles: { status: '4/4 Synced', latency: '<12ms', gates: activeGates },
        lidarSensors: { total: 450, reporting: 442, recalibrating: 8 },
        autoReleaseEngine: { status: 'ENFORCING', gracePeriodMinutes: 15 },
      },
      weeklyUtilization: {
        meanPercent: 78.4,
        breakdown: [
          { name: 'Collaborative Hub', percent: 92 },
          { name: 'Window Bar Counter', percent: 88 },
          { name: 'Silent Pods (L2)', percent: 76 },
        ],
      },
      logs: activeLogs,
      alerts: adminAlerts,
    };

    return res.status(200).json({
      success: true,
      overview: overviewData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get master list of all bookings for administrative audit
 * @route   GET /api/admin/bookings
 * @access  Private (Admin Only)
 */
export const getAdminBookings = async (req, res, next) => {
  try {
    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbBookings } = await supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (dbBookings && dbBookings.length > 0) {
          const bookings = dbBookings.map((b) => ({
            id: b.id,
            bookingRef: `#BK-${b.reservation_code.slice(-5)}`,
            studentName: b.user_name || 'Ankit Singh Rathore',
            studentId: b.student_id || '12513583',
            department: 'Lovely Professional University (LPU)',
            standing: '100% Tier 1 (Honors)',
            seatNumber: b.seat_number,
            zoneName: b.zone_name,
            startTime: b.start_time,
            endTime: b.end_time,
            scheduledHours: Number(b.duration_hours),
            status: b.status,
            verificationMethod: b.rfid_tap_verified ? 'RFID Desk Scanner Tap' : 'Pending Tap',
            terminalId: `HBL-${b.seat_number}`,
          }));

          return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
          });
        }
      } catch (sbError) {
        // Fallback
      }
    }

    // 2. Fallback memory bookings
    const mockAdminBookings = [
      {
        id: 'res-bk-88410',
        bookingRef: '#BK-88410',
        studentName: 'Ankit Singh Rathore',
        studentId: '12513583',
        department: 'LPU B.Tech CSE',
        standing: '100% Tier 1 (Honors)',
        seatNumber: 'B07',
        zoneName: 'Floor 2 • Collab Hub',
        startTime: '12:00 PM',
        endTime: '02:00 PM',
        scheduledHours: 2.0,
        status: 'CHECKED_IN',
        verificationMethod: 'RFID Desk Scanner Tap',
        verifiedAt: '12:04 PM',
        terminalId: 'HBL-2B-SN7',
      },
      {
        id: 'res-bk-88411',
        bookingRef: '#BK-88411',
        studentName: 'Marcus A. Thorne',
        studentId: '2023-1940',
        department: 'Mechanical Eng.',
        standing: '98% Tier 1',
        seatNumber: 'A14',
        zoneName: 'Floor 1 • Panorama Bar',
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        scheduledHours: 3.0,
        status: 'PENDING_GRACE',
        verificationMethod: 'Gate 2 Swiped (Turnstile)',
        graceRemainingMinutes: 11,
        terminalId: 'HBL-1A-GATE2',
      },
      {
        id: 'res-bk-88398',
        bookingRef: '#BK-88398',
        studentName: 'Chloe Zhao',
        studentId: '2025-4421',
        department: 'Fine Arts (Media)',
        standing: '92% Tier 2 (1 late record)',
        seatNumber: 'D04',
        zoneName: 'Floor 3 • Dual Tech Station',
        startTime: '01:00 PM',
        endTime: '03:00 PM',
        scheduledHours: 2.0,
        status: 'CHECKED_IN',
        verificationMethod: 'RFID Desk Scanner Tap',
        verifiedAt: '01:02 PM',
        terminalId: 'HBL-3D-SN4',
      },
      {
        id: 'res-bk-88390',
        bookingRef: '#BK-88390',
        studentName: 'Julian Ray',
        studentId: '2023-4109',
        department: 'Economics',
        standing: '85% Tier 3 (1 strike)',
        seatNumber: 'C12',
        zoneName: 'Floor 2 • Sanctuary',
        startTime: '01:30 PM',
        endTime: '03:30 PM',
        scheduledHours: 2.0,
        status: 'AUTO_RELEASED',
        verificationMethod: 'Unclaimed (15m elapsed)',
        terminalId: 'SYSTEM_AUTOSWEEP',
      },
    ];

    return res.status(200).json({
      success: true,
      count: mockAdminBookings.length,
      bookings: mockAdminBookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Seat Status Override (e.g. Set to MAINTENANCE, AVAILABLE, OCCUPIED)
 * @route   PATCH /api/admin/seats/:seatNumber/status
 * @access  Private (Admin Only)
 */
export const overrideSeatStatus = async (req, res, next) => {
  try {
    const { seatNumber } = req.params;
    const { status = 'MAINTENANCE', note = 'Administrative override' } = req.body;

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('seats')
          .update({ current_status: status })
          .ilike('seat_number', seatNumber);

        await supabase.from('operational_logs').insert({
          time_label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Admin Override',
          student_name: 'Administrator',
          student_id: 'ADMIN',
          event_detail: `Seat status manually changed to ${status}. Note: ${note}`,
          target_unit: `Desk ${seatNumber}`,
          floor_name: 'Operations Control',
          status_color: status === 'MAINTENANCE' ? 'warning' : 'secondary',
        });
      } catch (e) {}
    }

    // Append to in-memory operational log
    operationalLogs.unshift({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Admin Override',
      studentName: 'Administrator',
      studentId: 'ADMIN',
      eventDetail: `Seat status manually changed to ${status}. Note: ${note}`,
      targetUnit: `Desk ${seatNumber}`,
      floorName: 'Operations Control',
      statusColor: status === 'MAINTENANCE' ? 'warning' : 'secondary',
    });

    return res.status(200).json({
      success: true,
      message: `Desk ${seatNumber} status successfully updated to ${status}.`,
      seatNumber,
      status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Waive student no-show strike
 * @route   PATCH /api/admin/students/:studentId/waive-strike
 * @access  Private (Admin Only)
 */
export const waiveStudentStrike = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { reason = 'Excused academic conflict / hardware scanner issue' } = req.body;

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('no_show_strikes')
          .eq('student_id', studentId)
          .maybeSingle();

        if (user && user.no_show_strikes > 0) {
          await supabase
            .from('users')
            .update({ no_show_strikes: Math.max(0, user.no_show_strikes - 1) })
            .eq('student_id', studentId);
        }

        await supabase.from('operational_logs').insert({
          time_label: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Policy Pardon',
          student_name: `Student ${studentId}`,
          student_id: studentId,
          event_detail: `No-show strike waived. Reason: ${reason}`,
          target_unit: 'Conduct Register',
          floor_name: 'Administration',
          status_color: 'tertiary',
        });
      } catch (e) {}
    }

    // Remove or resolve alert if student 2024-5519
    adminAlerts = adminAlerts.filter((a) => a.targetStudent !== studentId);

    operationalLogs.unshift({
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Policy Pardon',
      studentName: `Student ${studentId}`,
      studentId,
      eventDetail: `No-show strike waived. Reason: ${reason}`,
      targetUnit: 'Conduct Register',
      floorName: 'Administration',
      statusColor: 'tertiary',
    });

    return res.status(200).json({
      success: true,
      message: `No-show strike waived for student ${studentId}. Account standing restored.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle turnstile gate status
 * @route   POST /api/admin/turnstiles/:gateId/toggle
 * @access  Private (Admin Only)
 */
export const toggleTurnstileGate = async (req, res, next) => {
  try {
    const { gateId } = req.params;
    const gate = turnstileGates.find((g) => g.id === gateId);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }

    gate.status = gate.status === 'OPERATIONAL' ? 'LOCKED_OVERFLOW' : 'OPERATIONAL';

    // Try Supabase update
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('turnstile_gates')
          .update({ status: gate.status })
          .eq('id', gateId);
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      message: `${gate.name} state set to ${gate.status}.`,
      gate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export daily operations audit log as CSV
 * @route   GET /api/admin/export/audit.csv
 * @access  Private (Admin Only)
 */
export const exportAuditLog = async (req, res, next) => {
  try {
    let logs = operationalLogs;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbLogs } = await supabase
          .from('operational_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbLogs && dbLogs.length > 0) {
          logs = dbLogs.map((l) => ({
            time: l.time_label,
            category: l.category,
            studentName: l.student_name,
            studentId: l.student_id,
            targetUnit: l.target_unit,
            floorName: l.floor_name,
            eventDetail: l.event_detail,
          }));
        }
      } catch (e) {}
    }

    const csvHeader = 'Timestamp,Category,Student_Name,Student_ID,Target_Unit,Floor,Event_Details\n';
    const csvRows = logs
      .map((log) => `"${log.time}","${log.category}","${log.studentName}","${log.studentId}","${log.targetUnit}","${log.floorName}","${(log.eventDetail || '').replace(/"/g, '""')}"`)
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="library-audit-log.csv"');
    return res.status(200).send(csvHeader + csvRows);
  } catch (error) {
    next(error);
  }
};

export default {
  getAdminOverview,
  getAdminBookings,
  overrideSeatStatus,
  waiveStudentStrike,
  toggleTurnstileGate,
  exportAuditLog,
};
