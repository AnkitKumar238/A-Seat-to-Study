import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reservationAPI } from '../services/api';
import { DigitalPassModal } from '../components/booking/DigitalPassModal';

export function MyBookingsPage({ onNavigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed' | 'cancelled'
  const [searchFilter, setSearchFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal for digital pass
  const [selectedPassReservation, setSelectedPassReservation] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Operation feedback
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Local state for active session extension
  const [sessionExtendedMinutes, setSessionExtendedMinutes] = useState(60);

  // Reservations list
  const [reservations, setReservations] = useState([
    {
      id: 'mock-res-001',
      reservationCode: 'PASS-HBLL-2024-B07',
      seatNumber: 'B07',
      deskCode: '#AT-207',
      floorLevel: 2,
      zoneName: 'Floor 2 • Silent Study Sanctuary (Center Atrium Collaborative Hub)',
      date: 'Today, Oct 24',
      startTime: '12:00 PM',
      endTime: '3:00 PM',
      durationHours: 3.0,
      status: 'CHECKED_IN',
      rfidTapVerified: true,
      remainingText: '01h 45m left',
      sessionProgressPercent: 41,
      telemetry: {
        soundDb: 34,
        soundLabel: 'Whisper',
        climateTemp: '21.5°C',
        daylightPercent: 88,
      },
      amenities: [
        'Dual 100W USB-C PD',
        'Glass Magnetic Whiteboard',
        'Herman Miller Ergonomic Mesh',
        'Wi-Fi 6E (1.2 Gbps dedicated)',
      ],
    },
    {
      id: 'mock-res-002',
      reservationCode: 'PASS-LPU-12513583-A14',
      seatNumber: 'A14',
      deskCode: '#A-14',
      floorLevel: 1,
      zoneName: 'Floor 1 • Academic Commons & Garden View',
      date: 'Tomorrow, Fri Oct 25',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      durationHours: 3.0,
      status: 'CONFIRMED',
      passBadge: 'Pass #12513583-A',
      openNotice: 'CHECK-IN OPENS IN 25 MINS',
      amenities: ['Dual Monitors (27")', 'Natural Daylight', 'Low Noise Zone'],
    },
    {
      id: 'mock-res-003',
      reservationCode: 'PASS-LPU-12513583-D04',
      seatNumber: 'D04',
      deskCode: '#D-04',
      floorLevel: 3,
      zoneName: 'Floor 3 • Graduate Media & Data Science Lab',
      date: 'Monday, Oct 28',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      durationHours: 4.0,
      status: 'CONFIRMED',
      passBadge: 'Pass #12513583-D',
      openNotice: 'CONFIRMED RESERVATION',
      amenities: ['Dual 32" 4K Displays', 'High-Speed Fiber Ethernet', 'Sound Dampening Enclosure'],
    },
    {
      id: 'mock-res-004',
      reservationCode: 'PASS-LPU-12513583-C02',
      seatNumber: 'C02',
      deskCode: '#C-02',
      floorLevel: 3,
      zoneName: 'Floor 3 • Creative Media Studio Suite',
      date: 'Tue, Oct 22',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      durationHours: 3.0,
      status: 'COMPLETED',
      amenities: ['Dual 4K Displays', 'Ergonomic Mesh Seating'],
    },
    {
      id: 'mock-res-005',
      reservationCode: 'PASS-LPU-12513583-B03',
      seatNumber: 'B03',
      deskCode: '#AT-203',
      floorLevel: 2,
      zoneName: 'Floor 2 • Collaborative Hub',
      date: 'Sun, Oct 20',
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      durationHours: 2.0,
      status: 'CANCELLED',
      amenities: ['Ergonomic Task Chair', 'Shared Whiteboard'],
    },
  ]);

  // Load from backend API if available
  const loadMyReservations = async () => {
    try {
      const res = await reservationAPI.getMy();
      if (res.success && res.reservations && res.reservations.length > 0) {
        // Merge or set
      }
    } catch {
      // Keep rich realistic mock default
    }
  };

  useEffect(() => {
    loadMyReservations();
  }, []);

  // Quick Extend +30 Mins
  const handleExtend = async (resId) => {
    setActionLoadingId(resId);
    try {
      await reservationAPI.extend(resId, 30);
      setSessionExtendedMinutes((prev) => prev + 30);
      setFeedbackToast('Desk B07 extended by +30 minutes! New end time: 3:30 PM.');
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch {
      setSessionExtendedMinutes((prev) => prev + 30);
      setFeedbackToast('Desk B07 extended by +30 minutes! (Local simulation)');
      setTimeout(() => setFeedbackToast(null), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Release Seat Early / Cancel
  const handleCancel = async (resId, seatNumber) => {
    if (!window.confirm(`Release or cancel reservation for Seat ${seatNumber}?`)) return;
    setActionLoadingId(resId);
    try {
      await reservationAPI.cancel(resId);
      setReservations((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: 'CANCELLED' } : r))
      );
      setFeedbackToast(`Reservation for Seat ${seatNumber} cancelled and seat released.`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: 'CANCELLED' } : r))
      );
      setFeedbackToast(`Reservation for Seat ${seatNumber} cancelled (Local simulation).`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Pass Modal
  const handleOpenDigitalPass = (resItem) => {
    setSelectedPassReservation({
      reservationCode: resItem.reservationCode || `PASS-HBLL-2024-${resItem.seatNumber}`,
      seatNumber: resItem.seatNumber,
      deskCode: resItem.deskCode || `#AT-207`,
      floorLevel: resItem.floorLevel || 2,
      zoneName: resItem.zoneName,
      date: resItem.date,
      startTime: resItem.startTime,
      endTime: resItem.endTime,
      durationHours: resItem.durationHours || 2.0,
      status: resItem.status,
      holdExpiresAt: new Date(Date.now() + 14 * 60 * 1000).toISOString(),
    });
    setIsPassModalOpen(true);
  };

  // Filter logic
  const filteredReservations = reservations.filter((r) => {
    // Tab filter
    if (activeTab === 'active' && !['CHECKED_IN', 'CONFIRMED'].includes(r.status)) return false;
    if (activeTab === 'completed' && r.status !== 'COMPLETED') return false;
    if (activeTab === 'cancelled' && !['CANCELLED', 'AUTO_RELEASED'].includes(r.status)) return false;

    // Floor filter
    if (floorFilter !== 'ALL' && r.floorLevel !== Number(floorFilter)) return false;

    // Status filter
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

    // Search query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchSeat = r.seatNumber.toLowerCase().includes(q);
      const matchZone = r.zoneName.toLowerCase().includes(q);
      const matchCode = (r.deskCode || '').toLowerCase().includes(q);
      if (!matchSeat && !matchZone && !matchCode) return false;
    }

    return true;
  });

  const activeBooking = reservations.find((r) => r.status === 'CHECKED_IN');
  const upcomingBookings = filteredReservations.filter((r) => r.status === 'CONFIRMED');
  const pastBookings = filteredReservations.filter((r) => ['COMPLETED', 'CANCELLED'].includes(r.status));

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-xl border border-secondary flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
          <span className="font-label-md text-label-md">{feedbackToast}</span>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-on-primary/70 hover:text-on-primary ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Command & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Student Portal • Level 02 Desk Management
            </span>
            <span className="text-outline-variant text-label-sm">•</span>
            <span className="font-tabular-numeric text-tabular-numeric text-on-surface-variant flex items-center gap-1 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
              Campus Gateway Synced
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            My Bookings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Manage active desk passes, authenticate RFID check-ins, extend focus blocks, and maintain your library reliability standing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
            <span>Past Study Logs</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('find-a-seat')}
            className="px-space-md py-2.5 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md transition-all flex items-center gap-2 shadow-md shadow-secondary/15 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">add_circle</span>
            <span>+ Book a New Seat</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Matrix (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Status Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-secondary/20 flex flex-col justify-between">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-secondary-fixed/30 pointer-events-none blur-xl" />
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Active Right Now
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {activeBooking ? `Seat ${activeBooking.seatNumber}` : 'None'}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                L2 Sanctuary
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
              {activeBooking ? 'Checked In • 01h 45m remaining' : 'No active reservation'}
            </p>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-high/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-tertiary-container">sensors</span>
              Live Telemetry OK
            </span>
            <button
              type="button"
              onClick={() => activeBooking && handleOpenDigitalPass(activeBooking)}
              className="font-label-sm text-label-sm text-secondary font-semibold hover:underline cursor-pointer"
            >
              Manage Desk →
            </button>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Upcoming This Week
            </span>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
              calendar_month
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md text-primary font-bold">2 Passes</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Fri &amp; Mon</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Next pass opens in 25 mins
            </p>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-high/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Total: 7 reserved hours</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Auto-checkin active
            </span>
          </div>
        </div>

        {/* Monthly Study Hours with Circular Gauge */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Monthly Study Hours
            </span>
            <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
              Dean&apos;s Tier
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-headline-md text-primary font-bold">48.5</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">/ 60 hrs</span>
              </div>
              <p className="font-body-sm text-body-sm text-tertiary-container font-medium mt-0.5">
                +14% vs. September
              </p>
            </div>
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-secondary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="81, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-tabular-numeric text-[11px] font-bold text-primary">
                81%
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-high/60 flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Pacing: +3.2h / week
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              Target 60h
            </span>
          </div>
        </div>

        {/* Student Reliability Score */}
        <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Reliability Score
            </span>
            <span className="material-symbols-outlined text-[20px] text-tertiary-container">
              verified
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-md text-headline-md text-primary font-bold">100%</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-label-sm font-label-sm bg-surface-container text-primary font-semibold">
                Zero Strikes
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              0 no-shows • 0 late releases
            </p>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container-high/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Priority 72h Booking window
            </span>
            <span className="font-label-sm text-label-sm text-tertiary-container font-semibold">
              Tier 1 Standing
            </span>
          </div>
        </div>
      </div>

      {/* Campus Fair Access Policy Alert Banner */}
      <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-container-high/80">
        <div className="flex items-start sm:items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-primary leading-tight font-semibold">
              University 15-Minute Seat Grace Period
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Unclaimed reservations auto-release after 15 minutes to guarantee fair study space. Always swipe your student RFID or scan desk barcode upon arrival.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => alert('University Library Fair Use Policy: Max 25 hrs/week per undergraduate student. Grace countdown starts at booked startTime. 3 unexcused no-show strikes result in a 7-day booking pause.')}
            className="font-label-md text-label-md text-secondary hover:text-primary font-semibold transition-colors cursor-pointer"
          >
            Study Quotas Policy →
          </button>
        </div>
      </div>

      {/* Tab Bar & Filter Controls Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-4 border-b border-surface-container-high">
        {/* Segmented Navigation Tabs */}
        <div className="inline-flex p-1 bg-surface-container rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md font-title-md text-title-md flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Active &amp; Upcoming</span>
            <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-md font-label-md text-label-md flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Completed History</span>
            <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-on-surface-variant">
              28
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-md font-label-md text-label-md flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Cancelled &amp; Released</span>
            <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-on-surface-variant">
              2
            </span>
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by Seat, Level, Pod..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none border border-surface-container-high focus:border-secondary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md border border-surface-container-high outline-none cursor-pointer"
            >
              <option value="ALL">All Floors</option>
              <option value="1">Floor 1: Academic Commons</option>
              <option value="2">Floor 2: Silent Sanctuary</option>
              <option value="3">Floor 3: Graduate Tech Lab</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md border border-surface-container-high outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="CHECKED_IN">In Progress (Checked In)</option>
              <option value="CONFIRMED">Ready to Check-in / Confirmed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Content Stream */}
      <div className="flex flex-col gap-space-lg">
        {/* CARD 1: ACTIVE CURRENT SESSION (HERO PRIORITY) */}
        {activeTab === 'active' && activeBooking && (
          <div className="rounded-2xl bg-surface-container-lowest border-2 border-secondary/40 shadow-md p-space-lg relative overflow-hidden transition-all">
            {/* Decorative status accent ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-secondary-container to-tertiary-fixed-dim" />

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-md mb-space-md">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[26px]">chair</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                      <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                      IN PROGRESS • CHECKED IN
                    </span>
                    <span className="font-tabular-numeric text-label-sm font-semibold text-secondary px-2 py-0.5 rounded bg-secondary-fixed">
                      01h 45m left
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      • RFID Tap Confirmed 12:04 PM
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 font-bold">
                    Seat {activeBooking.seatNumber}{' '}
                    <span className="text-on-surface-variant font-body-md text-body-md font-normal">
                      • Desk {activeBooking.deskCode}
                    </span>
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {activeBooking.zoneName}
                  </p>
                </div>
              </div>

              {/* Live IoT Environmental Telemetry Capsule */}
              <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high self-start">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                    volume_down
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Sound
                    </span>
                    <span className="font-tabular-numeric text-label-md font-bold">
                      {activeBooking.telemetry?.soundDb || 34} dB (Whisper)
                    </span>
                  </div>
                </div>
                <div className="w-[1px] h-7 bg-surface-container-high" />
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    thermostat
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Climate
                    </span>
                    <span className="font-tabular-numeric text-label-md font-bold">
                      {activeBooking.telemetry?.climateTemp || '21.5°C'}
                    </span>
                  </div>
                </div>
                <div className="w-[1px] h-7 bg-surface-container-high" />
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px] text-secondary-container">
                    wb_sunny
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-semibold">
                      Daylight
                    </span>
                    <span className="font-tabular-numeric text-label-md font-bold">
                      {activeBooking.telemetry?.daylightPercent || 88}% Natural
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Timeline Visualizer */}
            <div className="rounded-xl bg-surface-container-low p-space-md mb-space-md border border-surface-container">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 text-primary font-title-md text-title-md font-semibold">
                  <span className="material-symbols-outlined text-[20px] text-secondary">schedule</span>
                  <span>Today, Oct 24 • 12:00 PM – 2:00 PM</span>
                  <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
                    +{sessionExtendedMinutes}m Extension Applied (Till 3:00 PM)
                  </span>
                </div>
                <span className="font-tabular-numeric text-body-sm text-on-surface-variant font-medium">
                  Session Progress: 41%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-secondary-container rounded-full transition-all duration-500"
                  style={{ width: '41%' }}
                />
              </div>
            </div>

            {/* Amenity Tags Grid */}
            <div className="flex flex-wrap items-center gap-2 mb-space-lg">
              {activeBooking.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">bolt</span>{' '}
                  {amenity}
                </span>
              ))}
            </div>

            {/* Operational Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-md border-t border-surface-container-high">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={actionLoadingId === activeBooking.id}
                  onClick={() => handleExtend(activeBooking.id)}
                  className="px-4 py-2 rounded-lg bg-secondary-container hover:bg-secondary text-on-secondary font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">more_time</span>
                  <span>{actionLoadingId === activeBooking.id ? 'Extending...' : '+30 Mins Quick Extend'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDigitalPass(activeBooking)}
                  className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">qr_code_2</span>
                  <span>View Digital Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('find-a-seat')}
                  className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>View on Floor Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Facility Ticket logged for Desk B07. Maintenance technician notified.')}
                  className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-md text-label-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">report_problem</span>
                  <span>Report Issue</span>
                </button>
              </div>

              <button
                type="button"
                disabled={actionLoadingId === activeBooking.id}
                onClick={() => handleCancel(activeBooking.id, activeBooking.seatNumber)}
                className="px-4 py-2 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">door_front</span>
                <span>Release Seat Early</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-COLUMN SPLIT FOR UPCOMING RESERVATIONS */}
        {activeTab === 'active' && upcomingBookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* CARD 2: UPCOMING RESERVATION (Ready for Check-In Window Desk A14) */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-space-sm">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      CHECK-IN OPENS IN 25 MINS
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Window Desk A14
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Floor 1 • Academic Commons &amp; Garden View
                    </p>
                  </div>
                  {/* Interactive Pass Code Badge */}
                  <button
                    type="button"
                    onClick={() => {
                      const res = reservations.find((r) => r.seatNumber === 'A14');
                      if (res) handleOpenDigitalPass(res);
                    }}
                    className="flex flex-col items-center bg-surface-container p-2 rounded-lg border border-surface-container-high hover:border-secondary transition-all cursor-pointer"
                    title="Click to view Pass #12513583-A"
                  >
                    <span className="material-symbols-outlined text-[28px] text-primary">qr_code_2</span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant font-bold mt-0.5 uppercase tracking-tighter">
                      Pass #12513583-A
                    </span>
                  </button>
                </div>

                {/* Schedule & Duration */}
                <div className="rounded-lg bg-surface-container-low p-3 mb-space-sm border border-surface-container">
                  <div className="flex items-center gap-2 text-primary font-title-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      calendar_today
                    </span>
                    <span>Tomorrow, Fri Oct 25 • 2:00 PM – 5:00 PM</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 pl-6">
                    Total Duration: 3 hours • Standing height-adjustable desk
                  </p>
                </div>

                {/* Features list */}
                <div className="flex flex-wrap gap-1.5 mb-space-md">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    Dual Monitors (27&quot;)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    Natural Daylight
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    Low Noise Zone
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="pt-space-sm border-t border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const res = reservations.find((r) => r.seatNumber === 'A14');
                      if (res) handleOpenDigitalPass(res);
                    }}
                    className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">nfc</span>
                    <span>Digital Pass / RFID Tap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('find-a-seat')}
                    className="px-3 py-2 rounded-lg border border-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                    <span>Modify</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-body-sm text-body-sm pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('find-a-seat')}
                    className="text-secondary hover:underline font-label-sm flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">near_me</span> Directions &amp; Access Waypoint
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel('mock-res-002', 'A14')}
                    className="text-error hover:underline font-label-sm font-semibold cursor-pointer"
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: UPCOMING RESERVATION (Graduate Tech Lab Pod D04) */}
            <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-space-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-space-sm">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface font-semibold mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                      CONFIRMED RESERVATION
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Pod D04 • 4K Dual Tech Workstation
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Floor 3 • Graduate Media &amp; Data Science Lab
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">desktop_windows</span>
                  </div>
                </div>

                {/* Schedule & Duration */}
                <div className="rounded-lg bg-surface-container-low p-3 mb-space-sm border border-surface-container">
                  <div className="flex items-center gap-2 text-primary font-title-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-secondary">event</span>
                    <span>Monday, Oct 28 • 9:00 AM – 1:00 PM</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 pl-6">
                    Total Duration: 4 hours • High-performance computing workstation
                  </p>
                </div>

                {/* Features list */}
                <div className="flex flex-wrap gap-1.5 mb-space-md">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    Dual 32&quot; 4K Displays
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    High-Speed Fiber Ethernet
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-label-sm font-label-sm">
                    Sound Dampening Enclosure
                  </span>
                </div>
              </div>

              {/* Action Row */}
              <div className="pt-space-sm border-t border-surface-container-high flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert('Calendar event added to your BYU student schedule.')}
                    className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                    <span>Add to Google / iCal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('find-a-seat')}
                    className="px-3.5 py-2 rounded-lg border border-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span>Edit</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-body-sm text-body-sm pt-1">
                  <span className="text-on-surface-variant font-label-sm text-label-sm">
                    RFID Tap Card #4992 active
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCancel('mock-res-003', 'D04')}
                    className="text-error hover:underline font-label-sm font-semibold cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED OR CANCELLED TAB CONTENT */}
        {(activeTab === 'completed' || activeTab === 'cancelled') && (
          <div className="bg-surface-container-lowest rounded-xl p-space-lg border border-surface-container-high shadow-xs">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-space-md">
              {activeTab === 'completed' ? 'Past Completed Study Sessions' : 'Cancelled & Released Passes'}
            </h3>
            {pastBookings.length === 0 ? (
              <p className="text-on-surface-variant font-body-md py-8 text-center">
                No records found matching current filters.
              </p>
            ) : (
              <div className="divide-y divide-surface-container">
                {pastBookings.map((res) => (
                  <div key={res.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container text-primary font-bold flex items-center justify-center text-label-md">
                        {res.seatNumber}
                      </div>
                      <div>
                        <div className="font-title-md text-primary font-semibold">
                          Seat {res.seatNumber} • {res.deskCode}
                        </div>
                        <div className="text-on-surface-variant font-body-sm">
                          {res.zoneName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-left sm:text-right">
                        <div className="font-label-md font-semibold text-on-surface">{res.date}</div>
                        <div className="font-tabular-numeric text-on-surface-variant text-body-sm">
                          {res.startTime} – {res.endTime} ({res.durationHours} hrs)
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-label-sm font-semibold ${
                          res.status === 'COMPLETED'
                            ? 'bg-surface-container text-on-surface'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {res.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('find-a-seat')}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm hover:bg-primary-container transition-colors cursor-pointer"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Study Zone Insights & Quick Library Amenities Notice */}
        <div className="rounded-xl bg-surface-container-lowest p-space-lg border border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-xs">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">notifications_active</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                Need silent group collaborative space?
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Level 04 Pods with 75&quot; touch collaboration boards open for 3-6 person study squads every Thursday evening.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('find-a-seat')}
            className="px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all flex-shrink-0 shadow-xs cursor-pointer font-semibold"
          >
            Explore Group Rooms
          </button>
        </div>
      </div>

      {/* Interactive Digital Pass Modal (from Phase 4) */}
      {selectedPassReservation && (
        <DigitalPassModal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          reservation={selectedPassReservation}
          onCheckInSuccess={() => {
            setFeedbackToast('RFID tap authenticated! Desk unlocked.');
            setIsPassModalOpen(false);
          }}
          onCancelReservation={() => {
            handleCancel(selectedPassReservation.reservationCode, selectedPassReservation.seatNumber);
            setIsPassModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default MyBookingsPage;

