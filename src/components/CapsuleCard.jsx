import { useState } from 'react';
import Countdown from './Countdown';

/**
 * CapsuleCard - Styled as an ethereal glassmorphic envelope
 * Displays locked status with countdown or unlocked status ready for unsealing
 */
export default function CapsuleCard({ capsule, onOpen, onDelete }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return new Date(capsule.unlock_date).getTime() <= Date.now();
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formattedUnlockDate = new Date(capsule.unlock_date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedCreatedDate = new Date(capsule.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleCountdownUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl glass-panel glass-panel-hover p-6 transition-all duration-300 border border-slate-700/50 shadow-xl shadow-slate-950/50">
      {/* Decorative Envelope Flap Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity">
        <div className="w-28 h-28 mx-auto -mt-20 rotate-45 border-b border-r border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
      </div>

      {/* Top Header Row: Status badge & Delete button */}
      <div className="flex items-start justify-between gap-2 z-10 mb-4">
        <div>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-sm shadow-amber-950">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 11V7a2 2 0 114 0v4" />
              </svg>
              Sealed in Time
            </span>
          )}
        </div>

        {/* Delete Trigger */}
        <div className="relative">
          {showConfirmDelete ? (
            <div className="flex items-center gap-1.5 bg-slate-900/95 border border-rose-500/40 rounded-xl px-2 py-1 shadow-lg backdrop-blur-md animate-fade-in">
              <span className="text-[11px] text-rose-300 font-medium mr-1">Delete?</span>
              <button
                type="button"
                onClick={() => onDelete(capsule.id)}
                className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                title="Confirm deletion"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-2 py-0.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete capsule"
              aria-label="Delete capsule"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Card Body */}
      <div className="z-10 flex-1 my-2">
        <h3 className="text-lg font-semibold tracking-tight text-slate-100 line-clamp-1 group-hover:text-amber-200 transition-colors">
          {capsule.title}
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Inscribed on {formattedCreatedDate}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
            {isUnlocked ? 'Unlocked Since' : 'Unlocks On'}
          </div>
          <p className="text-sm font-medium text-slate-200">
            {formattedUnlockDate}
          </p>
        </div>
      </div>

      {/* Card Footer: Live Countdown or Unseal Action */}
      <div className="z-10 mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
        {isUnlocked ? (
          <button
            type="button"
            onClick={() => onOpen(capsule)}
            className="w-full group/btn relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-200 hover:to-amber-100 shadow-md shadow-amber-950/40 hover:shadow-amber-500/25 transition-all duration-300 active:scale-[0.98]"
          >
            {/* Wax seal inspired icon */}
            <span className="w-5 h-5 rounded-full bg-amber-900/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            <span>Unseal Letter</span>
            <svg className="w-4 h-4 text-amber-900 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-medium">Time Remaining</span>
              <Countdown targetDate={capsule.unlock_date} onUnlock={handleCountdownUnlock} />
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500" title="Locked until unlock date">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
