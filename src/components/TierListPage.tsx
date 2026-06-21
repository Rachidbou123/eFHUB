import React, { useMemo } from 'react';
import { Award, ShieldAlert, Sparkles, TrendingUp, Info } from 'lucide-react';
import { PLAYERS_DB } from '../database/data';
import { Player } from '../types';

interface TierRowConfig {
  id: string;
  name: string;
  colorBg: string;
  textColor: string;
  desc: string;
}

interface TierListPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function TierListPage({ setActiveTab, setSelectedPlayerId }: TierListPageProps) {
  
  const allPlayers = useMemo(() => Object.values(PLAYERS_DB), []);

  const tiers: TierRowConfig[] = [
    { id: 'SSS', name: 'SSS - SUPREME', colorBg: 'bg-rose-600', textColor: 'text-white', desc: 'Unbeatable game-breaking cards (Resolve Giorno, Spider-Web Slinger)' },
    { id: 'S', name: 'S - GOD META', colorBg: 'bg-orange-500', textColor: 'text-black', desc: 'S-Tier masterclass cards that change matches entirely (Lionel Messi 103 AMF, SANS GK)' },
    { id: 'A', name: 'A - META CLASS', colorBg: 'bg-yellow-500', textColor: 'text-black', desc: 'Extremely good cards for competitive setups (Haaland, Neymar, Squirrel Girl, Dumfries RB)' },
    { id: 'B', name: 'B - STANDARD', colorBg: 'bg-green-500', textColor: 'text-black', desc: 'Solid starters and standard selections' }
  ];

  // Group players into tiers
  const groupedPlayers = useMemo(() => {
    const map: Record<string, Player[]> = { SSS: [], S: [], A: [], B: [] };
    allPlayers.forEach((p) => {
      if (['500101', '500104'].includes(p.id)) {
        map['SSS'].push(p);
      } else if (['105674', '500102'].includes(p.id)) {
        map['S'].push(p);
      } else if (['400101', '300981', '500103', '100105'].includes(p.id)) {
        map['A'].push(p);
      } else {
        map['B'].push(p);
      }
    });
    return map;
  }, [allPlayers]);

  const handlePlayerClick = (id: string) => {
    setSelectedPlayerId(id);
    setActiveTab('player-detail');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 select-none">
      
      {/* Title */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
          META CARD <span className="text-[#00FF00]">TIER LIST</span>
        </h1>
        <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
          Season 2 competitive meta classifications. Interactive tier structures. Click any player profile disc to open their build sheet.
        </p>
      </div>

      {/* Intro info box */}
      <div className="bg-[#101411] border border-[#00FF00]/10 p-5 rounded-2xl flex items-start gap-4">
        <div className="bg-[#00FF00]/10 p-2 rounded-xl text-[#00FF00]">
          <Info className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white font-sans uppercase">How tiers are determined</h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Ratings are based on fully maxed progression point builds, playstyle proficiencies under 88-rated managers, and active booster calculations for the 2026 Competitive Division.
          </p>
        </div>
      </div>

      {/* Tier Rows block */}
      <div className="bg-[#101411] border border-white/5 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/5">
        {tiers.map((tier) => {
          const list = groupedPlayers[tier.id] || [];
          return (
            <div key={tier.id} className="grid grid-cols-1 md:grid-cols-4 items-stretch group">
              
              {/* Row title badge */}
              <div className={`p-6 flex flex-col justify-center items-center text-center select-none ${tier.colorBg} md:border-r md:border-white/5 transition-transform duration-200`}>
                <span className={`text-xl font-black tracking-tighter ${tier.textColor} font-sans`}>
                  {tier.name.split(' - ')[0]}
                </span>
                <span className={`text-[10px] font-black uppercase mt-1 ${tier.textColor} opacity-60 tracking-wider font-sans`}>
                  {tier.name.split(' - ')[1]}
                </span>
              </div>

              {/* Player icons cell list */}
              <div className="p-6 md:col-span-3 flex flex-col justify-center space-y-4 bg-[#141815]">
                {list.length === 0 ? (
                  <span className="text-xs text-slate-600 italic font-sans">No cards currently placed in this tier.</span>
                ) : (
                  <div className="flex flex-wrap gap-4 items-center">
                    {list.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handlePlayerClick(p.id)}
                        className="relative group border border-white/5 hover:border-[#00FF00] hover:shadow-lg hover:shadow-green-500/10 p-2 rounded-xl flex items-center gap-3 cursor-pointer bg-black/30 hover:bg-[#00FF00]/5 transition-all"
                      >
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10 bg-slate-800">
                          <img src={p.avatar} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#00FF00] transition-colors font-sans">
                            {p.shortName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-sans uppercase">
                            Max ovr: <span className="text-[#00FF00] font-bold">{p.maxRating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Description details line */}
                <div className="text-[10px] text-slate-500 font-sans italic border-t border-white/5 pt-2.5">
                  {tier.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
