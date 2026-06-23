import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, RefreshCw, Plus, X } from 'lucide-react';
import { PLAYERS_DB } from '../database/data';
import { InteractiveCard } from './InteractiveCard';
import { Player } from '../types';

interface PlayersPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
  compareList: string[];
  setCompareList: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PlayersPage({
  setActiveTab,
  setSelectedPlayerId,
  compareList,
  setCompareList
}: PlayersPageProps) {
  // Filter States
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedCardType, setSelectedCardType] = useState<string>('ALL');
  const [selectedStars, setSelectedStars] = useState<number | 'ALL'>('ALL');
  const [selectedPreferredFoot, setSelectedPreferredFoot] = useState<string>('ALL');
  const [hasBoosterOnly, setHasBoosterOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'speed' | 'defense'>('rating');

  // Multi-page Pagination (lazy load)
  const [visibleCount, setVisibleCount] = useState(8);

  const players = useMemo(() => Object.values(PLAYERS_DB), []);

  // Filter positions
  const positions = ['ALL', 'CF', 'ST', 'SS', 'LWF', 'RWF', 'AMF', 'CMF', 'DMF', 'LMF', 'RMF', 'CB', 'LB', 'RB', 'GK'];
  const cardTypes = [
    'ALL', 
    'epic', 
    'bigtime', 
    'showtime', 
    'potw', 
    'highlight', 
    'standard',
    'legendary',
    'epic_highlight',
    'epic_special',
    'showtime_effect',
    'showtime_template',
    'highlight_special',
    'highlight_special_alt'
  ];

  // Apply filters and sorting
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.club.toLowerCase().includes(q) ||
          p.nation.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q)
      );
    }

    // Position filter
    if (selectedPosition !== 'ALL') {
      result = result.filter((p) => p.position === selectedPosition);
    }

    // Card Type filter
    if (selectedCardType !== 'ALL') {
      result = result.filter((p) => p.cardType === selectedCardType);
    }

    // Stars Filter
    if (selectedStars !== 'ALL') {
      result = result.filter((p) => p.stars === selectedStars);
    }

    // Foot Filter
    if (selectedPreferredFoot !== 'ALL') {
      result = result.filter((p) => p.preferredFoot === selectedPreferredFoot);
    }

    // Booster only filter
    if (hasBoosterOnly) {
      result = result.filter((p) => !!p.booster);
    }

    // Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        const primaryA = a.maxRating;
        const primaryB = b.maxRating;
        return primaryB - primaryA || a.name.localeCompare(b.name);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'speed') {
        return b.baseStats.speed - a.baseStats.speed;
      }
      if (sortBy === 'defense') {
        return b.baseStats.defensiveAwareness - a.baseStats.defensiveAwareness;
      }
      return 0;
    });

    return result;
  }, [players, search, selectedPosition, selectedCardType, selectedStars, selectedPreferredFoot, hasBoosterOnly, sortBy]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedPosition('ALL');
    setSelectedCardType('ALL');
    setSelectedStars('ALL');
    setSelectedPreferredFoot('ALL');
    setHasBoosterOnly(false);
    setSortBy('rating');
    setVisibleCount(8);
  };

  const handlePlayerClick = (id: string) => {
    setSelectedPlayerId(id);
    setActiveTab('player-detail');
  };

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // limit to 2
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 select-none">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
            PLAYERS <span className="text-[#00FF00]">REGISTRY</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
            Browse through our full-fidelity DataTable database. Use filters to query meta, booster, and epic cards.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 focus:border-[#00FF00]/50 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 font-sans outline-none transition-all"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Advanced Filters Frame */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-sans tracking-wider uppercase border-b border-white/5 pb-2.5">
          <SlidersHorizontal className="w-4 h-4 text-[#00FF00]" />
          DATABASE FILTER MODULES
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Position Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider font-sans uppercase">Tactical Position</label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50 appearance-none"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos === 'ALL' ? 'ALL POSITIONS' : pos}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Card Type Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider font-sans uppercase">Card Series</label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50 appearance-none capitalize"
                value={selectedCardType}
                onChange={(e) => setSelectedCardType(e.target.value)}
              >
                {cardTypes.map((type) => (
                  <option key={type} value={type}>{type === 'ALL' ? 'ALL CARD TYPES' : type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Stars Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider font-sans uppercase">Star Quality</label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50 appearance-none"
                value={selectedStars.toString()}
                onChange={(e) => setSelectedStars(e.target.value === 'ALL' ? 'ALL' : (parseInt(e.target.value) as any))}
              >
                <option value="ALL">ALL STARS</option>
                <option value="5">⭐⭐⭐⭐★ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Preferred Foot */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider font-sans uppercase">Preferred Foot</label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50 appearance-none"
                value={selectedPreferredFoot}
                onChange={(e) => setSelectedPreferredFoot(e.target.value)}
              >
                <option value="ALL">ALL FEET</option>
                <option value="Right">Right Foot</option>
                <option value="Left">Left Foot</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort By Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider font-sans uppercase">Sort Analytics</label>
            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50 appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="rating">Rating: Highest Potential</option>
                <option value="name">Name: Alphabetical</option>
                <option value="speed">Atlethicism: Top Speed</option>
                <option value="defense">Defense: Awareness</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Secondary Toggles Row */}
        <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3.5 gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBoosterOnly}
                onChange={(e) => setHasBoosterOnly(e.target.checked)}
                className="rounded border-white/10 bg-white/5 text-[#00FF00] focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-300 font-sans tracking-wide uppercase">Booster Cards Only</span>
            </label>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase font-sans"
          >
            <RefreshCw className="w-3.5 h-3.5" /> REBOOT FILTERS
          </button>
        </div>
      </div>

      {/* Grid result display */}
      {filteredPlayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-[#0a0a0a] border border-white/10 rounded-2xl text-center space-y-3">
          <SlidersHorizontal className="w-12 h-12 text-slate-700 animate-pulse" />
          <h3 className="text-lg font-bold text-white font-sans uppercase">No Player Profiles Registered</h3>
          <p className="text-xs text-slate-500 font-sans max-w-sm leading-relaxed">
            There is no entry matching your query filters. Reset filters to explore our standard database catalog.
          </p>
          <button
            className="mt-2 bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] font-sans text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#00FF00]/20 transition-colors uppercase"
            onClick={resetFilters}
          >
            Reset Query
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-10 gap-x-6 justify-items-center">
            {filteredPlayers.slice(0, visibleCount).map((player) => {
              const worksInCompare = compareList.includes(player.id);
              return (
                <div
                  key={player.id}
                  className="flex flex-col items-center space-y-3 group"
                >
                  <div className="relative">
                    <InteractiveCard
                      player={player}
                      onClick={() => handlePlayerClick(player.id)}
                    />
                    
                    {/* Compare floating badge button overlay */}
                    <button
                      onClick={(e) => toggleCompare(e, player.id)}
                      title="Compare Card"
                      className={`absolute top-2 right-2 p-1.5 rounded-full border shadow-lg transition-all duration-200 z-30 ${
                        worksInCompare
                          ? 'bg-[#00FF00] border-[#00FF00] text-black scale-110'
                          : 'bg-black/80 backdrop-blur-sm border-white/10 hover:border-[#00FF00] text-slate-300 hover:text-[#00FF00] hover:scale-115'
                      }`}
                    >
                      {worksInCompare ? <Check className="w-3.5 h-3.5 font-bold" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                      Max Rating: <span className="text-[#00FF00] font-bold">{player.maxRating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {filteredPlayers.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00FF00]/50 text-white font-black font-sans text-xs tracking-widest uppercase px-8 py-3 rounded-none active:scale-95 transition-all duration-150"
              >
                LOAD MORE CARDS ({filteredPlayers.length - visibleCount} REMAINING)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating H2H Comparisons Draw Cabin */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-[#0a0a0a]/90 backdrop-blur-md border border-[#00FF00]/30 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 z-40 animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#00FF00] font-sans tracking-wide uppercase">COMPARISON TRAY:</span>
            <div className="flex items-center -space-x-2">
              {compareList.map((pid) => {
                const p = PLAYERS_DB[pid];
                if (!p) return null;
                return (
                  <div
                    key={pid}
                    className="relative w-8 h-8 rounded-full border border-[#00FF00]/50 overflow-hidden bg-slate-800 shadow-md"
                  >
                    <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => toggleCompare(e, pid)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compare')}
              disabled={compareList.length < 2}
              className={`font-sans text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-lg transition-all ${
                compareList.length >= 2
                  ? 'bg-[#00FF00] text-black hover:bg-lime-400 cursor-pointer shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              RUN COMPARE HEAD-TO-HEAD
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-xs font-bold text-slate-400 hover:text-white uppercase font-sans px-2 py-1"
            >
              CLEAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
