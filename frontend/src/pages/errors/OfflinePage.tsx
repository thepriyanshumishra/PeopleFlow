import { WifiOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function OfflinePage() {
  const handleCheckConnection = () => {
    if (navigator.onLine) {
      toast.success('You are back online! Reloading...', { duration: 1500 });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error('Still offline. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative mb-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center relative shadow-sm">
              <WifiOff className="w-12 h-12 text-error animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">No Internet Connection</h1>
          <p className="font-handwritten text-lg text-primary">"Take a deep breath."</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            It looks like you are disconnected from the internet. Please check your Wi-Fi, Ethernet, or cellular networks and try again.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleCheckConnection}
            className="btn-primary inline-flex items-center gap-2 px-6"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
