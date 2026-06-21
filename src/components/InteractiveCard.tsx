import React from 'react';
import { Player } from '../types';

interface InteractiveCardProps {
  player: Player;
  customRating?: number; // optionally override rating live
  onClick?: () => void;
  scale?: number;
}

export function InteractiveCard({ player, customRating, onClick, scale = 1 }: InteractiveCardProps) {
  const displayRating = customRating !== undefined ? customRating : player.rating;

  // Generate theme gradients based on CardType
  const getCardTheme = () => {
    switch (player.cardType) {
      case 'epic':
        return {
          bg: 'linear-gradient(135deg, #b45309 0%, #fef3c7 40%, #d97706 70%, #78350f 100%)',
          text: 'text-amber-900',
          border: 'border-amber-400',
          badgeBg: 'bg-amber-500/90',
          badgeBorder: 'border-amber-200'
        };
      case 'bigtime':
        return {
          bg: 'linear-gradient(135deg, #991b1b 0%, #1e1b4b 50%, #7f1d1d 100%)',
          text: 'text-rose-100',
          border: 'border-rose-500/60',
          badgeBg: 'bg-rose-600/90',
          badgeBorder: 'border-rose-300'
        };
      case 'showtime':
        return {
          bg: 'linear-gradient(135deg, #0891b2 0%, #0f172a 50%, #0e7490 100%)',
          text: 'text-cyan-100',
          border: 'border-cyan-400/60',
          badgeBg: 'bg-cyan-600/90',
          badgeBorder: 'border-cyan-200'
        };
      case 'potw':
        return {
          bg: 'linear-gradient(135deg, #6b21a8 0%, #15803d 50%, #4c1d95 100%)',
          text: 'text-green-100',
          border: 'border-lime-500/60',
          badgeBg: 'bg-lime-600/95',
          badgeBorder: 'border-lime-200'
        };
      case 'highlight':
        return {
          bg: 'linear-gradient(135deg, #1f2937 0%, #030712 50%, #374151 100%)',
          text: 'text-slate-100',
          border: 'border-green-400/50',
          badgeBg: 'bg-[#22c55e]/90',
          badgeBorder: 'border-green-200'
        };
      case 'standard':
      default:
        return {
          bg: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
          text: 'text-slate-300',
          border: 'border-slate-700',
          badgeBg: 'bg-slate-700/90',
          badgeBorder: 'border-slate-500'
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div
      onClick={onClick}
      className={`relative select-none rounded-[10px] overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-2xl hover:shadow-green-500/10 active:scale-95 transition-all duration-200' : ''
      }`}
      style={{
        width: '189px',
        height: '158px',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        border: '1.2px solid',
        borderColor: player.cardType === 'epic' ? '#f59e0b' : player.cardType === 'bigtime' ? '#ef4444' : '#1f2937',
        boxShadow: player.cardType === 'epic' ? '0 0 12px rgba(245, 158, 11, 0.15)' : 'none'
      }}
    >
      {/* 1. Portrait background panel (h=126px) */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden flex items-center justify-center"
        style={{
          height: '123px',
          background: theme.bg
        }}
      >
        {/* Subtle radial glowing backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent" />

        {/* Abstract Cyber Grid Overlays */}
        {player.cardType === 'showtime' && (
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: 'radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)',
            backgroundSize: '12px 12px'
          }} />
        )}
        {player.cardType === 'bigtime' && (
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ef4444_1px,transparent_1.5px)] bg-[size:10px_100%]" />
        )}

        {/* 2. Character Portrait (123px x 123px positioned right) */}
        <img
          src={player.avatar}
          alt={player.name}
          referrerPolicy="no-referrer"
          className="absolute right-0 bottom-0 float-right object-cover object-top filter contrast-[1.05]"
          style={{
            width: '123px',
            height: '123px',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
          }}
          onError={(e) => {
            // Placeholder character styling if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback Portrait placeholder */}
        <div className="absolute right-2 bottom-0 w-[100px] h-[100px] flex items-end justify-center">
          <div className="w-[85px] h-[95px] bg-gradient-to-t from-black/50 to-transparent rounded-t-full border-t border-white/20 flex items-center justify-center relative">
            <span className="text-[32px] font-bold text-white/10 select-none font-sans uppercase">
              {player.name.substring(0, 2)}
            </span>
          </div>
        </div>

        {/* 3. Rating & Position Badge overlays (top-left) */}
        <div className="absolute top-[8px] left-[10px] flex flex-col items-start leading-none select-none z-10">
          {/* Rating */}
          <div className="text-[34px] font-black text-white pr-1 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-mono">
            {displayRating}
          </div>
          {/* Position */}
          <div className={`mt-[-2px] px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wider text-center flex items-center justify-center font-sans ${theme.badgeBg} text-white border ${theme.badgeBorder}`}>
            {player.position}
          </div>
        </div>

        {/* Card Booster Mini badge */}
        {player.booster && (
          <div className="absolute bottom-[4px] left-[8px] flex items-center bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-green-500/40 text-[9px] text-green-400 font-bold tracking-widest font-sans uppercase z-10">
            <span>B</span>
          </div>
        )}
      </div>

      {/* 4. Bottom Name rectangular slot (h=30px) */}
      <div
        className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center bg-black"
        style={{
          height: '35px',
          zIndex: 5
        }}
      >
        <div className="text-white text-[13px] font-bold tracking-wide text-center uppercase font-sans px-1 truncate w-full select-none">
          {player.shortName}
        </div>
      </div>

      {/* 5. Bottom Height Dynamic Glowing Green Line (h=5px) */}
      <div
        className="absolute bottom-0 left-0 w-full bg-[#00FF00]"
        style={{
          height: '5px',
          zIndex: 10,
          boxShadow: '0 -2px 8px rgba(0, 255, 0, 0.4)'
        }}
      />
    </div>
  );
}
