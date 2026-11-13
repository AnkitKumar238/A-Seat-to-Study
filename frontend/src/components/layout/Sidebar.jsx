import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNleGJ8V-PPXAul3g-xIPF0otlj-LkHf4I1IaNRCxUqFQw-fUpLBiNiP8hlq-jfZuVhCYz4ljbCgem9ASwmi6gwVFnWQLdaNm_EobSkf9CzKVQi9HgK4C7xtF9oeNJpmvc-4DeEbgCK7z1yL4laFDu6a5wWUwB4mZQ33aouaiRWOj-fxwgBQNMOHD73V3ZXvFxq-SW5m4QcK8XGkfd0L0InKz3MZ2gRnLNMC27AlE';

export function Sidebar({ activeRoute = 'dashboard', onNavigate, isOpen = false, onClose }) {
  const { user, isAuthenticated, logout, isAdmin, quickDemoLogin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'find-a-seat', label: 'Find a Seat', icon: 'pin_drop', badge: 'Live Map', badgeType: 'secondary' },
    { id: 'seat-booking', label: 'Book a Seat', icon: 'event_seat' },
    { id: 'my-bookings', label: 'My Bookings', icon: 'event_available', badge: '2 active', badgeType: 'neutral' },
    { id: 'booking-history', label: 'Booking History', icon: 'history' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  ];

  const secondaryItems = [
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleItemClick = (id) => {
    if (onNavigate) onNavigate(id);
    if (onClose) onClose();
  };

  const handleRoleToggle = () => {
    if (isAdmin) {
      quickDemoLogin('STUDENT');
      handleItemClick('dashboard');
    } else {
      quickDemoLogin('ADMIN');
      handleItemClick('admin-portal');
    }
  };

  const handleLogout = async () => {
    await logout();
    handleItemClick('dashboard');
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-primary/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Drawer Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 sm:w-64 bg-surface-container-lowest shadow-2xl lg:shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-outline-variant/30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
            <button
              type="button"
              onClick={() => handleItemClick('dashboard')}
              className="flex items-center gap-space-sm text-left cursor-pointer group"
            >
              <img
                alt="A Seat to Study Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src={LOGO_URL}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary-container leading-none font-bold">
                  A Seat to Study
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant tracking-wider uppercase mt-0.5">
                  LPU Central Library
                </span>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User Role Card in Sidebar */}
          <div className="mx-space-md mt-space-sm p-space-xs rounded-lg bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {isAuthenticated && !isAdmin ? (
                <img
                  src={user?.avatarUrl || '/assets/ankit-singh-rathore.jpg'}
                  alt={user?.name || 'Ankit Singh Rathore'}
                  className="w-7 h-7 rounded-full object-cover border border-secondary/40 shrink-0"
                />
              ) : (
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isAdmin ? 'bg-error animate-pulse' : 'bg-outline'
                  }`}
                />
              )}
              <span className="font-label-sm text-label-sm font-semibold text-primary truncate max-w-[125px]">
                {isAdmin ? 'Admin Console' : isAuthenticated ? (user?.name || 'Ankit Singh Rathore') : 'Guest Student'}
              </span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                isAdmin
                  ? 'bg-primary text-on-primary'
                  : isAuthenticated
                  ? 'bg-secondary-fixed text-on-secondary-fixed'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {isAdmin ? 'ADMIN' : isAuthenticated ? (user?.role || 'STUDENT') : 'GUEST'}
            </span>
          </div>

          {/* Primary Navigation */}
          <div className="px-space-md py-space-sm flex-1">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between px-space-md py-2.5 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-title-md shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="font-label-md text-label-md">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-label-sm ${
                          item.badgeType === 'secondary'
                            ? 'bg-secondary-fixed text-on-secondary-fixed font-semibold'
                            : 'bg-surface-container-high text-on-surface-variant font-medium'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="my-2 h-[1px] bg-surface-container-high" />

              {secondaryItems.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between px-space-md py-2.5 rounded-lg transition-colors text-left cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-title-md'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="font-label-md text-label-md">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-space-md pb-space-md flex flex-col gap-1 bg-surface-container-lowest border-t border-outline-variant/20 pt-space-sm shrink-0">
          <button
            type="button"
            onClick={handleRoleToggle}
            className="flex items-center gap-3 px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-left cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAdmin ? 'school' : 'admin_panel_settings'}
            </span>
            <span className="font-label-md text-label-md font-medium">
              {isAdmin ? 'Switch to Student View' : 'Switch to Admin Portal'}
            </span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-space-md py-2.5 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="font-label-md text-label-md font-medium">Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleItemClick('login')}
              className="flex items-center gap-3 px-space-md py-2.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors text-left cursor-pointer min-h-[44px] font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span className="font-label-md text-label-md">Sign In to Account</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
