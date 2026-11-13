import app from './src/server.js';
import http from 'http';

async function runTests() {
  console.log('================================================================');
  console.log('   A SEAT TO STUDY: COMPREHENSIVE SUPABASE MIGRATION TEST SUITE');
  console.log('================================================================\n');

  // Start temporary local server on dynamic port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[Test Harness] Test server running on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  }

  try {
    let studentToken = '';
    let adminToken = '';
    let testReservationId = '';

    // 1. Health Check
    await test('GET /api/health returns operational status & Supabase info', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.database.provider !== 'supabase_postgresql') {
        throw new Error(`Unexpected body: ${JSON.stringify(data)}`);
      }
    });

    // 2. Student Login
    await test('POST /api/auth/login authenticates Ankit Singh Rathore (12513583)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '12513583',
          password: 'StudySanctuary2025#',
        }),
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.token || data.user.studentId !== '12513583') {
        throw new Error(`Invalid response: ${JSON.stringify(data)}`);
      }
      studentToken = data.token;
    });

    // 3. Protected GET /api/auth/me
    await test('GET /api/auth/me returns authenticated student profile', async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || (data.user.name !== 'Ankit Singh Rathore' && data.user.name !== 'Ankit') || data.user.studentId !== '12513583') {
        throw new Error(`Invalid user profile: ${JSON.stringify(data)}`);
      }
    });

    // 4. Admin Login
    await test('POST /api/auth/login authenticates Admin (ADMIN-001)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'ADMIN-001',
          password: 'StudySanctuary2025#',
        }),
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.user.role !== 'ADMIN') {
        throw new Error(`Admin role missing: ${JSON.stringify(data)}`);
      }
      adminToken = data.token;
    });

    // 5. Admin Authorization Route
    await test('GET /api/auth/admin-check verifies administrator privileges', async () => {
      const res = await fetch(`${baseUrl}/api/auth/admin-check`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });

    // 6. Seats Listing
    await test('GET /api/seats returns 70 sanctuary desks with filters', async () => {
      const res = await fetch(`${baseUrl}/api/seats?floor=2`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.count < 50) {
        throw new Error(`Count unexpectedly low: ${data.count}`);
      }
    });

    // 7. Single Seat Lookup
    await test('GET /api/seats/B07 returns desk B07 details and amenities', async () => {
      const res = await fetch(`${baseUrl}/api/seats/B07`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.seat.seatNumber !== 'B07') {
        throw new Error(`Unexpected seat: ${JSON.stringify(data)}`);
      }
    });

    // 8. Seat Telemetry
    await test('GET /api/seats/telemetry returns acoustic & load metrics', async () => {
      const res = await fetch(`${baseUrl}/api/seats/telemetry?floor=2`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || typeof data.telemetry.loadPercent !== 'number') {
        throw new Error(`Invalid telemetry: ${JSON.stringify(data)}`);
      }
    });

    // 9. Create Reservation
    await test('POST /api/reservations creates a confirmed booking pass', async () => {
      const res = await fetch(`${baseUrl}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          seatNumber: 'B07',
          floorLevel: 2,
          durationHours: 2.0,
          startTime: '14:00',
          endTime: '16:00',
          academicPurpose: 'INDIVIDUAL',
        }),
      });
      if (res.status !== 201) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.reservation.reservationCode) {
        throw new Error(`Failed reservation: ${JSON.stringify(data)}`);
      }
      testReservationId = data.reservation.id || data.reservation._id;
    });

    // 10. Student Reservations List
    await test('GET /api/reservations/my returns booking history', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/my`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.count === 0) {
        throw new Error(`No reservations: ${JSON.stringify(data)}`);
      }
    });

    // 11. RFID Desk Check-In
    await test('PATCH /api/reservations/:id/check-in simulates RFID tap', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/${testReservationId}/check-in`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || data.reservation.status !== 'CHECKED_IN') {
        throw new Error(`Not checked in: ${JSON.stringify(data)}`);
      }
    });

    // 12. Extend Reservation
    await test('PATCH /api/reservations/:id/extend adds +30 mins to active pass', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/${testReservationId}/extend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ additionalMinutes: 30 }),
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Failed to extend: ${JSON.stringify(data)}`);
    });

    // 13. Student Dashboard Analytics
    await test('GET /api/reservations/analytics returns quotas, forecast & badges', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/analytics`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.analytics.student || !data.analytics.quota) {
        throw new Error(`Invalid analytics: ${JSON.stringify(data)}`);
      }
    });

    // 14. Cancel Reservation
    await test('PATCH /api/reservations/:id/cancel releases the desk', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/${testReservationId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(`Cancel failed: ${JSON.stringify(data)}`);
    });

    // 15. Grace Period Auto-Sweep
    await test('POST /api/reservations/sweep-grace-expired sweeps forfeited passes', async () => {
      const res = await fetch(`${baseUrl}/api/reservations/sweep-grace-expired`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });

    // 16. Admin Overview
    await test('GET /api/admin/overview returns master KPI dashboard & IoT status', async () => {
      const res = await fetch(`${baseUrl}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !data.overview.facility || !data.overview.kpi) {
        throw new Error(`Invalid admin overview: ${JSON.stringify(data)}`);
      }
    });

    // 17. Admin Bookings
    await test('GET /api/admin/bookings returns all active and historical bookings', async () => {
      const res = await fetch(`${baseUrl}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.success || !Array.isArray(data.bookings)) {
        throw new Error(`Invalid admin bookings: ${JSON.stringify(data)}`);
      }
    });

    // 18. Admin Seat Status Override
    await test('PATCH /api/admin/seats/B07/status sets maintenance override', async () => {
      const res = await fetch(`${baseUrl}/api/admin/seats/B07/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: 'MAINTENANCE', note: 'Hardware test' }),
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });

    // 19. Waive Student Strike
    await test('PATCH /api/admin/students/12513583/waive-strike resets penalty strike', async () => {
      const res = await fetch(`${baseUrl}/api/admin/students/12513583/waive-strike`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ reason: 'Hardware RFID error' }),
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });

    // 20. Turnstile Gate Toggle
    await test('POST /api/admin/turnstiles/gate-1/toggle toggles gate state', async () => {
      const res = await fetch(`${baseUrl}/api/admin/turnstiles/gate-1/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    });

    // 21. Export CSV Audit Log
    await test('GET /api/admin/export/audit.csv streams CSV file', async () => {
      const res = await fetch(`${baseUrl}/api/admin/export/audit.csv`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const csvText = await res.text();
      if (!csvText.startsWith('Timestamp,Category')) {
        throw new Error(`Invalid CSV header: ${csvText.slice(0, 50)}`);
      }
    });

  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});

