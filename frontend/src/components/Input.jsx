import React from 'react';

export const Input = ({
  label,
  error,
  helper,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        className={`w-full px-3.5 py-2 bg-slate-900/90 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-150 ${
          error
            ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
            : 'border-slate-700/80 focus:border-cyan-400 focus:ring-cyan-400/20'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </div>
  );
};

export default Input;
