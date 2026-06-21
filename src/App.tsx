import React, { useState, useTransition } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PlayersPage } from './components/PlayersPage';
import { PlayerDetailPage } from './components/PlayerDetailPage';
import { SquadBuilderPage } from './components/SquadBuilderPage';
import { ComparePage } from './components/ComparePage';
import { TierListPage } from './components/TierListPage';
import { CommunityPage } from './components/CommunityPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Handle active view changes smoothly
  const handleSetTab = (tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  const handleSetPlayer = (id: string | null) => {
    startTransition(() => {
      setSelectedPlayerId(id);
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <LandingPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        );
      case 'players':
        return (
          <PlayersPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
            compareList={compareList}
            setCompareList={setCompareList}
          />
        );
      case 'player-detail':
        return selectedPlayerId ? (
          <PlayerDetailPage
            playerId={selectedPlayerId}
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        ) : (
          <PlayersPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
            compareList={compareList}
            setCompareList={setCompareList}
          />
        );
      case 'squad-builder':
        return <SquadBuilderPage />;
      case 'compare':
        return (
          <ComparePage
            compareIds={compareList}
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        );
      case 'tier-list':
        return (
          <TierListPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        );
      case 'community':
        return (
          <CommunityPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        );
      default:
        return (
          <LandingPage
            setActiveTab={handleSetTab}
            setSelectedPlayerId={handleSetPlayer}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col text-slate-100 font-sans antialiased overflow-x-hidden pb-12 selection:bg-[#00FF00] selection:text-black">
      {/* Dynamic glow in the background corner */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00FF00]/5 blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#00FF00]/3 blur-[140px] pointer-events-none select-none z-0" />

      {/* Styled Neon Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        setSelectedPlayerId={handleSetPlayer}
      />

      {/* Primary Dynamic Content Frame */}
      <main className="flex-1 w-full relative z-10 flex flex-col transition-all duration-200">
        {isPending ? (
          <div className="flex-1 flex flex-col items-center justify-center p-24 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-dashed border-[#00FF00] animate-spin mb-4" />
            <span className="text-xs font-bold text-[#00FF00] font-sans tracking-widest uppercase animate-pulse">
              SYNCING WITH DATATABLE ENGINE...
            </span>
          </div>
        ) : (
          renderActiveTab()
        )}
      </main>

      {/* Pristine cyber-noir bottom status bar matching Artistic Flair */}
      <footer className="w-full max-w-7xl mx-auto px-4 md:px-8 border-t border-white/10 pt-8 mt-12 pb-4 text-[10px] font-mono text-white/40 flex flex-col sm:flex-row items-center justify-between gap-4 uppercase">
        <div className="flex gap-4 items-center flex-wrap">
          <span>PLATFORM VERSION 2.4.0-STABLE</span>
          <span className="text-[#00FF00] flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse"></span>
            SYSTEM_ONLINE
          </span>
        </div>
        <div className="text-center sm:text-right space-y-1">
          <div>REAL-TIME STAT PROCESSING ACTIVE • SHARDS: 4 ACTIVE</div>
          <div className="opacity-60 normal-case">All eFootball assets belong to Konami or their respective publishers.</div>
        </div>
      </footer>
    </div>
  );
}
