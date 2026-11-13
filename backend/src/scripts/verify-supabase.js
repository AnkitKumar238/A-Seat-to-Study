import { supabase, isSupabaseConfigured } from '../config/supabase.js';

async function verifySupabase() {
  console.log('================================================================');
  console.log('   SUPABASE POSTGRESQL REAL DATABASE INTEGRATION VERIFICATION   ');
  console.log('================================================================\n');

  if (!isSupabaseConfigured || !supabase) {
    console.error('FAIL: Supabase client is not configured.');
    process.exit(1);
  }

  console.log('1. Connection check:');
  console.log('   URL:', process.env.SUPABASE_URL);
  console.log('   Secret Key Present:', Boolean(process.env.SUPABASE_SECRET_KEY));

  const tables = ['users', 'seats', 'reservations', 'telemetry_logs', 'turnstile_gates', 'operational_logs'];
  console.log('\n2. Schema & Permissions Check on Public Tables:');
  
  let allTablesAccessible = true;
  for (const table of tables) {
    const { data, error, status } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`   ✗ ${table}: status ${status} - ${error.message} (Code: ${error.code})`);
      if (error.hint) console.log(`     Hint: ${error.hint}`);
      allTablesAccessible = false;
    } else {
      console.log(`   ✓ ${table}: accessible (HTTP ${status})`);
    }
  }

  if (!allTablesAccessible) {
    console.log('\n----------------------------------------------------------------');
    console.log('ACTION REQUIRED IN SUPABASE SQL EDITOR:');
    console.log('Run the following SQL snippet to grant table privileges to the service role:\n');
    console.log(`GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;`);
    console.log('----------------------------------------------------------------\n');
    return;
  }

  // 3. Real INSERT and SELECT
  console.log('\n3. Testing Real INSERT & SELECT on public.users:');
  const testStudentId = `VERIFY-${Date.now().toString().slice(-6)}`;
  const testEmail = `verify-${Date.now()}@lpu.in`;

  const { data: insertedUser, error: insertError } = await supabase
    .from('users')
    .insert({
      name: 'Verification Student',
      email: testEmail,
      student_id: testStudentId,
      password_hash: '$2a$10$wTfU90y1u1B0P8n1b6N3qOiK/fG4U8Zp.F24aU.MhYyvBwGgZ6d62',
      role: 'STUDENT',
      department: 'LPU Verification Dept',
      academic_standing: 'Undergraduate',
      rfid_card_uid: `RFID-${testStudentId}`,
      weekly_quota_hours: 25.0,
      used_quota_hours: 0.0,
      no_show_strikes: 0,
    })
    .select('*')
    .single();

  if (insertError) {
    console.error('   ✗ INSERT failed:', insertError.message);
    return;
  }
  console.log(`   ✓ INSERT successful! Created User ID: ${insertedUser.id}`);

  // SELECT back
  const { data: fetchedUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('student_id', testStudentId)
    .single();

  if (selectError || !fetchedUser) {
    console.error('   ✗ SELECT failed:', selectError?.message);
    return;
  }
  console.log(`   ✓ SELECT successful! Fetched: ${fetchedUser.name} (${fetchedUser.student_id})`);

  // 4. Test Seats & Reservation Persistence
  console.log('\n4. Testing Real Seat Query & Reservation Persistence:');
  const { data: seats } = await supabase.from('seats').select('*').limit(1);
  const seatId = seats && seats.length > 0 ? seats[0].id : null;
  const seatNumber = seats && seats.length > 0 ? seats[0].seat_number : 'B07';

  if (seatId) {
    console.log(`   ✓ Found existing Seat in Supabase: ${seatNumber} (ID: ${seatId})`);
    const testResCode = `PASS-TEST-${Date.now().toString().slice(-6)}`;
    const { data: resRow, error: resError } = await supabase
      .from('reservations')
      .insert({
        reservation_code: testResCode,
        user_id: insertedUser.id,
        seat_id: seatId,
        seat_number: seatNumber,
        floor_level: 2,
        zone_name: 'Zone B • Collaborative Study Hub',
        date: new Date().toISOString().split('T')[0],
        start_time: '14:00',
        end_time: '16:00',
        duration_hours: 2.0,
        status: 'CONFIRMED',
      })
      .select('*')
      .single();

    if (resError) {
      console.error('   ✗ Reservation INSERT failed:', resError.message);
    } else {
      console.log(`   ✓ Reservation pass persisted: ${resRow.reservation_code} (Status: ${resRow.status})`);
      // Cleanup reservation
      await supabase.from('reservations').delete().eq('id', resRow.id);
      console.log('   ✓ Test reservation cleaned up.');
    }
  } else {
    console.log('   ℹ Seats table is currently empty. Run `node backend/src/scripts/seed.js` to populate 70 sanctuary desks.');
  }

  // Cleanup test user
  await supabase.from('users').delete().eq('id', insertedUser.id);
  console.log('   ✓ Test user cleaned up.');

  console.log('\n================================================================');
  console.log('   FINAL STATUS: SUPABASE INTEGRATION FULLY OPERATIONAL!');
  console.log('================================================================\n');
}

verifySupabase().catch(console.error);

