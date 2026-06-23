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
        return {
          border: 'rgba(212, 175, 55, 0.9)',
          glow: '0 0 15px rgba(212, 175, 55, 0.45), inset 0 0 10px rgba(212, 175, 55, 0.25)',
          badgeBg: 'bg-gradient-to-r from-[#D4AF37] to-[#8A640F]',
          badgeBorder: 'border-[#FFEAA5]/50',
          bottomLine: 'linear-gradient(90deg, #FFEAA5 0%, #D4AF37 50%, #8A640F 100%)',
          bottomLineGlow: '0 -2px 10px rgba(212, 175, 55, 0.6)'
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
        return {
          border: 'rgba(236, 72, 153, 0.9)',
          glow: '0 0 15px rgba(236, 72, 153, 0.45), inset 0 0 10px rgba(6, 182, 212, 0.25)',
          badgeBg: 'bg-gradient-to-r from-pink-600 to-cyan-600',
          badgeBorder: 'border-pink-300/50',
          bottomLine: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)',
          bottomLineGlow: '0 -2px 10px rgba(236, 72, 153, 0.6)'
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
        return {
          border: 'rgba(34, 197, 94, 0.9)',
          glow: '0 0 15px rgba(34, 197, 94, 0.45), inset 0 0 10px rgba(34, 197, 94, 0.25)',
          badgeBg: 'bg-gradient-to-r from-green-600 to-lime-600',
          badgeBorder: 'border-green-300/50',
          bottomLine: 'linear-gradient(90deg, #00FF00 0%, #22c55e 100%)',
          bottomLineGlow: '0 -2px 10px rgba(0, 255, 0, 0.6)'
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

  // Custom high-fidelity SVGs designed to EXACTLY replicate the premium eFootball cards from the uploaded photos
  const renderCardBackground = () => {
    switch (player.cardType) {
      case 'epic':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="epicBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#110d05"/>
                <stop offset="50%" stopColor="#070502"/>
                <stop offset="100%" stopColor="#0c0903"/>
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B2"/>
                <stop offset="30%" stopColor="#D4AF37"/>
                <stop offset="70%" stopColor="#AA7C11"/>
                <stop offset="100%" stopColor="#543D02"/>
              </linearGradient>
              <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45"/>
                <stop offset="50%" stopColor="#AA7C11" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
              </radialGradient>
              <filter id="goldGlowFilter">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="189" height="123" fill="url(#epicBG)"/>
            <rect width="189" height="123" fill="url(#goldGlow)"/>
            
            {/* Elegant outer golden frame */}
            <rect x="3.5" y="3.5" width="182" height="116" rx="6" stroke="url(#goldGrad)" strokeWidth="1.2" fill="none"/>
            <rect x="6.5" y="6.5" width="176" height="110" rx="4" stroke="url(#goldGrad)" strokeWidth="0.4" strokeDasharray="3 2" fill="none" opacity="0.6"/>
            
            {/* Beautiful Ornate Golden Corner Caps */}
            {/* Top Left */}
            <path d="M 3.5,15 L 15,3.5 M 3.5,10 L 10,3.5 M 3.5,20 L 20,3.5" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.7"/>
            {/* Top Right */}
            <path d="M 185.5,15 L 174,3.5 M 185.5,10 L 179,3.5 M 185.5,20 L 169,3.5" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.7"/>
            {/* Bottom Left */}
            <path d="M 3.5,108 L 15,119.5 M 3.5,113 L 10,119.5 M 3.5,103 L 20,119.5" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.7"/>
            {/* Bottom Right */}
            <path d="M 185.5,108 L 174,119.5 M 185.5,113 L 179,119.5 M 185.5,103 L 169,119.5" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.7"/>

            {/* Left and Right Leaf Laurels matching eFootball Image 5 style */}
            <g stroke="url(#goldGrad)" strokeWidth="0.8" fill="url(#goldGrad)" opacity="0.85">
              {/* Left Side Laurels */}
              <path d="M 14,35 Q 11,60 18,90" fill="none" stroke="url(#goldGrad)" strokeWidth="1"/>
              <path d="M 14,38 C 11,36 11,33 14,33 C 17,33 17,36 14,38 Z"/>
              <path d="M 13,48 C 10,46 10,43 13,43 C 16,43 16,46 13,48 Z"/>
              <path d="M 12,58 C 9,56 9,53 12,53 C 15,53 15,56 12,58 Z"/>
              <path d="M 12,68 C 9,66 9,63 12,63 C 15,63 15,66 12,68 Z"/>
              <path d="M 13,78 C 10,76 10,73 13,73 C 16,73 16,76 13,78 Z"/>
              <path d="M 15,88 C 12,86 12,83 15,83 C 18,83 18,86 15,88 Z"/>

              {/* Right Side Laurels */}
              <path d="M 175,35 Q 178,60 171,90" fill="none" stroke="url(#goldGrad)" strokeWidth="1"/>
              <path d="M 175,38 C 178,36 178,33 175,33 C 172,33 172,36 175,38 Z"/>
              <path d="M 176,48 C 179,46 179,43 176,43 C 173,43 173,46 176,48 Z"/>
              <path d="M 177,58 C 180,56 180,53 177,53 C 174,53 174,56 177,58 Z"/>
              <path d="M 177,68 C 180,66 180,63 177,63 C 174,63 174,66 177,68 Z"/>
              <path d="M 176,78 C 179,76 179,73 176,73 C 173,73 173,76 176,78 Z"/>
              <path d="M 174,88 C 177,86 177,83 174,83 C 171,83 171,86 174,88 Z"/>
            </g>

            {/* Glowing Golden Crown at top-center */}
            <g transform="translate(94.5, 12) scale(0.65)" filter="url(#goldGlowFilter)">
              <path d="M -15,5 L -10,-8 L -3,-2 L 0,-15 L 3,-2 L 10,-8 L 15,5 Z" fill="url(#goldGrad)"/>
              <circle cx="0" cy="-17" r="1.5" fill="#FFEAA5" />
              <circle cx="-11" cy="-10" r="1" fill="#FFEAA5" />
              <circle cx="11" cy="-10" r="1" fill="#FFEAA5" />
              <rect x="-15" y="6" width="30" height="2.5" rx="1" fill="url(#goldGrad)"/>
            </g>

            {/* Subtle ornate concentric geometric gold circles in the background */}
            <circle cx="94.5" cy="61.5" r="42" stroke="url(#goldGrad)" strokeWidth="0.4" strokeOpacity="0.25" fill="none"/>
            <circle cx="94.5" cy="61.5" r="48" stroke="url(#goldGrad)" strokeWidth="0.4" strokeOpacity="0.15" strokeDasharray="3 3" fill="none"/>

            {/* Premium Golden Shield / Crest symbol at bottom center */}
            <g transform="translate(94.5, 105) scale(0.6)" filter="url(#goldGlowFilter)">
              <path d="M -10,-10 L 10,-10 L 10,0 C 10,7 0,14 0,14 C 0,14 -10,7 -10,0 Z" fill="url(#goldGrad)" stroke="#FFEAA5" strokeWidth="0.8"/>
              <polygon points="0,-7 3,-2 -3,-2" fill="#2d1d02"/>
              <line x1="0" y1="-8" x2="0" y2="10" stroke="#2d1d02" strokeWidth="0.8"/>
            </g>
          </svg>
        );

      case 'bigtime':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bigtimeBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#45000d"/>
                <stop offset="40%" stopColor="#140112"/>
                <stop offset="80%" stopColor="#08001a"/>
                <stop offset="100%" stopColor="#020008"/>
              </linearGradient>
              <filter id="lightningGlow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="lightningGlowStrong">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="189" height="123" fill="url(#bigtimeBG)"/>
            
            {/* Energetic circular/radial explosion waves in the background */}
            <circle cx="94" cy="61" r="25" stroke="#ff0055" strokeWidth="1" strokeOpacity="0.25" fill="none" filter="url(#lightningGlow)"/>
            <circle cx="94" cy="61" r="45" stroke="#bf00ff" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="5 2" fill="none"/>
            <circle cx="94" cy="61" r="65" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.1" fill="none"/>

            {/* Deep Red glowing border frame */}
            <rect x="2.5" y="2.5" width="184" height="118" rx="6" stroke="#ff0044" strokeWidth="1.2" strokeOpacity="0.8" fill="none" filter="url(#lightningGlow)"/>
            <rect x="4.5" y="4.5" width="180" height="114" rx="4" stroke="#ff00ff" strokeWidth="0.4" strokeOpacity="0.4" fill="none"/>

            {/* Branching Starburst Lightning Pattern (Exact Images 7-20 style) */}
            {/* Outer strong glow lines (Pink/Red/Purple) */}
            <g stroke="#ff0055" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#lightningGlowStrong)" opacity="0.85">
              {/* Lightning Bolt 1: Top-Left */}
              <path d="M 94,61 L 80,48 L 84,45 L 68,32 L 72,28 L 50,12" />
              {/* Lightning Bolt 2: Top-Right */}
              <path d="M 94,61 L 110,48 L 106,44 L 124,30 L 120,26 L 145,8" />
              {/* Lightning Bolt 3: Bottom-Left */}
              <path d="M 94,61 L 78,74 L 83,78 L 62,94 L 66,98 L 42,118" />
              {/* Lightning Bolt 4: Bottom-Right */}
              <path d="M 94,61 L 110,75 L 105,79 L 125,95 L 121,99 L 148,118" />
              {/* Extra branch 5: Left horizontal */}
              <path d="M 94,61 L 75,58 L 78,52 L 55,50 L 58,45 L 20,44" />
              {/* Extra branch 6: Right horizontal */}
              <path d="M 94,61 L 115,64 L 112,70 L 135,72 L 132,78 L 170,80" />
            </g>

            {/* Inner vibrant cyan-white lightning core for extreme high contrast */}
            <g stroke="#00ffff" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" filter="url(#lightningGlow)" opacity="0.95">
              <path d="M 94,61 L 80,48 L 84,45 L 68,32 L 72,28 L 50,12" />
              <path d="M 94,61 L 110,48 L 106,44 L 124,30 L 120,26 L 145,8" />
              <path d="M 94,61 L 78,74 L 83,78 L 62,94 L 66,98 L 42,118" />
              <path d="M 94,61 L 110,75 L 105,79 L 125,95 L 121,99 L 148,118" />
              <path d="M 94,61 L 75,58 L 78,52 L 55,50 L 58,45 L 20,44" />
              <path d="M 94,61 L 115,64 L 112,70 L 135,72 L 132,78 L 170,80" />
            </g>

            {/* Core center lightning white-hot crack */}
            <g stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" opacity="1">
              <path d="M 94,61 L 80,48 L 84,45 L 68,32 L 72,28 L 50,12" />
              <path d="M 94,61 L 110,48 L 106,44 L 124,30 L 120,26 L 145,8" />
              <path d="M 94,61 L 78,74 L 83,78 L 62,94 L 66,98 L 42,118" />
              <path d="M 94,61 L 110,75 L 105,79 L 125,95 L 121,99 L 148,118" />
              <path d="M 94,61 L 75,58 L 78,52 L 55,50 L 58,45 L 20,44" />
              <path d="M 94,61 L 115,64 L 112,70 L 135,72 L 132,78 L 170,80" />
            </g>

            {/* Sparkles / Energy stars */}
            <g fill="#ffffff">
              <circle cx="50" cy="12" r="1.2" filter="url(#lightningGlow)"/>
              <circle cx="145" cy="8" r="1.2" filter="url(#lightningGlow)"/>
              <circle cx="42" cy="118" r="1.2" filter="url(#lightningGlow)"/>
              <circle cx="148" cy="118" r="1.2" filter="url(#lightningGlow)"/>
            </g>
          </svg>
        );

      case 'showtime':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="showtimeBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#180a3a"/>
                <stop offset="40%" stopColor="#08031a"/>
                <stop offset="80%" stopColor="#0d0426"/>
                <stop offset="100%" stopColor="#1e033d"/>
              </linearGradient>
              <linearGradient id="cyanLaser" x1="0%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45"/>
                <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="pinkLaser" x1="100%" y1="0%" x2="30%" y2="100%">
                <stop offset="0%" stopColor="#ff00aa" stopOpacity="0.45"/>
                <stop offset="50%" stopColor="#ff00aa" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#ff00aa" stopOpacity="0"/>
              </linearGradient>
              <filter id="neonPinkGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="189" height="123" fill="url(#showtimeBG)"/>
            
            {/* Cyber Grid Pattern */}
            <g stroke="#ffffff" strokeWidth="0.3" strokeOpacity="0.1">
              <line x1="0" y1="20" x2="189" y2="20"/>
              <line x1="0" y1="45" x2="189" y2="45"/>
              <line x1="0" y1="70" x2="189" y2="70"/>
              <line x1="0" y1="95" x2="189" y2="95"/>
              
              <line x1="30" y1="0" x2="30" y2="123"/>
              <line x1="65" y1="0" x2="65" y2="123"/>
              <line x1="100" y1="0" x2="100" y2="123"/>
              <line x1="135" y1="0" x2="135" y2="123"/>
              <line x1="170" y1="0" x2="170" y2="123"/>
            </g>

            {/* Glowing neon Show Time frame */}
            <rect x="2.5" y="2.5" width="184" height="118" rx="6" stroke="#ff00aa" strokeWidth="1.2" strokeOpacity="0.75" fill="none" filter="url(#neonPinkGlow)"/>

            {/* Diagonal Spotlight lasers/rays (Image 23 style) */}
            <polygon points="0,0 90,123 30,123" fill="url(#cyanLaser)"/>
            <polygon points="189,0 159,123 99,123" fill="url(#pinkLaser)"/>
            <polygon points="120,0 189,60 189,123 150,123" fill="url(#cyanLaser)" opacity="0.6"/>

            {/* Translucent floating 3D Hexagon Crystals (Images 21 & 23 style) */}
            {/* Left Crystal */}
            <g transform="translate(35, 55) scale(0.65)" stroke="#00f0ff" strokeWidth="0.8" fill="#00f0ff" fillOpacity="0.08" opacity="0.7">
              <polygon points="0,-18 15,-9 15,9 0,18 -15,9 -15,-9" />
              <line x1="0" y1="-18" x2="0" y2="18" strokeOpacity="0.5"/>
              <line x1="-15" y1="-9" x2="15" y2="9" strokeOpacity="0.5"/>
              <line x1="-15" y1="9" x2="15" y2="-9" strokeOpacity="0.5"/>
            </g>
            {/* Right Crystal */}
            <g transform="translate(155, 45) scale(0.75)" stroke="#ff00ff" strokeWidth="0.8" fill="#ff00ff" fillOpacity="0.08" opacity="0.7">
              <polygon points="0,-18 15,-9 15,9 0,18 -15,9 -15,-9" />
              <line x1="0" y1="-18" x2="0" y2="18" strokeOpacity="0.5"/>
              <line x1="-15" y1="-9" x2="15" y2="9" strokeOpacity="0.5"/>
              <line x1="-15" y1="9" x2="15" y2="-9" strokeOpacity="0.5"/>
            </g>

            {/* Central energy lightning bolt split (Image 22 "Show Time" signature lightning bolt) */}
            <g stroke="#ffffff" strokeWidth="1.8" filter="url(#neonPinkGlow)" opacity="0.9">
              <path d="M 105,-5 L 95,25 L 105,20 L 90,55 L 102,50 L 85,85 L 95,80 L 80,128" />
            </g>
            <g stroke="#00ffff" strokeWidth="0.8" opacity="1">
              <path d="M 105,-5 L 95,25 L 105,20 L 90,55 L 102,50 L 85,85 L 95,80 L 80,128" />
            </g>

            {/* Giant stylized background typography "SHOW TIME" (Image 22/21 style) */}
            <text x="94.5" y="72" fill="none" stroke="#ff00aa" strokeWidth="3" strokeOpacity="0.4" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontSize="23" fontWeight="900" textAnchor="middle" letterSpacing="0.5" filter="url(#neonPinkGlow)">SHOWTIME</text>
            <text x="94.5" y="72" fill="#ffffff" fillOpacity="0.3" fontFamily="'Space Grotesk', 'Inter', sans-serif" fontSize="23" fontWeight="900" textAnchor="middle" letterSpacing="0.5">SHOWTIME</text>
          </svg>
        );

      case 'potw':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="potwBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#011b24"/>
                <stop offset="50%" stopColor="#01070d"/>
                <stop offset="100%" stopColor="#02141a"/>
              </linearGradient>
              <filter id="cyanGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="189" height="123" fill="url(#potwBG)"/>
            
            {/* Charcoal cyber pattern */}
            <g stroke="#00f0ff" strokeWidth="0.3" strokeOpacity="0.12">
              <line x1="0" y1="30" x2="189" y2="30"/>
              <line x1="0" y1="60" x2="189" y2="60"/>
              <line x1="0" y1="90" x2="189" y2="90"/>
              <line x1="45" y1="0" x2="45" y2="123"/>
              <line x1="94" y1="0" x2="94" y2="123"/>
              <line x1="143" y1="0" x2="143" y2="123"/>
            </g>

            {/* Electric Cyan lightning striking across (Image 10 style) */}
            <g stroke="#00f0ff" strokeWidth="1.5" filter="url(#cyanGlow)" opacity="0.85" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 135,-5 L 115,25 L 125,22 L 95,58 L 105,54 L 75,90 L 85,86 L 50,128" />
              <path d="M 115,25 L 85,35 L 90,38 L 65,58 L 72,61 L 45,82 L 50,84 L 20,110" />
            </g>
            <g stroke="#ffffff" strokeWidth="0.6" opacity="0.95" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 135,-5 L 115,25 L 125,22 L 95,58 L 105,54 L 75,90 L 85,86 L 50,128" />
              <path d="M 115,25 L 85,35 L 90,38 L 65,58 L 72,61 L 45,82 L 50,84 L 20,110" />
            </g>

            <rect x="2.5" y="2.5" width="184" height="118" rx="6" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.75" fill="none" filter="url(#cyanGlow)"/>
          </svg>
        );

      case 'highlight':
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 189 123" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="highlightBG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0a170d"/>
                <stop offset="50%" stopColor="#020804"/>
                <stop offset="100%" stopColor="#051408"/>
              </linearGradient>
              <linearGradient id="greenLaser" x1="100%" y1="0%" x2="20%" y2="100%">
                <stop offset="0%" stopColor="#00ff44" stopOpacity="0.45"/>
                <stop offset="40%" stopColor="#adff2f" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#00ff44" stopOpacity="0"/>
              </linearGradient>
              <filter id="neonGreenGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="189" height="123" fill="url(#highlightBG)"/>
            
            {/* Hexagon Tunnel Lines (Image 4 style) */}
            <g stroke="#00ff44" strokeWidth="0.4" strokeOpacity="0.2" fill="none">
              <polygon points="94.5,21.5 129.5,41.5 129.5,81.5 94.5,101.5 59.5,81.5 59.5,41.5"/>
              <polygon points="94.5,41.5 111.5,51.5 111.5,71.5 94.5,81.5 77.5,71.5 77.5,51.5"/>
              <line x1="94.5" y1="21.5" x2="94.5" y2="41.5"/>
              <line x1="129.5" y1="41.5" x2="111.5" y2="51.5"/>
              <line x1="129.5" y1="81.5" x2="111.5" y2="71.5"/>
              <line x1="94.5" y1="101.5" x2="94.5" y2="81.5"/>
              <line x1="59.5" y1="81.5" x2="77.5" y2="71.5"/>
              <line x1="59.5" y1="41.5" x2="77.5" y2="51.5"/>
            </g>

            {/* Neon Green diagonal spotlight beams (Image 1 style) */}
            <polygon points="120,0 189,0 139,123 70,123" fill="url(#greenLaser)"/>
            <polygon points="40,0 90,0 30,123 0,123" fill="url(#greenLaser)" opacity="0.5"/>

            {/* Floating neon green hexagon grids (Image 2 style) */}
            <g stroke="#00ff44" strokeWidth="0.8" fill="none" opacity="0.65" filter="url(#neonGreenGlow)">
              <polygon points="35,25 45,31 45,41 35,47 25,41 25,31" />
              <polygon points="155,75 165,81 165,91 155,97 145,91 145,31" opacity="0.3"/>
            </g>

            {/* Glowing circle "eFootball" style emblem in center background */}
            <circle cx="94.5" cy="61.5" r="14" stroke="#00ff44" strokeWidth="1" strokeOpacity="0.4" fill="none" filter="url(#neonGreenGlow)"/>
            <circle cx="94.5" cy="61.5" r="8" stroke="#00ff44" strokeWidth="0.5" strokeOpacity="0.3" fill="none"/>
            <circle cx="94.5" cy="61.5" r="3" fill="#adff2f" fillOpacity="0.4"/>

            {/* Neon green card frame */}
            <rect x="2.5" y="2.5" width="184" height="118" rx="6" stroke="#00ff44" strokeWidth="1.2" strokeOpacity="0.85" fill="none" filter="url(#neonGreenGlow)"/>
          </svg>
        );

      case 'standard':
      default:
        // Sleek graphite metallic carbon fiber pattern
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
            
            {/* Minimal borders */}
            <rect x="2" y="2" width="185" height="119" rx="5" stroke="#4b5563" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
          </svg>
        );
    }
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

