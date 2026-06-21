import React from 'react';
import { Sparkles, TrendingUp, Users, Flame, ChevronRight, Award } from 'lucide-react';
import { PLAYERS_DB, MANAGERS_DB, INITIAL_POSTS } from '../database/data';
import { InteractiveCard } from './InteractiveCard';
import { Player } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function LandingPage({ setActiveTab, setSelectedPlayerId }: LandingPageProps) {
  // Get lists of players based on card categories
  const allPlayers = Object.values(PLAYERS_DB);
  const epics = allPlayers.filter((p) => p.cardType === 'epic');
  const showtimes = allPlayers.filter((p) => p.cardType === 'showtime' || p.cardType === 'bigtime');
  const potws = allPlayers.filter((p) => p.cardType === 'potw' || p.cardType === 'highlight');

  const handlePlayerClick = (id: string) => {
    setSelectedPlayerId(id);
    setActiveTab('player-detail');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* 1. Hero Promo banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101411] to-[#162a1a] border border-[#00FF00]/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/30 text-xs font-bold text-[#00FF00] tracking-wider uppercase font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            Season 2026 Core Live Update
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-sans text-white tracking-tight leading-none uppercase">
            THE ABSOLUTE <span className="text-[#00FF00]">eFOOTBALL</span> DATABASE & CALCULATOR
          </h1>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Recalculate player stats, allocate points, add manager bonuses, toggle boosters, and design the ultimate squad with precise 2026 tactical physics formulas.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('players')}
              className="bg-[#00FF00] text-black font-black font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-white transition-colors shadow-md shadow-green-500/15"
            >
              DATABASE CATALOG
            </button>
            <button
              onClick={() => setActiveTab('squad-builder')}
              className="bg-transparent border border-white/20 text-white font-black font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-white/10 transition-colors"
            >
              SQUAD BUILDER
            </button>
          </div>
        </div>

        {/* Highlight player grid banner */}
        <div className="flex gap-4 select-none relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#101411]/80 z-20 pointer-events-none" />
          <div className="rotate-2 hover:rotate-0 transition-transform duration-300">
            {allPlayers[0] && (
              <InteractiveCard
                player={allPlayers[0]}
                onClick={() => handlePlayerClick(allPlayers[0].id)}
              />
            )}
          </div>
          <div className="-rotate-3 hover:rotate-0 transition-transform duration-300 mt-4">
            {allPlayers[1] && (
              <InteractiveCard
                player={allPlayers[1]}
                onClick={() => handlePlayerClick(allPlayers[1].id)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 2. Featured Special Packs (POTW, Jojo, Underground) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#00FF00] rounded-sm" />
            <h2 className="text-xl font-bold font-sans text-white tracking-widest uppercase">FEATURED PACKS / SELECTIONS</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pack 1 */}
          <div className="bg-[#141815] border border-white/5 rounded-2xl p-5 hover:border-[#00FF00]/30 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-amber-500 font-sans tracking-widest uppercase">LEGENDARY POOL</div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00FF00] font-sans transition-colors uppercase">EPIC: TIME TRAVELERS</h3>
              <p className="text-xs text-slate-400 font-sans">Retro anime star Giorno Giovanna, Peter Parker & classic legends.</p>
            </div>
            <div className="flex gap-2">
              {epics.slice(0, 3).map((p) => (
                <div key={p.id} onClick={() => handlePlayerClick(p.id)} className="w-10 h-10 rounded-full overflow-hidden border border-amber-500 cursor-pointer hover:scale-110 transition-transform">
                  <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Pack 2 */}
          <div className="bg-[#141815] border border-white/5 rounded-2xl p-5 hover:border-[#00FF00]/30 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-rose-500 font-sans tracking-widest uppercase">BIG TIME MATCHES</div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00FF00] font-sans transition-colors uppercase">SHOWTIME SHOT-REELS</h3>
              <p className="text-xs text-slate-400 font-sans">Featuring Lionel Messi 103 rating & electric card styles.</p>
            </div>
            <div className="flex gap-2">
              {showtimes.slice(0, 3).map((p) => (
                <div key={p.id} onClick={() => handlePlayerClick(p.id)} className="w-10 h-10 rounded-full overflow-hidden border border-rose-500 cursor-pointer hover:scale-110 transition-transform">
                  <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Pack 3 */}
          <div className="bg-[#141815] border border-white/5 rounded-2xl p-5 hover:border-[#00FF00]/30 transition-all group flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#00FF00] font-sans tracking-widest uppercase">WEEKLY SPECIAL</div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00FF00] font-sans transition-colors uppercase">PLAYERS OF THE WEEK (POTW)</h3>
              <p className="text-xs text-slate-400 font-sans">Denzel Dumfries highlight card, Haaland, and weekly standouts.</p>
            </div>
            <div className="flex gap-2">
              {potws.slice(0, 3).map((p) => (
                <div key={p.id} onClick={() => handlePlayerClick(p.id)} className="w-10 h-10 rounded-full overflow-hidden border border-[#00FF00]/50 cursor-pointer hover:scale-110 transition-transform">
                  <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trending Players Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#00FF00] rounded-sm" />
            <h2 className="text-xl font-bold font-sans text-white tracking-widest uppercase">TRENDING CARD REGISTRY</h2>
          </div>
          <button
            onClick={() => setActiveTab('players')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00FF00] transition-colors uppercase font-sans"
          >
            VIEW ENTIRE REGISTRY <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap justify-between gap-6">
          {allPlayers.slice(0, 5).map((player) => (
            <div key={player.id} className="transition-transform duration-300 hover:-translate-y-2">
              <InteractiveCard
                player={player}
                onClick={() => handlePlayerClick(player.id)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Managers & Community Double Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Managers */}
        <section className="space-y-6 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#00FF00]" />
              <h2 className="text-lg font-bold font-sans text-white tracking-wider uppercase">TOP META MANAGERS</h2>
            </div>
          </div>

          <div className="space-y-4">
            {MANAGERS_DB.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#00FF00]/40 transition-colors duration-155"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-[#00FF00]/40">
                    <img src={manager.avatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white font-sans">{manager.name}</h4>
                    <p className="text-[10px] text-slate-500 font-sans font-medium uppercase tracking-wider">
                      Bonus style: <span className="text-[#00FF00]">{manager.bonusType} +{manager.bonusValue}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex bg-[#00FF00]/10 border border-[#00FF00]/20 px-2 py-0.5 rounded text-[11px] font-bold text-[#00FF00] font-sans">
                    POS: {manager.possession} • QC: {manager.quickCounter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Popular builds */}
        <section className="space-y-6 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold font-sans text-white tracking-wider uppercase">COMMUNITY POPULAR BUILDS</h2>
            </div>
            <button
              onClick={() => setActiveTab('community')}
              className="text-xs font-bold text-slate-400 hover:text-[#00FF00] font-sans"
            >
              FORUM
            </button>
          </div>

          <div className="space-y-4">
            {INITIAL_POSTS.slice(0, 2).map((post) => {
              const p = PLAYERS_DB[post.playerId || ''];
              return (
                <div
                  key={post.id}
                  onClick={() => handlePlayerClick(post.playerId || '')}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00FF00]/20 cursor-pointer transition-colors space-y-2 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                      Posted by {post.author}
                    </span>
                    <span className="text-xs text-[#00FF00] font-bold font-sans">
                      ▲ {post.upvotes}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00FF00] font-sans transition-colors line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                    {post.content}
                  </p>
                  {p && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold font-sans uppercase">
                        {p.name} Build
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
