import React, { useState, useMemo } from 'react';
import { Users, Send, Search, Sparkles, MessageSquare, ThumbsUp, Filter, Trash, Plus } from 'lucide-react';
import { INITIAL_POSTS, PLAYERS_DB } from '../database/data';
import { CommunityPost, PointAllocation } from '../types';

interface CommunityPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export function CommunityPage({ setActiveTab, setSelectedPlayerId }: CommunityPageProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  
  // Search and filter States
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [forumSearch, setForumSearch] = useState('');

  // Post Creator States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPlayerId, setNewPostPlayerId] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [newPostPoints, setNewPostPoints] = useState<PointAllocation>({
    shooting: 4, passing: 4, dribbling: 4, dexterity: 4, lowerBody: 4, aerial: 4, defending: 4, gk1: 0, gk2: 0, gk3: 0
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const allPlayers = useMemo(() => Object.values(PLAYERS_DB), []);

  const tags = ['ALL', 'Build Sharing', 'Unbeatable', 'GK Build', 'Messi', 'Sans'];

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (selectedTag !== 'ALL') {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    if (forumSearch.trim()) {
      const q = forumSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }

    // Sort by most upvoted first
    result.sort((a, b) => b.upvotes - a.upvotes);
    return result;
  }, [posts, selectedTag, forumSearch]);

  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, upvotes: post.upvotes + 1 };
        }
        return post;
      })
    );
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostAuthor.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      author: newPostAuthor,
      content: newPostContent,
      upvotes: 1,
      commentsCount: 0,
      tags: ['Build Sharing'],
      playerId: newPostPlayerId || null,
      buildPoints: newPostPlayerId ? newPostPoints : null,
      createdAt: new Date().toISOString()
    };

    if (newPostPlayerId) {
      const selectedPlayer = PLAYERS_DB[newPostPlayerId];
      if (selectedPlayer) {
        newPost.tags.push(selectedPlayer.name);
      }
    }

    setPosts((prev) => [newPost, ...prev]);

    // Reset Creator
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostPlayerId('');
    setNewPostAuthor('');
    setShowAddForm(false);
  };

  const handlePlayerLinkClick = (pid: string) => {
    setSelectedPlayerId(pid);
    setActiveTab('player-detail');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white font-sans uppercase">
            COMMUNITY <span className="text-[#00FF00]">BUILDS</span>
          </h1>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
            Browse and discuss meta point combinations designed by eFootball tacticians worldwide.
          </p>
        </div>

        {/* Global actions */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 bg-[#00FF00] hover:bg-lime-400 font-sans text-xs font-black text-black px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-md shadow-green-500/20"
        >
          <Plus className="w-4 h-4" /> SHARE CUSTOM BUILD
        </button>
      </div>

      {/* Write custom build post modal / dropdown form */}
      {showAddForm && (
        <form onSubmit={handlePublishPost} className="bg-[#101411] border border-[#00FF00]/30 rounded-2xl p-6 space-y-4 animate-fade-in">
          <div className="text-xs font-black text-[#00FF00] font-sans tracking-wide uppercase flex items-center gap-1 tracking-wider border-b border-white/5 pb-2">
            <Sparkles className="w-3.5 h-3.5" /> SHARE YOUR OPTIMAL BUILD DESIGN
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Tactician Name</label>
              <input
                type="text"
                className="w-full bg-[#141815] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 font-sans tracking-wide outline-none focus:border-[#00FF00]"
                placeholder="Manager Name e.g. Pep99"
                value={newPostAuthor}
                onChange={(e) => setNewPostAuthor(e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Title</label>
              <input
                type="text"
                className="w-full bg-[#141815] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 font-sans tracking-wide outline-none focus:border-[#00FF00]"
                placeholder="e.g. My Infinite Speed Neymar Jr build"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Description Details</label>
            <textarea
              className="w-full h-24 bg-[#141815] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 font-sans tracking-wide outline-none focus:border-[#00FF00] resize-none"
              placeholder="Why is this build optimal? Support your claims with math or clinical playstyle advantages..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Anchor Player card</label>
              <select
                className="w-full bg-[#141815] border border-white/10 rounded-lg p-2.5 text-xs text-white font-bold font-sans outline-none focus:border-[#00FF00]"
                value={newPostPlayerId}
                onChange={(e) => setNewPostPlayerId(e.target.value)}
              >
                <option value="">No Card Anchored</option>
                {allPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Max OVR {p.maxRating}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-transparent text-slate-400 hover:text-white font-sans text-xs tracking-wider uppercase px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#00FF00] text-black font-sans font-black text-xs tracking-longer uppercase px-6 py-2.5 rounded-lg active:scale-95 transition-all shadow-md shadow-green-500/20"
            >
              PUBLISH BUILD
            </button>
          </div>
        </form>
      )}

      {/* Forums listing filter and query controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#101411] border border-white/5 rounded-2xl">
        {/* Tags category selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500 mr-2" />
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`p-1 px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                selectedTag === tag
                  ? 'bg-[#00FF00]/10 border border-[#00FF00]/40 text-[#00FF00]'
                  : 'bg-[#141815] border border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Local Search inside Forum */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full bg-[#141815] border border-white/10 focus:border-[#00FF00] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 font-sans"
            placeholder="Search communities..."
            value={forumSearch}
            onChange={(e) => setForumSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Forums Lists cards */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const anchoredPlayer = post.playerId ? PLAYERS_DB[post.playerId] : null;

          return (
            <div
              key={post.id}
              className="bg-[#101411] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all space-y-4"
            >
              {/* Header metrics */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-[#00FF00]/30 flex items-center justify-center font-bold text-[#00FF00] text-xs font-sans">
                    {post.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-sans">{post.author}</div>
                    <div className="text-[9px] text-slate-500 font-sans font-medium uppercase tracking-widest">
                      CLUB TACTICIAN
                    </div>
                  </div>
                </div>

                {/* Date stamp or tags */}
                <div className="flex items-center gap-2">
                  {post.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[9px] font-bold text-[#00FF00] bg-[#00FF00]/5 px-2 py-0.5 rounded border border-[#00FF00]/10 font-sans uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight leading-tight font-sans uppercase">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Anchored Player stats preview row */}
              {anchoredPlayer && (
                <div
                  onClick={() => handlePlayerLinkClick(anchoredPlayer.id)}
                  className="flex items-center justify-between p-3.5 bg-[#141815] border border-white/5 rounded-xl cursor-pointer hover:border-[#00FF00]/30 hover:bg-[#00FF00]/5 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={anchoredPlayer.avatar} className="w-9 h-9 rounded-full object-cover border border-white/15" alt="" />
                    <div>
                      <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest font-sansBlock font-sans">
                        Anchored Card Build
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00FF00] transition-colors font-sans">
                        {anchoredPlayer.name} (Primary: {anchoredPlayer.position} • Max {anchoredPlayer.maxRating})
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#00FF00] font-sans uppercase">
                    VIEW BUILD & RECALCULATE →
                  </span>
                </div>
              )}

              {/* Interaction row: comment counts & upvote counter */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3.5 text-xs text-slate-500 font-sans font-bold">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-[#00FF00] transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" /> UPVOTE ({post.upvotes})
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> {post.commentsCount} COMMENTS
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
