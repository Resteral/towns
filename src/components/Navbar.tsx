'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';
import {
  ShoppingBag,
  LayoutDashboard,
  Truck,
  ChevronDown,
  Menu,
  X,
  Store,
  Hammer,
  Gift,
  Trophy,
  Utensils,
  Bot,
  Tag,
  Phone,
  Flame,
  CreditCard,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, currentUser } = useNfcStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMoreOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  const navLinkClass = (active: boolean) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
      active
        ? 'text-amber-400 bg-amber-400/10'
        : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#07070b]/92 backdrop-blur-xl border-b border-white/[0.08]">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
          ref={navRef}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/townraise-logo.png"
              alt="Townraise"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Simple Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/deals"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname?.startsWith('/deals')
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                  : 'text-orange-300 hover:bg-orange-500/15'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Deals &amp; Penny Finds</span>
            </Link>

            <Link href="/courier" className={navLinkClass(pathname === '/courier')}>
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Courier</span>
            </Link>

            <Link href="/custom-nfc" className={navLinkClass(pathname === '/custom-nfc')}>
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Free NFC Card</span>
            </Link>

            <Link href="/directory" className={navLinkClass(pathname === '/directory')}>
              <Store className="w-4 h-4 text-zinc-400" />
              <span>Businesses</span>
            </Link>

            {/* Single Clean "More" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={navLinkClass(moreOpen)}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`}
                />
              </button>

              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 p-2 rounded-2xl bg-[#0c0c14] border border-white/10 shadow-2xl space-y-1 z-50">
                  <Link
                    href="/work"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    <Hammer className="w-4 h-4 text-emerald-400" />
                    <span>Contractors &amp; Trades</span>
                  </Link>
                  <Link
                    href="/menus"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    <Utensils className="w-4 h-4 text-orange-400" />
                    <span>Menus &amp; Local Eats</span>
                  </Link>
                  <Link
                    href="/marketplace"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>Local Marketplace</span>
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>Leaderboard &amp; Rewards</span>
                  </Link>
                  <Link
                    href="/ai-concierge"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-center gap-3 text-sm font-medium text-zinc-200 hover:text-white"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>AI Helper Bot</span>
                  </Link>
                  <div className="pt-1 mt-1 border-t border-white/10">
                    <Link
                      href="/create-storefront"
                      className="p-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 flex items-center gap-3 text-sm font-bold text-amber-300"
                    >
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span>Register Business (Free Card)</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:5085070305"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-200"
              title="Call or Text Sean Martin"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>(508) 507-0305</span>
            </a>

            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5"
              title="Sign In / Account"
            >
              <span>{currentUser?.avatar || '👤'}</span>
              <span className="hidden sm:inline max-w-[70px] truncate">
                {currentUser?.name.split(' ')[0] || 'Sign In'}
              </span>
            </button>

            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#08080e] border-t border-white/10 px-4 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/deals"
                className="col-span-2 p-3.5 rounded-2xl bg-orange-500/15 border border-orange-500/35 text-orange-200 flex items-center justify-between font-bold text-sm"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Local Deals &amp; Home Depot Penny Finds
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500 text-black font-black">
                  $0.01
                </span>
              </Link>

              <Link
                href="/courier"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>4x4 Courier</span>
              </Link>

              <Link
                href="/custom-nfc"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Free NFC Card</span>
              </Link>

              <Link
                href="/directory"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span>Businesses</span>
              </Link>

              <Link
                href="/work"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Hammer className="w-4 h-4 text-emerald-400" />
                <span>Contractors</span>
              </Link>

              <Link
                href="/leaderboard"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Leaderboard</span>
              </Link>

              <Link
                href="/ai-concierge"
                className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-semibold flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Helper</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <a
                href="tel:5085070305"
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs text-center"
              >
                📞 Call (508) 507-0305
              </a>
              <a
                href="sms:5085070305"
                className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs text-center"
              >
                💬 Text Sean
              </a>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
