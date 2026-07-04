import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLoginRedirect = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative mb-8">
          <p className="text-[120px] font-black text-border leading-none select-none">401</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-card flex items-center justify-center">
              <Lock className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Session Expired</h1>
          <p className="font-handwritten text-lg text-primary">"Security first, always."</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            Your login session has expired or you are unauthorized to view this resource. Please log back in to renew your workspace session tokens.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLoginRedirect}
            className="btn-primary inline-flex items-center gap-2 px-6"
          >
            <LogIn className="w-4 h-4" /> Log In Again
          </button>
        </div>
      </div>
    </div>
  );
}
