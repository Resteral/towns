'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import TownSelector from '@/components/TownSelector';
import { Sparkles, ShoppingBag, LayoutDashboard, Radio, Truck, MessageSquare, Compass, Crown } from 'lucide-react';

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
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
              pathname === '/' ? 'text-amber-400' : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
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
        <div className="flex items-center gap-3">
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
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
