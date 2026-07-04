import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Activity } from 'lucide-react';

export function SplashPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation simulation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] flex flex-col items-center justify-center p-6 select-none overflow-hidden relative">
      {/* Background soft circular gradient designs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-50/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-100/40 blur-3xl pointer-events-none" />

      <div className="text-center max-w-sm w-full space-y-8 z-10">
        {/* Animated Brand Logo Container */}
        <div className="flex justify-center mb-2">
          <div className="relative animate-bounce">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-plum to-purple-600 flex items-center justify-center shadow-xl shadow-plum-200 ring-8 ring-white">
              <Activity size={38} className="text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-violet-400 border-2 border-white flex items-center justify-center shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-display text-4xl font-black text-plum-accent tracking-tight animate-fade-in">
            PeopleFlow
          </h1>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mt-1">
            HR Intelligence Ecosystem
          </p>
          <p className="font-handwritten text-lg text-primary mt-2">
            "Workspaces that feel alive"
          </p>
        </div>

        {/* Progress bar container */}
        <div className="space-y-3 pt-6">
          <div className="w-full bg-white border border-border h-2 rounded-full overflow-hidden shadow-inner p-[1px]">
            <div
              className="bg-gradient-to-r from-plum to-purple-600 h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            <span>Preparing workspace...</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer Version Info */}
      <div className="absolute bottom-8 text-center space-y-1">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
          Version 2.0.4 (LTS)
        </p>
        <p className="text-[9px] text-text-secondary/70">
          © 2026 PeopleFlow Inc. · All Rights Reserved
        </p>
      </div>
    </div>
  );
}
