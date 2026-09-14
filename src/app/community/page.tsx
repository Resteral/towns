'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { ShoutoutPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { 
  Radio, Sparkles, MessageSquare, Flame, Zap, Heart, 
  Send, Plus, ShoppingBag, Truck, Star, ArrowRight, ShieldCheck, User 
} from 'lucide-react';

export default function CommunityFeedPage() {
  const { shoutouts, sellers, addShoutout, reactToShoutout } = useNfcStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Post Form State
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<ShoutoutPost['tag']>('news');
  const [isPosting, setIsPosting] = useState(false);

  const tags = [
    { id: 'all', label: 'All Stream', icon: '✨' },
    { id: 'drop', label: 'Fresh Drops', icon: '🛍️' },
    { id: 'review', label: '5★ Spotlights', icon: '⭐' },
    { id: 'courier', label: 'Courier Radar', icon: '🚐' },
    { id: 'deal', label: 'Flash Deals', icon: '🔥' },
    { id: 'news', label: 'Community News', icon: '📢' },
  ];

  const filteredShoutouts = shoutouts.filter(s => {
    if (activeFilter === 'all') return true;
    return s.tag === activeFilter;
  });

  const handlePostShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    addShoutout({
      authorName,
      authorHandle: `@${authorName.toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: selectedTag === 'drop' ? '🛍️' : selectedTag === 'review' ? '⭐' : selectedTag === 'courier' ? '🚐' : '✨',
      authorBadge: selectedTag === 'drop' ? 'Vendor Drop' : 'Community Member',
      content,
      tag: selectedTag,
    });

    setContent('');
    setIsPosting(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Social Pulse & Community Wire</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              Community <span className="text-indigo-400">Shoutouts.</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Real-time feed of artisan drops, verified 5-star customer reviews, courier alerts, and local announcements across the Oasis network.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsPosting(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Shoutout</span>
            </button>
            <Link
              href="/sell"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>List Item for Sale</span>
            </Link>
          </div>
        </div>

        {/* Modal / Form: Broadcast a Shoutout */}
        {isPosting && (
          <div className="bg-[#0e0e14] border border-amber-400/30 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400">Public Broadcast</span>
                <h3 className="text-xl font-black italic uppercase text-white">Post to Oasis Community Feed</h3>
              </div>
              <button
                onClick={() => setIsPosting(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono uppercase"
              >
                Cancel ✕
              </button>
            </div>

            <form onSubmit={handlePostShoutout} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Your Name / Business</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Oasis Bakery or Dave M."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Category Tag</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value as any)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="drop">🛍️ Fresh Product Drop</option>
                    <option value="review">⭐ 5-Star Review Highlight</option>
                    <option value="courier">🚐 Courier Transit Alert</option>
                    <option value="deal">🔥 Flash Deal / Promo</option>
                    <option value="news">📢 Community Announcement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Message Content</label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share a fresh drop, announce an in-person NFC tap station, or post a local shoutout..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Shoutout</span>
              </button>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                activeFilter === t.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Two-Column Layout: Main Feed & Sidebar Vanguards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {filteredShoutouts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4 hover:border-indigo-400/40 transition-all group"
              >
                {/* Author Bar */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black italic text-white text-base leading-snug">{post.authorName}</h3>
                        {post.authorBadge && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[8px] font-mono font-bold uppercase">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500">{post.authorHandle} • {formatDate(post.timestamp)}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono uppercase text-zinc-400">
                    #{post.tag}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-zinc-200 leading-relaxed pt-1">
                  {post.content}
                </p>

                {/* Reactions Bar */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reactToShoutout(post.id, 'voltage')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                        post.userReactions?.voltage
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{post.reactions.voltage}</span>
                    </button>

                    <button
                      onClick={() => reactToShoutout(post.id, 'fire')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                        post.userReactions?.fire
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{post.reactions.fire}</span>
                    </button>

                    <button
                      onClick={() => reactToShoutout(post.id, 'heart')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                        post.userReactions?.heart
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.reactions.heart}</span>
                    </button>
                  </div>

                  <Link
                    href="/order"
                    className="text-[10px] font-mono text-amber-400 hover:text-white uppercase font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Order Delivery</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: Verified Vanguards & Sellers */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-amber-400">Verified Network</span>
                  <h3 className="text-lg font-black italic uppercase text-white">Founding Vanguards</h3>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {sellers.map((seller) => (
                  <Link
                    key={seller.id}
                    href={`/sellers/${seller.id}`}
                    className="block p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{seller.avatar}</span>
                        <div>
                          <p className="font-bold text-white text-xs leading-snug group-hover:text-amber-400 transition-colors">
                            {seller.name}
                          </p>
                          <p className="text-[9px] font-mono text-indigo-400">{seller.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {seller.rating} ★
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{seller.bio}</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/sell"
                className="block w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest text-center rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
              >
                Join as Local Vanguard
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
