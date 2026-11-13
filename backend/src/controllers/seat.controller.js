import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { normalizeSeat } from '../utils/supabaseAdapter.js';

// Pre-configured Level 02 Sanctuary Seats matching the Google Stitch Floor Plan
export const mockSeatsLevel2 = [
  // ZONE A: Silent Study Pods (North Wing) - 16 Seats (A01 - A16)
  ...[
    { num: 'A01', status: 'OCCUPIED' },
    { num: 'A02', status: 'AVAILABLE' },
    { num: 'A03', status: 'RESERVED' },
    { num: 'A04', status: 'OCCUPIED' },
    { num: 'A05', status: 'AVAILABLE' },
    { num: 'A06', status: 'AVAILABLE' },
    { num: 'A07', status: 'OCCUPIED' },
    { num: 'A08', status: 'OFFLINE' },
    { num: 'A09', status: 'OCCUPIED' },
    { num: 'A10', status: 'RESERVED' },
    { num: 'A11', status: 'OCCUPIED' },
    { num: 'A12', status: 'AVAILABLE' },
    { num: 'A13', status: 'OCCUPIED' },
    { num: 'A14', status: 'OCCUPIED' },
    { num: 'A15', status: 'AVAILABLE' },
    { num: 'A16', status: 'AVAILABLE' },
  ].map((s) => ({
    seatNumber: s.num,
    deskCode: `#POD-${s.num}`,
    floorLevel: 2,
    zoneId: 'ZONE_A',
    zoneName: 'Zone A • Silent Study Pods',
    currentStatus: s.status,
    amenities: {
      powerSocket: true,
      powerSpecs: '100W USB-C + Dual AC',
      dualMonitor: false,
      ergonomicChair: true,
      naturalLight: false,
      whiteboardAccess: false,
    },
    noiseRating: 'Whisper Silent (32 dB)',
    podNumber: `POD 0${Math.ceil(parseInt(s.num.slice(1)) / 4)}`,
  })),

  // ZONE D: Dual-Monitor Tech Stations (East Wing) - 12 Seats (D01 - D12)
  ...[
    { num: 'D01', status: 'OCCUPIED' },
    { num: 'D02', status: 'AVAILABLE' },
    { num: 'D03', status: 'OCCUPIED' },
    { num: 'D04', status: 'RESERVED' },
    { num: 'D05', status: 'AVAILABLE' },
    { num: 'D06', status: 'AVAILABLE' },
    { num: 'D07', status: 'OCCUPIED' },
    { num: 'D08', status: 'OCCUPIED' },
    { num: 'D09', status: 'RESERVED' },
    { num: 'D10', status: 'AVAILABLE' },
    { num: 'D11', status: 'OFFLINE' },
    { num: 'D12', status: 'AVAILABLE' },
  ].map((s) => ({
    seatNumber: s.num,
    deskCode: `#TECH-${s.num}`,
    floorLevel: 2,
    zoneId: 'ZONE_D',
    zoneName: 'Zone D • Dual-Monitor Tech Stations',
    currentStatus: s.status,
    amenities: {
      powerSocket: true,
      powerSpecs: 'Dual 100W USB-C PD + DisplayPort',
      dualMonitor: true,
      ergonomicChair: true,
      naturalLight: false,
      whiteboardAccess: false,
    },
    noiseRating: 'Low Focus (38 dB)',
  })),

  // ZONE B: Collaborative Study Hub (Center Atrium) - 24 Seats (B01 - B24)
  ...[
    { num: 'B01', status: 'OCCUPIED' },
    { num: 'B02', status: 'RESERVED' },
    { num: 'B03', status: 'AVAILABLE' },
    { num: 'B04', status: 'OCCUPIED' },
    { num: 'B05', status: 'AVAILABLE' },
    { num: 'B06', status: 'AVAILABLE' },
    { num: 'B07', status: 'AVAILABLE' },
    { num: 'B08', status: 'AVAILABLE' },
    { num: 'B09', status: 'OCCUPIED' },
    { num: 'B10', status: 'OCCUPIED' },
    { num: 'B11', status: 'AVAILABLE' },
    { num: 'B12', status: 'AVAILABLE' },
    { num: 'B13', status: 'RESERVED' },
    { num: 'B14', status: 'RESERVED' },
    { num: 'B15', status: 'OCCUPIED' },
    { num: 'B16', status: 'AVAILABLE' },
    { num: 'B17', status: 'AVAILABLE' },
    { num: 'B18', status: 'AVAILABLE' },
    { num: 'B19', status: 'OCCUPIED' },
    { num: 'B20', status: 'OCCUPIED' },
    { num: 'B21', status: 'AVAILABLE' },
    { num: 'B22', status: 'OFFLINE' },
    { num: 'B23', status: 'RESERVED' },
    { num: 'B24', status: 'AVAILABLE' },
  ].map((s) => ({
    seatNumber: s.num,
    deskCode: `#AT-${s.num.slice(1)}`,
    floorLevel: 2,
    zoneId: 'ZONE_B',
    zoneName: 'Zone B • Collaborative Study Hub',
    currentStatus: s.status,
    amenities: {
      powerSocket: true,
      powerSpecs: '2x 100W USB-C',
      dualMonitor: false,
      ergonomicChair: true,
      naturalLight: true,
      whiteboardAccess: true,
    },
    noiseRating: 'Moderate (Atrium)',
    clusterNumber: `CLUSTER 0${Math.ceil(parseInt(s.num.slice(1)) / 8)}`,
  })),

  // ZONE C: Window Panorama Bar (South Glass Curtain Wall) - 18 Seats (C01 - C18)
  ...[
    { num: 'C01', status: 'AVAILABLE' },
    { num: 'C02', status: 'AVAILABLE' },
    { num: 'C03', status: 'OCCUPIED' },
    { num: 'C04', status: 'OCCUPIED' },
    { num: 'C05', status: 'RESERVED' },
    { num: 'C06', status: 'AVAILABLE' },
    { num: 'C07', status: 'AVAILABLE' },
    { num: 'C08', status: 'OCCUPIED' },
    { num: 'C09', status: 'AVAILABLE' },
    { num: 'C10', status: 'AVAILABLE' },
    { num: 'C11', status: 'OCCUPIED' },
    { num: 'C12', status: 'RESERVED' },
    { num: 'C13', status: 'AVAILABLE' },
    { num: 'C14', status: 'AVAILABLE' },
    { num: 'C15', status: 'OCCUPIED' },
    { num: 'C16', status: 'OFFLINE' },
    { num: 'C17', status: 'AVAILABLE' },
    { num: 'C18', status: 'AVAILABLE' },
  ].map((s) => ({
    seatNumber: s.num,
    deskCode: `#WIN-${s.num.slice(1)}`,
    floorLevel: 2,
    zoneId: 'ZONE_C',
    zoneName: 'Zone C • Window Panorama Bar',
    currentStatus: s.status,
    amenities: {
      powerSocket: true,
      powerSpecs: '100W USB-C + AC Outlet',
      dualMonitor: false,
      ergonomicChair: true,
      naturalLight: true,
      whiteboardAccess: false,
    },
    noiseRating: 'Pleasant Ambient (36 dB)',
  })),
];

