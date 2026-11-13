import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reservationAPI } from '../services/api';
import { DigitalPassModal } from '../components/booking/DigitalPassModal';

const DESK_PERSPECTIVE_IMAGE = '/assets/lpu-library-lab-2.jpg';

export const SeatBookingPage = ({ seat = null, onNavigate }) => {
  const { user } = useAuth();

  const selectedSeat = seat || {
    seatNumber: 'B07',
    deskCode: '#AT-207',
    zoneName: 'Zone B • Collaborative Study Hub (Center Atrium)',
    floorLevel: 2,
    powerSpecs: '2x 100W USB-C + Dual AC Outlet',
  };

  const studentName = user?.name || 'Ankit Singh Rathore';
  const studentId = user?.studentId || '12513583';

  // Booking Configuration State
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Today
  const [durationHours, setDurationHours] = useState(2.0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(3); // 14:00 - 16:00
  const [academicPurpose, setAcademicPurpose] = useState('INDIVIDUAL');
  const [smsNotification, setSmsNotification] = useState(true);
  const [companionMode, setCompanionMode] = useState(false);

  // Countdown timer for 15-min hold in banner
  const [holdSeconds, setHoldSeconds] = useState(13 * 60 + 42);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePass, setActivePass] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const days = [
    { label: 'Today', num: '24', day: 'Thu, Oct', active: true },
    { label: 'Tomorrow', num: '25', day: 'Fri, Oct', active: false },
    { label: 'Sat', num: '26', day: 'Oct', active: false },
    { label: 'Sun', num: '27', day: 'Oct', active: false },
    { label: 'Mon', num: '28', day: 'Oct', active: false },
    { label: 'Tue', num: '29', day: 'Oct', active: false },
  ];

  const slots = [
    { time: '08:00 – 10:00', status: 'PAST', label: 'Past Time Window' },
    { time: '10:00 – 12:00', status: 'OCCUPIED', label: 'Occupied by Peer' },
    { time: '12:00 – 14:00', status: 'CONCLUDED', label: 'Just Concluded' },
    { time: '14:00 – 16:00', status: 'SELECTED', label: 'Selected Slot' },
    { time: '16:00 – 18:00', status: 'AVAILABLE', label: 'Available' },
    { time: '18:00 – 20:00', status: 'AVAILABLE', label: 'Available' },
    { time: '20:00 – 22:00', status: 'AVAILABLE', label: 'Available (Late Shift)' },
  ];

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    const currentSlot = slots[selectedSlotIndex] || slots[3];
    const [start, end] = currentSlot.time.split(' – ');

    try {
      const response = await reservationAPI.create({
        seatNumber: selectedSeat.seatNumber,
        floorLevel: selectedSeat.floorLevel || 2,
        durationHours,
        startTime: start,
        endTime: end,
        academicPurpose,
        smsNotification,
        companionMode,
      });

      if (response.success && response.reservation) {
        setActivePass(response.reservation);
      }
    } catch (err) {
      console.warn('Booking API fallback:', err.message);
      // Fallback pass for instant dev testing
      setActivePass({
        id: `PASS-LPU-12513583-${selectedSeat.seatNumber}`,
        reservationCode: `PASS-LPU-12513583-${selectedSeat.seatNumber}`,
        userName: studentName,
        studentId,
        seatNumber: selectedSeat.seatNumber,
        deskCode: selectedSeat.deskCode || '#AT-207',
        zoneName: selectedSeat.zoneName,
        startTime: start,
        endTime: end,
        durationHours,
        status: 'CONFIRMED',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-md">
      {/* Top Flow Navigation & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-sm">
        <div className="flex items-center flex-wrap gap-2 text-on-surface-variant font-label-md text-label-md">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('find-a-seat')}
            className="hover:text-secondary flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Find a Seat</span>
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface-variant">Level 02 Sanctuary</span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface-variant">Collaborative Hub</span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-title-md text-title-md font-bold">
            Seat {selectedSeat.seatNumber} Booking
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate && onNavigate('find-a-seat')}
          className="inline-flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container shadow-sm transition-all self-start md:self-auto font-label-md text-label-md cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Floor Map</span>
        </button>
      </div>

      {/* Header Banner with Live Hold Countdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm relative overflow-hidden border border-surface-container-high/30">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-secondary-fixed opacity-40 blur-2xl pointer-events-none" />
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Step 2 of 2
            </span>
            <span className="text-outline-variant text-label-sm">•</span>
            <span className="text-on-surface-variant font-label-sm text-label-sm">Reservation Hold Active</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Complete Your Seat Reservation
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Reserve your study spot with precision. An instant RFID pass and desk unlock code will be issued upon immediate confirmation.
          </p>
        </div>

        {/* Countdown Timer Pill Component */}
        <div className="z-10 flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl self-start lg:self-center shadow-xs border border-surface-container">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <circle className="stroke-surface-container-high" cx="18" cy="18" fill="none" r="14" strokeWidth="3" />
              <circle
                className="stroke-secondary transition-all duration-1000"
                cx="18"
                cy="18"
                fill="none"
                r="14"
                strokeDasharray="88"
                strokeDashoffset={88 - (holdSeconds / (15 * 60)) * 88}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <span className="material-symbols-outlined text-secondary text-[16px] absolute">hourglass_top</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Temporary Hold
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-tabular-numeric text-title-md text-primary font-bold">
                {formatTimer(holdSeconds)}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Reservation Configuration (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Selected Desk Showcase Banner */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high/30">
            <div className="flex flex-wrap items-start justify-between gap-space-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm">
                  {selectedSeat.seatNumber}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Seat {selectedSeat.seatNumber}
                    </span>
                    <span className="font-tabular-numeric text-body-sm text-on-surface-variant px-2 py-0.5 rounded bg-surface-container-high font-semibold">
                      Desk {selectedSeat.deskCode || '#AT-207'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
                      Ready to Claim
                    </span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {selectedSeat.zoneName} • Floor {selectedSeat.floorLevel}: Silent Study Sanctuary
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-secondary font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Premium Tier Node</span>
              </div>
            </div>

            {/* Amenities Mosaic Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">2x 100W USB-C</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Dual AC Outlet Built-in</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">wifi</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Wi-Fi 6E (650 Mbps)</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Dedicated AP Overhead</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">chair</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Ergonomic Mesh</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Steelcase Gesture model</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">volume_down</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Noise: ~34 dB</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Low chatter ambient</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">draw</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Whiteboard Access</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Personal mobile divider</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Natural Daylight</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">South-facing skylight</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection Section */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">calendar_month</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Select Reservation Date</h2>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors font-label-md text-label-md px-2 py-1 rounded-md bg-secondary-fixed/50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                <span>Browse Full Calendar</span>
              </button>
            </div>

            {/* Weekly Strip */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {days.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDay(idx)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all text-center cursor-pointer ${
                    selectedDay === idx
                      ? 'bg-primary-container text-on-primary shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className={`font-label-sm text-label-sm uppercase tracking-wider ${selectedDay === idx ? 'text-secondary-fixed font-bold' : 'text-on-surface-variant'}`}>
                    {item.label}
                  </span>
                  <span className="font-headline-md text-headline-md my-0.5 leading-none font-bold">
                    {item.num}
                  </span>
                  <span className={`font-body-sm text-body-sm ${selectedDay === idx ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>
                    {item.day}
                  </span>
                  {selectedDay === idx && <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim" />}
                </button>
              ))}
            </div>
          </div>

          {/* Time Duration & Window */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[20px]">nest_clock_farsight_analog</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Time Duration &amp; Window</h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                Max concurrent block: 4.0 Hours
              </span>
            </div>

            {/* Duration Quick Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-md text-label-md text-on-surface-variant mr-1 font-medium">Quick pick:</span>
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDurationHours(hrs)}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                    durationHours === hrs
                      ? 'bg-secondary text-on-secondary shadow-sm font-bold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {hrs === 2 ? '2 Hours (Recommended)' : hrs === 4 ? '4 Hours (Max)' : `${hrs} Hour${hrs > 1 ? 's' : ''}`}
                </button>
              ))}
            </div>

            {/* Visual Slot Timeline */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Schedule for Seat {selectedSeat.seatNumber} (Today)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {slots.map((item, idx) => {
                  const isPast = item.status === 'PAST' || item.status === 'CONCLUDED';
                  const isOccupied = item.status === 'OCCUPIED';
                  const isSelected = selectedSlotIndex === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isPast || isOccupied}
                      onClick={() => setSelectedSlotIndex(idx)}
                      className={`p-3 rounded-lg flex flex-col justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-surface-container-lowest shadow-md ring-2 ring-secondary ring-offset-2 relative overflow-hidden bg-gradient-to-br from-surface-container-low to-surface-container-lowest'
                          : isOccupied
                          ? 'bg-error-container/40 opacity-70 cursor-not-allowed'
                          : isPast
                          ? 'bg-surface-container-low/60 opacity-60 cursor-not-allowed'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />}
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-tabular-numeric text-tabular-numeric font-semibold ${isSelected ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                          {item.time}
                        </span>
                        {isSelected ? (
                          <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        ) : isOccupied ? (
                          <span className="w-2 h-2 rounded-full bg-error" />
                        ) : isPast ? (
                          <span className="w-2 h-2 rounded-full bg-outline" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-on-tertiary-container" />
                        )}
                      </div>
                      <span className={`font-label-sm text-label-sm mt-2 font-medium ${
                        isSelected
                          ? 'text-secondary font-bold'
                          : isOccupied
                          ? 'text-error'
                          : isPast
                          ? 'text-on-surface-variant'
                          : 'text-on-tertiary-container'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Study Purpose & Custom Preferences */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container-high/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-[20px]">psychology</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Study Purpose &amp; Custom Preferences
              </h2>
            </div>

            {/* Academic Intent Pills */}
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Academic Intent (Categorizes floor acoustics)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'INDIVIDUAL', label: 'Individual Focused Study', icon: 'menu_book' },
                  { id: 'GROUP', label: 'Group Discussion', icon: 'forum' },
                  { id: 'EXAM', label: 'Exam Preparation', icon: 'edit_note' },
                  { id: 'RESEARCH', label: 'Lab Research / Thesis', icon: 'science' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAcademicPurpose(item.id)}
                    className={`px-3.5 py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                      academicPurpose === item.id
                        ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={smsNotification}
                  onChange={(e) => setSmsNotification(e.target.checked)}
                  className="mt-0.5 rounded text-secondary focus:ring-secondary h-4 w-4 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Send SMS notification 15 minutes prior to check-in deadline
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Dispatched to registered campus device with quick one-tap verification URL.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low/70 hover:bg-surface-container cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={companionMode}
                  onChange={(e) => setCompanionMode(e.target.checked)}
                  className="mt-0.5 rounded text-secondary focus:ring-secondary h-4 w-4 cursor-pointer"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Silent Companion Mode</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed uppercase">
                      Opt-in
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Flags adjacent desks to be prioritized for quiet peers studying similar subjects.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Institutional Reservation Policies */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-3 border border-surface-container-high/30">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">policy</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Institutional Reservation Policies
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">timer</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">15-Minute Grace Window</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Students must tap their physical student RFID badge or scan the desk QR code within 15 minutes of start time. Unclaimed desks are automatically re-assigned to walk-ins.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
                <span className="material-symbols-outlined text-on-tertiary-container text-[22px] mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">Flexible Cancellation</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Free cancellation is permitted up to 5 minutes before scheduled start time with zero negative strikes recorded against your semester study quota.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Summary Card & Confirmation (4 Cols on Desktop) */}
        <div className="lg:col-span-4 sticky top-20 flex flex-col gap-space-md">
          {/* Primary Summary Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-surface-container-high/30">
            {/* Perspective View Banner */}
            <div className="relative h-44 w-full bg-primary-container overflow-hidden">
              <img
                alt={`Seat ${selectedSeat.seatNumber} atrium view`}
                className="w-full h-full object-cover opacity-85"
                src={DESK_PERSPECTIVE_IMAGE}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-on-primary">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-semibold">
                    Atrium Perspective
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-primary font-bold">
                    Zone B • Seat {selectedSeat.seatNumber}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-tabular-numeric text-tabular-numeric flex items-center gap-1 shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                  <span>Level 02</span>
                </div>
              </div>
            </div>

            {/* Breakdown Details */}
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/40">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Reservation Summary</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  Standard Pass
                </span>
              </div>

              <div className="flex flex-col gap-2.5 font-body-sm text-body-sm">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    <span>Campus Library</span>
                  </span>
                  <span className="font-title-md text-title-md text-right font-semibold">LPU Central Library</span>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>Student</span>
                  </span>
                  <span className="font-title-md text-title-md text-right font-semibold flex items-center gap-2">
                    <img
                      src={user?.avatarUrl || '/assets/ankit-singh-rathore.jpg'}
                      alt={studentName}
                      className="w-6 h-6 rounded-full object-cover border border-secondary/40 shrink-0"
                    />
                    <span>{studentName} ({studentId})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">event</span>
                    <span>Date</span>
                  </span>
                  <span className="font-title-md text-title-md text-right font-semibold">Today, Oct 24</span>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Allocated Time</span>
                  </span>
                  <span className="font-tabular-numeric text-tabular-numeric font-bold text-secondary text-right">
                    {slots[selectedSlotIndex]?.time} ({durationHours} hrs)
                  </span>
                </div>
              </div>

              {/* Quota Metric Bar */}
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                    Weekly Study Quota
                  </span>
                  <span className="font-tabular-numeric text-label-sm text-on-surface font-bold">
                    {durationHours} hrs deducted
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '34%' }} />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                  <span>8.5 hrs used this week</span>
                  <span className="font-bold text-on-surface">16.5 hrs remaining</span>
                </div>
              </div>

              {/* Total Fee: $0.00 Covered */}
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/40">
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-bold">Institutional Fee</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Covered by Student Library Dues</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">$0.00</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">USD</span>
                </div>
              </div>

              {/* Primary Confirm Action CTA */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmReservation}
                  className="w-full py-3.5 px-4 rounded-xl bg-secondary hover:bg-primary-container text-on-secondary font-title-md text-title-md font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all group cursor-pointer active:scale-[0.99] disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                      <span>Issuing RFID Keypass...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                        lock
                      </span>
                      <span>Confirm Reservation (Seat {selectedSeat.seatNumber})</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('find-a-seat')}
                  className="w-full py-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 text-center font-label-md text-label-md transition-colors cursor-pointer"
                >
                  Cancel &amp; Release Hold
                </button>
              </div>

              {/* Trust & Verification Points */}
              <div className="pt-2 flex flex-col gap-2 text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container-high/40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">qr_code_2</span>
                  <span>Instant Digital Pass generated for Apple &amp; Google Wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">contactless</span>
                  <span>RFID Card tap available at Desk {selectedSeat.seatNumber} pillar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">sanitizer</span>
                  <span>Sanitized &amp; inspected 15 mins ago by facility team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-3 shadow-sm border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[22px]">lightbulb</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">Pro-Tip for Collaborative Hub</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Seat {selectedSeat.seatNumber} includes direct sightlines to the presentation screen in Pod 2. Bring HDMI or USB-C adapter if sharing displays.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal upon Booking Confirmation */}
      {activePass && (
        <DigitalPassModal
          reservation={activePass}
          onClose={() => {
            setActivePass(null);
            if (onNavigate) onNavigate('my-bookings');
          }}
          onStatusChange={(newStatus) => {
            if (newStatus === 'CANCELLED') {
              setActivePass(null);
              if (onNavigate) onNavigate('find-a-seat');
            }
          }}
        />
      )}
    </div>
  );
};

export default SeatBookingPage;

