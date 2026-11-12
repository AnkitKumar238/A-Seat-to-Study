import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAfQAU6UOokY_eynC-uk1Pmf3sc5a1-Lx-Eeu3zILa1a9EwkLjV8yBQUphHn8ITTe5Ef4YhjGDDnLmE6glb3-DAMdCRuO2q0zKiwQBdOft_ABXM09x-LSKdzFeH7mnRfIqbv-KYJy4o13uz2p9TSTJecCY1C-0Hpd8S_8YftyUX1GF1k7WAjjPmrViifGOcplOgpsNMRvojZZ5rQT2GuN6sZyUNKrg9_vWPST0x8iM';

export function Header({
  searchQuery = '',
  onSearchChange,
  occupancyPercent = 74,
  libraryName = 'LPU Central Library (Lovely Professional University)',
  onNavigate,
}) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const studentName = user?.name || 'Ankit';
  const studentId = user?.studentId || '12513583';
  const studentDept = user?.department || 'Lovely Professional University — B.Tech CSE';
  const quotaHours = user?.weeklyQuotaHours || 25.0;
  const usedHours = user?.usedQuotaHours || 8.5;

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    if (onNavigate) onNavigate('login');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-lg flex items-center justify-between border-b border-outline-variant/20">
      {/* Left Telemetry Cluster */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-label-md text-label-md font-medium text-on-surface">
            {libraryName}
          </span>
          <span className="text-outline-variant text-label-sm font-label-sm">•</span>
          <span className="font-tabular-numeric text-tabular-numeric text-on-surface-variant font-semibold">
            {occupancyPercent}% Occupied
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span className="font-tabular-numeric text-tabular-numeric text-body-sm">
            Thu, Oct 24 • 14:32
          </span>
        </div>
      </div>

      {/* Right Controls Cluster */}
      <div className="flex items-center gap-space-md">
        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search Seat ID (e.g. B07)..."
            className="w-60 h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-secondary/20 border border-outline-variant/30 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold">
            3
          </span>
        </button>

        <div className="h-8 w-[1px] bg-surface-container-high mx-1" />

        {/* User Profile Chip with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-space-sm pl-1 pr-2 py-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors text-left"
          >
            <img
              alt={studentName}
              className="w-8 h-8 rounded-full object-cover border border-outline-variant/40"
              src={AVATAR_URL}
            />
            <div className="flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold flex items-center gap-1.5">
                {studentName}
                {isAdmin && (
                  <span className="px-1.5 py-0.2 bg-primary text-on-primary text-[10px] font-bold rounded">
                    ADMIN
                  </span>
                )}
              </span>
              <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight truncate max-w-[150px]">
                ID: {studentId}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              {showProfileMenu ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Profile Popover / Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-space-sm z-50">
              <div className="px-space-md py-space-xs border-b border-surface-container-high/40 pb-space-sm">
                <p className="font-title-md text-body-md font-bold text-primary">{studentName}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email || 'ankit@lpu.in'}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary text-[11px] font-semibold">
                    {user?.role || 'STUDENT'}
                  </span>
                  <span className="text-[11px] text-outline font-tabular-numeric">
                    Quota: {usedHours} / {quotaHours} hrs
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigate) onNavigate('profile');
                  }}
                  className="w-full flex items-center gap-space-sm px-space-md py-2 text-on-surface-variant hover:bg-surface-container text-left text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <span>My Student Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigate) onNavigate('my-bookings');
                  }}
                  className="w-full flex items-center gap-space-sm px-space-md py-2 text-on-surface-variant hover:bg-surface-container text-left text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span>Active Bookings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigate) onNavigate('login');
                  }}
                  className="w-full flex items-center gap-space-sm px-space-md py-2 text-on-surface-variant hover:bg-surface-container text-left text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  <span>Switch User / Relogin</span>
                </button>
              </div>

              <div className="border-t border-surface-container-high/40 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-space-sm px-space-md py-2 text-error hover:bg-error-container text-left text-label-md font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
