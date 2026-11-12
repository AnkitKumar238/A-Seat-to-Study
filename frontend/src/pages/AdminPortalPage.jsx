import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

export function AdminPortalPage() {
  const { user } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview' | 'seats' | 'students' | 'gates'
  const [emergencyProtocolActive, setEmergencyProtocolActive] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Quick Seat Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideSeatNumber, setOverrideSeatNumber] = useState('A04');
  const [overrideStatus, setOverrideStatus] = useState('MAINTENANCE');
  const [overrideNote, setOverrideNote] = useState('Smart socket dropped electrical feed; maintenance ticket #4102');
  const [isSubmittingOverride, setIsSubmittingOverride] = useState(false);

  // Student Search / Filter
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');

  // Turnstile Gates State
  const [gates, setGates] = useState([
    { id: 'gate-1', name: 'Turnstile Gate 01 (North Lobby)', status: 'OPERATIONAL', latencyMs: 8, totalSwipesToday: 412 },
    { id: 'gate-2', name: 'Turnstile Gate 02 (Center Atrium)', status: 'OPERATIONAL', latencyMs: 11, totalSwipesToday: 518 },
    { id: 'gate-3', name: 'Turnstile Gate 03 (South Commons)', status: 'OPERATIONAL', latencyMs: 9, totalSwipesToday: 214 },
    { id: 'gate-4', name: 'Turnstile Gate 04 (Graduate East Wing)', status: 'OPERATIONAL', latencyMs: 12, totalSwipesToday: 104 },
  ]);

  // Operational Logs (Live Stream)
  const [logs, setLogs] = useState([
    {
      id: 'log-001',
      time: '14:32',
      category: 'Check-In',
      studentName: 'Ankit (12513583)',
      eventDetail: 'Authenticated via RFID Turnstile Gate 02',
      targetUnit: 'Desk B07',
      floorName: 'Floor 2 Sanctuary',
      statusColor: 'tertiary',
    },
    {
      id: 'log-002',
      time: '14:28',
      category: 'Auto-Release',
      studentName: '15-minute grace period expired',
      eventDetail: 'Student ID: 2023-4109 • Desk returned to public booking pool',
      targetUnit: 'Seat C12',
      floorName: 'Floor 2 Sanctuary',
      statusColor: 'error',
    },
    {
      id: 'log-003',
      time: '14:20',
      category: 'IoT Fault',
      studentName: 'Smart Power Outlet Offline',
      eventDetail: 'Zero voltage telemetry reported by hardware switch',
      targetUnit: 'Desk A04',
      floorName: 'Floor 1 Commons',
      statusColor: 'warning',
    },
    {
      id: 'log-004',
      time: '14:15',
      category: 'Reservation',
      studentName: 'Liam Chen (2025-1102)',
      eventDetail: 'Booked duration: 3.0 Hours (16:00 – 19:00)',
      targetUnit: 'Pod D02',
      floorName: 'Floor 3 Tech Lab',
      statusColor: 'secondary',
    },
    {
      id: 'log-005',
      time: '14:02',
      category: 'Sanitized',
      studentName: 'Custodial Routine Complete',
      eventDetail: 'Cleared maintenance lock • Re-enabled in student portal',
      targetUnit: 'Pod D04',
      floorName: 'Floor 3 Tech Lab',
      statusColor: 'tertiary',
    },
  ]);

  // Immediate Action Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 'alert-001',
      type: 'Warning',
      title: 'Outlet Hardware Fault',
      detail: 'Desk A04 (Floor 1 Commons) smart socket dropped electrical feed.',
      targetSeat: 'A04',
      icon: 'electrical_services',
      color: 'error',
    },
    {
      id: 'alert-002',
      type: 'Notice',
      title: 'High Pod Demand Surge',
      detail: 'Level 02 Silent Pods projected 95% capacity between 15:00 - 18:00.',
      icon: 'trending_up',
      color: 'secondary',
    },
    {
      id: 'alert-003',
      type: 'Policy',
      title: 'Repeat No-Show Flag',
      detail: 'Student 2024-5519 logged 3 consecutive automated booking forfeits this week.',
      targetStudent: '2024-5519',
      icon: 'person_alert',
      color: 'neutral',
    },
  ]);

  // Master Student Booking Audit List
  const [studentBookings, setStudentBookings] = useState([
    {
      id: 'res-bk-88410',
      bookingRef: '#BK-88410',
      studentName: 'Ankit',
      studentId: '12513583',
      initials: 'AN',
      department: 'LPU B.Tech CSE',
      standing: '100% Tier 1',
      honorsBadge: "Dean's Honors Scholar",
      seatNumber: 'B07',
      zoneName: 'Floor 2 • Collab Hub',
      features: 'AC Dual Plug • Monitor',
      timeSlot: '12:00 PM – 02:00 PM',
      durationText: 'Today • 2.0 hrs scheduled',
      extensionText: '+1h extension claimed',
      status: 'Active • Checked In',
      timeLeft: '1h 22m session left',
      verificationMethod: 'Desk Scanner Tap',
      verifiedAt: '12:04 PM (+4m grace)',
      terminalId: 'Terminal ID: LPU-2B-SN7',
    },
    {
      id: 'res-bk-88411',
      bookingRef: '#BK-88411',
      studentName: 'Marcus A. Thorne',
      studentId: '2023-1940',
      initials: 'MT',
      department: 'Mechanical Eng.',
      standing: '98% Tier 1',
      seatNumber: 'Desk A14',
      zoneName: 'Floor 1 • Panorama Bar',
      features: 'High Daylight Rating',
      timeSlot: '02:00 PM – 05:00 PM',
      durationText: 'Today • 3.0 hrs block',
      extensionText: 'Quota remainder: 14.5 hrs',
      status: 'Pending Check-in',
      timeLeft: '11m grace left',
      verificationMethod: 'Gate 2 Swiped (Turnstile)',
      verifiedAt: '02:02 PM',
      terminalId: 'Awaiting Desk NFC verification',
    },
    {
      id: 'res-bk-88398',
      bookingRef: '#BK-88398',
      studentName: 'Chloe Zhao',
      studentId: '2025-4421',
      initials: 'CZ',
      department: 'Fine Arts (Media)',
      standing: '92% Tier 2',
      seatNumber: 'Pod D04',
      zoneName: 'Floor 3 • Dual Tech Station',
      features: 'Dual 4K Dell UltraSharp',
      timeSlot: '01:00 PM – 03:00 PM',
      durationText: 'Today • 2.0 hrs scheduled',
      status: 'Active • Checked In',
      timeLeft: '25m session left',
      verificationMethod: 'RFID Desk Scanner',
      verifiedAt: '01:02 PM',
      terminalId: 'Terminal ID: LPU-3D-SN4',
    },
    {
      id: 'res-bk-88390',
      bookingRef: '#BK-88390',
      studentName: 'Julian Ray',
      studentId: '2023-4109',
      initials: 'JR',
      department: 'Economics',
      standing: '85% Tier 3 (1 strike)',
      seatNumber: 'Seat C12',
      zoneName: 'Floor 2 • Sanctuary',
      features: 'Ergonomic Task Chair',
      timeSlot: '01:30 PM – 03:30 PM',
      durationText: 'Today • 2.0 hrs scheduled',
      status: 'Auto-Released (No-Show)',
      timeLeft: 'Grace period expired',
      verificationMethod: 'Unclaimed (15m elapsed)',
      verifiedAt: '14:28 Auto-release',
      terminalId: 'Turnstile Gate 1 In-only',
    },
  ]);

  // Load from backend
  const loadAdminOverview = async () => {
    try {
      const res = await adminAPI.getOverview();
      if (res.success && res.overview) {
        if (res.overview.logs) setLogs(res.overview.logs);
      }
    } catch {
      // Keep rich defaults
    }
  };

  useEffect(() => {
    loadAdminOverview();
  }, []);

  // Quick Override Action
  const handleApplyOverride = async (e) => {
    e.preventDefault();
    setIsSubmittingOverride(true);
    try {
      await adminAPI.overrideSeatStatus(overrideSeatNumber, overrideStatus, overrideNote);
      setFeedbackToast(`Desk ${overrideSeatNumber} successfully marked as ${overrideStatus}.`);
      setLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'Admin Override',
          studentName: 'Dr. Marcus Vance (Admin)',
          eventDetail: `Seat status manually changed to ${overrideStatus}. Note: ${overrideNote}`,
          targetUnit: `Desk ${overrideSeatNumber}`,
          floorName: 'Operations Control',
          statusColor: overrideStatus === 'MAINTENANCE' ? 'warning' : 'secondary',
        },
        ...prev,
      ]);
      setShowOverrideModal(false);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch {
      setFeedbackToast(`Desk ${overrideSeatNumber} marked as ${overrideStatus} (Local simulation).`);
      setShowOverrideModal(false);
      setTimeout(() => setFeedbackToast(null), 4000);
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  // Waive Student Strike
  const handleWaiveStrike = async (studentId) => {
    try {
      await adminAPI.waiveStrike(studentId, 'Administrative pardon / Scanner latency reconciliation');
      setAlerts((prev) => prev.filter((a) => a.targetStudent !== studentId));
      setFeedbackToast(`No-show strike waived for Student ${studentId}. Standing restored to Tier 1.`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch {
      setAlerts((prev) => prev.filter((a) => a.targetStudent !== studentId));
      setFeedbackToast(`Strike waived for Student ${studentId} (Local simulation).`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  // Turnstile Gate Toggle
  const handleToggleGate = async (gateId) => {
    try {
      await adminAPI.toggleGate(gateId);
      setGates((prev) =>
        prev.map((g) =>
          g.id === gateId
            ? { ...g, status: g.status === 'OPERATIONAL' ? 'LOCKED_OVERFLOW' : 'OPERATIONAL' }
            : g
        )
      );
      setFeedbackToast(`Gate ${gateId} status updated.`);
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch {
      setGates((prev) =>
        prev.map((g) =>
          g.id === gateId
            ? { ...g, status: g.status === 'OPERATIONAL' ? 'LOCKED_OVERFLOW' : 'OPERATIONAL' }
            : g
        )
      );
      setFeedbackToast(`Gate ${gateId} state toggled.`);
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Time,Category,Identity,Target_Desk,Floor,Event_Details\n' +
      logs
        .map(
          (l) =>
            `"${l.time}","${l.category}","${l.studentName}","${l.targetUnit}","${l.floorName}","${l.eventDetail.replace(/"/g, '""')}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `library-operations-audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackToast('Daily Operations Audit Log downloaded (.CSV).');
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtered students list
  const filteredStudentBookings = studentBookings.filter((b) => {
    if (studentStatusFilter !== 'ALL' && !b.status.toLowerCase().includes(studentStatusFilter.toLowerCase())) {
      return false;
    }
    if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.toLowerCase();
      const matchName = b.studentName.toLowerCase().includes(q);
      const matchId = b.studentId.includes(q);
      const matchDesk = b.seatNumber.toLowerCase().includes(q);
      const matchRef = b.bookingRef.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchDesk && !matchRef) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-lg">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl border border-secondary flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
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

      {/* Admin Top Header Banner Block */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse" />
              Telemetry Grid Active
            </span>
            <span className="font-tabular-numeric text-tabular-numeric text-outline text-xs">
              Node #HL-MAIN-B2
            </span>
            {emergencyProtocolActive && (
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[11px] font-bold animate-pulse">
                EMERGENCY OVERRIDE ACTIVE (85% CAP)
              </span>
            )}
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Facility Operations &amp; Campus Overview
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Real-time occupancy monitoring, IoT sensor health, turnstile throughput, and daily booking demand across all library zones.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-xs border border-surface-container-high cursor-pointer font-medium"
          >
            <span className="material-symbols-outlined text-[18px] text-outline">download</span>
            <span>Export Audit Log (.CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOverrideModal(true)}
            className="inline-flex items-center gap-2 px-space-md py-space-sm rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all shadow-xs cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Quick Seat Override</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmergencyProtocolActive(!emergencyProtocolActive);
              setFeedbackToast(
                !emergencyProtocolActive
                  ? 'Emergency Capacity Protocol enabled: intake capped at 85%.'
                  : 'Emergency Capacity Protocol cleared. Nominal operations resumed.'
              );
              setTimeout(() => setFeedbackToast(null), 4000);
            }}
            className={`inline-flex items-center gap-2 px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors shadow-xs cursor-pointer font-semibold ${
              emergencyProtocolActive
                ? 'bg-error text-on-error'
                : 'bg-error-container hover:bg-error/20 text-on-error-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{emergencyProtocolActive ? 'Deactivate Protocol' : 'Emergency Capacity Protocol'}</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="inline-flex p-1 bg-surface-container rounded-lg self-start">
        <button
          type="button"
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2 rounded-md font-title-md text-title-md flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'overview'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Operations Overview</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('students')}
          className={`px-4 py-2 rounded-md font-label-md text-label-md flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'students'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
          <span>Booking &amp; Student Audit</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveAdminTab('gates')}
          className={`px-4 py-2 rounded-md font-label-md text-label-md flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminTab === 'gates'
              ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">door_sliding</span>
          <span>Turnstile Gate Controls</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONS OVERVIEW (STITCH REPLICA) */}
      {activeAdminTab === 'overview' && (
        <>
          {/* 5 KPI Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* KPI 1: Total Library Capacity */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Total Capacity
                </span>
                <span className="p-1 rounded-md bg-surface-container text-primary material-symbols-outlined text-[18px]">
                  meeting_room
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold">450</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Seats Total
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                  380 Desks • 70 Group Pods
                </p>
              </div>
              <div className="h-6 w-full pt-1">
                <svg className="w-full h-full text-secondary" fill="none" viewBox="0 0 100 24">
                  <path
                    d="M0,18 L15,14 L30,19 L45,11 L60,13 L75,6 L90,10 L100,5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,18 L15,14 L30,19 L45,11 L60,13 L75,6 L90,10 L100,5 L100,24 L0,24 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  />
                </svg>
              </div>
            </div>

            {/* KPI 2: Live Occupancy */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Live Occupancy
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  63.1%
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold">284</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Occupied Desks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                    trending_up
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    +12%
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">vs last Thursday</span>
                </div>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: '63.1%' }} />
              </div>
            </div>

            {/* KPI 3: Active Reservations Next 2 Hours */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Next 2 Hours
                </span>
                <span className="p-1 rounded-md bg-secondary-fixed text-on-secondary-fixed material-symbols-outlined text-[18px]">
                  bookmark_added
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold">74</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Holds</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                  <strong className="text-on-surface font-semibold">18</strong> Arrived •{' '}
                  <strong className="text-on-surface font-semibold">56</strong> Grace Window
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-label-sm text-outline">
                <span className="w-2 h-2 rounded-full bg-secondary-container" />
                <span>Grace Period: 15 min threshold</span>
              </div>
            </div>

            {/* KPI 4: Peak Projected Window */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Projected Peak
                </span>
                <span className="p-1 rounded-md bg-surface-container-high text-primary material-symbols-outlined text-[18px]">
                  insights
                </span>
              </div>
              <div className="my-2">
                <span className="font-title-md text-title-md text-primary font-bold block leading-tight">
                  14:00 – 17:30
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                    Max 89%
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">AI Traffic Forecast</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-outline">auto_graph</span>
                <span>Campus IoT Predictive sync</span>
              </div>
            </div>

            {/* KPI 5: Daily Registered Students */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container-high hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Students Today
                </span>
                <span className="p-1 rounded-md bg-surface-container text-primary material-symbols-outlined text-[18px]">
                  badge
                </span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary font-bold">1,248</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Check-ins</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Turnstiles synchronized 99.8%
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-on-tertiary-fixed-variant">
                <span className="flex items-center gap-1 font-label-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" />
                  Live Gate Stream
                </span>
                <span className="font-tabular-numeric text-tabular-numeric text-outline">&lt;12ms</span>
              </div>
            </div>
          </div>

          {/* Main Asymmetric Split Grid (8 cols / 4 cols) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
            {/* LEFT COLUMN (8 cols) */}
            <div className="xl:col-span-8 flex flex-col gap-space-lg">
              {/* Real-Time Floor-by-Floor Load & Sensor Telemetry */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-space-md border-b border-surface-container">
                  <div>
                    <h2 className="font-title-md text-title-md text-primary font-semibold">
                      Real-Time Floor-by-Floor Load &amp; Sensor Telemetry
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Multi-sensor acoustic, thermal, and occupancy monitoring arrays
                    </p>
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-label-sm">
                    <span className="inline-flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-xs bg-tertiary-fixed-dim" /> Available
                    </span>
                    <span className="inline-flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-xs bg-error" /> Occupied
                    </span>
                    <span className="inline-flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-xs bg-secondary" /> Reserved
                    </span>
                    <span className="inline-flex items-center gap-1 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-xs bg-outline-variant" /> Maintenance
                    </span>
                  </div>
                </div>

                {/* Floor List */}
                <div className="space-y-4 pt-4">
                  {/* Floor 1 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-md text-primary font-bold">
                          01
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-primary font-semibold">
                              Academic Commons &amp; Cafe
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                              85% High Load
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            120 Total Desks • 102 In-use • 12 Holds • 6 Open
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">volume_up</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">54 dB</span>
                          <span className="font-body-sm text-body-sm text-outline">(Conversational)</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">air</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">28 AQI</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">thermostat</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">22.0°C</span>
                        </div>
                      </div>
                    </div>
                    {/* Segmented Floor Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div className="bg-error h-full" style={{ width: '85%' }} title="Occupied: 85%" />
                      <div className="bg-secondary h-full" style={{ width: '10%' }} title="Reserved: 10%" />
                      <div className="bg-tertiary-fixed-dim h-full" style={{ width: '4%' }} title="Available: 4%" />
                      <div className="bg-outline-variant h-full" style={{ width: '1%' }} title="Maintenance: 1%" />
                    </div>
                  </div>

                  {/* Floor 2 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-md text-primary font-bold">
                          02
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-primary font-semibold">
                              Silent Study Sanctuary
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm font-semibold">
                              54% Optimal
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            180 Total Desks • 98 In-use • 44 Holds • 38 Open
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">volume_mute</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">32 dB</span>
                          <span className="font-body-sm text-body-sm text-tertiary-fixed-dim font-medium">Whisper</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">air</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">22 AQI</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">thermostat</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">21.2°C</span>
                        </div>
                      </div>
                    </div>
                    {/* Segmented Floor Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div className="bg-error h-full" style={{ width: '54%' }} title="Occupied: 54%" />
                      <div className="bg-secondary h-full" style={{ width: '24%' }} title="Reserved: 24%" />
                      <div className="bg-tertiary-fixed-dim h-full" style={{ width: '21%' }} title="Available: 21%" />
                      <div className="bg-outline-variant h-full" style={{ width: '1%' }} title="Maintenance: 1%" />
                    </div>
                  </div>

                  {/* Floor 3 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-container">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-title-md text-primary font-bold">
                          03
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-primary font-semibold">
                              Graduate Tech &amp; Media Lab
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                              42% Quiet
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            150 Total Desks • 63 In-use • 18 Holds • 69 Open
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">graphic_eq</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">38 dB</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">air</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">24 AQI</span>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-surface-container-lowest shadow-xs flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-outline">thermostat</span>
                          <span className="font-tabular-numeric text-tabular-numeric text-on-surface font-semibold">20.8°C</span>
                        </div>
                      </div>
                    </div>
                    {/* Segmented Floor Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
                      <div className="bg-error h-full" style={{ width: '42%' }} title="Occupied: 42%" />
                      <div className="bg-secondary h-full" style={{ width: '12%' }} title="Reserved: 12%" />
                      <div className="bg-tertiary-fixed-dim h-full" style={{ width: '46%' }} title="Available: 46%" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Occupancy vs. Capacity Forecast Chart with 85% Safe Cap Line */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-space-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-title-md text-title-md text-primary font-semibold">
                        Hourly Occupancy vs. Reservation Capacity Forecast
                      </h2>
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
                        08:00 – 23:00
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      IoT Gateway aggregated head-counts alongside current hold bookings
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-label-md">
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="w-3 h-3 rounded bg-primary" /> Live Headcount
                    </span>
                    <span className="flex items-center gap-1.5 text-on-surface">
                      <span className="w-3 h-3 rounded bg-secondary-fixed" /> Reserved Buffer
                    </span>
                    <span className="flex items-center gap-1.5 text-error font-semibold">
                      <span className="w-4 h-0.5 bg-error border-b border-dashed border-error" /> Safe Limit (85%)
                    </span>
                  </div>
                </div>

                {/* Bar Chart Visual Visualization */}
                <div className="relative pt-6 pb-2 w-full">
                  {/* Safe Capacity Threshold Line at 85% */}
                  <div className="absolute left-10 right-2 top-14 flex items-center pointer-events-none z-10">
                    <div className="w-full border-t-2 border-dashed border-error/50" />
                    <span className="ml-2 bg-error-container text-on-error-container font-label-sm text-label-sm font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                      85% Safe Cap
                    </span>
                  </div>

                  {/* Chart Columns Container */}
                  <div className="flex items-end justify-between h-56 pl-10 pr-2 gap-2 text-center">
                    {[
                      { hour: '08h', live: 16, buff: 8, h: '24%' },
                      { hour: '09h', live: 27, buff: 11, h: '38%' },
                      { hour: '10h', live: 40, buff: 14, h: '54%' },
                      { hour: '11h', live: 54, buff: 14, h: '68%' },
                      { hour: '12h', live: 60, buff: 15, h: '75%' },
                      { hour: '13h', live: 59, buff: 20, h: '79%' },
                      { hour: '14h', live: 47, buff: 16, h: '63.1%', isNow: true },
                      { hour: '15h', live: 60, buff: 28, h: '88%', isPeak: true },
                      { hour: '16h', live: 61, buff: 24, h: '85%' },
                      { hour: '17h', live: 57, buff: 25, h: '82%' },
                      { hour: '18h', live: 55, buff: 16, h: '71%' },
                      { hour: '19h', live: 57, buff: 30, h: '87%', isPeak: true },
                      { hour: '20h', live: 53, buff: 13, h: '66%' },
                      { hour: '21h', live: 41, buff: 7, h: '48%' },
                      { hour: '22h', live: 26, buff: 3, h: '29%' },
                      { hour: '23h', live: 11, buff: 1, h: '12%' },
                    ].map((col) => (
                      <div key={col.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        {col.isNow && (
                          <span className="absolute -top-7 px-1.5 py-0.5 rounded bg-secondary text-on-secondary text-[10px] font-bold">
                            Now
                          </span>
                        )}
                        {col.isPeak && (
                          <span className="absolute -top-6 px-1 py-0.5 rounded bg-error-container text-on-error-container text-[10px] font-bold">
                            Peak
                          </span>
                        )}
                        <div
                          className={`w-full max-w-[28px] rounded-t-xs flex flex-col justify-end overflow-hidden transition-all ${
                            col.isNow
                              ? 'ring-2 ring-secondary ring-offset-2'
                              : 'bg-surface-container group-hover:opacity-90'
                          }`}
                          style={{ height: col.h }}
                        >
                          <div className="bg-secondary-fixed w-full" style={{ height: `${col.buff}%` }} />
                          <div className="bg-primary w-full" style={{ height: `${col.live}%` }} />
                        </div>
                        <span
                          className={`font-tabular-numeric text-tabular-numeric mt-2 text-xs ${
                            col.isNow ? 'text-secondary font-bold' : 'text-outline'
                          }`}
                        >
                          {col.hour}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Y Axis Labels */}
                  <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-outline text-[11px] font-tabular-numeric pointer-events-none">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                </div>
              </div>

              {/* Recent Operational & Booking Logs (Live Feed) */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
                  <div>
                    <h2 className="font-title-md text-title-md text-primary font-semibold">
                      Recent Operational &amp; Booking Logs
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Live telemetry stream from turnstiles, smart outlets, and RFID portals
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Auto-refresh 5s
                    </span>
                  </div>
                </div>

                {/* Log Table Stream */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="px-space-md py-space-sm rounded-l-lg">Time</th>
                        <th className="px-space-md py-space-sm">Category</th>
                        <th className="px-space-md py-space-sm">Event &amp; Identity Detail</th>
                        <th className="px-space-md py-space-sm">Target Unit</th>
                        <th className="px-space-md py-space-sm rounded-r-lg text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-body-sm text-body-sm">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-space-md py-space-sm font-tabular-numeric text-tabular-numeric text-primary font-semibold">
                            {log.time}
                          </td>
                          <td className="px-space-md py-space-sm">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-medium ${
                                log.category === 'Check-In' || log.category === 'Sanitized'
                                  ? 'bg-surface-container-high text-tertiary font-semibold'
                                  : log.category === 'Auto-Release'
                                  ? 'bg-error-container text-on-error-container font-semibold'
                                  : log.category === 'Reservation'
                                  ? 'bg-surface-container-high text-secondary font-semibold'
                                  : 'bg-surface-container-highest text-on-surface-variant'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  log.category === 'Check-In' || log.category === 'Sanitized'
                                    ? 'bg-tertiary-fixed-dim'
                                    : log.category === 'Auto-Release'
                                    ? 'bg-error'
                                    : 'bg-secondary'
                                }`}
                              />
                              {log.category}
                            </span>
                          </td>
                          <td className="px-space-md py-space-sm text-on-surface">
                            <div className="flex flex-col">
                              <span className="font-medium text-on-surface">{log.studentName}</span>
                              <span className="text-xs text-outline">{log.eventDetail}</span>
                            </div>
                          </td>
                          <td className="px-space-md py-space-sm">
                            <span className="font-tabular-numeric font-semibold text-secondary">
                              {log.targetUnit}
                            </span>
                            <span className="text-xs text-outline block">{log.floorName}</span>
                          </td>
                          <td className="px-space-md py-space-sm text-right">
                            <button
                              type="button"
                              onClick={() => alert(`Log record: ${log.time} - ${log.eventDetail}`)}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              title="Audit trail"
                            >
                              <span className="material-symbols-outlined text-[18px]">verified</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (4 cols) */}
            <div className="xl:col-span-4 flex flex-col gap-space-lg">
              {/* Card 1: Zone & System Health */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container">
                  <h2 className="font-title-md text-title-md text-primary font-semibold">
                    Zone &amp; System Health
                  </h2>
                  <span className="material-symbols-outlined text-secondary text-[20px]">sensors</span>
                </div>
                <div className="space-y-3">
                  {/* Acoustic Enforcer */}
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">noise_aware</span>
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          Sound Shield System
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">&lt;35 dB enforced Sanctuary</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" /> Active
                    </span>
                  </div>

                  {/* Turnstiles */}
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">door_sliding</span>
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          Turnstile Gate Sync
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">All 4 gates online (&lt;12ms)</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" /> 4/4 Synced
                    </span>
                  </div>

                  {/* LiDAR desk sensors */}
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">radar</span>
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          LiDAR Desk Sensors
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">442 / 450 reporting</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      8 Recalibrating
                    </span>
                  </div>

                  {/* Auto-Release Policy */}
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-surface-container">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">timer</span>
                      </div>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          Auto-Release Engine
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">15 min grace window</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold">
                      Enforcing
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Immediate Administrative Action Required (Alerts) */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-title-md text-primary font-semibold">
                      Action Required
                    </h2>
                    <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold">
                      {alerts.length}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    notifications_active
                  </span>
                </div>
                <div className="space-y-3">
                  {alerts.map((alertItem) => (
                    <div
                      key={alertItem.id}
                      className={`p-space-sm rounded-lg space-y-2 border ${
                        alertItem.type === 'Warning'
                          ? 'bg-error-container/30 border-error/20'
                          : alertItem.type === 'Notice'
                          ? 'bg-secondary-fixed/20 border-secondary/20'
                          : 'bg-surface-container-low border-surface-container'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`material-symbols-outlined text-[18px] mt-0.5 ${
                            alertItem.type === 'Warning'
                              ? 'text-error'
                              : alertItem.type === 'Notice'
                              ? 'text-secondary'
                              : 'text-outline'
                          }`}
                        >
                          {alertItem.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              {alertItem.title}
                            </span>
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                alertItem.type === 'Warning' ? 'text-error' : 'text-secondary'
                              }`}
                            >
                              {alertItem.type}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            {alertItem.detail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {alertItem.targetStudent ? (
                          <button
                            type="button"
                            onClick={() => handleWaiveStrike(alertItem.targetStudent)}
                            className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors shadow-xs cursor-pointer border border-surface-container-high"
                          >
                            Waive Strike &amp; Pardon
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setOverrideSeatNumber(alertItem.targetSeat || 'A04');
                              setShowOverrideModal(true);
                            }}
                            className="px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-label-sm text-label-sm transition-colors cursor-pointer"
                          >
                            Resolve / Override Seat
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Weekly Utilization Summary (Circular SVG Gauge) */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high">
                <div className="flex items-center justify-between pb-2 mb-2">
                  <h2 className="font-title-md text-title-md text-primary font-semibold">
                    Weekly Seat Utilization
                  </h2>
                  <span className="font-tabular-numeric text-tabular-numeric text-outline text-xs">
                    Past 7 Days
                  </span>
                </div>
                <div className="flex items-center gap-4 py-2">
                  {/* Circular Gauge SVG */}
                  <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-surface-container"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="10"
                      />
                      <circle
                        className="text-secondary"
                        cx="50"
                        cy="50"
                        fill="none"
                        r="40"
                        stroke="currentColor"
                        strokeDasharray="251.2"
                        strokeDashoffset="54.2"
                        strokeLinecap="round"
                        strokeWidth="10"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-title-md text-title-md text-primary font-bold">
                        78.4%
                      </span>
                      <span className="font-label-sm text-label-sm text-outline text-[10px] uppercase">
                        Mean
                      </span>
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-label-md text-on-surface font-medium">Collaborative Hub</span>
                        <span className="font-tabular-numeric font-bold text-primary">92%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-label-md text-on-surface font-medium">Window Bar Counter</span>
                        <span className="font-tabular-numeric font-bold text-primary">88%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-label-md text-on-surface font-medium">Silent Pods (L2)</span>
                        <span className="font-tabular-numeric font-bold text-primary">76%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: '76%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: BOOKING & STUDENT AUDIT (STITCH SCREEN C306 REPLICA) */}
      {activeAdminTab === 'students' && (
        <div className="rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-high overflow-hidden flex flex-col">
          {/* Search & Filter Bar */}
          <div className="p-space-md bg-surface-container-low/40 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md border-b border-surface-container">
            <div className="relative flex-1 min-w-[320px] max-w-2xl">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Search by student name, ID (e.g. 12513583), booking ref (#BK-88410), or seat ID..."
                className="w-full bg-surface-container-lowest rounded-lg pl-11 pr-10 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/20 shadow-xs border border-surface-container-high"
              />
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                className="bg-surface-container-lowest rounded-lg px-3 py-2.5 font-label-md text-label-md text-on-surface shadow-xs border border-surface-container-high outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Checked In">Active • Checked In</option>
                <option value="Pending">Pending Grace Window</option>
                <option value="Auto-Released">Auto-Released (No-Show)</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setStudentSearchQuery('');
                  setStudentStatusFilter('ALL');
                }}
                className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-xs border border-surface-container-high cursor-pointer"
                title="Reset Filters"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="py-3 px-4 font-semibold">Booking Ref</th>
                  <th className="py-3 px-4 font-semibold">Student &amp; Reliability</th>
                  <th className="py-3 px-4 font-semibold">Seat &amp; Floor Zone</th>
                  <th className="py-3 px-4 font-semibold">Reservation Window</th>
                  <th className="py-3 px-4 font-semibold">Live Status</th>
                  <th className="py-3 px-4 font-semibold">Check-in Verification</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
                {filteredStudentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-tabular-numeric text-tabular-numeric text-primary font-bold">
                          {b.bookingRef}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline mt-0.5">
                          Verified Pass
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-md font-bold shrink-0">
                          {b.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                              {b.studentName}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                              {b.standing}
                            </span>
                          </div>
                          <span className="font-body-sm text-body-sm text-outline">
                            ID: {b.studentId} • {b.department}
                          </span>
                          {b.honorsBadge && (
                            <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-1 mt-1">
                              <span className="material-symbols-outlined text-[14px]">school</span>{' '}
                              {b.honorsBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-secondary">
                            table_restaurant
                          </span>
                          <span className="font-title-md text-title-md font-bold text-primary">
                            {b.seatNumber}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-0.5">
                          {b.zoneName}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline mt-1">
                          {b.features}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col">
                        <span className="font-tabular-numeric text-tabular-numeric font-semibold text-on-surface">
                          {b.timeSlot}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline mt-0.5">
                          {b.durationText}
                        </span>
                        {b.extensionText && (
                          <span className="font-label-sm text-label-sm text-secondary font-medium mt-1 inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">add_alarm</span>{' '}
                            {b.extensionText}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${
                          b.status.includes('Checked In')
                            ? 'bg-surface-container-high text-tertiary'
                            : b.status.includes('Pending')
                            ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            b.status.includes('Checked In')
                              ? 'bg-on-tertiary-container'
                              : b.status.includes('Pending')
                              ? 'bg-secondary'
                              : 'bg-error'
                          }`}
                        />
                        {b.status}
                      </div>
                      <div className="font-body-sm text-body-sm text-outline mt-1.5 pl-1">
                        {b.timeLeft}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-on-surface font-label-md text-label-md font-medium">
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            nfc
                          </span>
                          <span>{b.verificationMethod}</span>
                        </div>
                        <span className="font-tabular-numeric text-tabular-numeric text-on-surface-variant mt-0.5">
                          {b.verifiedAt}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">{b.terminalId}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Reviewing complete study pass details for ${b.studentName}`)}
                          className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                          title="View Digital Pass"
                        >
                          <span className="material-symbols-outlined text-[18px]">badge</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Force early release for ${b.seatNumber}?`)) {
                              setStudentBookings((prev) =>
                                prev.map((item) =>
                                  item.id === b.id ? { ...item, status: 'Released by Admin' } : item
                                )
                              );
                              setFeedbackToast(`Desk ${b.seatNumber} released by Admin.`);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          title="Force Early Release"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TURNSTILE GATE CONTROLS */}
      {activeAdminTab === 'gates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {gates.map((gate) => (
            <div
              key={gate.id}
              className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                    Turnstile Portal
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                      gate.status === 'OPERATIONAL'
                        ? 'bg-secondary-fixed text-on-secondary-fixed'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        gate.status === 'OPERATIONAL' ? 'bg-secondary' : 'bg-error'
                      }`}
                    />
                    {gate.status}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {gate.name}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  RFID &amp; NFC Student Pass Authenticator • Hardware Scanner Sync
                </p>
                <div className="grid grid-cols-2 gap-2 my-space-md pt-space-sm border-t border-surface-container">
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <span className="text-xs text-outline">Network Latency</span>
                    <div className="font-tabular-numeric text-title-md font-bold text-primary">
                      {gate.latencyMs} ms
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container-low">
                    <span className="text-xs text-outline">Total Swipes Today</span>
                    <div className="font-tabular-numeric text-title-md font-bold text-primary">
                      {gate.totalSwipesToday}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-space-sm border-t border-surface-container flex items-center justify-between">
                <span className="text-xs text-outline">Firmware v4.2.1 • TLS 1.3 Synced</span>
                <button
                  type="button"
                  onClick={() => handleToggleGate(gate.id)}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors cursor-pointer ${
                    gate.status === 'OPERATIONAL'
                      ? 'bg-error-container hover:bg-error text-on-error-container hover:text-on-error'
                      : 'bg-secondary text-on-secondary hover:bg-primary-container'
                  }`}
                >
                  {gate.status === 'OPERATIONAL' ? 'Lock Turnstile' : 'Re-enable Gate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QUICK SEAT OVERRIDE MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl border border-surface-container-high space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">tune</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Administrative Seat Override
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyOverride} className="space-y-space-md">
              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                  Target Desk ID
                </label>
                <input
                  type="text"
                  value={overrideSeatNumber}
                  onChange={(e) => setOverrideSeatNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. A04, B07, C12..."
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md border border-surface-container focus:border-secondary outline-none uppercase font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                  Set Override Status
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md border border-surface-container focus:border-secondary outline-none cursor-pointer"
                >
                  <option value="MAINTENANCE">MAINTENANCE (Hardware Lock / Custodial)</option>
                  <option value="AVAILABLE">AVAILABLE (Immediate Public Booking)</option>
                  <option value="OCCUPIED">OCCUPIED (Manual Study Session)</option>
                  <option value="RESERVED">RESERVED (Hold Locked)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-1">
                  Operational Audit Note
                </label>
                <textarea
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  placeholder="Document reason for audit log..."
                  className="w-full h-20 p-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-surface-container focus:border-secondary outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-space-sm border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOverride}
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingOverride ? 'Updating Node...' : 'Apply Status Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPortalPage;
