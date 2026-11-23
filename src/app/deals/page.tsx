'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  loadLocalDeals,
  saveLocalDeals,
  LocalShoppingDeal,
  DealCategory,
  PennyStage,
} from '@/lib/deals-data';
import { useNfcStore } from '@/lib/store';
import {
  Search,
  Tag,
  Copy,
  Check,
  ThumbsUp,
  Plus,
  ExternalLink,
  Truck,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Info,
  X,
} from 'lucide-react';

const CATEGORY_TABS: { id: 'all' | DealCategory; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Deals', emoji: '🔥' },
  { id: 'home_depot_penny', label: 'Home Depot Penny ($0.01)', emoji: '🪙' },
  { id: 'grocery', label: 'Groceries', emoji: '🛒' },
  { id: 'hardware', label: 'Hardware & Farm', emoji: '🔧' },
  { id: 'clearance', label: 'Clearance', emoji: '🏷️' },
  { id: 'local_shop', label: 'Local & Outlets', emoji: '🛍️' },
];

const TOWNS = [
  'All Towns',
  'Conway',
  'Ossipee',
  'Effingham',
  'Wolfeboro',
  'Freedom',
  'Tamworth',
  'Wakefield',
];

export default function DealsPage() {
  const { cards } = useNfcStore();
  const [deals, setDeals] = useState<LocalShoppingDeal[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | DealCategory>('all');
  const [selectedTown, setSelectedTown] = useState<string>('All Towns');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSkuId, setCopiedSkuId] = useState<string | null>(null);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [showPennyGuide, setShowPennyGuide] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  // Post-a-deal form state
  const [formTitle, setFormTitle] = useState('');
  const [formStore, setFormStore] = useState('The Home Depot — North Conway');
  const [formTown, setFormTown] = useState('Conway');
  const [formCategory, setFormCategory] = useState<DealCategory>('home_depot_penny');
  const [formPennyStage, setFormPennyStage] = useState<PennyStage>('penny_01');
  const [formSku, setFormSku] = useState('');
  const [formAisle, setFormAisle] = useState('');
  const [formOrigPrice, setFormOrigPrice] = useState('19.99');
  const [formDealPrice, setFormDealPrice] = useState('0.01');
  const [formDescription, setFormDescription] = useState('');
  const [formPostedBy, setFormPostedBy] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setDeals(loadLocalDeals());
  }, []);

  const pennyCount = useMemo(
    () => deals.filter((d) => d.category === 'home_depot_penny').length,
    [deals]
  );

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesCat = activeCategory === 'all' || deal.category === activeCategory;
      const matchesTown =
        selectedTown === 'All Towns' ||
        deal.town.toLowerCase() === selectedTown.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.storeName.toLowerCase().includes(q) ||
        deal.town.toLowerCase().includes(q) ||
        (deal.sku && deal.sku.toLowerCase().includes(q)) ||
        deal.description.toLowerCase().includes(q);
      return matchesCat && matchesTown && matchesSearch;
    });
  }, [deals, activeCategory, selectedTown, searchQuery]);

  const handleCopySku = (dealId: string, sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSkuId(dealId);
    setTimeout(() => setCopiedSkuId(null), 1800);
  };

  const handleConfirmDeal = (dealId: string) => {
    if (upvotedIds[dealId]) return;
    const updated = deals.map((d) =>
      d.id === dealId ? { ...d, verifiedCount: d.verifiedCount + 1 } : d
    );
    setDeals(updated);
    saveLocalDeals(updated);
    setUpvotedIds((prev) => ({ ...prev, [dealId]: true }));
  };

  const handleSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formStore.trim()) return;

    const origNum = parseFloat(formOrigPrice) || 0;
    const dealNum = parseFloat(formDealPrice) || 0;
    const isPenny = formCategory === 'home_depot_penny';

    let badge = 'LOCAL DEAL';
    if (isPenny && formPennyStage === 'penny_01') badge = '$0.01 PENNY DEAL';
    else if (isPenny && formPennyStage === 'drop_03') badge = '.03 WATCH (PENNY SOON)';
    else if (isPenny && formPennyStage === 'clearance_06') badge = '.06 CLEARANCE';
    else if (origNum > dealNum && origNum > 0) {
      const pct = Math.round(((origNum - dealNum) / origNum) * 100);
      badge = `${pct}% OFF`;
    }

    const cleanSku = formSku.trim();
    const newDeal: LocalShoppingDeal = {
      id: `deal-${Date.now()}`,
      title: formTitle.trim(),
      storeName: formStore.trim(),
      town: formTown,
      category: formCategory,
      pennyStage: isPenny ? formPennyStage : 'local_deal',
      sku: cleanSku || undefined,
      aisleOrBay: formAisle.trim() || undefined,
      originalPrice: origNum,
      dealPrice: dealNum,
      savingsBadge: badge,
      description:
        formDescription.trim() ||
        'Spotted locally by a Carroll County shopper. Check shelf & overhead clearance bays.',
      verifiedCount: 1,
      soldOutCount: 0,
      postedBy: formPostedBy.trim() || 'Local Shopper',
      postedAt: 'Just now',
      externalUrl:
        isPenny && cleanSku
          ? `https://www.homedepot.com/s/${encodeURIComponent(cleanSku)}`
          : undefined,
    };

    const updated = [newDeal, ...deals];
    setDeals(updated);
    saveLocalDeals(updated);

    setFormTitle('');
    setFormSku('');
    setFormAisle('');
    setFormDescription('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowPostForm(false);
    }, 1400);
  };

  const activeNfcCards = useMemo(() => cards.filter((c) => c.active), [cards]);

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>Carroll County Deals + Home Depot $0.01 Penny Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Local Shopping Deals &amp; <span className="text-orange-400">Penny Finds</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Find Home Depot <strong className="text-orange-300">$0.01 penny SKUs</strong>, yellow-tag clearance, and weekly grocery &amp; hardware deals around Conway, Ossipee, Effingham, and Wolfeboro.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-amber-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Deal / Penny SKU</span>
          </button>
          <a
            href="sms:5085070305"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-sm transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Text Sean for Pickup</span>
          </a>
        </div>
      </div>

      {/* HOW HOME DEPOT PENNY DEALS WORK (COLLAPSIBLE) */}
      <div className="rounded-2xl bg-orange-500/[0.07] border border-orange-500/25 overflow-hidden">
        <button
          onClick={() => setShowPennyGuide(!showPennyGuide)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-orange-500/10 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🪙</span>
            <span className="text-sm font-bold text-orange-200">
              How Home Depot $0.01 Penny Deals Work (Quick 30-Second Guide)
            </span>
          </div>
          {showPennyGuide ? (
            <ChevronUp className="w-4 h-4 text-orange-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-orange-300" />
          )}
        </button>

        {showPennyGuide && (
          <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-orange-500/15 text-xs text-zinc-300">
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <div className="font-bold text-orange-300">1. Watch the Price Endings</div>
              <p className="text-zinc-400 leading-relaxed">
                Yellow clearance tags ending in <strong className="text-white">.06</strong> drop in ~6 weeks. Tags ending in <strong className="text-white">.03</strong> drop to <strong className="text-orange-400">$0.01</strong> in ~3 weeks.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <div className="font-bold text-orange-300">2. Check Overhead Bays &amp; Back of Hooks</div>
              <p className="text-zinc-400 leading-relaxed">
                Penny items are supposed to be pulled from shelves, so they are usually hiding in <strong className="text-white">top stock / overhead cartons</strong> or behind newer packaging. Match the exact 10-digit SKU!
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <div className="font-bold text-orange-300">3. Use Self-Checkout</div>
              <p className="text-zinc-400 leading-relaxed">
                Never ask an employee to pull a penny SKU (policy requires them to remove it). If you find it on the shelf yourself, scan it at <strong className="text-white">self-checkout</strong> — it rings up for <strong className="text-emerald-400">$0.01</strong>!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* POST A DEAL FORM */}
      {showPostForm && (
        <form
          onSubmit={handleSubmitDeal}
          className="p-6 rounded-2xl bg-[#0e0e16] border border-amber-400/30 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Share a Local Deal or Home Depot Penny Find</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowPostForm(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Item / Deal Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Ryobi 18V Battery 2-Pack or Hannaford Ground Beef"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Deal Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => {
                  const val = e.target.value as DealCategory;
                  setFormCategory(val);
                  if (val === 'home_depot_penny') {
                    setFormStore('The Home Depot — North Conway');
                    setFormDealPrice('0.01');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              >
                <option value="home_depot_penny">🪙 Home Depot Penny / Clearance</option>
                <option value="grocery">🛒 Grocery Deal</option>
                <option value="hardware">🔧 Hardware &amp; Farm</option>
                <option value="clearance">🏷️ Clearance</option>
                <option value="local_shop">🛍️ Local Shop / Outlet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formStore}
                onChange={(e) => setFormStore(e.target.value)}
                placeholder="e.g. The Home Depot — North Conway"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Town</label>
              <select
                value={formTown}
                onChange={(e) => setFormTown(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              >
                {TOWNS.filter((t) => t !== 'All Towns').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {formCategory === 'home_depot_penny' && (
              <div>
                <label className="block text-xs font-semibold text-orange-300 mb-1">
                  Home Depot Price Stage
                </label>
                <select
                  value={formPennyStage}
                  onChange={(e) => {
                    const st = e.target.value as PennyStage;
                    setFormPennyStage(st);
                    if (st === 'penny_01') setFormDealPrice('0.01');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-orange-500/30 text-sm text-white focus:border-orange-400 outline-none"
                >
                  <option value="penny_01">$0.01 Confirmed Penny Deal</option>
                  <option value="drop_03">.03 Clearance (Drops to $0.01 Soon)</option>
                  <option value="clearance_06">.06 Clearance (50%+ Off)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Sale / Penny Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formDealPrice}
                onChange={(e) => setFormDealPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Regular Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formOrigPrice}
                onChange={(e) => setFormOrigPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                SKU / Item # (Optional)
              </label>
              <input
                type="text"
                value={formSku}
                onChange={(e) => setFormSku(e.target.value)}
                placeholder="e.g. 1006482914"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Aisle / Overhead Bay (Optional)
              </label>
              <input
                type="text"
                value={formAisle}
                onChange={(e) => setFormAisle(e.target.value)}
                placeholder="e.g. Aisle 9 Top Stock"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={formPostedBy}
                onChange={(e) => setFormPostedBy(e.target.value)}
                placeholder="e.g. Sean Martin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Notes / Tips for Shoppers
              </label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Where in the store is it located? How many were left?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {submitSuccess && (
              <span className="text-sm font-bold text-emerald-400">
                ✓ Deal posted live!
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPostForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm"
            >
              Publish Deal Now
            </button>
          </div>
        </form>
      )}

      {/* SEARCH & FILTERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, stores, or Home Depot 10-digit SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400 outline-none"
            />
          </div>

          <select
            value={selectedTown}
            onChange={(e) => setSelectedTown(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white font-medium focus:border-amber-400 outline-none"
          >
            {TOWNS.map((t) => (
              <option key={t} value={t} className="bg-[#0b0b12]">
                📍 {t}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            const isPennyTab = tab.id === 'home_depot_penny';
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? isPennyTab
                      ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                      : 'bg-amber-400 text-black shadow-lg shadow-amber-500/15'
                    : isPennyTab
                    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20'
                    : 'bg-white/[0.04] border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {isPennyTab && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/25 text-[10px]">
                    {pennyCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DEALS GRID */}
      {filteredDeals.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
          <p className="text-lg font-bold text-white">No deals matched your filter</p>
          <p className="text-sm text-zinc-400">
            Try clearing your search or selecting &quot;All Towns&quot;, or post a new deal you spotted!
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedTown('All Towns');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDeals.map((deal) => {
            const isPenny = deal.pennyStage === 'penny_01';
            const isHomeDepot = deal.category === 'home_depot_penny';
            return (
              <div
                key={deal.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                  isPenny
                    ? 'bg-gradient-to-br from-orange-500/10 via-[#0d0d14] to-[#09090e] border-orange-500/35 hover:border-orange-400'
                    : 'bg-[#0c0c12] border-white/10 hover:border-amber-400/35'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: Badge & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide ${
                        isPenny
                          ? 'bg-orange-500 text-black'
                          : isHomeDepot
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {deal.savingsBadge}
                    </span>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-2xl font-black leading-none ${
                          isPenny ? 'text-orange-400' : 'text-emerald-400'
                        }`}
                      >
                        ${deal.dealPrice.toFixed(2)}
                      </div>
                      {deal.originalPrice > deal.dealPrice && (
                        <div className="text-xs text-zinc-500 line-through">
                          Reg. ${deal.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Store */}
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {deal.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-200">{deal.storeName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {deal.town}, NH
                      </span>
                      {deal.aisleOrBay && (
                        <span className="text-orange-300 font-medium">
                          • {deal.aisleOrBay}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Pro Tip */}
                  {deal.proTip && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-zinc-300 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{deal.proTip}</span>
                    </div>
                  )}

                  {/* SKU Box for Home Depot */}
                  {deal.sku && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => handleCopySku(deal.id, deal.sku!)}
                        className="px-3 py-1.5 rounded-lg bg-black/50 border border-orange-500/30 hover:border-orange-400 text-xs font-mono text-orange-200 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedSkuId === deal.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied {deal.sku}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-orange-400" />
                            <span>SKU: {deal.sku}</span>
                          </>
                        )}
                      </button>

                      {deal.externalUrl && (
                        <a
                          href={deal.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
                        >
                          <span>Check HomeDepot.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConfirmDeal(deal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        upvotedIds[deal.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>
                        {upvotedIds[deal.id] ? 'Confirmed' : 'Still Here'} ({deal.verifiedCount})
                      </span>
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      by {deal.postedBy} • {deal.postedAt}
                    </span>
                  </div>

                  <Link
                    href="/courier"
                    className="px-3 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Courier Pickup</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ACTIVE LOCAL BUSINESS NFC REWARD DEALS */}
      {activeNfcCards.length > 0 && (
        <section className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Local Business &amp; Contractor NFC Rewards</span>
            </h2>
            <Link
              href="/custom-nfc"
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Claim Free Business NFC Card →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeNfcCards.slice(0, 6).map((card) => (
              <Link
                key={card.id}
                href={`/tap/${card.id}`}
                className="p-4 rounded-2xl bg-[#0c0c12] border border-white/10 hover:border-amber-400/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {card.entityRole === 'contractor' ? '🔨 Contractor' : '🏪 Local Business'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    +{card.leaderboardXpPerTap || 50} XP
                  </span>
                </div>
                <div className="font-bold text-white">{card.businessName}</div>
                <div className="text-xs text-zinc-400">
                  {card.nextVisitRewardTitle || 'Tap in-store for Next-Visit Rewards'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
