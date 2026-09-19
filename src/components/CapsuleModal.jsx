import { useEffect, useState } from 'react';

/**
 * CapsuleModal - Letter unsealing experience
 * Features envelope opening and parchment paper unfolding animations
 */
export default function CapsuleModal({ capsule, onClose }) {
  const [stage, setStage] = useState('opening'); // 'opening' -> 'revealed'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Stage animation: flap opens, then parchment letter emerges
    const timer = setTimeout(() => {
      setStage('revealed');
    }, 450);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!capsule) return null;

  const createdDate = new Date(capsule.created_at);
  const unlockDate = new Date(capsule.unlock_date);

  const formattedCreated = createdDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedUnlock = unlockDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate duration elapsed between creation and unlock
  const diffMs = unlockDate.getTime() - createdDate.getTime();
  const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  const timeTraveled = diffDays >= 2 
    ? `${diffDays} days` 
    : diffHours >= 1 
      ? `${diffHours} hours` 
      : 'moments';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${capsule.title}\n\n${capsule.message}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Darkened Starry Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-2xl my-8 z-10 transition-all duration-500">
        {/* Envelope Top Flap Opening Animation Layer */}
        <div 
          className={`relative mx-auto rounded-3xl parchment-paper p-6 sm:p-10 transition-all duration-700 transform ${
            stage === 'opening' 
              ? 'opacity-0 scale-95 translate-y-6' 
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Top Wax Seal Stamp Accent */}
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-950/60 ring-2 ring-amber-400/40">
                <svg className="w-5 h-5 text-amber-950" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
                  Echo From The Past
                </span>
                <p className="text-xs text-slate-400">
                  Traveled {timeTraveled} across time to reach you
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              aria-label="Close letter"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Letter Title */}
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-amber-100 mb-3">
            {capsule.title}
          </h2>

          {/* Letter Metadata */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 mb-8 pb-4 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Inscribed on {formattedCreated}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400/90">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Destined for {formattedUnlock}
            </span>
          </div>

          {/* Letter Body - Poetic Journal Font */}
          <div className="relative font-journal text-lg sm:text-xl leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-amber-400/20 max-h-[55vh] overflow-y-auto pr-3">
            {capsule.message}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 pt-6 border-t border-amber-500/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Letter</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-amber-100 transition-all shadow-md active:scale-95"
            >
              Close Letter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
