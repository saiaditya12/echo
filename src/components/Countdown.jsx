import { useState, useEffect } from 'react';

/**
 * Precision Countdown component for locked capsules
 * Automatically signals when the capsule unlocks
 */
export default function Countdown({ targetDate, onUnlock }) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - Date.now();

    if (difference <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return { total: difference, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onUnlock) {
          onUnlock();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onUnlock]);

  if (timeLeft.total <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        Ready to Unseal
      </div>
    );
  }

  const formatPad = (num) => String(num).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg min-w-[36px]">
          <span className="font-mono text-sm font-semibold text-amber-200">
            {timeLeft.days}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
            days
          </span>
        </div>
      )}
      <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg min-w-[34px]">
        <span className="font-mono text-sm font-semibold text-amber-200">
          {formatPad(timeLeft.hours)}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
          hrs
        </span>
      </div>
      <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg min-w-[34px]">
        <span className="font-mono text-sm font-semibold text-amber-200">
          {formatPad(timeLeft.minutes)}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
          min
        </span>
      </div>
      <div className="flex flex-col items-center bg-slate-900/80 border border-slate-800 px-2 py-1 rounded-lg min-w-[34px]">
        <span className="font-mono text-sm font-semibold text-amber-300 animate-pulse">
          {formatPad(timeLeft.seconds)}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
          sec
        </span>
      </div>
    </div>
  );
}
