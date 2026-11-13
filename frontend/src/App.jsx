import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindSeatPage } from './pages/FindSeatPage';
import { SeatBookingPage } from './pages/SeatBookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const VALID_ROUTES = [
  'dashboard',
  'find-a-seat',
  'seat-booking',
  'my-bookings',
  'booking-history',
  'admin-portal',
  'login',
  'register',
];

export function App() {
  const { isAuthenticated, user, isAdmin, quickDemoLogin } = useAuth();

  // TASK 3: Ensure visitors opening https://a-seat-to-study.vercel.app land directly on Dashboard
  const [activeRoute, setActiveRoute] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (VALID_ROUTES.includes(hash)) {
        return hash;
      }
    }
    // Default is ALWAYS the main Dashboard/home page
    return 'dashboard';
  });

  const [bookingSeat, setBookingSeat] = useState({
    seatNumber: 'B07',
    deskCode: '#AT-207',
    zoneName: 'Zone B • Collaborative Study Hub (Center Atrium)',
    floorLevel: 2,
    powerSpecs: '2x 100W USB-C + Dual AC Outlet',
  });

  // State to minimize/expand the presentation switcher on mobile devices
  const [isSwitcherMinimized, setIsSwitcherMinimized] = useState(false);

  // Sync route with URL hash for browser back/forward and deep link support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (VALID_ROUTES.includes(hash)) {
        setActiveRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route, data) => {
    if (data) {
      setBookingSeat(data);
    }
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${route}`;
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Floating Quick View Switcher with Mobile Optimization
  const renderDevSwitcher = () => {
    if (isSwitcherMinimized) {
      return (
        <button
          type="button"
          onClick={() => setIsSwitcherMinimized(false)}
          className="fixed bottom-3 right-3 z-50 bg-primary/95 text-on-primary hover:bg-secondary px-3 py-1.5 rounded-full shadow-xl border border-primary-container text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium"
          title="Open Phase Switcher"
          aria-label="Expand Phase Switcher"
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Phase Switcher</span>
        </button>
      );
    }

    return (
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-primary/95 text-on-primary backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full shadow-2xl border border-primary-container flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs max-w-[94vw] overflow-x-auto no-scrollbar whitespace-nowrap">
        <span className="font-semibold text-primary-fixed uppercase tracking-wider text-[10px] pl-1 hidden md:inline">
          Phase:
        </span>
        <button
          type="button"
          onClick={() => handleNavigate('dashboard')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'dashboard'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          📊 Dashboard
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) quickDemoLogin('STUDENT');
            handleNavigate('find-a-seat');
          }}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'find-a-seat'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          🗺️ Seat Map
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) quickDemoLogin('STUDENT');
            handleNavigate('seat-booking');
          }}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'seat-booking'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          🎫 Book Seat
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) quickDemoLogin('STUDENT');
            handleNavigate('my-bookings');
          }}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            ['my-bookings', 'booking-history'].includes(activeRoute)
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          📋 Passes
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAdmin) quickDemoLogin('ADMIN');
            handleNavigate('admin-portal');
          }}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'admin-portal'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          🛡️ Admin
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('login')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'login'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          🔑 Login
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('register')}
          className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            activeRoute === 'register'
              ? 'bg-secondary text-on-secondary font-bold shadow-xs'
              : 'hover:bg-surface-container-lowest/15 text-surface-container-high'
          }`}
        >
          📝 Register
        </button>
        <button
          type="button"
          onClick={() => setIsSwitcherMinimized(true)}
          className="p-1 rounded-full hover:bg-surface-container-lowest/20 text-surface-container-high transition-colors ml-0.5 cursor-pointer"
          title="Minimize bar"
          aria-label="Minimize bar"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>
    );
  };

  // Standalone Full-Page Authentication Views
  if (activeRoute === 'login') {
    return (
      <>
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={(userData) => {
            handleNavigate(userData.role === 'ADMIN' ? 'admin-portal' : 'dashboard');
          }}
        />
        {renderDevSwitcher()}
      </>
    );
  }

  if (activeRoute === 'register') {
    return (
      <>
        <RegisterPage
          onNavigate={handleNavigate}
          onRegisterSuccess={() => handleNavigate('dashboard')}
        />
        {renderDevSwitcher()}
      </>
    );
  }

  // Main App Shell with Responsive Layout Navigation
  return (
    <>
      <AppLayout activeRoute={activeRoute} onNavigate={handleNavigate}>
        {activeRoute === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {activeRoute === 'find-a-seat' && (
          <FindSeatPage
            onNavigate={handleNavigate}
            onSelectSeatForBooking={(seat) => handleNavigate('seat-booking', seat)}
          />
        )}
        {activeRoute === 'seat-booking' && (
          <SeatBookingPage seat={bookingSeat} onNavigate={handleNavigate} />
        )}
        {['my-bookings', 'booking-history'].includes(activeRoute) && (
          <MyBookingsPage onNavigate={handleNavigate} />
        )}
        {activeRoute === 'admin-portal' && <AdminPortalPage onNavigate={handleNavigate} />}

        {/* Future Phase Placeholder Screens */}
        {!VALID_ROUTES.includes(activeRoute) && (
          <div className="max-w-4xl mx-auto pt-16 text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[32px]">construction</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              {activeRoute.replace('-', ' ').toUpperCase()}
            </h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              This module is scheduled for implementation in upcoming phases following user approval.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-space-sm">
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('find-a-seat')}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-colors cursor-pointer"
              >
                Find a Seat
              </button>
            </div>
          </div>
        )}
      </AppLayout>
      {renderDevSwitcher()}
    </>
  );
}

export default App;
