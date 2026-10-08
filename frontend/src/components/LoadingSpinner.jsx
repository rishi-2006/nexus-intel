import React from 'react';

export const LoadingSpinner = ({
  size = 'md',
  message = 'Loading intelligence telemetry...',
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} border-cyan-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-xs font-mono text-slate-400 tracking-wider">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
