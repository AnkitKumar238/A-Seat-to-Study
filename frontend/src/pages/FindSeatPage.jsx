import React, { useState, useEffect } from 'react';
import { seatAPI } from '../services/api';

const DESK_IMAGE_URL = '/assets/lpu-library-lab-1.jpg';

// Fallback initial Level 02 sanctuary dataset matching Stitch
const initialSeats = [
  // Zone A: Silent Pods (A01 - A16)
  { seatNumber: 'A01', deskCode: '#POD-A01', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 01', noise: '31 dB', power: '100W USB-C' },
  { seatNumber: 'A02', deskCode: '#POD-A02', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 01', noise: '30 dB', power: '100W USB-C' },
  { seatNumber: 'A03', deskCode: '#POD-A03', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'RESERVED', pod: 'POD 01', noise: '31 dB', power: '100W USB-C' },
  { seatNumber: 'A04', deskCode: '#POD-A04', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 01', noise: '32 dB', power: '100W USB-C' },
  { seatNumber: 'A05', deskCode: '#POD-A05', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 02', noise: '29 dB', power: '100W USB-C' },
  { seatNumber: 'A06', deskCode: '#POD-A06', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 02', noise: '29 dB', power: '100W USB-C' },
  { seatNumber: 'A07', deskCode: '#POD-A07', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 02', noise: '33 dB', power: '100W USB-C' },
  { seatNumber: 'A08', deskCode: '#POD-A08', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OFFLINE', pod: 'POD 02', noise: 'N/A', power: 'Service' },
  { seatNumber: 'A09', deskCode: '#POD-A09', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 03', noise: '31 dB', power: '100W USB-C' },
  { seatNumber: 'A10', deskCode: '#POD-A10', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'RESERVED', pod: 'POD 03', noise: '31 dB', power: '100W USB-C' },
  { seatNumber: 'A11', deskCode: '#POD-A11', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 03', noise: '32 dB', power: '100W USB-C' },
  { seatNumber: 'A12', deskCode: '#POD-A12', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 03', noise: '30 dB', power: '100W USB-C' },
  { seatNumber: 'A13', deskCode: '#POD-A13', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 04', noise: '32 dB', power: '100W USB-C' },
  { seatNumber: 'A14', deskCode: '#POD-A14', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'OCCUPIED', pod: 'POD 04', noise: '32 dB', power: '100W USB-C' },
  { seatNumber: 'A15', deskCode: '#POD-A15', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 04', noise: '30 dB', power: '100W USB-C' },
  { seatNumber: 'A16', deskCode: '#POD-A16', zoneId: 'ZONE_A', zoneName: 'Zone A • Silent Study Pods', currentStatus: 'AVAILABLE', pod: 'POD 04', noise: '30 dB', power: '100W USB-C' },

  // Zone D: Dual Monitor Tech Stations (D01 - D12)
  { seatNumber: 'D01', deskCode: '#TECH-D01', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'OCCUPIED', dualMonitor: true, noise: '38 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D02', deskCode: '#TECH-D02', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'AVAILABLE', dualMonitor: true, noise: '37 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D03', deskCode: '#TECH-D03', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'OCCUPIED', dualMonitor: true, noise: '39 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D04', deskCode: '#TECH-D04', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'RESERVED', dualMonitor: true, noise: '38 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D05', deskCode: '#TECH-D05', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'AVAILABLE', dualMonitor: true, noise: '36 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D06', deskCode: '#TECH-D06', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'AVAILABLE', dualMonitor: true, noise: '37 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D07', deskCode: '#TECH-D07', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'OCCUPIED', dualMonitor: true, noise: '38 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D08', deskCode: '#TECH-D08', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'OCCUPIED', dualMonitor: true, noise: '39 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D09', deskCode: '#TECH-D09', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'RESERVED', dualMonitor: true, noise: '38 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D10', deskCode: '#TECH-D10', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'AVAILABLE', dualMonitor: true, noise: '36 dB', power: 'Dual 100W PD' },
  { seatNumber: 'D11', deskCode: '#TECH-D11', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'OFFLINE', dualMonitor: true, noise: 'N/A', power: 'Service' },
  { seatNumber: 'D12', deskCode: '#TECH-D12', zoneId: 'ZONE_D', zoneName: 'Zone D • Dual-Monitor Tech Stations', currentStatus: 'AVAILABLE', dualMonitor: true, noise: '36 dB', power: 'Dual 100W PD' },

  // Zone B: Collaborative Study Hub (B01 - B24)
  { seatNumber: 'B01', deskCode: '#AT-01', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 01', noise: '44 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B02', deskCode: '#AT-02', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'RESERVED', cluster: 'CLUSTER 01', noise: '43 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B03', deskCode: '#AT-03', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 01', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B04', deskCode: '#AT-04', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 01', noise: '45 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B05', deskCode: '#AT-05', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 01', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B06', deskCode: '#AT-06', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 01', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B07', deskCode: '#AT-207', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 01', noise: '41 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B08', deskCode: '#AT-08', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 01', noise: '41 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B09', deskCode: '#AT-09', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 02', noise: '46 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B10', deskCode: '#AT-10', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 02', noise: '46 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B11', deskCode: '#AT-11', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 02', noise: '43 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B12', deskCode: '#AT-12', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 02', noise: '43 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B13', deskCode: '#AT-13', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'RESERVED', cluster: 'CLUSTER 02', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B14', deskCode: '#AT-14', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'RESERVED', cluster: 'CLUSTER 02', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B15', deskCode: '#AT-15', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 02', noise: '45 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B16', deskCode: '#AT-16', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 02', noise: '41 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B17', deskCode: '#AT-17', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 03', noise: '40 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B18', deskCode: '#AT-18', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 03', noise: '40 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B19', deskCode: '#AT-19', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 03', noise: '44 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B20', deskCode: '#AT-20', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OCCUPIED', cluster: 'CLUSTER 03', noise: '44 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B21', deskCode: '#AT-21', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 03', noise: '42 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B22', deskCode: '#AT-22', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'OFFLINE', cluster: 'CLUSTER 03', noise: 'N/A', power: 'Service' },
  { seatNumber: 'B23', deskCode: '#AT-23', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'RESERVED', cluster: 'CLUSTER 03', noise: '41 dB', power: '2x 100W USB-C' },
  { seatNumber: 'B24', deskCode: '#AT-24', zoneId: 'ZONE_B', zoneName: 'Zone B • Collaborative Study Hub', currentStatus: 'AVAILABLE', cluster: 'CLUSTER 03', noise: '41 dB', power: '2x 100W USB-C' },

  // Zone C: Window Panorama Bar (C01 - C18)
  ...Array.from({ length: 18 }, (_, i) => {
    const num = `C${String(i + 1).padStart(2, '0')}`;
    const statusMap = {
      C01: 'AVAILABLE', C02: 'AVAILABLE', C03: 'OCCUPIED', C04: 'OCCUPIED',
      C05: 'RESERVED', C06: 'AVAILABLE', C07: 'AVAILABLE', C08: 'OCCUPIED',
      C09: 'AVAILABLE', C10: 'AVAILABLE', C11: 'OCCUPIED', C12: 'RESERVED',
      C13: 'AVAILABLE', C14: 'AVAILABLE', C15: 'OCCUPIED', C16: 'OFFLINE',
      C17: 'AVAILABLE', C18: 'AVAILABLE',
    };
    return {
      seatNumber: num,
      deskCode: `#WIN-${num.slice(1)}`,
      zoneId: 'ZONE_C',
      zoneName: 'Zone C • Window Panorama Bar',
      currentStatus: statusMap[num] || 'AVAILABLE',
      naturalLight: true,
      noise: '36 dB',
      power: '100W USB-C',
    };
  }),
];

export const FindSeatPage = ({ onNavigate, onSelectSeatForBooking }) => {
  const [activeFloor, setActiveFloor] = useState(2);
  const [searchQuery, setSearchQuery] = useState('B07');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [activeFilters, setActiveFilters] = useState({
    powerSocket: true,
    dualMonitor: false,
    ergonomicChair: true,
    naturalLight: false,
  });

  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState(
    initialSeats.find((s) => s.seatNumber === 'B07') || initialSeats[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('10:00 - 12:00');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Load live seats from backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await seatAPI.getSeats({ floor: activeFloor });
        if (response.success && response.seats && response.seats.length > 0) {
          setSeats(response.seats);
        }
      } catch (err) {
        // Keeps initialSeats if offline or backend is booting
        console.warn('Seat map data fallback:', err.message);
      }
    };
    fetchSeats();
  }, [activeFloor]);

  // Filter seats based on inputs
  const filteredSeats = seats.filter((seat) => {
    if (selectedZone !== 'ALL' && seat.zoneId !== selectedZone) return false;
    if (searchQuery && !seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeFilters.dualMonitor && !seat.dualMonitor && !seat.amenities?.dualMonitor) {
      return false;
    }
    return true;
  });

  const getSeatByNum = (num) => seats.find((s) => s.seatNumber === num) || {
    seatNumber: num,
    currentStatus: 'AVAILABLE',
  };

  const toggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Color mapping based on Stitch tokens
  const getStatusBgColor = (status, isSelected) => {
    if (isSelected) return 'bg-surface-container-lowest ring-2 ring-secondary ring-offset-2 scale-105 z-20 shadow-xl';
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#DCFCE7] hover:shadow-md';
      case 'OCCUPIED':
        return 'bg-[#FEE2E2] hover:shadow-md';
      case 'RESERVED':
        return 'bg-[#DBEAFE] hover:shadow-md';
      case 'OFFLINE':
      default:
        return 'bg-[#F1F5F9] hover:shadow-md';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#22C55E]';
      case 'OCCUPIED':
        return 'bg-[#EF4444]';
      case 'RESERVED':
        return 'bg-[#3B82F6]';
      case 'OFFLINE':
      default:
        return 'bg-[#94A3B8]';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-[#15803D]';
      case 'OCCUPIED':
        return 'text-[#B91C1C]';
      case 'RESERVED':
        return 'text-[#1D4ED8]';
      case 'OFFLINE':
      default:
        return 'text-[#64748B]';
    }
  };

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const handleProceedBooking = () => {
    if (onSelectSeatForBooking) {
      onSelectSeatForBooking(selectedSeat, selectedSlot);
    } else if (onNavigate) {
      onNavigate('seat-booking', selectedSeat);
    }
  };

  // Status counts for legend
  const countAvailable = seats.filter((s) => s.currentStatus === 'AVAILABLE').length;
  const countOccupied = seats.filter((s) => s.currentStatus === 'OCCUPIED').length;
  const countReserved = seats.filter((s) => s.currentStatus === 'RESERVED').length;
  const countOffline = seats.filter((s) => s.currentStatus === 'OFFLINE').length;

  return (
    <div className="space-y-space-lg max-w-[1700px] mx-auto">
      {/* Top Command & Filter HUD */}
      <div className="flex flex-col gap-space-md">
        {/* Level Selector Bar & Real-time Ambient Occupancy Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Floor Switcher Tabs */}
          <div className="inline-flex p-1 bg-surface-container rounded-xl shadow-sm self-start">
            <button
              type="button"
              onClick={() => setActiveFloor(1)}
              className={`px-space-md py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer ${
                activeFloor === 1
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span>Floor 1: Main Commons</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFloor(2)}
              className={`px-space-md py-2 rounded-lg font-title-md text-title-md transition-all flex items-center gap-2 cursor-pointer ${
                activeFloor === 2
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
              <span>Floor 2: Silent Study Sanctuary</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
                Active
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFloor(3)}
              className={`px-space-md py-2 rounded-lg font-label-md text-label-md transition-all flex items-center gap-2 cursor-pointer ${
                activeFloor === 3
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>Floor 3: Grad &amp; Tech Lab</span>
            </button>
          </div>

          {/* Quick Stats Telemetry Banner */}
          <div className="flex items-center gap-4 bg-surface-container-lowest px-space-md py-2 rounded-xl shadow-sm self-stretch lg:self-auto justify-between lg:justify-end border border-surface-container-high/30">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Capacity</span>
              <span className="font-tabular-numeric text-tabular-numeric text-on-surface bg-surface-container px-2 py-0.5 rounded font-semibold">
                132 Desks
              </span>
            </div>
            <div className="w-px h-4 bg-surface-container-high" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary animate-ping" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Load</span>
              <span className="font-tabular-numeric text-tabular-numeric text-secondary font-bold">65%</span>
            </div>
            <div className="w-px h-4 bg-surface-container-high" />
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">trending_up</span>
              <span className="font-label-sm text-label-sm">Peak: 14:00 - 17:00</span>
            </div>
          </div>
        </div>

        {/* Precision Filter & Search Row */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md border border-surface-container-high/30">
          {/* Search & Zone Selectors */}
          <div className="flex flex-wrap items-center gap-space-sm flex-1">
            {/* Live Desk Search Box */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Seat ID (e.g. B07, C12)..."
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 transition-all"
              />
            </div>

            {/* Zone Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="h-10 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-2 transition-colors cursor-pointer outline-none appearance-none pr-8"
              >
                <option value="ALL">All Zones (Full Sanctuary)</option>
                <option value="ZONE_A">Zone A: Silent Study Pods</option>
                <option value="ZONE_B">Zone B: Collaborative Study Hub</option>
                <option value="ZONE_C">Zone C: Window Panorama Bar</option>
                <option value="ZONE_D">Zone D: Dual-Monitor Tech Stations</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Amenities Multi-Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => toggleFilter('powerSocket')}
                className={`h-9 px-2.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                  activeFilters.powerSocket
                    ? 'bg-secondary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Power Socket</span>
              </button>

              <button
                type="button"
                onClick={() => toggleFilter('dualMonitor')}
                className={`h-9 px-2.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                  activeFilters.dualMonitor
                    ? 'bg-secondary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                <span>Dual Monitor</span>
              </button>

              <button
                type="button"
                onClick={() => toggleFilter('ergonomicChair')}
                className={`h-9 px-2.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                  activeFilters.ergonomicChair
                    ? 'bg-secondary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">chair</span>
                <span>Ergonomic Chair</span>
              </button>

              <button
                type="button"
                onClick={() => toggleFilter('naturalLight')}
                className={`h-9 px-2.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                  activeFilters.naturalLight
                    ? 'bg-secondary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                <span>Natural Light</span>
              </button>
            </div>
          </div>

          {/* Real-Time Interactive Seat Status Legend */}
          <div className="flex items-center gap-3 lg:gap-4 flex-wrap bg-surface-container-low px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span className="font-label-sm text-label-sm text-on-surface">
                Available <strong className="font-tabular-numeric text-tabular-numeric">({countAvailable})</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="font-label-sm text-label-sm text-on-surface">
                Occupied <strong className="font-tabular-numeric text-tabular-numeric">({countOccupied})</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span className="font-label-sm text-label-sm text-on-surface">
                Reserved <strong className="font-tabular-numeric text-tabular-numeric">({countReserved})</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Offline <strong className="font-tabular-numeric text-tabular-numeric">({countOffline})</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout: Floor Canvas + Contextual Seat Detail Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left 8 Columns: Blueprint Canvas Area */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {/* Architectural Canvas Container */}
          <div
            className={`relative bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden p-space-md sm:p-space-lg min-h-[760px] select-none border border-surface-container-high/30 transition-all ${
              isHeatmap ? 'bg-amber-50/20' : ''
            }`}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          >
            {/* Architectural Grid Ambient Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#002043_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Canvas Controls (Zoom / Reset / Heatmap HUD) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-surface-container-high/40">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.3))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Zoom in"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.85))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Zoom out"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <div className="w-px h-4 bg-surface-container-high mx-0.5" />
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                title="Reset Camera"
              >
                <span className="material-symbols-outlined text-[18px]">filter_center_focus</span>
              </button>
              <button
                type="button"
                onClick={() => setIsHeatmap(!isHeatmap)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isHeatmap ? 'bg-secondary text-on-primary' : 'text-secondary hover:bg-surface-container'
                }`}
                title="Thermal Heatmap View"
              >
                <span className="material-symbols-outlined text-[18px]">thermostat</span>
              </button>
            </div>

            {/* Canvas Header Banner */}
            <div className="relative z-10 flex items-center justify-between pb-space-sm mb-space-md border-b-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">domain</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Floor Plan: Level 02 Sanctuary
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Acoustic Shielding Active • Ambient Sound: 32 dB (Whisper Silent)
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                  MAP ID: L2-ARC-2024
                </span>
              </div>
            </div>

            {/* Spatial Zones Floor Blueprint Grid */}
            <div className="relative z-10 flex flex-col gap-space-lg">
              {/* TOP ROW: ZONE A (Silent Pods) & ZONE D (Tech Stations) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* ZONE A: Silent Study Pods (North Wing) */}
                <div className="bg-surface-container-low/60 rounded-xl p-space-md relative flex flex-col justify-between group hover:bg-surface-container-low transition-colors border border-surface-container-high/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary-container" />
                      <span className="font-title-md text-title-md text-primary font-bold">
                        Zone A • Silent Study Pods
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-medium">
                      Acoustic Glass
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    North Wing • Ultra-quiet individual focus carrels
                  </p>

                  {/* 4 Pods x 4 Seats = 16 Seats */}
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((podIdx) => (
                      <div key={podIdx} className="bg-surface-container-lowest rounded-lg p-2.5 shadow-sm flex flex-col items-center">
                        <div className="text-[10px] font-mono text-on-surface-variant mb-1 font-semibold">
                          POD 0{podIdx}
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          {[1, 2, 3, 4].map((seatIdx) => {
                            const seatNum = `A${String((podIdx - 1) * 4 + seatIdx).padStart(2, '0')}`;
                            const seat = getSeatByNum(seatNum);
                            const isSelected = selectedSeat?.seatNumber === seatNum;

                            return (
                              <button
                                key={seatNum}
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`relative flex flex-col items-center p-1.5 rounded-md transition-all cursor-pointer ${getStatusBgColor(
                                  seat.currentStatus,
                                  isSelected
                                )}`}
                              >
                                {isSelected && (
                                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
                                  </span>
                                )}
                                <span className={`w-3.5 h-3.5 rounded-full ${getStatusDotColor(seat.currentStatus)} mb-1`} />
                                <span className={`font-tabular-numeric text-tabular-numeric ${isSelected ? 'text-secondary font-bold' : getStatusTextColor(seat.currentStatus)}`}>
                                  {seatNum}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ZONE D: Dual-Monitor Tech Stations (East Wing) */}
                <div className="bg-surface-container-low/60 rounded-xl p-space-md relative flex flex-col justify-between group hover:bg-surface-container-low transition-colors border border-surface-container-high/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="font-title-md text-title-md text-primary font-bold">
                        Zone D • Dual-Monitor Tech Stations
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-medium">
                      4K Displays
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    East Wing • Equipped with 32" Dell UltraSharp monitors &amp; USB-C Docks
                  </p>

                  {/* 12 Workstations (3 rows of 4) */}
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 12 }, (_, i) => {
                      const seatNum = `D${String(i + 1).padStart(2, '0')}`;
                      const seat = getSeatByNum(seatNum);
                      const isSelected = selectedSeat?.seatNumber === seatNum;

                      return (
                        <button
                          key={seatNum}
                          type="button"
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`bg-surface-container-lowest p-2 rounded-lg shadow-sm flex flex-col items-center hover:scale-105 transition-all cursor-pointer ${getStatusBgColor(
                            seat.currentStatus,
                            isSelected
                          )}`}
                        >
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant mb-0.5">
                            desktop_windows
                          </span>
                          <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(seat.currentStatus)} mb-1`} />
                          <span className={`font-tabular-numeric text-tabular-numeric ${isSelected ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                            {seatNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: ZONE B (Collaborative Study Hub - CENTER ATRIUM) */}
              <div className="bg-gradient-to-r from-surface-container-low via-surface-container-low/40 to-surface-container-low rounded-xl p-space-md relative border border-surface-container-high/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-space-md gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary-container animate-pulse" />
                    <span className="font-title-md text-title-md text-primary font-bold">
                      Zone B • Collaborative Study Hub (Center Atrium)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-lowest text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-secondary">forum</span>
                      <span>Discussions Allowed</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-lowest text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">draw</span>
                      <span>Whiteboard Divider</span>
                    </span>
                  </div>
                </div>

                {/* 3 Table Clusters x 8 Seats = 24 Seats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
                  {[1, 2, 3].map((clusterIdx) => (
                    <div key={clusterIdx} className="bg-surface-container-lowest rounded-xl p-3 shadow-sm relative flex flex-col justify-between border border-surface-container-high/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-mono font-semibold">
                          TABLE CLUSTER 0{clusterIdx}
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[16px]">power</span>
                      </div>

                      {/* 2x4 Desk Array */}
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 8 }, (_, i) => {
                          const seatNum = `B${String((clusterIdx - 1) * 8 + i + 1).padStart(2, '0')}`;
                          const seat = getSeatByNum(seatNum);
                          const isSelected = selectedSeat?.seatNumber === seatNum;

                          return (
                            <div key={seatNum} className="relative group/seat">
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                onMouseEnter={() => setHoveredSeat(seat)}
                                onMouseLeave={() => setHoveredSeat(null)}
                                className={`w-full flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer ${getStatusBgColor(
                                  seat.currentStatus,
                                  isSelected
                                )}`}
                              >
                                {isSelected && (
                                  <>
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                                    </span>
                                    <span className="absolute -bottom-2 px-1 rounded font-label-sm text-[9px] bg-secondary text-on-primary font-bold">
                                      SELECT
                                    </span>
                                  </>
                                )}
                                <span className={`w-3 h-3 rounded-full ${getStatusDotColor(seat.currentStatus)} mb-1`} />
                                <span className={`font-tabular-numeric text-tabular-numeric ${isSelected ? 'text-secondary font-bold' : getStatusTextColor(seat.currentStatus)}`}>
                                  {seatNum}
                                </span>
                              </button>

                              {/* Precision Tooltip on Hover */}
                              {hoveredSeat?.seatNumber === seatNum && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col w-52 p-2.5 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-xl z-50 pointer-events-none transition-all">
                                  <div className="flex items-center justify-between pb-1 border-b border-surface-container-high/20 mb-1">
                                    <span className="font-title-md text-title-md text-on-primary font-bold">
                                      Seat {seatNum}
                                    </span>
                                    <span className={`font-label-sm text-label-sm ${seat.currentStatus === 'AVAILABLE' ? 'text-[#4ae176]' : 'text-error-container'}`}>
                                      {seat.currentStatus}
                                    </span>
                                  </div>
                                  <span className="font-body-sm text-[11px] text-surface-container-highest">
                                    Collaborative Zone • Atrium
                                  </span>
                                  <div className="flex items-center gap-2 mt-1 text-[11px] text-surface-container-high">
                                    <span className="flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[13px]">bolt</span> 100W
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="material-symbols-outlined text-[13px]">chair</span> Mesh
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM ROW: ZONE C (Window Panorama Bar - South Glass Facade) */}
              <div className="bg-surface-container-low/80 rounded-xl p-space-md relative flex flex-col justify-between border border-surface-container-high/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-space-sm gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">panorama</span>
                    <span className="font-title-md text-title-md text-primary font-bold">
                      Zone C • Window Panorama Bar
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-primary font-medium">
                      South Glass Curtain Wall
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">wb_sunny</span>
                    <span>Max Daylight Index • Campus Lawn View</span>
                  </span>
                </div>

                {/* Architectural Linear Desk Sequence (Seats C01 - C18) */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-sm shadow-sm overflow-x-auto border border-surface-container-high/20">
                  <div className="flex items-center justify-between min-w-[700px] gap-2">
                    {Array.from({ length: 18 }, (_, i) => {
                      const seatNum = `C${String(i + 1).padStart(2, '0')}`;
                      const seat = getSeatByNum(seatNum);
                      const isSelected = selectedSeat?.seatNumber === seatNum;

                      return (
                        <button
                          key={seatNum}
                          type="button"
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-all cursor-pointer ${getStatusBgColor(
                            seat.currentStatus,
                            isSelected
                          )}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor(seat.currentStatus)} mb-1`} />
                          <span className={`font-tabular-numeric text-tabular-numeric ${isSelected ? 'text-secondary font-bold' : getStatusTextColor(seat.currentStatus)}`}>
                            {seatNum}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Blueprint Metric Legend Bar */}
            <div className="relative z-10 mt-space-md pt-space-sm flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-2 border-t border-surface-container-high/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> 1.2m Distanced Layout
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary-container" /> Emergency Exits North/East
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">sensors</span>
                <span>Real-time LiDAR Occupancy Sensors Synced • Updated 12s ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Contextual Seat Inspection & Instant Booking Drawer */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Sticky Seat Detail Flyout Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-lg flex flex-col gap-space-md sticky top-20 border border-surface-container-high/30">
            {/* Drawer Header with Seat ID & Badges */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display-lg text-[32px] leading-tight text-primary font-bold">
                    Seat {selectedSeat?.seatNumber || 'B07'}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                    selectedSeat?.currentStatus === 'AVAILABLE'
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : selectedSeat?.currentStatus === 'OCCUPIED'
                      ? 'bg-[#FEE2E2] text-[#B91C1C]'
                      : 'bg-[#DBEAFE] text-[#1D4ED8]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(selectedSeat?.currentStatus || 'AVAILABLE')}`} />
                    {selectedSeat?.currentStatus === 'AVAILABLE'
                      ? 'Available Now'
                      : selectedSeat?.currentStatus === 'OCCUPIED'
                      ? 'Occupied'
                      : 'Reserved'}
                  </span>
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {selectedSeat?.zoneName || 'Center Atrium • Collaborative Study Hub'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => alert(`Seat ${selectedSeat?.seatNumber} saved to your study favorites.`)}
                className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                title="Bookmark Seat"
              >
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
              </button>
            </div>

            {/* Realistic Desk Aesthetic Preview Photograph */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-sm group">
              <img
                alt={`Seat ${selectedSeat?.seatNumber} preview`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={DESK_IMAGE_URL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
                <span className="font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md bg-primary/40 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  Live Seat View (Verified)
                </span>
                <span className="font-tabular-numeric text-tabular-numeric bg-surface-container-lowest/30 backdrop-blur-md px-2 py-0.5 rounded-full text-on-primary text-[11px] font-semibold">
                  Desk ID: {selectedSeat?.deskCode || '#AT-207'}
                </span>
              </div>
            </div>

            {/* Key Hardware Specs & Ambient Environmental Telemetry */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Power Source</span>
                  <span className="font-title-md text-[13px] text-on-surface font-semibold mt-0.5">
                    {selectedSeat?.power || '2x 100W USB-C'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">wifi</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Network</span>
                  <span className="font-title-md text-[13px] text-on-surface font-semibold mt-0.5">Wi-Fi 6 (650 Mbps)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">chair</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Ergonomics</span>
                  <span className="font-title-md text-[13px] text-on-surface font-semibold mt-0.5">High-back Mesh</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">volume_down</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Noise Rating</span>
                  <span className="font-title-md text-[13px] text-on-surface font-semibold mt-0.5">
                    {selectedSeat?.noise || 'Moderate (Atrium)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Slot Selection Section */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Select Booking Window
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  Today, Nov 14
                </span>
              </div>

              {/* Time Slot Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { slot: '10:00 - 12:00', status: 'AVAILABLE', label: 'Selected (2 Hours)' },
                  { slot: '12:00 - 14:00', status: 'AVAILABLE', label: 'Available' },
                  { slot: '14:00 - 16:00', status: 'AVAILABLE', label: 'Available' },
                  { slot: '16:00 - 18:00', status: 'RESERVED', label: 'Reserved' },
                ].map((item) => {
                  const isSelected = selectedSlot === item.slot;
                  const isReserved = item.status === 'RESERVED';

                  return (
                    <button
                      key={item.slot}
                      type="button"
                      disabled={isReserved}
                      onClick={() => setSelectedSlot(item.slot)}
                      className={`p-2.5 rounded-xl font-label-md text-label-md flex flex-col items-start transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-secondary text-on-primary shadow-md ring-2 ring-secondary ring-offset-2'
                          : isReserved
                          ? 'bg-surface-container opacity-60 cursor-not-allowed text-on-surface-variant'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-semibold ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                          {item.slot}
                        </span>
                        {isSelected ? (
                          <span className="material-symbols-outlined text-[16px] text-on-primary">check_circle</span>
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${isReserved ? 'bg-[#3B82F6]' : 'bg-[#22C55E]'}`} />
                        )}
                      </div>
                      <span className={`font-label-sm text-[11px] mt-0.5 ${
                        isSelected ? 'text-secondary-fixed' : isReserved ? 'text-on-surface-variant' : 'text-[#15803D]'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Call to Action Button */}
            <div className="flex flex-col gap-2 pt-space-xs">
              <button
                type="button"
                onClick={handleProceedBooking}
                disabled={selectedSeat?.currentStatus !== 'AVAILABLE'}
                className="w-full py-3.5 px-space-md rounded-xl bg-secondary text-on-primary hover:bg-[#003ea8] shadow-md hover:shadow-lg transition-all font-title-md text-title-md flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {selectedSeat?.currentStatus === 'AVAILABLE'
                    ? `Proceed to Reserve Seat ${selectedSeat?.seatNumber}`
                    : `Seat ${selectedSeat?.seatNumber} is ${selectedSeat?.currentStatus}`}
                </span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => alert(`Seat ${selectedSeat?.seatNumber} added to quick favorites.`)}
                  className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>Save to Favorites</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Issue report submitted for Desk ${selectedSeat?.seatNumber}. Facility staff notified.`)}
                  className="font-label-sm text-label-sm text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">report_problem</span>
                  <span>Report Desk Issue</span>
                </button>
              </div>
            </div>

            {/* Student Instant Check-In Policy Microcard */}
            <div className="bg-surface-container-low/70 rounded-xl p-3 flex items-start gap-2.5 border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Hold expires 15 minutes post-start time. Tap your student RFID card or scan the desk QR upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Global Library Acoustic & Capacity Health Metrics Strip */}
      <div className="mt-space-lg grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between border border-surface-container-high/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Acoustic Status
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">34.2 dB Average</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Sanctuary standard met</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[26px]">hearing</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between border border-surface-container-high/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Natural Daylight
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">Zone C (High)</span>
            <span className="font-body-sm text-body-sm text-[#15803D] font-medium">Optimal study lighting until 16:45</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[26px]">lightbulb</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between border border-surface-container-high/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Available Outlets
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold mt-1">118 / 132 Desks</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">100% grid operational</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-[#22C55E]">
            <span className="material-symbols-outlined text-[26px]">power</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindSeatPage;

