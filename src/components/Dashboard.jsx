import { useState, useMemo } from 'react';
import CapsuleCard from './CapsuleCard';
import EmptyState from './EmptyState';

/**
 * Dashboard - Displays all time capsules, filters, search, and statistics
 */
export default function Dashboard({ capsules, onOpenCapsule, onDeleteCapsule, onCreateClick }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'sealed' | 'unlocked'
  const [searchQuery, setSearchQuery] = useState('');

  const now = Date.now();

  const stats = useMemo(() => {
    let sealed = 0;
    let unlocked = 0;

    capsules.forEach((c) => {
      const isPast = new Date(c.unlock_date).getTime() <= now;
      if (isPast) unlocked++;
      else sealed++;
    });

    return {
      total: capsules.length,
      sealed,
      unlocked,
    };
  }, [capsules, now]);

  const filteredCapsules = useMemo(() => {
    return capsules.filter((c) => {
      const isUnlocked = new Date(c.unlock_date).getTime() <= now;

      if (filter === 'sealed' && isUnlocked) return false;
      if (filter === 'unlocked' && !isUnlocked) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesMessage = c.message.toLowerCase().includes(query);
        return matchesTitle || matchesMessage;
      }

      return true;
    });
  }, [capsules, filter, searchQuery, now]);

  return (
    <div className="space-y-8">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Total Inscribed
            </p>
            <p className="text-2xl font-bold text-slate-100 mt-1 font-mono">
              {stats.total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-400/80 font-medium">
              Sealed in Time
            </p>
            <p className="text-2xl font-bold text-amber-200 mt-1 font-mono">
              {stats.sealed}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 11V7a2 2 0 114 0v4" />
            </svg>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-400/80 font-medium">
              Ready to Unseal
            </p>
            <p className="text-2xl font-bold text-emerald-300 mt-1 font-mono">
              {stats.unlocked}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 max-w-fit">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setFilter('sealed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'sealed'
                ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sealed ({stats.sealed})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'unlocked'
                ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ready ({stats.unlocked})
          </button>
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your echoes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/50 transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={onCreateClick}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-300 to-amber-200 hover:from-amber-200 hover:to-amber-100 shadow-md shadow-amber-950/40 transition-all active:scale-95 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Echo</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {capsules.length === 0 ? (
        <EmptyState onCreateClick={onCreateClick} />
      ) : filteredCapsules.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800/80">
          <p className="text-slate-400 text-sm">
            No time capsules match your active filter or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-amber-300 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onOpen={onOpenCapsule}
              onDelete={onDeleteCapsule}
            />
          ))}
        </div>
      )}
    </div>
  );
}
