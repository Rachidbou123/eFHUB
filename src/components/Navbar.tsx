import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShieldAlert, Award, Layers, Users, Home } from 'lucide-react';
import { PLAYERS_DB } from '../database/data';
import { Player } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function Navbar({ activeTab, setActiveTab, setSelectedPlayerId }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter suggestions as query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const hits = Object.values(PLAYERS_DB).filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query) ||
        player.club.toLowerCase().includes(query) ||
        player.nation.toLowerCase().includes(query)
    );

    setSuggestions(hits.slice(0, 5));
  }, [searchQuery]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (pid: string) => {
    setSelectedPlayerId(pid);
    setActiveTab('player-detail');
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'players', label: 'DATABASE', icon: Layers },
    { id: 'squad-builder', label: 'SQUAD BUILDER', icon: ShieldAlert },
    { id: 'compare', label: 'COMPARE', icon: Users },
    { id: 'tier-list', label: 'TIER LIST', icon: Award },
    { id: 'community', label: 'COMMUNITY', icon: Users }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand logo */}
      <div
        onClick={() => { setSelectedPlayerId(null); setActiveTab('home'); }}
        className="flex items-center gap-2 cursor-pointer group select-none active:scale-95 transition-transform duration-150"
      >
        <div className="bg-[#00FF00] text-black font-black px-3 py-1 text-base skew-x-[-12deg] tracking-tighter shadow-md shadow-green-500/20">
          EF-HUB
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex items-center flex-wrap justify-center gap-2 select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'players' && activeTab === 'player-detail');
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedPlayerId(null);
                setActiveTab(item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider font-sans transition-all duration-200 border ${
                isActive
                  ? 'bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00]'
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Search box autocomplete */}
      <div className="relative w-full max-w-xs" ref={suggestionRef}>
        <div className="relative">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 focus:border-[#00FF00]/50 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-white/30 font-sans tracking-wide outline-none transition-all duration-200"
            placeholder="Search 20,000+ players..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-white/30" />
        </div>

        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute right-0 left-0 mt-2 bg-[#101411] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
            {suggestions.map((player) => (
              <div
                key={player.id}
                onClick={() => handleSuggestionClick(player.id)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#00FF00]/10 cursor-pointer border-b border-white/5 last:border-0 group transition-colors duration-150"
              >
                {/* Mini avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                  <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-[#00FF00] truncate font-sans">
                    {player.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate font-sans">
                    {player.position} • {player.club}
                  </div>
                </div>
                {/* Rating Badge */}
                <div className="bg-[#141815] border border-white/10 group-hover:border-[#00FF00] px-2 py-0.5 rounded text-xs font-bold text-white group-hover:text-[#00FF00]">
                  {player.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
