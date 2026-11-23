'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { loadLocalDeals, LocalShoppingDeal } from '@/lib/deals-data';
import {
  ArrowRight,
  Flame,
  Truck,
  CreditCard,
  Trophy,
  Phone,
  MessageSquare,
  Store,
  Hammer,
  MapPin,
  Bot,
  Tag,
} from 'lucide-react';

export default function HomePage() {
  const { cards } = useNfcStore();
  const [deals, setDeals] = useState<LocalShoppingDeal[]>([]);

  useEffect(() => {
    setDeals(loadLocalDeals());
  }, []);

  const featuredDeals = useMemo(() => {
    const pennyDeals = deals.filter((d) => d.pennyStage === 'penny_01').slice(0, 2);
    const localDeals = deals.filter((d) => d.category !== 'home_depot_penny').slice(0, 2);
    return [...pennyDeals, ...localDeals];
  }, [deals]);

  const activeCards = useMemo(() => cards.filter((c) => c.active).slice(0, 3), [cards]);

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      {/* 1. CLEAN HERO + INSTANT ACTION TILES */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold">
            <span>🌲 Carroll County, NH • Effingham • Ossipee • Conway • Wolfeboro</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
            Local Deals, 4x4 Delivery &amp;{' '}
            <span className="text-amber-400">Free NFC Rewards</span>
          </h1>

          <p className="text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Shop Home Depot <strong className="text-orange-300">$0.01 penny deals</strong> &amp; local area discounts, book fast local pickups with Sean Martin, or claim a free custom NFC card for your business or trade.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>🛒 Shop Groceries &amp; Stores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/deals"
              className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Flame className="w-4 h-4" />
              <span>Local &amp; Penny Deals</span>
            </Link>
            <a
              href="tel:5085070305"
              className="px-5 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call (508) 507-0305</span>
            </a>
            <a
              href="sms:5085070305"
              className="px-5 py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-bold text-sm transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Text Sean</span>
            </a>
          </div>
        </div>

        {/* 4 Simple Quick-Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/deals"
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/15 to-[#0c0c12] border border-orange-500/30 hover:border-orange-400 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div className="font-bold text-white group-hover:text-orange-300 transition-colors">
              Local &amp; Penny Deals
            </div>
            <p className="text-xs text-zinc-400">
              Home Depot $0.01 SKUs, Hannaford, Tractor Supply &amp; local clearance.
            </p>
          </Link>

          <Link
            href="/courier"
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-[#0c0c12] border border-emerald-500/30 hover:border-emerald-400 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              4x4 Courier &amp; Pickup
            </div>
            <p className="text-xs text-zinc-400">
              Same-day pickup from any local store, restaurant, or hardware counter.
            </p>
          </Link>

          <Link
            href="/custom-nfc"
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 to-[#0c0c12] border border-amber-500/30 hover:border-amber-400 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
              Free Custom NFC Card
            </div>
            <p className="text-xs text-zinc-400">
              Customize your free business or contractor card with menu &amp; rewards.
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-[#0c0c12] border border-indigo-500/30 hover:border-indigo-400 transition-all group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
              Leaderboard &amp; XP
            </div>
            <p className="text-xs text-zinc-400">
              Earn Next-Visit points &amp; climb the Carroll County rewards ladder.
            </p>
          </Link>
        </div>
      </section>

      {/* 2. HOT DEALS PREVIEW: HOME DEPOT PENNY DEALS & LOCAL SHOPPING */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Hot Local Deals &amp; <span className="text-orange-400">Home Depot Penny Finds</span>
            </h2>
            <p className="text-sm text-zinc-400">
              Updated by local shoppers — tap any deal to copy SKUs or see full store tips.
            </p>
          </div>
          <Link
            href="/deals"
            className="text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 shrink-0"
          >
            <span>See all {deals.length} deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredDeals.map((deal) => {
            const isPenny = deal.pennyStage === 'penny_01';
            return (
              <Link
                key={deal.id}
                href="/deals"
                className={`p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all ${
                  isPenny
                    ? 'bg-orange-500/[0.08] border-orange-500/30 hover:border-orange-400'
                    : 'bg-[#0c0c12] border-white/10 hover:border-amber-400/40'
                }`}
              >
                <div className="space-y-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      isPenny
                        ? 'bg-orange-500 text-black'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {deal.savingsBadge}
                  </span>
                  <h3 className="font-bold text-white leading-snug">{deal.title}</h3>
                  <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>{deal.storeName}</span>
                    <span className="flex items-center gap-0.5 text-zinc-300">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {deal.town}
                    </span>
                    {deal.sku && (
                      <span className="font-mono text-orange-300">SKU: {deal.sku}</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-2xl font-black ${
                      isPenny ? 'text-orange-400' : 'text-emerald-400'
                    }`}
                  >
                    ${deal.dealPrice.toFixed(2)}
                  </div>
                  {deal.originalPrice > deal.dealPrice && (
                    <div className="text-xs text-zinc-500 line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FOR BUSINESSES & CONTRACTORS (SIMPLE 2-CARD SECTION) */}
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Free NFC Card for Every Local Business &amp; Contractor
          </h2>
          <p className="text-sm text-zinc-400">
            Zero commissions. Showcase your menu or services, reward repeat visits, and boost your Google reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-amber-400/25 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Restaurants, Shops &amp; Cafes
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Register your storefront and customize your Free NFC Card right on the site — display your digital menu, offer Next-Visit Reward points, and award Website Leaderboard XP.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/create-storefront"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5"
              >
                <span>Register Business</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/custom-nfc"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-bold text-xs"
              >
                Customize Free Card
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c0c12] border border-emerald-400/25 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Contractors &amp; Local Trades
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Carpenters, plow drivers, landscapers, mechanics, and builders — list your services, claim local job leads, and get a Free Custom Contractor NFC Card for estimates &amp; repeat-client rewards.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/work"
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs flex items-center gap-1.5"
              >
                <span>Join as Contractor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/custom-nfc?role=contractor"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 font-bold text-xs"
              >
                Customize Contractor Card
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIMPLE COURIER & AI ASSISTANT BANNER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0d0d14] to-amber-950/30 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Truck className="w-4 h-4" />
            <span>Sean Martin 4x4 Local Courier</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            Need Groceries, Hardware, or Takeout Delivered?
          </h2>
          <p className="text-sm text-zinc-300">
            Order ahead at any local store — including Hannaford, Home Depot, Tractor Supply, or your favorite takeout spot — and Sean will pick it up and deliver it right to your door.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/courier"
            className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Book Pickup</span>
          </Link>
          <Link
            href="/ai-concierge"
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Ask AI Helper</span>
          </Link>
        </div>
      </section>

      {/* 5. ACTIVE NFC REWARD CARDS (COMPACT LIVE LIST) */}
      {activeCards.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Active Local NFC Reward Cards</span>
            </h2>
            <Link href="/custom-nfc" className="text-xs font-bold text-amber-400 hover:underline">
              Create Yours Free →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeCards.map((card) => (
              <Link
                key={card.id}
                href={`/tap/${card.id}`}
                className="p-4 rounded-2xl bg-[#0c0c12] border border-white/10 hover:border-amber-400/40 transition-all space-y-1.5"
              >
                <div className="text-xs font-bold text-amber-300">
                  {card.entityRole === 'contractor' ? '🔨 Contractor Card' : '🏪 Business Card'}
                </div>
                <div className="font-bold text-white">{card.businessName}</div>
                <div className="text-xs text-zinc-400 line-clamp-2">
                  {card.nextVisitRewardTitle || 'Tap for Next-Visit Rewards & Leaderboard XP'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
