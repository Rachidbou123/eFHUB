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

  // Generate theme attributes based on CardType
  const getCardTheme = () => {
    switch (player.cardType) {
      case 'epic':
      case 'epic_highlight':
        return {
          border: 'rgba(212, 175, 55, 0.9)',
          glow: '0 0 15px rgba(212, 175, 55, 0.45), inset 0 0 10px rgba(212, 175, 55, 0.25)',
          badgeBg: 'bg-gradient-to-r from-[#D4AF37] to-[#8A640F]',
          badgeBorder: 'border-[#FFEAA5]/50',
          bottomLine: 'linear-gradient(90deg, #FFEAA5 0%, #D4AF37 50%, #8A640F 100%)',
          bottomLineGlow: '0 -2px 10px rgba(212, 175, 55, 0.6)'
        };
      case 'epic_special':
        return {
          border: 'rgba(147, 51, 234, 0.9)',
          glow: '0 0 15px rgba(147, 51, 234, 0.45), inset 0 0 10px rgba(147, 51, 234, 0.25)',
          badgeBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600',
          badgeBorder: 'border-purple-300/50',
          bottomLine: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
          bottomLineGlow: '0 -2px 10px rgba(147, 51, 234, 0.6)'
        };
      case 'legendary':
        return {
          border: 'rgba(245, 158, 11, 0.9)',
          glow: '0 0 15px rgba(245, 158, 11, 0.45), inset 0 0 10px rgba(245, 158, 11, 0.25)',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          badgeBorder: 'border-amber-300/50',
          bottomLine: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)',
          bottomLineGlow: '0 -2px 10px rgba(245, 158, 11, 0.6)'
        };
      case 'bigtime':
        return {
          border: 'rgba(239, 68, 68, 0.9)',
          glow: '0 0 15px rgba(239, 68, 68, 0.45), inset 0 0 10px rgba(239, 68, 68, 0.25)',
          badgeBg: 'bg-gradient-to-r from-red-600 to-rose-800',
          badgeBorder: 'border-rose-400/50',
          bottomLine: 'linear-gradient(90deg, #ef4444 0%, #ec4899 50%, #7f1d1d 100%)',
          bottomLineGlow: '0 -2px 10px rgba(239, 68, 68, 0.6)'
        };
      case 'showtime':
      case 'showtime_template':
        return {
          border: 'rgba(236, 72, 153, 0.9)',
          glow: '0 0 15px rgba(236, 72, 153, 0.45), inset 0 0 10px rgba(6, 182, 212, 0.25)',
          badgeBg: 'bg-gradient-to-r from-pink-600 to-cyan-600',
          badgeBorder: 'border-pink-300/50',
          bottomLine: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)',
          bottomLineGlow: '0 -2px 10px rgba(236, 72, 153, 0.6)'
        };
      case 'showtime_effect':
        return {
          border: 'rgba(168, 85, 247, 0.9)',
          glow: '0 0 15px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(168, 85, 247, 0.25)',
          badgeBg: 'bg-gradient-to-r from-violet-600 to-indigo-600',
          badgeBorder: 'border-violet-300/50',
          bottomLine: 'linear-gradient(90deg, #8b5cf6 0%, #4f46e5 100%)',
          bottomLineGlow: '0 -2px 10px rgba(168, 85, 247, 0.6)'
        };
      case 'potw':
        return {
          border: 'rgba(6, 182, 212, 0.9)',
          glow: '0 0 15px rgba(6, 182, 212, 0.45), inset 0 0 10px rgba(6, 182, 212, 0.25)',
          badgeBg: 'bg-gradient-to-r from-cyan-600 to-emerald-600',
          badgeBorder: 'border-cyan-300/50',
          bottomLine: 'linear-gradient(90deg, #00f0ff 0%, #10b981 100%)',
          bottomLineGlow: '0 -2px 10px rgba(0, 240, 255, 0.6)'
        };
      case 'highlight':
      case 'highlight_special':
        return {
          border: 'rgba(34, 197, 94, 0.9)',
          glow: '0 0 15px rgba(34, 197, 94, 0.45), inset 0 0 10px rgba(34, 197, 94, 0.25)',
          badgeBg: 'bg-gradient-to-r from-green-600 to-lime-600',
          badgeBorder: 'border-green-300/50',
          bottomLine: 'linear-gradient(90deg, #00FF00 0%, #22c55e 100%)',
          bottomLineGlow: '0 -2px 10px rgba(0, 255, 0, 0.6)'
        };
      case 'highlight_special_alt':
        return {
          border: 'rgba(16, 185, 129, 0.9)',
          glow: '0 0 15px rgba(16, 185, 129, 0.45), inset 0 0 10px rgba(16, 185, 129, 0.25)',
          badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
          badgeBorder: 'border-emerald-300/50',
          bottomLine: 'linear-gradient(90deg, #10b981 0%, #14b8a6 100%)',
          bottomLineGlow: '0 -2px 10px rgba(16, 185, 129, 0.6)'
        };
      case 'standard':
      default:
        return {
          border: 'rgba(75, 85, 99, 0.8)',
          glow: 'none',
          badgeBg: 'bg-slate-700',
          badgeBorder: 'border-slate-500',
          bottomLine: 'linear-gradient(90deg, #4b5563 0%, #1f2937 100%)',
          bottomLineGlow: 'none'
        };
    }
  };

  const theme = getCardTheme();

  // Custom premium eFootball backgrounds loaded as PNG assets from the uploaded photos mapping
  const renderCardBackground = () => {
    let src = '';
    let alt = '';

    // National Selection highlights
    const nationalBgs: { [key: string]: string } = {
      'Argentina': 'Argentina.png',
      'Brazil': 'Brazil .png',
      'Egypt': 'Egypt .png',
      'England': 'England .png',
      'France': 'France.png',
      'Germany': 'Germany .png',
      'Japan': 'Japan .png',
      'Malaysia': 'Malaysia .png',
      'Morocco': 'Morocco.png',
      'Netherlands': 'Netherlands.png',
      'Portugal': 'Portugal .png',
      'Spain': 'Spain.png',
      'Thailand': 'Thailand .png',
      'Türkiye': 'Türkiye.png',
      'Turkey': 'Türkiye.png'
    };

    // Check if it's a highlight national selection background
    if (
      (player.cardType === 'highlight' || player.cardType === 'highlight_special' || player.cardType === 'highlight_special_alt') &&
      nationalBgs[player.nation]
    ) {
      src = `/src/assets/images/${nationalBgs[player.nation]}`;
      alt = `Highlight / ${player.nation} National Team Selection`;
    } else {
      switch (player.cardType) {
        case 'showtime':
          src = '/src/assets/images/0601_402_m01.png';
          alt = 'Show Time';
          break;
        case 'epic':
          src = '/src/assets/images/0601_480_m01.png';
          alt = 'Epic';
          break;
        case 'potw':
          src = '/src/assets/images/POTD.png';
          alt = 'Player of the Day / Highlight';
          break;
        case 'bigtime':
          src = '/src/assets/images/EPIC.png';
          alt = 'Big Time';
          break;
        case 'epic_highlight':
          src = '/src/assets/images/EPIC (2).png';
          alt = 'Epic / Highlight';
          break;
        case 'epic_special':
          src = '/src/assets/images/EPIC (3).png';
          alt = 'Epic / Special Concept';
          break;
        case 'legendary':
          src = '/src/assets/images/EPIC (4).png';
          alt = 'Legendary';
          break;
        case 'showtime_effect':
          src = '/src/assets/images/0600_977_m01.png';
          alt = 'Show Time Background Effect';
          break;
        case 'showtime_template':
          src = '/src/assets/images/0601_338_m01.png';
          alt = 'Show Time Template';
          break;
        case 'highlight':
        case 'highlight_special':
          src = '/src/assets/images/0600_1102_m01.png';
          alt = 'Highlight / Special Edition';
          break;
        case 'highlight_special_alt':
          src = '/src/assets/images/0600_1103_m01.png';
          alt = 'Highlight / Special Edition Alternative';
          break;
        case 'standard':
        default:
          // Graphite metallic standard style
          return (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="stdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2e3541"/>
                  <stop offset="100%" stopColor="#0f1319"/>
                </linearGradient>
                <pattern id="carbon" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="3" height="3" fill="#ffffff" fillOpacity="0.03"/>
                  <rect x="3" y="3" width="3" height="3" fill="#ffffff" fillOpacity="0.03"/>
                </pattern>
              </defs>
              <rect width="189" height="123" fill="url(#stdGrad)"/>
              <rect width="189" height="123" fill="url(#carbon)"/>
              <rect x="2" y="2" width="185" height="119" rx="5" stroke="#4b5563" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
            </svg>
          );
      }
    }

    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Hide broken/unloaded background image gracefully
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative select-none rounded-[10px] overflow-hidden transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-2xl hover:shadow-green-500/10 active:scale-95' : ''
      }`}
      style={{
        width: '189px',
        height: '158px',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        border: `1.2px solid ${theme.border}`,
        boxShadow: theme.glow
      }}
    >
      {/* 1. Portrait background panel (h=123px) */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden flex items-center justify-center"
        style={{ height: '123px' }}
      >
        {/* Render our custom high-fidelity SVG theme vector background */}
        {renderCardBackground()}

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
            // Hide broken images gracefully
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
          <div className="text-[34px] font-black text-white pr-1 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono">
            {displayRating}
          </div>
          {/* Position */}
          <div className={`mt-[-2px] px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wider text-center flex items-center justify-center font-sans ${theme.badgeBg} text-white border ${theme.badgeBorder} shadow-sm`}>
            {player.position}
          </div>
        </div>

        {/* Card Booster Mini badge */}
        {player.booster && (
          <div className="absolute bottom-[4px] left-[8px] flex items-center bg-black/85 backdrop-blur-sm px-1.5 py-0.5 rounded border border-green-500/40 text-[9px] text-green-400 font-bold tracking-widest font-sans uppercase z-10 shadow-sm">
            <span>B</span>
          </div>
        )}
      </div>

      {/* 4. Bottom Name rectangular slot (h=35px) */}
      <div
        className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center bg-black/95 backdrop-blur-xs border-t border-white/5"
        style={{
          height: '35px',
          zIndex: 5
        }}
      >
        <div className="text-white text-[13px] font-bold tracking-wide text-center uppercase font-sans px-1 truncate w-full select-none">
          {player.shortName}
        </div>
      </div>

      {/* 5. Bottom Height Dynamic Glowing Accent Line (h=5px) */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '5px',
          zIndex: 10,
          background: theme.bottomLine,
          boxShadow: theme.bottomLineGlow
        }}
      />
    </div>
  );
}

