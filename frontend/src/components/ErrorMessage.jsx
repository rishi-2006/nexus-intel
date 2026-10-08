import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorMessage = ({
  title = 'Intelligence Retrieval Error',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-200 backdrop-blur-md flex items-start space-x-3.5 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-rose-300">{title}</h4>
        <p className="text-xs text-rose-200/90 mt-1">
          {message || 'An unexpected communication error occurred. Check backend network connection.'}
        </p>
        {onRetry && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              icon={RefreshCw}
              onClick={onRetry}
              className="text-rose-200 border-rose-700/60 hover:bg-rose-900/40 hover:text-white"
            >
              Retry Action
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
