/**
 * EmptyState - Inspiring empty state shown when no capsules exist
 */
export default function EmptyState({ onCreateClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 text-center max-w-xl mx-auto border border-slate-700/60 shadow-2xl">
      {/* Decorative Starry Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Celestial Envelope / Hourglass Illustration */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950/60 border border-amber-400/30 flex items-center justify-center shadow-xl shadow-slate-950/80 mb-6 group animate-float">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 transition-transform group-hover:scale-110 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
          No Echoes Sent Yet
        </h3>

        <p className="font-journal text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-md mb-8">
          The future is waiting. Inscribe your thoughts, aspirations, or confessions today, seal them away, and let them find you when the stars align.
        </p>

        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-200 hover:to-amber-100 shadow-lg shadow-amber-950/50 hover:shadow-amber-500/20 transition-all duration-300 active:scale-95"
        >
          <svg className="w-4 h-4 text-amber-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Seal Your First Echo</span>
        </button>
      </div>
    </div>
  );
}
