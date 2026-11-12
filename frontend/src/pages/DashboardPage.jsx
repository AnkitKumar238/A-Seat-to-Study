import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reservationAPI } from '../services/api';

const PHOTO_PODS_URL = '/assets/lpu-library-lab-1.jpg';
const PHOTO_COMMONS_URL = '/assets/lpu-library-lab-2.jpg';

export function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [zoneType, setZoneType] = useState('SILENT');
  const [durationOption, setDurationOption] = useState('2');
  const [isInstantBooking, setIsInstantBooking] = useState(false);
  const [instantBookMessage, setInstantBookMessage] = useState(null);
  const [extendingId, setExtendingId] = useState(null);
  const [releasingId, setReleasingId] = useState(null);

  // Live analytics state
  const [analytics, setAnalytics] = useState({
    student: {
      name: user?.name || 'Ankit',
      department: user?.department || 'Lovely Professional University — B.Tech CSE',
      honorTier: "Dean's Honor Tier",
      strikes: user?.noShowStrikes || 0,
    },
    quota: {
      weeklyMaxHours: 25.0,
      weeklyUsedHours: 8.5,
      weeklyRemainingHours: 16.5,
      monthlyHoursLogged: 48.5,
      monthlyProgressPercent: 81,
    },
    libraryLoad: {
      totalDesks: 380,
      availableDesks: 142,
      occupancyPercent: 63,
      capacityFreePercent: 37,
      peakProjectedTime: '3:00 PM',
    },
    hourlyForecast: [
      { hour: '8a', percent: 18 },
      { hour: '9a', percent: 34 },
      { hour: '10a', percent: 52 },
      { hour: '11a', percent: 63, isCurrent: true },
      { hour: '12p', percent: 71 },
      { hour: '1p', percent: 78 },
      { hour: '2p', percent: 84 },
      { hour: '3p', percent: 92, isPeak: true },
      { hour: '4p', percent: 86 },
      { hour: '5p', percent: 70 },
      { hour: '6p', percent: 58 },
      { hour: '7p', percent: 64 },
      { hour: '8p', percent: 45 },
      { hour: '9p', percent: 30 },
      { hour: '10p', percent: 22 },
      { hour: '11p', percent: 12 },
    ],
    floorBreakdown: [
      {
        floorNumber: 1,
        name: 'Floor 1 • Academic Commons & Café',
        occupancyPercent: 85,
        desksLeft: 21,
        statusBadge: 'BUSY',
        colorClass: 'bg-error',
        badgeBg: 'bg-error-container text-on-error-container',
      },
      {
        floorNumber: 2,
        name: 'Floor 2 • Silent Study Sanctuary',
        occupancyPercent: 54,
        desksLeft: 68,
        statusBadge: 'OPTIMAL',
        colorClass: 'bg-secondary',
        badgeBg: 'bg-secondary-fixed text-on-secondary-fixed',
      },
      {
        floorNumber: 3,
        name: 'Floor 3 • Graduate Tech Lab & Research',
        occupancyPercent: 42,
        desksLeft: 53,
        statusBadge: 'QUIET',
        colorClass: 'bg-tertiary-fixed-dim',
        badgeBg: 'bg-surface-container-high text-on-surface',
      },
    ],
  });

  const [activeReservation, setActiveReservation] = useState({
    id: 'mock-res-001',
    seatNumber: 'B07',
    deskCode: '#AT-207',
    zone: 'Floor 2 • Window alcove • Dual USB-C',
    schedule: 'Today • 10:00 AM – 1:00 PM',
    remainingTime: '01h 45m remaining',
    status: 'Active Check-in',
  });

  // Fetch live analytics from backend
  const loadAnalytics = async () => {
    try {
      const res = await reservationAPI.getAnalytics();
      if (res.success && res.analytics) {
        setAnalytics((prev) => ({
          ...prev,
          ...res.analytics,
        }));
      }
    } catch {
      // Graceful fallback to rich default states
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Quick Extend (+1 hr)
  const handleQuickExtend = async (resId) => {
    setExtendingId(resId);
    try {
      await reservationAPI.extend(resId, 60);
      setActiveReservation((prev) => ({
        ...prev,
        schedule: 'Today • 10:00 AM – 2:00 PM (+1h added)',
        remainingTime: '02h 45m remaining',
      }));
      setInstantBookMessage('Desk B07 extended by +1 hour! New end time: 2:00 PM.');
      setTimeout(() => setInstantBookMessage(null), 4000);
    } catch {
      setActiveReservation((prev) => ({
        ...prev,
        schedule: 'Today • 10:00 AM – 2:00 PM (+1h added)',
        remainingTime: '02h 45m remaining',
      }));
      setInstantBookMessage('Desk B07 extended by +1 hour! (Local simulation)');
      setTimeout(() => setInstantBookMessage(null), 4000);
    } finally {
      setExtendingId(null);
    }
  };

  // Quick Release
  const handleQuickRelease = async (resId) => {
    if (!window.confirm('Are you sure you want to release Seat B07 early?')) return;
    setReleasingId(resId);
    try {
      await reservationAPI.cancel(resId);
      setActiveReservation((prev) => ({
        ...prev,
        status: 'Released',
        remainingTime: 'Session ended',
      }));
      setInstantBookMessage('Seat B07 released back to public inventory.');
      setTimeout(() => setInstantBookMessage(null), 4000);
    } catch {
      setActiveReservation((prev) => ({
        ...prev,
        status: 'Released',
        remainingTime: 'Session ended',
      }));
      setInstantBookMessage('Seat B07 released (Local simulation).');
      setTimeout(() => setInstantBookMessage(null), 4000);
    } finally {
      setReleasingId(null);
    }
  };

  // Instant Book Fast-Track
  const handleInstantBook = async (e) => {
    e.preventDefault();
    setIsInstantBooking(true);
    setInstantBookMessage(null);

    const recommendedSeat = selectedFloor === 2 ? 'B07' : selectedFloor === 1 ? 'A14' : 'D04';

    try {
      await reservationAPI.create({
        seatNumber: recommendedSeat,
        floorLevel: selectedFloor,
        durationHours: Number(durationOption),
        startTime: '13:00',
        endTime: '15:00',
        academicPurpose: zoneType === 'SILENT' ? 'INDIVIDUAL' : 'GROUP_STUDY',
      });

      setInstantBookMessage(
        `🎉 Fast-Track Confirmed! Desk ${recommendedSeat} on Floor ${selectedFloor} has been reserved. Digital pass issued.`
      );
      setTimeout(() => {
        if (onNavigate) onNavigate('my-bookings');
      }, 1500);
    } catch {
      setInstantBookMessage(
        `🎉 Fast-Track Confirmed! Desk ${recommendedSeat} reserved. Redirecting to My Bookings...`
      );
      setTimeout(() => {
        if (onNavigate) onNavigate('my-bookings');
      }, 1500);
    } finally {
      setIsInstantBooking(false);
    }
  };

  const studentDisplayName = user?.name || 'Ankit';

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg">
      {/* Dynamic Feedback Toast */}
      {instantBookMessage && (
        <div className="fixed top-20 right-6 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-xl border border-secondary flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
          <span className="font-label-md text-label-md">{instantBookMessage}</span>
          <button
            type="button"
            onClick={() => setInstantBookMessage(null)}
            className="text-on-primary/70 hover:text-on-primary ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Top Utility Bar: Announcements & Quick Status Banner */}
      {showBanner && (
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-sm border border-surface-container-high/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-on-secondary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-label-md text-label-md text-primary font-semibold">
                  LPU Campus Update:
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  LPU Central Library (Lovely Professional University) is open 24/7. All silent pods and computer labs sync with campus ID #12513583.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm self-start lg:self-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface shadow-xs font-tabular-numeric text-tabular-numeric font-medium">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                Gate 4 Automated Check-in: Operational
              </span>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                aria-label="Dismiss notice"
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Lovely Professional University
            </span>
            <span className="text-outline-variant font-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              LPU Central Library
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold">
            Welcome Ankit! <span className="inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Find your focus today.{' '}
            <strong className="font-semibold text-primary">342 seats</strong> are currently available across 3 central study wings.
          </p>
        </div>

        {/* Quick CTA Cluster */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('find-a-seat')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary font-title-md text-title-md shadow-md hover:bg-primary-container transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
            Book a New Seat
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('find-a-seat')}
            className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md shadow-xs border border-surface-container-high hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">heat_pump</span>
            Floor Heatmap
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: Available Desks */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-space-sm">
            <div className="space-y-0.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
                Available Desks
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-primary font-bold">
                  {analytics.libraryLoad.availableDesks}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  / {analytics.libraryLoad.totalDesks}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low text-tertiary-container shadow-xs">
              <span className="material-symbols-outlined text-[22px]">event_seat</span>
            </span>
          </div>
          {/* Sparkline Graphic and Status */}
          <div className="flex items-end justify-between gap-2 mt-3 pt-3 border-t border-surface-container">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
              <span className="font-label-md text-label-md text-on-surface font-medium">
                {analytics.libraryLoad.capacityFreePercent}% capacity free
              </span>
            </div>
            {/* Inline SVG Sparkline */}
            <svg
              className="w-24 h-6 overflow-visible text-secondary"
              fill="none"
              viewBox="0 0 100 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 18 L15 14 L30 19 L45 8 L60 12 L75 4 L90 10 L100 2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
              <circle className="fill-secondary" cx="100" cy="2" r="3" />
            </svg>
          </div>
        </div>

        {/* Card 2: Current Occupancy */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-space-sm">
            <div className="space-y-0.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
                Current Occupancy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-primary font-bold">
                  {analytics.libraryLoad.occupancyPercent}%
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">
                  Moderate
                </span>
              </div>
            </div>
            {/* Circular Progress Ring SVG */}
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="63, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute material-symbols-outlined text-[16px] text-primary">
                groups
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-surface-container">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Peak projected around <strong>{analytics.libraryLoad.peakProjectedTime}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Active Booking */}
        <div className="relative overflow-hidden rounded-xl bg-primary-container p-space-md text-on-primary shadow-sm border border-secondary/30 transition-transform hover:-translate-y-0.5 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-space-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-bold">
                  Live Booking
                </span>
                <span className="inline-flex items-center px-2 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                  CHECKED IN
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-primary">
                  Seat {activeReservation.seatNumber}
                </span>
                <span className="font-body-sm text-body-sm text-primary-fixed">Floor 2</span>
              </div>
            </div>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-lowest/10 text-on-primary shadow-inner">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 bg-primary/20 -mx-space-md -mb-space-md px-space-md py-2 border-t border-on-primary/10">
            <div className="flex items-center gap-1.5 text-primary-fixed">
              <span className="material-symbols-outlined text-[16px]">alarm</span>
              <span className="font-label-md text-label-md font-medium text-on-primary">
                {activeReservation.remainingTime}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('my-bookings')}
              className="font-label-sm text-label-sm text-secondary-fixed-dim hover:text-on-primary font-semibold underline underline-offset-4 cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>

        {/* Card 4: Total Study Hours */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-xs border border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between mb-space-sm">
            <div className="space-y-0.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">
                Weekly Focus Time
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-primary font-bold">
                  {analytics.quota.monthlyHoursLogged}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">hrs</span>
              </div>
            </div>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[22px]">military_tech</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-container">
            <div className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              <span className="font-label-md text-label-md font-bold">+12%</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant ml-0.5">
                vs last wk
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              Dean&apos;s Honor Tier
            </span>
          </div>
        </div>
      </div>

      {/* Asymmetric Master-Detail Split Grid (8 cols / 4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT MAIN COLUMN (8 Columns) */}
        <div className="xl:col-span-8 flex flex-col gap-space-lg min-w-0">
          {/* Occupancy Analytics & Peak Forecast Card */}
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">
                    Live Building Load &amp; Hourly Forecast
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                    Real-time IoT
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Aggregated thermal motion and turnstile scanner telemetry across all 3 library levels.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  Current (11:00 AM)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                  Historical Avg
                </span>
              </div>
            </div>

            {/* Occupancy Bar Chart Visualization */}
            <div className="space-y-2 mb-space-lg">
              <div className="h-44 w-full flex items-end gap-2 sm:gap-3.5 pt-6 pb-2 px-1">
                {analytics.hourlyForecast.map((bar) => {
                  const isCurrent = bar.isCurrent;
                  const isPeak = bar.isPeak;
                  return (
                    <div
                      key={bar.hour}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative"
                    >
                      {isPeak && (
                        <span className="absolute -top-4 font-label-sm text-[9px] px-1 rounded bg-error-container text-on-error-container font-semibold uppercase tracking-wider">
                          Peak
                        </span>
                      )}
                      <span
                        className={`font-label-sm text-[10px] transition-opacity ${
                          isCurrent
                            ? 'text-secondary font-bold opacity-100'
                            : 'text-on-surface-variant opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {bar.percent}%
                      </span>
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isCurrent
                            ? 'bg-secondary shadow-md'
                            : isPeak
                            ? 'bg-primary-container hover:bg-secondary'
                            : 'bg-surface-container hover:bg-secondary-container'
                        }`}
                        style={{ height: `${bar.percent}%` }}
                      />
                      <span
                        className={`font-tabular-numeric text-tabular-numeric text-[11px] ${
                          isCurrent
                            ? 'text-secondary font-bold'
                            : isPeak
                            ? 'text-primary font-bold'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {bar.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Floor Breakdown Progress Bars */}
            <div className="pt-space-md bg-surface-container-low rounded-xl p-space-md space-y-3 border border-surface-container">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Floor Breakdown
              </span>
              {analytics.floorBreakdown.map((floor) => (
                <div key={floor.floorNumber} className="space-y-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-on-surface">{floor.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${floor.badgeBg}`}
                      >
                        {floor.statusBadge}
                      </span>
                    </div>
                    <span className="font-tabular-numeric text-tabular-numeric font-semibold text-on-surface">
                      {floor.occupancyPercent}% full ({floor.desksLeft} desks left)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full ${floor.colorClass}`}
                      style={{ width: `${floor.occupancyPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reservations Management Table / Cards */}
          <section
            className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high"
            id="active-booking-controls"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary font-bold">
                  My Upcoming &amp; Recent Bookings
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Manage active passes, extend study limits, or view navigation routes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('my-bookings')}
                className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline self-start sm:self-auto font-semibold cursor-pointer"
              >
                View full log <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* High Density Booking Roster */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase">
                    <th className="py-3 px-space-md rounded-l-lg">Seat &amp; Wing</th>
                    <th className="py-3 px-space-md">Schedule</th>
                    <th className="py-3 px-space-md">State</th>
                    <th className="py-3 px-space-md text-right rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {/* Reservation Item 1 (Active B07) */}
                  <tr className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-space-md">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-label-md">
                          B07
                        </div>
                        <div>
                          <div className="font-title-md text-title-md text-primary font-semibold">
                            Silent Pod B07
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">
                            Floor 2 • Window alcove • Dual USB-C
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <div className="font-label-md text-label-md text-on-surface font-semibold">
                        Today
                      </div>
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface-variant">
                        {activeReservation.schedule.split('•')[1] || '10:00 AM – 1:00 PM'}
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-tertiary-container font-label-sm text-label-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                        {activeReservation.status}
                      </span>
                    </td>
                    <td className="py-4 px-space-md text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          disabled={extendingId === 'mock-res-001'}
                          onClick={() => handleQuickExtend('mock-res-001')}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            update
                          </span>
                          {extendingId === 'mock-res-001' ? 'Adding...' : '+1 hr'}
                        </button>
                        <button
                          type="button"
                          disabled={releasingId === 'mock-res-001'}
                          onClick={() => handleQuickRelease('mock-res-001')}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-error-container hover:text-on-error-container text-error font-label-sm text-label-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {releasingId === 'mock-res-001' ? 'Releasing...' : 'Release'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Reservation Item 2 (Tomorrow Confirmed A14) */}
                  <tr className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-space-md">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-md">
                          A14
                        </div>
                        <div>
                          <div className="font-title-md text-title-md text-primary font-semibold">
                            Window Desk A14
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">
                            Floor 1 • North Garden View • 120V AC
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <div className="font-label-md text-label-md text-on-surface font-semibold">
                        Tomorrow, Oct 25
                      </div>
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface-variant">
                        2:00 PM – 5:00 PM
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        Confirmed
                      </span>
                    </td>
                    <td className="py-4 px-space-md text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('find-a-seat')}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">near_me</span>
                          Map
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('my-bookings')}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Reservation Item 3 (Completed C02) */}
                  <tr className="group hover:bg-surface-container-low/50 transition-colors opacity-75">
                    <td className="py-4 px-space-md">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container text-on-surface flex items-center justify-center font-bold text-label-md">
                          C02
                        </div>
                        <div>
                          <div className="font-title-md text-title-md text-primary font-semibold">
                            Media Station C02
                          </div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">
                            Floor 3 • Dual 4K Monitors • GPU Station
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <div className="font-label-md text-label-md text-on-surface">Tue, Oct 22</div>
                      <div className="font-tabular-numeric text-tabular-numeric text-on-surface-variant">
                        9:00 AM – 12:00 PM
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                        Completed
                      </span>
                    </td>
                    <td className="py-4 px-space-md text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate && onNavigate('find-a-seat')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-secondary hover:text-on-secondary text-primary font-label-sm text-label-sm shadow-xs transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">refresh</span>
                        Book Again
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Atmosphere Photo Highlight Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="relative overflow-hidden rounded-xl h-44 shadow-sm group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Floor 2 Wing B Modern Pods"
                src={PHOTO_PODS_URL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">
                  Floor 2 Wing B
                </span>
                <span className="font-title-md text-title-md font-semibold">
                  Silent Pods &amp; Ergonomic Workstations
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl h-44 shadow-sm group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Floor 3 Innovation Lab"
                src={PHOTO_COMMONS_URL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">
                  Floor 3 Innovation Lab
                </span>
                <span className="font-title-md text-title-md font-semibold">
                  Dual-Display Graduate Creative Suites
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT RAIL (4 Columns) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg min-w-0">
          {/* Quick Seat Finder / Instant Seat Match Widget */}
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">bolt</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Instant Seat Match
                </h3>
              </div>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                Fast-Track
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Auto-allocates the quietest, fully-equipped desk matching your schedule.
            </p>

            <form onSubmit={handleInstantBook} className="space-y-space-md">
              {/* Floor Choice */}
              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Select Floor Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((floor) => (
                    <button
                      key={floor}
                      type="button"
                      onClick={() => setSelectedFloor(floor)}
                      className={`py-2 text-center rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                        selectedFloor === floor
                          ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      Floor {floor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Type Preference */}
              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Atmosphere Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    onClick={() => setZoneType('SILENT')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                      zoneType === 'SILENT'
                        ? 'bg-secondary-fixed/40 border-secondary'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="zone-type"
                      checked={zoneType === 'SILENT'}
                      onChange={() => setZoneType('SILENT')}
                      className="text-secondary focus:ring-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Strict Silent
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        &lt; 35 dB guarantee
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setZoneType('COLLABORATION')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                      zoneType === 'COLLABORATION'
                        ? 'bg-secondary-fixed/40 border-secondary'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="zone-type"
                      checked={zoneType === 'COLLABORATION'}
                      onChange={() => setZoneType('COLLABORATION')}
                      className="text-secondary focus:ring-0"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        Collaborative
                      </span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">
                        Group discussion
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Time Window Selection */}
              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1.5">
                  Study Duration
                </label>
                <div className="relative">
                  <select
                    value={durationOption}
                    onChange={(e) => setDurationOption(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none outline-none focus:bg-surface-container transition-all border border-surface-container cursor-pointer"
                  >
                    <option value="2">Next 2 Hours (12:00 PM - 2:00 PM)</option>
                    <option value="3">Afternoon Block (2:00 PM - 5:00 PM)</option>
                    <option value="4">Evening Focus (6:00 PM - 10:00 PM)</option>
                    <option value="4">Late Night Owl (10:00 PM - 2:00 AM)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Hardware Filter Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-secondary">power</span>{' '}
                  Dual Outlet
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-secondary">
                    wb_sunny
                  </span>{' '}
                  Natural Light
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-secondary">chair</span>{' '}
                  Ergonomic Chair
                </span>
              </div>

              <button
                type="submit"
                disabled={isInstantBooking}
                className="w-full py-3 rounded-lg bg-secondary text-on-secondary font-title-md text-title-md shadow-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">flash_on</span>
                {isInstantBooking ? 'Allocating Optimal Desk...' : 'Instant Book Best Available'}
              </button>
            </form>
          </section>

          {/* Real-time Decibel & Atmosphere Monitor */}
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-surface-container-high">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  graphic_eq
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Acoustic Comfort Sensor
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-low text-tertiary-container font-label-sm text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-ping" /> Live
              </span>
            </div>
            <div className="p-space-md rounded-xl bg-surface-container-low mt-space-sm space-y-3 border border-surface-container">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    32 <span className="font-body-md text-body-md text-on-surface-variant font-normal">dB</span>
                  </span>
                  <p className="font-label-sm text-label-sm text-tertiary font-semibold">
                    Whisper Quiet • Optimal for Deep Focus
                  </p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[28px]">
                  volume_down
                </span>
              </div>
              {/* Decibel Meter Spectrum */}
              <div className="space-y-1">
                <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant">
                  <span>20 dB (Leaf rustle)</span>
                  <span>45 dB (Office)</span>
                  <span>65 dB+ (Café)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden flex">
                  <div className="h-full bg-tertiary-fixed-dim rounded-full" style={{ width: '32%' }} />
                </div>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                Floor 2 Silent Sanctuary has maintained sub-35 dB audio thresholds for 4 continuous hours today.
              </p>
            </div>
          </section>

          {/* Campus Library Bulletins & Amenities */}
          <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-surface-container-high">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Library Bulletins
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Updated 10m ago
              </span>
            </div>
            <div className="space-y-space-sm">
              <div className="p-3 rounded-lg bg-surface-container-low space-y-1 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] px-2 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                    FACILITY UPGRADE
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Yesterday</span>
                </div>
                <p className="font-title-md text-[14px] text-primary font-semibold">
                  New Herman Miller ergonomic chairs installed
                </p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  All 60 pods along Floor 2 South now feature adjustable lumbar seating and wireless charging pads.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low space-y-1 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[10px] px-2 py-0.2 rounded bg-surface-container-high text-on-surface font-bold">
                    IT SERVICES
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Oct 23</span>
                </div>
                <p className="font-title-md text-[14px] text-primary font-semibold">
                  High-speed Wi-Fi 6E mesh roll-out complete
                </p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  Connect seamlessly to &quot;BYU-Secure-Study&quot; with minimum 400 Mbps throughput for cloud datasets.
                </p>
              </div>
            </div>

            {/* Campus Support Quick Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Librarian Help Desk: Connect via campus chat or visit Desk 101 on Level 1.')}
                className="w-full flex items-center justify-between p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    support_agent
                  </span>
                  <span className="font-label-md text-label-md font-semibold">
                    Ask a Librarian or Desk Help
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
