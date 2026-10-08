import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXUS INTEL UI Unhandled Error Boundary Caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interface Subsystem Error</h3>
            <p className="text-xs text-slate-400 mb-4">
              A client-side component crashed during rendering. You can safely reload the dashboard.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 text-left mb-5 overflow-x-auto">
              {this.state.error?.toString() || 'Unknown script exception'}
            </div>
            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={this.handleReload}
              className="w-full"
            >
              Reload Interface
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
