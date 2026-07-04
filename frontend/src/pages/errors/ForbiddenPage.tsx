import { Link } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function ForbiddenPage() {
  const user = useAuthStore(s => s.user);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-border leading-none select-none">403</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-card flex items-center justify-center">
              <ShieldOff className="w-10 h-10 text-error animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Access Denied</h1>
          <p className="font-handwritten text-lg text-primary">"Restricted zone. Turn back."</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            You don't have authorization permissions to view this screen. This module is restricted to administrators only.
          </p>
          {user && (
            <div className="mt-2 text-xs text-text-secondary">
              Logged in as: <span className="font-bold text-plum-accent">{user.role}</span> ({user.email})
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
