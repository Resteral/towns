'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import TownSelector from '@/components/TownSelector';
import SpotlightSearch from '@/components/SpotlightSearch';
import AuthModal from '@/components/AuthModal';
import { 
  Sparkles, 
  ShoppingBag, 
  LayoutDashboard, 
  Radio, 
  Truck, 
  MessageSquare, 
  Compass, 
  Crown, 
  Search,
  User,
  ShieldCheck
} from 'lucide-react';
import { calculateCardProgression } from '@/lib/card-leveling';
import NfcCardLevelWidget from '@/components/NfcCardLevelWidget';
import { useMemo } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, userMembership, currentUser, deliveryDrivers, storeHunterStamps, passportStamps } = useNfcStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const onlineDrivers = deliveryDrivers.filter(d => d.isOnline && d.status !== 'off_duty');

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#070709]/80 backdrop-blur-2xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/townraise-logo.png" 
              alt="Townraise" 
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="hidden sm:block">
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full">
                Town Nodes
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4">
            <Link
              href="/"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                pathname === '/' ? 'text-amber-400' : 'text-white/60 hover:text-white'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/drivers"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/drivers') ? 'text-emerald-400' : 'text-emerald-400/90 hover:text-emerald-300'
              }`}
            >
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{onlineDrivers.length} Drivers Online</span>
              </span>
            </Link>
            <Link
              href="/directory"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/directory') ? 'text-amber-400' : 'text-white/80 hover:text-white'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10 text-[9px] font-bold">Directory 🏢</span>
            </Link>
            <Link
              href="/events"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/events') ? 'text-pink-400' : 'text-pink-400/90 hover:text-pink-300'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/30 text-[9px] font-bold">Events 📅</span>
            </Link>
            <Link
              href="/concierge"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/concierge') ? 'text-emerald-400' : 'text-emerald-300/90 hover:text-emerald-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">Concierge 🌲</span>
            </Link>
            <Link
              href="/ai-concierge"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/ai-concierge') ? 'text-amber-400' : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">AI Bot 🤖</span>
            </Link>
            <Link
              href="/rewards"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/rewards') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[9px] font-bold">Rewards 🎁</span>
            </Link>
            <Link
              href="/eats"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/eats') ? 'text-amber-400' : 'text-amber-400/90 hover:text-amber-300'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[9px]">Eats 🍔</span>
            </Link>
            <Link
              href="/work"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/work') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold">🛠️ Work</span>
            </Link>
            <Link
              href="/creator"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/creator') || pathname?.startsWith('/custom-nfc') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[9px] font-bold">⚡ NFC Creator</span>
            </Link>
            <Link
              href="/tourist-hunts"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/tourist-hunts') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center gap-1">
                <span>🧭 Tourist Hunts</span>
              </span>
            </Link>
            <Link
              href="/store-hunting"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/store-hunting') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold flex items-center gap-1">
                <span>🛍️ Store Hunting</span>
              </span>
            </Link>
            <Link
              href="/society"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/society') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold flex items-center gap-1 shadow-lg shadow-amber-500/10 animate-pulse">
                <span>🏛️ Society & Vault</span>
              </span>
            </Link>
            <Link
              href="/leaderboard"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/leaderboard') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold flex items-center gap-1">
                <span>🏆 Leaderboard</span>
              </span>
            </Link>
            <Link
              href="/marketplace"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                pathname === '/marketplace' ? 'text-amber-400' : 'text-white/60 hover:text-white'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/towns"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/towns') ? 'text-amber-400' : 'text-white/60 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Towns</span>
            </Link>
            <Link
              href="/courier"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname?.startsWith('/courier') ? 'text-amber-400' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">Courier 📦</span>
            </Link>
            <Link
              href="/membership"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
                pathname === '/membership' ? 'text-amber-400' : 'text-white/60 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{userMembership.active && userMembership.tier !== 'free' ? userMembership.customBadge : 'VIP'}</span>
            </Link>
          </nav>

          {/* Right CTA / Town Selector, Cart, User Switcher, Portal */}
          <div className="flex items-center gap-2">
            {/* Spotlight Search Trigger Button */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-mono text-white/60 hover:text-white transition-all"
              title="Press Cmd+K or Ctrl+K to Search"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-mono">⌘K</kbd>
            </button>

            {/* Card Level Badge */}
            <div className="hidden lg:block">
              <NfcCardLevelWidget progression={cardProgression} compact={true} />
            </div>

            {/* Town Selector Component */}
            <TownSelector />

            {/* Drivers Live Status Icon for Mobile / Tablet */}
            <Link
              href="/drivers"
              className="xl:hidden relative p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/20 transition-all text-emerald-400 flex items-center justify-center"
              title={`${onlineDrivers.length} Drivers Online`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white flex items-center justify-center"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center shadow-lg border border-indigo-400 animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Switcher Trigger */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-1.5 sm:px-3 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all flex items-center gap-2 group"
              title="Switch Profile / Sign In"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-sm shadow-inner">
                {currentUser?.avatar || '👤'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[100px]">
                  {currentUser?.name.split(' ')[0] || 'Sign In'}
                </span>
                <span className="text-[8px] font-mono text-zinc-400 uppercase">
                  {currentUser ? `${currentUser.role}` : 'Guest'}
                </span>
              </div>
            </button>

            {/* Portal Link */}
            <Link
              href="/dashboard"
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal</span>
            </Link>
          </div>
        </div>
        <SpotlightSearch />
      </header>

      {/* Auth Modal popup */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
