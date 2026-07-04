import { Settings, RefreshCw, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MaintenancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="relative mb-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-primary-50 border border-primary-100 flex items-center justify-center relative">
              <Settings className="w-12 h-12 text-plum animate-spin" style={{ animationDuration: '8s' }} strokeWidth={1.5} />
              <Settings className="w-6 h-6 text-plum-accent absolute bottom-4 right-4 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">System Maintenance</h1>
          <p className="font-handwritten text-lg text-primary">"Polishing the gears for a smoother flow."</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
            PeopleFlow is currently undergoing scheduled system updates to deploy new features and optimize databases. We should be back online shortly.
          </p>
        </div>

        {/* Status panel */}
        <div className="bg-surface border border-border rounded-2xl p-4 max-w-sm mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Estimated completion: 30 mins</span>
          </div>
          <p className="text-[11px] text-text-secondary">Systems are healthy · Data is safe</p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Check Again
          </button>
          <button
            onClick={() => navigate('/help')}
            className="btn-secondary flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Help Center
          </button>
        </div>
      </div>
    </div>
  );
}
