import React from 'react';

export const Card = ({
  title,
  subtitle,
  value,
  badge,
  icon: Icon,
  trend,
  className = '',
  headerAction,
  children,
  onClick,
}) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`nexus-card rounded-xl p-5 border border-slate-800 ${
        isClickable ? 'cursor-pointer nexus-card-hover' : ''
      } ${className}`}
    >
      {(title || Icon || headerAction || badge) && (
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-sm font-semibold text-slate-300">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {badge && <span>{badge}</span>}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      {value !== undefined && (
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend > 0
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  : 'bg-rose-950 text-rose-400 border border-rose-800/50'
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default Card;
