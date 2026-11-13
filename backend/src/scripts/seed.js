import bcrypt from 'bcryptjs';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { mockSeatsLevel2 } from '../controllers/seat.controller.js';
import { mockReservations } from '../controllers/reservation.controller.js';

async function seed() {
  console.log('--- A Seat to Study: Supabase PostgreSQL Database Seeder ---');

  if (!isSupabaseConfigured || !supabase) {
    console.error('Error: Supabase is not configured. Check SUPABASE_URL and SUPABASE_SECRET_KEY in backend/.env');
    process.exit(1);
  }

  try {
    // 1. Seed Users
    console.log('[1/5] Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('StudySanctuary2025#', salt);

    const usersToSeed = [
      {
        name: 'Ankit Singh Rathore',
        email: 'ankit@lpu.in',
        student_id: '12513583',
        password_hash: demoPasswordHash,
        role: 'STUDENT',
        department: 'Lovely Professional University (LPU) — School of Computer Science & Engineering',
        academic_standing: 'Undergraduate',
        rfid_card_uid: 'RFID-12513583-A',
        weekly_quota_hours: 25.0,
        used_quota_hours: 8.5,
        no_show_strikes: 0,
        avatar_url: '/assets/ankit-singh-rathore.jpg',
      },
      {
        name: 'Ankit Singh Rathore',
        email: 'admin@library.univ.edu',
        student_id: 'ADMIN-001',
        password_hash: demoPasswordHash,
        role: 'ADMIN',
        department: 'LPU Central Library Operations & Administration',
        academic_standing: 'Chief Library Administrator',
        rfid_card_uid: 'RFID-ADMIN-ROOT',
        weekly_quota_hours: 99.0,
        used_quota_hours: 0.0,
        no_show_strikes: 0,
        avatar_url: '/assets/ankit-singh-rathore.jpg',
      },
      {
        name: 'Custodial Team B',
        email: 'custodial@library.univ.edu',
        student_id: 'STAFF-104',
        password_hash: demoPasswordHash,
        role: 'FACILITY_STAFF',
        department: 'Facilities & Environmental Operations',
        academic_standing: 'Staff',
        rfid_card_uid: 'RFID-STAFF-104',
        weekly_quota_hours: 40.0,
        used_quota_hours: 0.0,
        no_show_strikes: 0,
      },
    ];

    for (const u of usersToSeed) {
      const { error } = await supabase
        .from('users')
        .upsert(u, { onConflict: 'student_id' });
      if (error) {
        console.warn(`  Warning seeding user ${u.name}:`, error.message);
      } else {
        console.log(`  ✓ User ${u.name} (${u.student_id}) ready.`);
      }
    }

    // Retrieve Ankit's UUID
    const { data: ankitUser } = await supabase
      .from('users')
      .select('id')
      .eq('student_id', '12513583')
      .single();

    const ankitId = ankitUser ? ankitUser.id : '00000000-0000-0000-0000-000000000001';

    // 2. Seed Seats (70 Sanctuary Pods)
    console.log('[2/5] Seeding Seats (70 Level 02 Desks)...');
    const seatsPayload = mockSeatsLevel2.map((s) => ({
      seat_number: s.seatNumber,
      desk_code: s.deskCode,
      floor_level: s.floorLevel,
      zone_id: s.zoneId,
      zone_name: s.zoneName,
      current_status: s.currentStatus,
      amenities: s.amenities,
      noise_rating: s.noiseRating,
    }));

    const { error: seatsError } = await supabase
      .from('seats')
      .upsert(seatsPayload, { onConflict: 'seat_number' });

    if (seatsError) {
      console.warn('  Warning seeding seats:', seatsError.message);
    } else {
      console.log(`  ✓ Successfully populated ${seatsPayload.length} sanctuary seats.`);
    }

    // 3. Seed Turnstile Gates
    console.log('[3/5] Seeding Turnstile Gates...');
    const turnstiles = [
      { id: 'gate-1', name: 'Turnstile Gate 01 (North Lobby)', status: 'OPERATIONAL', latency_ms: 8, total_swipes_today: 412 },
      { id: 'gate-2', name: 'Turnstile Gate 02 (Center Atrium)', status: 'OPERATIONAL', latency_ms: 11, total_swipes_today: 518 },
      { id: 'gate-3', name: 'Turnstile Gate 03 (South Commons)', status: 'OPERATIONAL', latency_ms: 9, total_swipes_today: 214 },
      { id: 'gate-4', name: 'Turnstile Gate 04 (Graduate East Wing)', status: 'OPERATIONAL', latency_ms: 12, total_swipes_today: 104 },
    ];

    for (const g of turnstiles) {
      await supabase.from('turnstile_gates').upsert(g, { onConflict: 'id' });
    }
    console.log('  ✓ 4 Turnstile gates initialized.');

    // 4. Seed Reservations
    console.log('[4/5] Seeding Initial Reservations...');
    for (const res of mockReservations) {
      const { data: seatRecord } = await supabase
        .from('seats')
        .select('id')
        .eq('seat_number', res.seatNumber)
        .maybeSingle();

      const seatId = seatRecord ? seatRecord.id : '00000000-0000-0000-0000-000000000000';

      const resRow = {
        reservation_code: res.reservationCode,
        user_id: ankitId,
        seat_id: seatId,
        seat_number: res.seatNumber,
        desk_code: res.deskCode,
        floor_level: res.floorLevel,
        zone_name: res.zoneName,
        date: res.date,
        start_time: res.startTime,
        end_time: res.endTime,
        duration_hours: res.durationHours,
        status: res.status,
        hold_expires_at: res.holdExpiresAt,
        checked_in_at: res.checkedInAt || null,
        academic_purpose: res.academicPurpose,
        sms_notification_enabled: true,
        companion_mode_enabled: false,
        rfid_tap_verified: res.rfidTapVerified || false,
      };

      await supabase.from('reservations').upsert(resRow, { onConflict: 'reservation_code' });
    }
    console.log(`  ✓ ${mockReservations.length} sample reservation passes synchronized.`);

    // 5. Seed Operational Logs
    console.log('[5/5] Seeding Operational Logs...');
    const sampleLogs = [
      {
        time_label: '14:32',
        category: 'Check-In',
        student_name: 'Ankit Singh Rathore',
        student_id: '12513583',
        event_detail: 'Authenticated via RFID Turnstile Gate 02',
        target_unit: 'Desk B07',
        floor_name: 'Floor 2 Sanctuary',
        status_color: 'tertiary',
      },
      {
        time_label: '14:28',
        category: 'Auto-Release',
        student_name: 'Julian Ray (2023-4109)',
        student_id: '2023-4109',
        event_detail: '15-minute grace period expired • Desk returned to public pool',
        target_unit: 'Seat C12',
        floor_name: 'Floor 2 Sanctuary',
        status_color: 'error',
      },
    ];

    for (const log of sampleLogs) {
      await supabase.from('operational_logs').insert(log);
    }
    console.log('  ✓ Operational logs initialized.');

    console.log('\n--- Seeding Complete: Database is fully synchronized with Supabase! ---');
  } catch (err) {
    console.error('Fatal error during seeding:', err);
  }
}

seed();

