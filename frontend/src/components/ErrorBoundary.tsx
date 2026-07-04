import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Navigate to dashboard as a safe fallback
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-border shadow-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6 border border-red-100">
              <AlertTriangle className="w-8 h-8 text-error" />
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-text-secondary mb-2 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page or go back to the dashboard.
            </p>
            {this.state.error && (
              <p className="text-xs text-text-secondary font-mono bg-background border border-border rounded-lg p-3 mb-6 text-left overflow-auto max-h-24">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border hover:bg-background text-text-primary font-bold text-xs rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-plum hover:bg-primary-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
