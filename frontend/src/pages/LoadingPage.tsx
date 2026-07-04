import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  'Preparing your interactive workspace...',
  'Fetching headcount charts and attendance indexes...',
  'Polishing dashboard analytics...',
  'Calculating net salary indices and payslip reports...',
  'Syncing team leave balances with department calendars...',
  'Consulting Gemini AI engine for latest updates...',
  'Formatting custom workspace layouts...',
  'Organizing active employee profile registers...',
  'Structuring department headcounts and teams...'
];

export function LoadingPage() {
  const [message, setMessage] = useState(MESSAGES[0]);

  useEffect(() => {
    // Choose random message
    const initialIndex = Math.floor(Math.random() * MESSAGES.length);
    setMessage(MESSAGES[initialIndex]);

    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * MESSAGES.length);
      setMessage(MESSAGES[index]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center space-y-6 max-w-sm w-full">
        {/* Loading Spinner Wrapper */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-plum animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <p className="font-semibold text-text-primary text-sm tracking-tight">{message}</p>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Loading Resources
          </p>
        </div>

        {/* Skeleton Box Mockup */}
        <div className="card p-4 space-y-3 opacity-60">
          <div className="flex gap-2">
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="space-y-1.5 flex-grow pt-1">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-2 w-1/4 rounded" />
            </div>
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
