import React from 'react';

export function Badge({
  children,
  variant = 'available',
  showDot = true,
  className = '',
}) {
  const styles = {
    // Green Available
    available: {
      container: 'bg-[#DCFCE7] text-[#15803D]',
      dot: 'bg-[#22C55E]',
    },
    // Red Occupied
    occupied: {
      container: 'bg-[#FEE2E2] text-[#B91C1C]',
      dot: 'bg-[#EF4444]',
    },
    // Blue Reserved
    reserved: {
      container: 'bg-[#DBEAFE] text-[#1D4ED8]',
      dot: 'bg-[#3B82F6]',
    },
    // Slate Offline
    offline: {
      container: 'bg-[#F1F5F9] text-[#64748B]',
      dot: 'bg-[#94A3B8]',
    },
    // Royal Blue Tag
    accent: {
      container: 'bg-secondary-fixed text-on-secondary-fixed',
      dot: 'bg-secondary',
    },
    // Neutral Low
    neutral: {
      container: 'bg-surface-container text-on-surface-variant',
      dot: 'bg-outline',
    },
  };

  const selected = styles[variant] || styles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold tracking-wide ${selected.container} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${selected.dot}`} />}
      {children}
    </span>
  );
}

export default Badge;

