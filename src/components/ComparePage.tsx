import React, { useMemo } from 'react';
import { ArrowLeft, GitCompare, Sparkles, HelpCircle } from 'lucide-react';
import { PLAYERS_DB } from '../database/data';
import { PlayerStats } from '../types';
import { getStatColor } from '../utils';

interface ComparePageProps {
  compareIds: string[];
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function ComparePage({ compareIds, setActiveTab, setSelectedPlayerId }: ComparePageProps) {
  
  // Enforce exactly 2 players. Fallback if tray is empty
  const [idA, idB] = useMemo(() => {
    if (compareIds.length >= 2) return [compareIds[0], compareIds[1]];
    if (compareIds.length === 1) {
      // Find another player
      const keys = Object.keys(PLAYERS_DB);
      const other = keys.find((key) => key !== compareIds[0]) || '';
      return [compareIds[0], other];
    }
    // Fallback: Dumfries and Messi
    const keys = Object.keys(PLAYERS_DB);
    return [keys[0] || '', keys[1] || ''];
  }, [compareIds]);

  const playerA = PLAYERS_DB[idA];
  const playerB = PLAYERS_DB[idB];

  const statKeys: { key: keyof PlayerStats; label: string }[] = [
    { key: 'offensiveAwareness', label: 'Offensive Awareness' },
    { key: 'ballControl', label: 'Ball Control' },
    { key: 'dribbling', label: 'Dribbling' },
    { key: 'tightPossession', label: 'Tight Possession' },
    { key: 'lowPass', label: 'Low Pass' },
    { key: 'loftedPass', label: 'Lofted Pass' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'heading', label: 'Heading' },
    { key: 'placeKicking', label: 'Place Kicking' },
    { key: 'curl', label: 'Curl' },
    { key: 'defensiveAwareness', label: 'Defensive Awareness' },
    { key: 'defensiveEngagement', label: 'Defensive Engagement' },
    { key: 'tackling', label: 'Tackling' },
    { key: 'aggression', label: 'Aggression' },
    { key: 'speed', label: 'Speed' },
    { key: 'acceleration', label: 'Acceleration' },
    { key: 'kickingPower', label: 'Kicking Power' },
    { key: 'jump', label: 'Jump' },
    { key: 'physicalContact', label: 'Physical Contact' },
    { key: 'balance', label: 'Balance' },
    { key: 'stamina', label: 'Stamina' }
  ];

  if (!playerA || !playerB) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 font-sans">
        <HelpCircle className="w-12 h-12 text-slate-700 animate-pulse" />
        <h3 className="text-sm font-bold text-white mt-1">H2H Analyzer Unpopulated</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Please select at least 2 players from the catalog registry comparison tray.</p>
        <button onClick={() => setActiveTab('players')} className="text-[#00FF00] font-sans font-bold text-xs uppercase underline mt-2">
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 select-none">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveTab('players')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00FF00] font-sans tracking-wide uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to database cards
        </button>
      </div>

      {/* Header and statistics comparison overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
            H2H CARD <span className="text-[#00FF00]">COMPARATOR</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
            Compare base stats side-by-side. The bar shifts dynamically towards the superior attribute holder.
          </p>
        </div>
      </div>

      {/* Players Header comparison disks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#101411] border border-white/5 p-6 rounded-2xl">
        
        {/* Player A card banner */}
        <div
          onClick={() => setSelectedPlayerId(playerA.id)}
          className="flex items-center gap-4 bg-[#141815] border border-[#00FF00]/10 hover:border-[#00FF00]/40 p-4 rounded-xl cursor-pointer group transition-all"
        >
          <img src={playerA.avatar} alt="" className="w-16 h-16 rounded-full object-cover object-top border-2 border-white/15" />
          <div>
            <span className="text-[10px] font-bold text-[#00FF00] font-sans uppercase tracking-widest bg-[#00FF00]/10 px-1.5 py-0.5 rounded">
              OVR {playerA.maxRating}
            </span>
            <h2 className="text-lg font-bold text-white group-hover:text-[#00FF00] font-sans mt-0.5">{playerA.name}</h2>
            <p className="text-xs text-slate-500 font-sans">{playerA.position} • {playerA.club} • {playerA.nation}</p>
          </div>
        </div>

        {/* Player B card banner */}
        <div
          onClick={() => setSelectedPlayerId(playerB.id)}
          className="flex items-center gap-4 bg-[#141815] border border-cyan-500/10 hover:border-cyan-500/40 p-4 rounded-xl cursor-pointer group transition-all"
        >
          <img src={playerB.avatar} alt="" className="w-16 h-16 rounded-full object-cover object-top border-2 border-white/15" />
          <div>
            <span className="text-[10px] font-bold text-cyan-400 font-sans uppercase tracking-widest bg-cyan-400/10 px-1.5 py-0.5 rounded">
              OVR {playerB.maxRating}
            </span>
            <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 font-sans mt-0.5">{playerB.name}</h2>
            <p className="text-xs text-slate-500 font-sans">{playerB.position} • {playerB.club} • {playerB.nation}</p>
          </div>
        </div>
      </div>

      {/* Comparisons stats list */}
      <div className="bg-[#101411] border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
          <GitCompare className="w-4 h-4 text-[#00FF00]" />
          <h3 className="text-xs font-bold text-slate-300 font-sans tracking-wider uppercase">Attribute Head-to-Head</h3>
        </div>

        <div className="space-y-4 pt-2">
          {statKeys.map(({ key, label }) => {
            const valA = playerA.baseStats[key];
            const valB = playerB.baseStats[key];

            const colorA = getStatColor(valA);
            const colorB = getStatColor(valB);

            // Calculate percentage width mapping for comparing bar
            const total = valA + valB;
            const pctA = total > 0 ? (valA / total) * 100 : 50;

            const isAWinner = valA > valB;
            const isBWinner = valB > valA;

            return (
              <div key={key} className="space-y-1.5">
                {/* Value row */}
                <div className="flex items-center justify-between">
                  {/* Left Player Val */}
                  <span
                    className={`text-xs font-black font-sans px-2 py-0.5 rounded ${
                      isAWinner ? 'bg-green-500/10 scale-103' : 'text-slate-400'
                    }`}
                    style={{ color: isAWinner ? '#00FF00' : getStatColor(valA) }}
                  >
                    {valA} {isAWinner && '🗲'}
                  </span>

                  {/* Stat title label */}
                  <span className="text-xs font-bold text-slate-400 font-sans sm:text-center text-center">
                    {label}
                  </span>

                  {/* Right Player Val */}
                  <span
                    className={`text-xs font-black font-sans px-2 py-0.5 rounded ${
                      isBWinner ? 'bg-cyan-500/10 scale-103' : 'text-slate-400'
                    }`}
                    style={{ color: isBWinner ? '#06b6d4' : getStatColor(valB) }}
                  >
                    {isBWinner && '🗲'} {valB}
                  </span>
                </div>

                {/* Compare Bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full flex overflow-hidden">
                  <div
                    className="h-full rounded-l-full bg-gradient-to-r from-[#00FF00]/80 to-[#10b981] transition-all duration-300"
                    style={{ width: `${pctA}%` }}
                  />
                  <div
                    className="h-full rounded-r-full bg-gradient-to-r from-[#0891b2] to-cyan-400 transition-all duration-300"
                    style={{ width: `${100 - pctA}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
