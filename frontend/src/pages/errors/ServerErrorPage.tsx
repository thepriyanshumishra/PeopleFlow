import { Link } from 'react-router-dom';
import { ServerCrash, Home, RefreshCw, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export function ServerErrorPage() {
  const handleReportIssue = () => {
    toast.success('System error report logged with IT Support!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-border leading-none select-none">500</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-card flex items-center justify-center">
              <ServerCrash className="w-10 h-10 text-error animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Internal Server Error</h1>
          <p className="font-handwritten text-lg text-primary">"A small bump in the wire."</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            Something went wrong inside our server systems. Please try refreshing the screen. If the issue persists, send a support log request.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button onClick={() => window.location.reload()} className="btn-primary flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh Page
          </button>
          <button onClick={handleReportIssue} className="btn-secondary flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> Report Issue
          </button>
          <Link to="/dashboard" className="btn-ghost flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
