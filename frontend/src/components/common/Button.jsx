import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-title-md transition-all rounded-lg outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    // Primary Navy Button
    primary: 'bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow',
    // Secondary Royal Blue CTA (Confirm Booking / Find Seat)
    secondary: 'bg-secondary text-on-primary hover:bg-[#003ea8] shadow-md hover:shadow-lg',
    // Ghost / Outline Button
    outline: 'border border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:bg-surface-container',
    // Neutral Low
    subtle: 'bg-surface-container-low text-on-surface hover:bg-surface-container',
    // Destructive Red
    destructive: 'bg-error-container text-on-error-container hover:bg-error/20',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-label-sm gap-1',
    md: 'px-space-md py-2 text-label-md gap-2',
    lg: 'px-space-lg py-3 text-title-md gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;

