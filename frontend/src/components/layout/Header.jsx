import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAfQAU6UOokY_eynC-uk1Pmf3sc5a1-Lx-Eeu3zILa1a9EwkLjV8yBQUphHn8ITTe5Ef4YhjGDDnLmE6glb3-DAMdCRuO2q0zKiwQBdOft_ABXM09x-LSKdzFeH7mnRfIqbv-KYJy4o13uz2p9TSTJecCY1C-0Hpd8S_8YftyUX1GF1k7WAjjPmrViifGOcplOgpsNMRvojZZ5rQT2GuN6sZyUNKrg9_vWPST0x8iM';

export function Header({
  searchQuery = '',
  onSearchChange,
  occupancyPercent = 74,
  libraryName = 'LPU Central Library',
  onNavigate,
  onToggleMobileMenu,
}) {
  const { user, isAuthenticated, logout, isAdmin, quickDemoLogin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const studentName = user?.name || 'Ankit';
  const studentId = user?.studentId || '12513583';
  const studentDept = user?.department || 'Lovely Professional University — B.Tech CSE';
  const quotaHours = user?.weeklyQuotaHours || 25.0;
  const usedHours = user?.usedQuotaHours || 8.5;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    if (onNavigate) onNavigate('dashboard');
  };

  const handleNavigateItem = (route) => {
    setShowProfileMenu(false);
    if (onNavigate) onNavigate(route);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/95 backdrop-blur-xl shadow-xs z-40 px-2 sm:px-space-md lg:px-space-lg flex items-center justify-between border-b border-outline-variant/20">
      {/* Left Cluster: Mobile Hamburger + Telemetry */}
      <div className="flex items-center gap-1.5 sm:gap-space-md min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface-container active:scale-95 transition-all cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px] shrink-0"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Telemetry Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-surface-container-low text-on-surface text-xs sm:text-sm min-w-0">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse shrink-0" />
          <span className="font-label-md font-medium text-on-surface truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-none">
            {libraryName}
          </span>
          <span className="text-outline-variant text-label-sm font-label-sm hidden xs:inline">•</span>
          <span className="font-tabular-numeric text-tabular-numeric text-on-surface-variant font-semibold shrink-0">
            {occupancyPercent}%
            <span className="hidden sm:inline"> Occupied</span>
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span className="font-tabular-numeric text-tabular-numeric text-body-sm">
            Thu, Oct 24 • 14:32
          </span>
        </div>
      </div>

      {/* Right Cluster: Search, Notifications & Profile/Auth */}
      <div className="flex items-center gap-1.5 sm:gap-space-sm md:gap-space-md shrink-0">
        {/* Search Input (Collapsible/Scaled on Small Viewports) */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3 text-on-surface-variant text-[16px] sm:text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search seat..."
            className="w-24 xs:w-28 sm:w-44 md:w-56 lg:w-60 h-9 pl-8 sm:pl-9 pr-2 sm:pr-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-xs sm:text-sm outline-none focus:ring-2 focus:ring-secondary/20 border border-outline-variant/30 transition-all"
            aria-label="Search seat"
          />
        </div>

        {/* Notifications (Desktop / Tablet) */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('notifications')}
          aria-label="Notifications"
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer hidden sm:flex items-center justify-center min-w-[36px] min-h-[36px]"
        >
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-sm text-[10px] font-bold">
            3
          </span>
        </button>

        <div className="h-6 sm:h-8 w-[1px] bg-surface-container-high mx-0.5 sm:mx-1 hidden xs:block" />

        {/* Authenticated Profile or Guest Sign-In CTAs */}
        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-1.5 sm:gap-space-sm pl-1 pr-1.5 sm:pr-2 py-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors text-left min-h-[40px]"
              aria-label="User profile menu"
            >
              <img
                alt={studentName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-outline-variant/40 shrink-0"
                src={AVATAR_URL}
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold flex items-center gap-1.5">
                  <span className="truncate max-w-[120px]">{studentName}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 bg-primary text-on-primary text-[10px] font-bold rounded">
                      ADMIN
                    </span>
                  )}
                </span>
                <span className="font-tabular-numeric text-[11px] text-on-surface-variant">
                  ID: {studentId}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant hidden md:inline">
                {showProfileMenu ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface-container-lowest shadow-2xl border border-outline-variant/30 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-surface-container-high">
                  <p className="font-title-md text-title-md text-primary font-bold">{studentName}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">ID: {studentId}</p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant mt-1 line-clamp-1">{studentDept}</p>
                </div>

                <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Weekly Focus Quota</span>
                  <span className="font-tabular-numeric text-label-sm font-bold text-secondary">
                    {usedHours}h / {quotaHours}h
                  </span>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => handleNavigateItem('dashboard')}
                    className="w-full px-4 py-2 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    <span>Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigateItem('my-bookings')}
                    className="w-full px-4 py-2 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">event_available</span>
                    <span>My Bookings &amp; Passes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigateItem('find-a-seat')}
                    className="w-full px-4 py-2 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                    <span>Interactive Floor Map</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigateItem('admin-portal')}
                    className="w-full px-4 py-2 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span>Admin Operations Portal</span>
                  </button>
                </div>

                <div className="border-t border-surface-container-high pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left font-label-md text-label-md text-error hover:bg-error-container flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer min-h-[36px] flex items-center"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('register')}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg shadow-xs transition-colors cursor-pointer min-h-[36px] items-center hidden xs:inline-flex"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
