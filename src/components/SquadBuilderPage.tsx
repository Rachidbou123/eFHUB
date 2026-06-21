import React, { useState, useMemo } from 'react';
import { User, ShieldAlert, Award, Search, PlusCircle, Trash, Award as Trophy } from 'lucide-react';
import { PLAYERS_DB, MANAGERS_DB } from '../database/data';
import { Player } from '../types';

interface SlotConfig {
  id: string;
  label: string;
  top: string; // pitch coordinate %
  left: string; // pitch coordinate %
}

export function SquadBuilderPage() {
  const [selectedManagerId, setSelectedManagerId] = useState<string>('m1');
  
  // Pitch mapping for 4-3-3 formation
  const pitchSlots: SlotConfig[] = [
    { id: 'ST', label: 'CF', top: '12%', left: '50%' },
    { id: 'LWF', label: 'LWF', top: '18%', left: '20%' },
    { id: 'RWF', label: 'RWF', top: '18%', left: '80%' },
    { id: 'AMF', label: 'AMF', top: '38%', left: '50%' },
    { id: 'CMF_L', label: 'CMF', top: '48%', left: '30%' },
    { id: 'CMF_R', label: 'CMF', top: '48%', left: '70%' },
    { id: 'DMF', label: 'DMF', top: '60%', left: '50%' },
    { id: 'LB', label: 'LB', top: '75%', left: '15%' },
    { id: 'CB1', label: 'CB', top: '78%', left: '38%' },
    { id: 'CB2', label: 'CB', top: '78%', left: '62%' },
    { id: 'RB', label: 'RB', top: '75%', left: '85%' },
    { id: 'GK', label: 'GK', top: '90%', left: '50%' }
  ];

  // Map of slot.id -> playerId
  const [squad, setSquad] = useState<Record<string, string | null>>({
    ST: '400101', // Haaland
    LWF: '500104', // Spider-Man
    RWF: '300981', // Neymar Jr
    AMF: '105674', // Messi
    CMF_L: '500101', // Giorno
    CMF_R: '500103', // Squirrel Girl
    DMF: '100105', // Dumfries
    LB: null,
    CB1: null,
    CB2: null,
    RB: null,
    GK: '500102' // Sans the skeleton
  });

  const [activeSlotSearch, setActiveSlotSearch] = useState<string | null>(null);

  const activeManager = useMemo(() => {
    return MANAGERS_DB.find((m) => m.id === selectedManagerId) || null;
  }, [selectedManagerId]);

  const allPlayers = useMemo(() => Object.values(PLAYERS_DB), []);

  const totalTeamRating = useMemo(() => {
    let sum = 0;
    let count = 0;
    const list = Object.values(squad) as (string | null)[];
    list.forEach((pid) => {
      if (pid) {
        const player = PLAYERS_DB[pid];
        if (player) {
          sum += player.maxRating;
          count++;
        }
      }
    });
    // Add manager modifier
    if (activeManager && count > 0) {
      sum += activeManager.bonusValue * count;
    }
    return count > 0 ? Math.round(sum / count) : 0;
  }, [squad, activeManager]);

  const selectPlayerForSlot = (slotId: string, playerId: string) => {
    setSquad((prev) => ({
      ...prev,
      [slotId]: playerId
    }));
    setActiveSlotSearch(null);
  };

  const clearSlot = (slotId: string) => {
    setSquad((prev) => ({
      ...prev,
      [slotId]: null
    }));
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 select-none">
      
      {/* Title block */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
          SQUAD <span className="text-[#00FF00]">BUILDER</span>
        </h1>
        <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
          Tactical board. Drag or slot cards from your DataTable, calculate team ratings, and set up dynamic managers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: green soccer pitch */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[3/4] w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#14532d] via-[#166534] to-[#14532d] shadow-2xl border-4 border-slate-900">
            {/* Draw soccer line marks */}
            <div className="absolute inset-x-0 top-0 h-[50%] border-b-2 border-white/15" />
            <div className="absolute left-[50%] top-0 h-full border-l-2 border-white/15 -translate-x-[50%]" />
            <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-32 h-32 rounded-full border-2 border-white/15" />
            <div className="absolute left-[50%] top-0 -translate-x-[50%] w-32 h-16 border-2 border-t-0 border-white/15" />
            <div className="absolute left-[50%] bottom-0 -translate-x-[50%] w-32 h-16 border-2 border-b-0 border-white/15" />
            
            {/* Render slots on pitch */}
            {pitchSlots.map((slot) => {
              const pid = squad[slot.id];
              const player = pid ? PLAYERS_DB[pid] : null;

              return (
                <div
                  key={slot.id}
                  className="absolute -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center transition-all duration-200 z-10"
                  style={{ top: slot.top, left: slot.left }}
                >
                  {player ? (
                    <div className="relative group flex flex-col items-center">
                      {/* Interactive player disk */}
                      <div
                        onClick={() => clearSlot(slot.id)}
                        title="Click to remove player"
                        className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#00FF00] shadow-lg shadow-black/50 cursor-pointer relative"
                      >
                        <img src={player.avatar} alt="" className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Trash className="w-5 h-5 text-red-500" />
                        </div>
                      </div>
                      
                      {/* Name label */}
                      <div className="mt-1 bg-black/90 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5 shadow-md">
                        <span className="text-[10px] bg-[#00FF00]/10 text-[#00FF00] font-black px-1 rounded">
                          {player.maxRating + (activeManager ? activeManager.bonusValue : 0)}
                        </span>
                        <span className="text-[10px] font-black text-white truncate max-w-[65px] font-sans">
                          {player.shortName}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveSlotSearch(slot.id)}
                      className="w-11 h-11 rounded-full bg-slate-950/80 backdrop-blur-md hover:bg-[#00FF00]/20 hover:border-[#00FF00] border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 shadow-lg text-slate-400 hover:text-[#00FF00] transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span className="text-[8px] font-black font-sans uppercase">{slot.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: tactical squad status */}
        <div className="space-y-6">
          {/* Summary scoreboard Panel */}
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 font-sans tracking-widest uppercase border-b border-white/5 pb-2">
              Team Overview Status
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Team Strength</div>
                <div className="text-3xl font-black text-[#00FF00] tracking-tight mt-1">{totalTeamRating}</div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Manager Synergy</div>
                <div className="text-xs font-bold text-white mt-2 font-sans truncate capitalize">
                  {activeManager ? activeManager.name.split(' (')[0] : 'None Engaged'}
                </div>
              </div>
            </div>

            {/* Tactical Style select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Tactical Manager</label>
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold font-sans outline-none focus:border-[#00FF00]/50"
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
              >
                {MANAGERS_DB.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (+{m.bonusValue} {m.bonusType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick slot search catalog */}
          {activeSlotSearch && (
            <div className="bg-[#0a0a0a] border border-[#00FF00]/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-black text-white uppercase font-sans">Select Player for Slot: {activeSlotSearch}</span>
                <button onClick={() => setActiveSlotSearch(null)} className="text-xs text-red-400 hover:text-white uppercase font-sans font-bold">
                  Cancel
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {allPlayers.map((player) => {
                  const currentlyInSquad = Object.values(squad).includes(player.id);
                  return (
                    <div
                      key={player.id}
                      onClick={() => !currentlyInSquad && selectPlayerForSlot(activeSlotSearch, player.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                        currentlyInSquad
                          ? 'bg-slate-900 border-white/5 opacity-55 cursor-not-allowed'
                          : 'bg-white/5 border-white/10 hover:border-[#00FF00]/40 hover:bg-[#00FF00]/5 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={player.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <div className="text-xs font-bold text-white font-sans">{player.name}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{player.position} • {player.club}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-sans">OVR {player.maxRating}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