/**
 * @desc    Get seats by floor and optional filters
 * @route   GET /api/seats
 * @access  Public
 */
export const getSeats = async (req, res, next) => {
  try {
    const { floor = 2, zone, status, search, dualMonitor, powerSocket, naturalLight } = req.query;

    // 1. Query Supabase PostgreSQL if ready
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('seats')
          .select('*')
          .eq('floor_level', Number(floor))
          .order('seat_number', { ascending: true });

        if (zone && zone !== 'ALL') {
          query = query.eq('zone_id', zone);
        }
        if (status) {
          query = query.eq('current_status', status.toUpperCase());
        }
        if (search) {
          query = query.ilike('seat_number', `%${search}%`);
        }

        const { data: dbSeats, error } = await query;

        if (!error && dbSeats && dbSeats.length > 0) {
          let filtered = dbSeats.map(normalizeSeat);

          if (dualMonitor === 'true') {
            filtered = filtered.filter((s) => s.amenities?.dualMonitor);
          }
          if (powerSocket === 'true') {
            filtered = filtered.filter((s) => s.amenities?.powerSocket);
          }
          if (naturalLight === 'true') {
            filtered = filtered.filter((s) => s.amenities?.naturalLight);
          }

          return res.status(200).json({
            success: true,
            count: filtered.length,
            seats: filtered,
          });
        }
      } catch (sbError) {
        // Fallback to memory store if query fails
      }
    }

    // 2. Memory Store Filter Fallback
    const seats = mockSeatsLevel2.filter((s) => {
      if (floor && s.floorLevel !== Number(floor)) return false;
      if (zone && zone !== 'ALL' && s.zoneId !== zone) return false;
      if (status && s.currentStatus !== status.toUpperCase()) return false;
      if (search && !s.seatNumber.toLowerCase().includes(search.toLowerCase())) return false;
      if (dualMonitor === 'true' && !s.amenities.dualMonitor) return false;
      if (powerSocket === 'true' && !s.amenities.powerSocket) return false;
      if (naturalLight === 'true' && !s.amenities.naturalLight) return false;
      return true;
    });

    return res.status(200).json({
      success: true,
      count: seats.length,
      seats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single seat by seatNumber
 * @route   GET /api/seats/:seatNumber
 * @access  Public
 */
export const getSeatById = async (req, res, next) => {
  try {
    const { seatNumber } = req.params;

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbSeat, error } = await supabase
          .from('seats')
          .select('*')
          .ilike('seat_number', seatNumber)
          .maybeSingle();

        if (!error && dbSeat) {
          return res.status(200).json({
            success: true,
            seat: normalizeSeat(dbSeat),
          });
        }
      } catch (sbError) {
        // Fallback
      }
    }

    // 2. Fallback memory store
    const seat = mockSeatsLevel2.find(
      (s) => s.seatNumber.toLowerCase() === seatNumber.toLowerCase()
    );

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: `Seat ${seatNumber} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      seat: normalizeSeat(seat),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get floor telemetry (ambient noise dB, capacity, load)
 * @route   GET /api/seats/telemetry
 * @access  Public
 */
export const getFloorTelemetry = async (req, res, next) => {
  try {
    const floor = Number(req.query.floor) || 2;
    let available = 0;
    let occupied = 0;
    let reserved = 0;
    let offline = 0;
    let total = 70;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbSeats, error } = await supabase
          .from('seats')
          .select('current_status')
          .eq('floor_level', floor);

        if (!error && dbSeats && dbSeats.length > 0) {
          total = dbSeats.length;
          available = dbSeats.filter((s) => s.current_status === 'AVAILABLE').length;
          occupied = dbSeats.filter((s) => s.current_status === 'OCCUPIED').length;
          reserved = dbSeats.filter((s) => s.current_status === 'RESERVED').length;
          offline = dbSeats.filter((s) => s.current_status === 'OFFLINE' || s.current_status === 'MAINTENANCE').length;
        } else {
          throw new Error('Fallback needed');
        }
      } catch (err) {
        const seats = mockSeatsLevel2.filter((s) => s.floorLevel === floor);
        total = seats.length || 70;
        available = seats.filter((s) => s.currentStatus === 'AVAILABLE').length;
        occupied = seats.filter((s) => s.currentStatus === 'OCCUPIED').length;
        reserved = seats.filter((s) => s.currentStatus === 'RESERVED').length;
        offline = seats.filter((s) => s.currentStatus === 'OFFLINE').length;
      }
    } else {
      const seats = mockSeatsLevel2.filter((s) => s.floorLevel === floor);
      total = seats.length || 70;
      available = seats.filter((s) => s.currentStatus === 'AVAILABLE').length;
      occupied = seats.filter((s) => s.currentStatus === 'OCCUPIED').length;
      reserved = seats.filter((s) => s.currentStatus === 'RESERVED').length;
      offline = seats.filter((s) => s.currentStatus === 'OFFLINE').length;
    }

    const loadPercent = Math.round(((occupied + reserved) / (total || 1)) * 100);

    return res.status(200).json({
      success: true,
      telemetry: {
        floorLevel: floor,
        floorName: floor === 2 ? 'Level 02 Sanctuary' : `Level 0${floor}`,
        totalCapacity: total,
        available,
        occupied,
        reserved,
        offline,
        loadPercent,
        ambientSoundDb: 32.4,
        acousticStatus: 'Sanctuary standard met (Whisper Silent)',
        availableOutlets: total - offline,
        lastSensorSync: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSeats,
  getSeatById,
  getFloorTelemetry,
};
