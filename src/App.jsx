import { useState } from 'react';
import { useCapsules } from './hooks/useCapsules';
import Dashboard from './components/Dashboard';
import CapsuleForm from './components/CapsuleForm';
import CapsuleModal from './components/CapsuleModal';

export default function App() {
  const { capsules, loading, error, addCapsule, removeCapsule } = useCapsules();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleCreateCapsule = async (data) => {
    await addCapsule(data);
    showToast('Your message has been sealed in the sands of time.');
  };

  const handleDeleteCapsule = async (id) => {
    await removeCapsule(id);
    showToast('The time capsule was dissolved into the void.');
  };

  return (
    <div className="relative min-h-screen bg-[#060814] text-slate-100 selection:bg-amber-400/30 selection:text-amber-200">
      {/* Background Star Layers & Radial Vignette */}
      <div className="fixed inset-0 pointer-events-none stars-layer-1 opacity-70 z-0" />
      <div className="fixed inset-0 pointer-events-none stars-layer-2 opacity-60 z-0" />
      
      {/* Deep Celestial Nebula Glows */}
      <div className="fixed -top-32 -left-32 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-32 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed -bottom-32 left-1/3 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Glowing Constellation / Hourglass Logo */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-800 to-indigo-950 border border-amber-400/30 flex items-center justify-center shadow-md shadow-amber-950/40">
                <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-amber-100 flex items-center gap-2">
                  ECHOES
                  <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300">
                    SQLite WASM
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
                  A Time Capsule for Your Future Self
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-200 hover:to-amber-100 shadow-md shadow-amber-950/40 hover:shadow-amber-500/25 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 text-amber-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Write Echo</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-amber-300/90 mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Private • Client-Side • Stored Locally via SQLite WASM
          </div>
          
          <h2 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-slate-200 to-slate-400 leading-[1.15] mb-5">
            A message to the person you&apos;ll become.
          </h2>

          <p className="font-journal text-base sm:text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
            Write down your present world—your doubts, your quiet joys, the promises you wish to keep. 
            Lock them in time and rediscover your own words when the hour arrives.
          </p>
        </section>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 flex-1 w-full">
          {loading ? (
            /* Loading State while sql.js/WASM initializes */
            <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border border-slate-800/80 max-w-md mx-auto text-center p-8">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-indigo-400/20 border-b-indigo-400 animate-spin [animation-direction:reverse]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping"></div>
                </div>
              </div>
              <h3 className="font-serif-title text-lg font-semibold text-slate-200">
                Awakening the Time Vault
              </h3>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Initializing client-side SQLite WASM engine...
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center max-w-lg mx-auto">
              <p className="text-sm text-rose-300 font-medium">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-xl text-xs bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Reload Vault
              </button>
            </div>
          ) : (
            <Dashboard
              capsules={capsules}
              onOpenCapsule={(capsule) => setSelectedCapsule(capsule)}
              onDeleteCapsule={handleDeleteCapsule}
              onCreateClick={() => setIsFormOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/60 backdrop-blur-md py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-serif-title text-slate-400">
              Echoes — Timeless letters sealed in client-side SQLite & IndexedDB
            </p>
            <p className="text-[11px] text-slate-500">
              All data stays on your machine. Static & Vercel ready.
            </p>
          </div>
        </footer>
      </div>

      {/* Write Capsule Modal */}
      <CapsuleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCapsule}
      />

      {/* Read Capsule Modal with Opening Animation */}
      {selectedCapsule && (
        <CapsuleModal
          capsule={selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
        />
      )}

      {/* Floating Action Button for Mobile */}
      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="sm:hidden fixed right-5 bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-xl shadow-amber-950 flex items-center justify-center active:scale-95"
        aria-label="Write New Echo"
      >
        <svg className="w-6 h-6 text-amber-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-amber-400/40 text-amber-200 text-xs font-medium shadow-2xl backdrop-blur-md animate-bounce">
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
