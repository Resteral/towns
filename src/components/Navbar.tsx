'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import TownSelector from '@/components/TownSelector';
import SpotlightSearch from '@/components/SpotlightSearch';
import { Sparkles, ShoppingBag, LayoutDashboard, Radio, Truck, MessageSquare, Compass, Crown, Wrench, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, deliveryOrders, userMembership } = useNfcStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#070709]/80 backdrop-blur-2xl border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#070709] rounded-[14px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black italic tracking-tighter text-xl text-white uppercase">Oasis<span className="text-amber-400">Tap</span></span>
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full">Decentralized</span>
            </div>
            <p className="text-[8px] font-bold text-white/40 tracking-[0.2em] uppercase">Reviews & Town Nodes</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          <Link
            href="/"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              pathname === '/' ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
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
            href="/rewards"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/rewards') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[9px] font-bold">Rewards 🎁</span>
          </Link>
          <Link
            href="/affiliate"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/affiliate') ? 'text-emerald-400' : 'text-emerald-400/90 hover:text-emerald-300'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">Affiliate $50 💰</span>
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
            href="/menus"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/menus') ? 'text-amber-400' : 'text-white/80 hover:text-white'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10 text-[9px] font-bold">Menus 📖</span>
          </Link>
          <Link
            href="/work"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/work') ? 'text-amber-400' : 'text-amber-300/90 hover:text-amber-200'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold">🛠️ Trades & Work</span>
          </Link>
          <Link
            href="/services"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/services') ? 'text-amber-400' : 'text-amber-300 hover:text-amber-200'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold">⚡ Services</span>
          </Link>
          <Link
            href="/dashboard/admin"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/dashboard/admin') ? 'text-amber-400' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black">👑 Admin</span>
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
            <span>Town Nodes</span>
          </Link>
          <Link
            href="/community"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/community') ? 'text-indigo-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Community Wire</span>
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
            href="/order"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname?.startsWith('/order') ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Delivery</span>
          </Link>
          <Link
            href="/membership"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-1 ${
              pathname === '/membership' ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{userMembership.active && userMembership.tier !== 'free' ? userMembership.customBadge : 'Membership'}</span>
          </Link>
          <Link
            href="/contact"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              pathname === '/contact' ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            Contact
          </Link>
          <Link
            href="/tap/card-oasis-main"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            NFC Demo
          </Link>
        </nav>

        {/* Right CTA / Town Selector, Cart, Portal */}
        <div className="flex items-center gap-2.5">
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

          {/* Town Selector Component */}
          <TownSelector />

          <Link
            href="/cart"
            className="relative p-2.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white flex items-center justify-center"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-indigo-400 animate-bounce">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            href="/driver"
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-1.5"
            title="Open Food Delivery Driver App"
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Driver App</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>
        </div>
      </div>
      <SpotlightSearch />
    </header>
  );
}
