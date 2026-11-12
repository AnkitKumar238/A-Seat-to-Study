import React from 'react';

export function Card({
  children,
  className = '',
  elevation = 'tier1',
  ...props
}) {
  const elevations = {
    tier0: 'bg-surface border-transparent',
    tier1: 'bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]',
    tier2: 'bg-surface-container-lowest border border-outline-variant/40 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)]',
  };

  return (
    <div
      className={`rounded-xl p-space-md sm:p-space-lg transition-all ${elevations[elevation] || elevations.tier1} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

