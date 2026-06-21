import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Zap, Sparkles, RefreshCw, Star, Info, TrendingUp } from 'lucide-react';
import { Player, PointAllocation, PlayerStats } from '../types';
import { MANAGERS_DB, PLAYERS_DB } from '../database/data';
import { InteractiveCard } from './InteractiveCard';
import {
  calculateStats,
  calculateOverallRating,
  getPointCostForLevel,
  generateAutoBuild,
  getStatColor,
  getStatBgClass,
  getStatBorderClass,
  CATEGORY_STAT_MAP
} from '../utils';

interface PlayerDetailPageProps {
  playerId: string;
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function PlayerDetailPage({ playerId, setActiveTab, setSelectedPlayerId }: PlayerDetailPageProps) {
  const player = useMemo(() => PLAYERS_DB[playerId], [playerId]);

  const POINTS_BUDGET = 70; // eFootball training budget

  // 1. Core Build States
  const [points, setPoints] = useState<PointAllocation>({
    shooting: 0,
    passing: 0,
    dribbling: 0,
    dexterity: 0,
    lowerBody: 0,
    aerial: 0,
    defending: 0,
    gk1: 0,
    gk2: 0,
    gk3: 0
  });

  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [boosterEnabled, setBoosterEnabled] = useState(true);

  // Reset points when player changes
  useEffect(() => {
    setPoints({
      shooting: 0,
      passing: 0,
      dribbling: 0,
      dexterity: 0,
      lowerBody: 0,
      aerial: 0,
      defending: 0,
      gk1: 0,
      gk2: 0,
      gk3: 0
    });
    setSelectedManagerId('');
    setBoosterEnabled(true);
  }, [playerId]);

  if (!player) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 font-sans">
        <p>Player profile not found in DataTable.</p>
        <button className="text-[#00FF00] font-bold mt-2" onClick={() => setActiveTab('players')}>
          Back to list
        </button>
      </div>
    );
  }

  const activeManager = useMemo(() => {
    return MANAGERS_DB.find((m) => m.id === selectedManagerId) || null;
  }, [selectedManagerId]);

  // Recalculated stats live
  const currentStats = useMemo(() => {
    return calculateStats(player, points, activeManager, boosterEnabled);
  }, [player, points, activeManager, boosterEnabled]);

  // Total allocated points cost
  const totalSpentPoints = useMemo(() => {
    const list = Object.values(points) as number[];
    return list.reduce((sum: number, current: number) => sum + getPointCostForLevel(current), 0);
  }, [points]);

  const remainingAvailablePoints = POINTS_BUDGET - totalSpentPoints;

  // Recalculate Live overall rating at ALL 14 positions for the position matrix!
  const positionRatings = useMemo(() => {
    const list = ['ST', 'CF', 'SS', 'LWF', 'RWF', 'AMF', 'CMF', 'DMF', 'LMF', 'RMF', 'CB', 'LB', 'RB', 'GK'];
    const ratings: Record<string, number> = {};
    list.forEach((pos) => {
      ratings[pos] = calculateOverallRating(currentStats, pos, player.rating, player.baseStats);
    });
    return ratings;
  }, [currentStats, player]);

  // Calculate live rating of the player's primary position for the Card display
  const livePrimaryRating = positionRatings[player.position] || player.rating;

  // Auto Build
  const handleAutoBuild = () => {
    const optimal = generateAutoBuild(player, POINTS_BUDGET);
    setPoints(optimal);
  };

  const handleMaxBuild = () => {
    handleAutoBuild(); // in a standard budget max is auto build
  };

  // Reset points
  const handleResetBuild = () => {
    setPoints({
      shooting: 0,
      passing: 0,
      dribbling: 0,
      dexterity: 0,
      lowerBody: 0,
      aerial: 0,
      defending: 0,
      gk1: 0,
      gk2: 0,
      gk3: 0
    });
  };

  const upgradeCategory = (cat: keyof PointAllocation, delta: number) => {
    const current = points[cat];
    const newVal = current + delta;

    if (newVal < 0 || newVal > 16) return;

    // Calculate delta cost to execute
    const oldCost = getPointCostForLevel(current);
    const newCost = getPointCostForLevel(newVal);
    const costDiff = newCost - oldCost;

    if (costDiff > remainingAvailablePoints && delta > 0) return; // budget constraint

    setPoints((prev) => ({
      ...prev,
      [cat]: newVal
    }));
  };

  // Filter out and display stats in categorical groups
  const renderStatGroup = (title: string, fields: (keyof PlayerStats)[]) => {
    return (
      <div className="space-y-3 bg-[#101411] border border-white/5 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-500 font-sans tracking-widest uppercase border-b border-white/5 pb-2">
          {title}
        </h3>
        <div className="space-y-3">
          {fields.map((statKey) => {
            const currentVal = currentStats[statKey];
            const baseVal = player.baseStats[statKey];
            const diff = currentVal - baseVal;
            const scoreColor = getStatColor(currentVal);
            const scoreBg = getStatBgClass(currentVal);
            const borderCol = getStatBorderClass(currentVal);

            // Format human-friendly labels
            const formattedLabel = statKey
              .replace(/([A-Z])/g, ' $1')
              .replace(/^gk/, 'GK ')
              .trim();

            return (
              <div key={statKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 font-sans capitalize">{formattedLabel}</span>
                  <div className="flex items-center gap-2">
                    {/* Delta indicator */}
                    {diff > 0 && (
                      <span className="text-[10px] font-bold text-green-400 font-sans bg-green-500/10 px-1 rounded">
                        +{diff}
                      </span>
                    )}
                    {/* Main score bubble */}
                    <span
                      className="w-7 py-0.5 rounded text-center font-bold font-sans select-none border"
                      style={{
                        color: scoreColor,
                        backgroundColor: scoreBg,
                        borderColor: scoreColor + '30'
                      }}
                    >
                      {currentVal}
                    </span>
                  </div>
                </div>
                {/* Visual indicator bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, currentVal)}%`,
                      backgroundColor: scoreColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Other versions of same player
  const otherVersions = Object.values(PLAYERS_DB).filter(
    (p) => p.name === player.name && p.id !== player.id
  );

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveTab('players')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#00FF00] font-sans tracking-wide uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DATABASE CARDS
        </button>
      </div>

      {/* Main player layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Composed Card Grafic & Positions Matrix */}
        <div className="space-y-6 flex flex-col items-center">
          {/* Main eFootball Interactive Composed Card Container */}
          <div className="bg-[#101411] border border-white/5 rounded-2xl p-6 w-full flex flex-col items-center shadow-xl">
            <InteractiveCard
              player={player}
              customRating={livePrimaryRating}
              scale={1.2}
            />

            {/* General Card Information */}
            <div className="w-full mt-10 pt-4 border-t border-white/5 space-y-2.5 text-xs text-center font-sans">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-sm">{player.name}</div>
              <div className="text-slate-500 font-semibold">{player.club} • {player.nation}</div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {Array.from({ length: player.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#00FF00] stroke-[#00FF00]" />
                ))}
              </div>
            </div>
          </div>

          {/* Position Ratings overall Matrix Grid (Top-Right mockup grid style!) */}
          <div className="bg-[#101411] border border-white/5 rounded-2xl p-5 w-full space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Zap className="w-4 h-4 text-[#00FF00]" />
              <h3 className="text-xs font-bold text-slate-300 font-sans tracking-wider uppercase">Live Pitch Positions</h3>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {Object.entries(positionRatings).map(([pos, rating]) => {
                const isActivePosition = player.position === pos;
                const scoreColor = getStatColor(rating as number);
                return (
                  <div
                    key={pos}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border font-sans tracking-wider transition-all duration-300 ${
                      isActivePosition
                        ? 'bg-[#00FF00]/10 border-[#00FF00] scale-103'
                        : 'bg-[#141815] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <span className={`text-[10px] font-black ${isActivePosition ? 'text-[#00FF00]' : 'text-slate-500'}`}>
                      {pos}
                    </span>
                    <span className="text-lg font-black tracking-tight" style={{ color: scoreColor }}>
                      {rating}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center / Right Columns: progression build point allocation and interactive stats panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Progress allocator board */}
          <div className="bg-[#101411] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Header cost info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-4">
              <div>
                <h2 className="text-lg font-bold font-sans text-white uppercase tracking-wide">Build progression calc</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00FF00]"
                      style={{ width: `${(totalSpentPoints / POINTS_BUDGET) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-sans">
                    Allocated: <span className="text-[#00FF00]">{totalSpentPoints}</span> / {POINTS_BUDGET} pts
                  </span>
                </div>
              </div>

              {/* Utility operations */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleMaxBuild}
                  className="bg-[#00FF00]/10 border border-[#00FF00]/30 hover:bg-[#00FF00]/25 text-[#00FF00] font-sans font-black text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg transition-all"
                >
                  AUTO MAX
                </button>
                <button
                  onClick={handleResetBuild}
                  className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/25 text-red-400 font-sans font-black text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg transition-all"
                >
                  RESET BUILD
                </button>
              </div>
            </div>

            {/* Modifier Toggles: Manager & Booster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#141815] p-4 rounded-xl border border-white/5">
              {/* Manager select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                  Tactical Manager
                </label>
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full bg-[#1b221c] border border-white/10 rounded-lg p-2.5 text-xs text-white font-bold font-sans outline-none focus:border-[#00FF00]"
                >
                  <option value="">No Active Manager</option>
                  {MANAGERS_DB.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (+{m.bonusValue} {m.bonusType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Booster select */}
              {player.booster ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">
                      Active Booster Badge
                    </label>
                    <div className="text-xs font-bold text-slate-300 font-sans">{player.booster.name}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={boosterEnabled}
                      onChange={(e) => setBoosterEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF00]/80"></div>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-center p-2 text-xs text-slate-600 font-sans italic">
                  No Booster Slot Available for this card.
                </div>
              )}
            </div>

            {/* Allocator sliders */}
            <div className="space-y-4">
              {Object.keys(points)
                .filter((cat) => {
                  const isGKPos = player.position === 'GK';
                  const isGKCat = cat.startsWith('gk');
                  // exclude GK paths for outfield players, and vice versa!
                  return isGKPos ? isGKCat || ['passing', 'dexterity', 'lowerBody', 'defending'].includes(cat) : !isGKCat;
                })
                .map((catKey) => {
                  const cat = catKey as keyof PointAllocation;
                  const value = points[cat];
                  return (
                    <div key={cat} className="flex items-center justify-between gap-4 p-3 bg-[#141815] rounded-xl border border-white/5">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white capitalize font-sans tracking-wide">
                          {cat.replace('gk', 'GK ')}
                        </span>
                        <div className="text-[10px] text-slate-500 truncate font-sans uppercase">
                          Influences: {CATEGORY_STAT_MAP[cat].join(', ').replace(/([A-Z])/g, ' $1')}
                        </div>
                      </div>

                      {/* +/- control widget */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => upgradeCategory(cat, -1)}
                          disabled={value <= 0}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-[#00FF00]/10 hover:text-[#00FF00] border border-white/5 hover:border-[#00FF00]/30 flex items-center justify-center font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-black text-sm text-white font-mono">
                          {value}
                        </span>
                        <button
                          onClick={() => upgradeCategory(cat, 1)}
                          disabled={value >= 16 || remainingAvailablePoints <= 0}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-[#00FF00]/10 hover:text-[#00FF00] border border-white/5 hover:border-[#00FF00]/30 flex items-center justify-center font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attacking Stats */}
            {renderStatGroup('Attack & Shooting', ['offensiveAwareness', 'ballControl', 'dribbling', 'tightPossession', 'lowPass', 'loftedPass', 'finishing', 'heading', 'placeKicking', 'curl'])}

            {/* Goalkeeping (Only visible if player is GK) or Defending */}
            {player.position === 'GK'
              ? renderStatGroup('Goalkeeping Stats', ['gkAwareness', 'gkCatching', 'gkParrying', 'gkReflexes', 'gkReach'])
              : renderStatGroup('Defending Stats', ['defensiveAwareness', 'defensiveEngagement', 'tackling', 'aggression'])}

            {/* Athleticism / Physicality */}
            {renderStatGroup('Atlethicism & Physical', ['speed', 'acceleration', 'kickingPower', 'jump', 'physicalContact', 'balance', 'stamina'])}

            {/* Player Physical Profile */}
            <div className="space-y-3 bg-[#101411] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-500 font-sans tracking-widest uppercase border-b border-white/5 pb-2">
                Weak foot & Physical Profile
              </h3>
              <div className="divide-y divide-white/5 text-xs font-sans">
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Age</span>
                  <span className="font-bold text-white">{player.age} Years</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Height / Weight</span>
                  <span className="font-bold text-white">{player.height}cm / {player.weight}kg</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Playstyle</span>
                  <span className="font-bold text-[#00FF00]">{player.playstyle}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Preferred Foot</span>
                  <span className="font-bold text-white">{player.preferredFoot}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Weak Foot Usage</span>
                  <span className="font-bold text-lime-400">{player.weakFootUsage}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Weak Foot Accuracy</span>
                  <span className="font-bold text-lime-400">{player.weakFootAccuracy}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Physical Form</span>
                  <span className="font-bold text-white">{player.form}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards from the same player (Horizontal Slider Carousel) */}
          {otherVersions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold font-sans text-white tracking-widest uppercase">
                OTHER VERSIONS AVAILABLE
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {otherVersions.map((v) => (
                  <div key={v.id} className="flex-shrink-0 cursor-pointer" onClick={() => setSelectedPlayerId(v.id)}>
                    <InteractiveCard player={v} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
