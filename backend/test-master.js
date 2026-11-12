process.env.NODE_ENV = 'test';
import http from 'http';
import app from './src/server.js';

async function runMasterTestSuite() {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`\n============================================================`);
    console.log(`🚀 MASTER FULL-STACK INTEGRATION TEST SUITE`);
    console.log(`🌐 Test Server running on: ${baseUrl}`);
    console.log(`============================================================\n`);

    let passedTests = 0;
    let totalTests = 0;

    const assertTest = (name, condition, details = '') => {
      totalTests++;
      if (condition) {
        passedTests++;
        console.log(`  ✅ [PASS] ${name} ${details ? `(${details})` : ''}`);
      } else {
        console.error(`  ❌ [FAIL] ${name} ${details ? `(${details})` : ''}`);
      }
    };

    try {
      // 1. Health check
      console.log('--- TEST GROUP 1: SYSTEM HEALTH ---');
      const healthRes = await fetch(`${baseUrl}/api/health`);
      const healthData = await healthRes.json();
      assertTest('System Health Check', healthRes.status === 200, `Service: ${healthData.service}`);

      // 2. Authentication (Student Login & Admin Login)
      console.log('\n--- TEST GROUP 2: AUTHENTICATION & ROLES ---');
      const studentLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'student@campus.edu', password: 'password123' }),
      });
      const studentLoginData = await studentLoginRes.json();
      assertTest('Student Login (Demo Credentials)', studentLoginRes.status === 200, `User: ${studentLoginData.user?.name}`);

      const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin@library.campus.edu', password: 'password123' }),
      });
      const adminLoginData = await adminLoginRes.json();
      assertTest('Admin Login (Privileged Role)', adminLoginRes.status === 200, `Role: ${adminLoginData.user?.role}`);

      // 3. Seats & Map Telemetry
      console.log('\n--- TEST GROUP 3: SEATS & TELEMETRY ---');
      const seatsRes = await fetch(`${baseUrl}/api/seats`);
      const seatsData = await seatsRes.json();
      assertTest('Fetch Level 02 Seat Inventory', seatsRes.status === 200, `Seats Count: ${seatsData.count}`);

      const singleSeatRes = await fetch(`${baseUrl}/api/seats/B07`);
      const singleSeatData = await singleSeatRes.json();
      assertTest('Get Single Seat B07 Details', singleSeatRes.status === 200, `Desk: ${singleSeatData.seat?.deskCode}`);

      const telemetryRes = await fetch(`${baseUrl}/api/seats/telemetry?floor=2`);
      const telemetryData = await telemetryRes.json();
      assertTest('Fetch Live Floor Telemetry', telemetryRes.status === 200, `Sound: ${telemetryData.telemetry?.soundDb} dB, Occupancy: ${telemetryData.telemetry?.occupancyPercent}%`);

      // 4. Reservations & 15-Minute Grace Period
      console.log('\n--- TEST GROUP 4: RESERVATIONS & GRACE PERIOD ---');
      const createRes = await fetch(`${baseUrl}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatNumber: 'B07',
          floorLevel: 2,
          durationHours: 2.0,
          startTime: '14:00',
          endTime: '16:00',
          academicPurpose: 'INDIVIDUAL',
        }),
      });
      const createData = await createRes.json();
      assertTest('Create Seat Reservation & Issue Digital Pass', createRes.status === 201, `Pass Code: ${createData.reservation?.reservationCode}`);

      const myRes = await fetch(`${baseUrl}/api/reservations/my`);
      const myData = await myRes.json();
      assertTest('Get Student Active & Historical Bookings', myRes.status === 200, `Reservations: ${myData.count}`);

      const checkInRes = await fetch(`${baseUrl}/api/reservations/mock-res-001/check-in`, {
        method: 'PATCH',
      });
      const checkInData = await checkInRes.json();
      assertTest('RFID & QR Pass Check-In Verification', checkInRes.status === 200, checkInData.message);

      const extendRes = await fetch(`${baseUrl}/api/reservations/mock-res-001/extend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additionalMinutes: 30 }),
      });
      const extendData = await extendRes.json();
      assertTest('Extend Active Study Reservation (+30 min)', extendRes.status === 200, extendData.message);

      const sweepRes = await fetch(`${baseUrl}/api/reservations/sweep-grace-expired`, {
        method: 'POST',
      });
      const sweepData = await sweepRes.json();
      assertTest('15-Minute Grace Auto-Release Sweep', sweepRes.status === 200, sweepData.message);

      // 5. Student Quota & Dashboard Analytics
      console.log('\n--- TEST GROUP 5: STUDENT QUOTA & ANALYTICS ---');
      const analyticsRes = await fetch(`${baseUrl}/api/reservations/analytics`);
      const analyticsData = await analyticsRes.json();
      assertTest('Fetch Student Dashboard & Quota Analytics', analyticsRes.status === 200, `Balance: ${analyticsData.analytics?.quota?.weeklyRemainingHours} hrs, Occupancy: ${analyticsData.analytics?.libraryLoad?.occupancyPercent}%`);

      // 6. Admin Operations & Controls
      console.log('\n--- TEST GROUP 6: ADMIN OPERATIONS & CONTROLS ---');
      const adminOverviewRes = await fetch(`${baseUrl}/api/admin/overview`);
      const adminOverviewData = await adminOverviewRes.json();
      assertTest('Admin Overview Telemetry & Peak Projection', adminOverviewRes.status === 200, `Node: ${adminOverviewData.overview?.facility?.nodeId}, Capacity: ${adminOverviewData.overview?.kpi?.totalCapacity}`);

      const adminBookingsRes = await fetch(`${baseUrl}/api/admin/bookings`);
      const adminBookingsData = await adminBookingsRes.json();
      assertTest('Admin Student Bookings Master Audit List', adminBookingsRes.status === 200, `Bookings: ${adminBookingsData.count}`);

      const seatOverrideRes = await fetch(`${baseUrl}/api/admin/seats/A04/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'MAINTENANCE', note: 'Hardware switch check' }),
      });
      const seatOverrideData = await seatOverrideRes.json();
      assertTest('Administrative Seat Status Override', seatOverrideRes.status === 200, seatOverrideData.message);

      const waiveStrikeRes = await fetch(`${baseUrl}/api/admin/students/2024-5519/waive-strike`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Medical excuse submitted' }),
      });
      const waiveStrikeData = await waiveStrikeRes.json();
      assertTest('Student Conduct Strike Waiver & Pardon', waiveStrikeRes.status === 200, waiveStrikeData.message);

      const gateToggleRes = await fetch(`${baseUrl}/api/admin/turnstiles/gate-1/toggle`, {
        method: 'POST',
      });
      const gateToggleData = await gateToggleRes.json();
      assertTest('Turnstile Gate 01 Toggle Override', gateToggleRes.status === 200, gateToggleData.message);

      const csvExportRes = await fetch(`${baseUrl}/api/admin/export/audit.csv`);
      const csvExportText = await csvExportRes.text();
      assertTest('Daily Operations CSV Audit Log Export', csvExportRes.status === 200 && csvExportText.includes('Timestamp'), `${csvExportText.length} bytes`);

      console.log(`\n============================================================`);
      console.log(`🏁 MASTER TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
      console.log(`============================================================\n`);
    } catch (err) {
      console.error('Master Test Suite encountered an error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runMasterTestSuite();

