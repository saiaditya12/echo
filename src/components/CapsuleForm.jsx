import { useState, useEffect } from 'react';

/**
 * CapsuleForm - Compose a message for your future self
 * Includes time presets, strict validation, and smooth modal transitions
 */
export default function CapsuleForm({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper to format Date into YYYY-MM-DDTHH:mm for datetime-local input
  const formatDateTimeLocal = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default unlock date to 1 month from now when opened
  useEffect(() => {
    if (isOpen) {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 1);
      setUnlockDate(formatDateTimeLocal(defaultDate));
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minDateTime = formatDateTimeLocal(new Date());

  const applyPreset = (offsetMinutes) => {
    const target = new Date(Date.now() + offsetMinutes * 60 * 1000);
    setUnlockDate(formatDateTimeLocal(target));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title for your time capsule.');
      return;
    }

    if (!message.trim()) {
      setError('Please write a message to your future self.');
      return;
    }

    if (!unlockDate) {
      setError('Please select an unlock date and time.');
      return;
    }

    const selectedTime = new Date(unlockDate).getTime();
    if (isNaN(selectedTime) || selectedTime <= Date.now()) {
      setError('The unlock date must be set to a moment in the future.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        message: message.trim(),
        unlock_date: new Date(unlockDate).toISOString(),
      });
      // Reset form
      setTitle('');
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to seal the time capsule.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Form Card */}
      <div className="relative w-full max-w-xl my-6 z-10 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl shadow-slate-950/80">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
              New Inscription
            </span>
            <h2 className="font-serif-title text-2xl font-bold text-slate-100">
              Seal an Echo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Capsule Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Reflections on where I stand today"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
          </div>

          {/* Message Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium">
                Your Letter
              </label>
              <span className="text-[11px] text-slate-400 font-journal italic">
                A digital journal to the future you
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Dear future me, right now I am hoping for... Here is what currently keeps me awake at night, and what makes me smile..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm font-journal text-base leading-relaxed focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all resize-y"
            />
          </div>

          {/* Unlock Date & Time */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Unlock Moment
            </label>
            <input
              type="datetime-local"
              value={unlockDate}
              min={minDateTime}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all [color-scheme:dark]"
            />

            {/* Quick Presets */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset(1)} // 1 min for instant testing
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
                title="Unlock in 1 minute"
              >
                +1 min
              </button>
              <button
                type="button"
                onClick={() => applyPreset(60)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
              >
                +1 hour
              </button>
              <button
                type="button"
                onClick={() => applyPreset(24 * 60)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
              >
                +1 day
              </button>
              <button
                type="button"
                onClick={() => applyPreset(7 * 24 * 60)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
              >
                +1 week
              </button>
              <button
                type="button"
                onClick={() => applyPreset(30 * 24 * 60)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
              >
                +1 month
              </button>
              <button
                type="button"
                onClick={() => applyPreset(365 * 24 * 60)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-200 border border-slate-700 transition-colors"
              >
                +1 year
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-200 hover:to-amber-100 transition-all shadow-lg shadow-amber-950/50 disabled:opacity-50 active:scale-95"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-amber-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Inscribing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-amber-950" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Seal in Time</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
