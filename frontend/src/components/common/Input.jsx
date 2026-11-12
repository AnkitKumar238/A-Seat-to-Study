import React from 'react';

export function Input({
  label,
  icon,
  error,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`w-full h-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary/20 focus:border-secondary border border-transparent ${
            icon ? 'pl-9 pr-3' : 'px-3'
          } ${error ? 'border-error ring-1 ring-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="font-body-sm text-[11px] text-error">{error}</span>}
    </div>
  );
}

export default Input;

