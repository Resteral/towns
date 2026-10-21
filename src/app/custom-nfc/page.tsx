'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Store,
  Hammer,
  Gift,
  Trophy,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Wifi,
  Palette,
  Utensils,
  Wrench,
  Phone,
  MessageSquare,
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Star,
  Copy,
  Check
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig } from '@/lib/types';
import confetti from 'canvas-confetti';

const CARD_THEMES: {
  id: NonNullable<NfcCardConfig['cardTheme']>;
  name: string;
  bgClass: string;
  borderClass: string;
  accentDefault: string;
  badgeText: string;
}[] = [
  {
    id: 'matte_obsidian',
    name: 'Matte Obsidian Black',
    bgClass: 'bg-gradient-to-br from-zinc-900 via-[#09090e] to-black',
    borderClass: 'border-amber-400/40',
    accentDefault: '#f59e0b',
    badgeText: 'Obsidian Stealth'
  },
  {
    id: 'gold_foil',
    name: 'Brushed Gold Executive',
    bgClass: 'bg-gradient-to-br from-amber-950/90 via-[#171206] to-black',
    borderClass: 'border-amber-300/60',
    accentDefault: '#fbbf24',
    badgeText: '24K Gold Foil'
  },
  {
    id: 'emerald_neon',
    name: 'Pine & Emerald Matrix',
    bgClass: 'bg-gradient-to-br from-emerald-950/90 via-[#07140f] to-black',
    borderClass: 'border-emerald-400/50',
    accentDefault: '#10b981',
    badgeText: 'NH Pine Edition'
  },
  {
    id: 'indigo_cyber',
    name: 'Cyber Indigo Pulse',
    bgClass: 'bg-gradient-to-br from-indigo-950/90 via-[#0b0b1a] to-black',
    borderClass: 'border-indigo-400/50',
    accentDefault: '#6366f1',
    badgeText: 'Indigo Horizon'
  },
  {
    id: 'crimson_velvet',
    name: 'Crimson Artisan Roast',
    bgClass: 'bg-gradient-to-br from-rose-950/90 via-[#17090d] to-black',
    borderClass: 'border-rose-400/50',
    accentDefault: '#f43f5e',
    badgeText: 'Crimson Reserve'
  }
];

const DEFAULT_BUSINESS_MENU = [
  {
    id: 'item-1',
    name: 'House Signature Special',
    description: 'Freshly prepared local favorite made to order daily.',
    price: '$14.99',
    category: 'Popular',
    badge: 'Best Seller'
  },
  {
    id: 'item-2',
    name: 'Artisan Combo & Drink',
    description: 'Includes your choice of side and house-brewed beverage.',
    price: '$11.50',
    category: 'Combos',
    badge: 'Fan Favorite'
  },
  {
    id: 'item-3',
    name: 'Local Loyalty Treat',
    description: 'Free with 100 Next-Visit NFC Tap Points!',
    price: 'FREE (100 Pts)',
    category: 'Rewards',
    badge: 'NFC Perk'
  }
];

const DEFAULT_CONTRACTOR_MENU = [
  {
    id: 'srv-1',
    name: 'On-Site Estimate & Consultation',
    description: 'Full project walkthrough, material estimate & timeline.',
    price: 'FREE Estimate',
    category: 'Consultation',
    badge: 'Fast Response'
  },
  {
    id: 'srv-2',
    name: 'Standard Service Call / Repair',
    description: 'Licensed & insured local trade work across Carroll County.',
    price: 'From $95',
    category: 'Service Call',
    badge: 'Verified Pro'
  },
  {
    id: 'srv-3',
    name: 'Seasonal Maintenance & Emergency Dispatch',
    description: 'Priority scheduling for repeat NFC card holders.',
    price: 'Custom Quote',
    category: 'Priority',
    badge: '10% NFC Discount'
  }
];

function CustomNfcStudioContent() {
  const searchParams = useSearchParams();
  const cardIdParam = searchParams?.get('cardId');
  const roleParam = searchParams?.get('role');

  const {
    cards,
    addCard,
    updateCard,
    towns,
    activeTown,
    playDeliveryChime
  } = useNfcStore();

  // Select either an existing card or 'new'
  const [selectedCardId, setSelectedCardId] = useState<string>(cardIdParam || 'new');

  // Role: Business/Restaurant vs Contractor/Trade
  const [entityRole, setEntityRole] = useState<'business' | 'contractor'>(
    roleParam === 'contractor' ? 'contractor' : 'business'
  );

  // Card Design & Identity State
  const [businessName, setBusinessName] = useState('Province Lake Diner & Bakery');
  const [town, setTown] = useState(activeTown?.fullName || 'Effingham, NH');
  const [contactPhone, setContactPhone] = useState('(603) 539-5500');
  const [logoEmoji, setLogoEmoji] = useState('🍕');
  const [cardTheme, setCardTheme] = useState<NonNullable<NfcCardConfig['cardTheme']>>('matte_obsidian');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b');
  const [cardTagline, setCardTagline] = useState('Tap for Our Live Menu, Next-Visit Rewards & Leaderboard XP!');
  const [customHeadline, setCustomHeadline] = useState('How was your experience with us today?');

  // Menu / Contractor Services Showcase State
  const [showcaseTitle, setShowcaseTitle] = useState('Featured Menu & Specials');
  const [showcaseItems, setShowcaseItems] = useState(DEFAULT_BUSINESS_MENU);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');

  // Reward & Leaderboard Program State
  const [visitPointsPerTap, setVisitPointsPerTap] = useState(25);
  const [nextVisitRewardGoal, setNextVisitRewardGoal] = useState(100);
  const [nextVisitRewardTitle, setNextVisitRewardTitle] = useState('$10.00 Off or Free Specialty Item on Your Next Visit');
  const [nextVisitPromoCode, setNextVisitPromoCode] = useState('NEXT-VISIT10');
  const [leaderboardXpPerTap, setLeaderboardXpPerTap] = useState(50);
  const [bonusReviewPoints, setBonusReviewPoints] = useState(25);

  // Saved confirmation state
  const [savedCardId, setSavedCardId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load card if existing card is chosen
  useEffect(() => {
    if (selectedCardId && selectedCardId !== 'new') {
      const existing = cards.find(c => c.id === selectedCardId);
      if (existing) {
        setEntityRole(existing.entityRole || 'business');
        setBusinessName(existing.businessName);
        setTown(existing.town || 'Effingham, NH');
        setContactPhone(existing.contactPhone || '(603) 539-5500');
        setLogoEmoji(existing.logoUrl || '🏪');
        setCardTheme(existing.cardTheme || 'matte_obsidian');
        setPrimaryColor(existing.primaryColor || '#f59e0b');
        setCardTagline(existing.cardTagline || `Tap for ${existing.businessName} Menu & Rewards`);
        setCustomHeadline(existing.customHeadline || `How was your visit to ${existing.businessName}?`);
        setShowcaseTitle(existing.showcaseTitle || (existing.entityRole === 'contractor' ? 'Contractor Services & Rates' : 'Featured Menu & Specials'));
        if (existing.showcaseItems && existing.showcaseItems.length > 0) {
          setShowcaseItems(existing.showcaseItems.map(i => ({
            id: i.id,
            name: i.name,
            description: i.description,
            price: i.price,
            category: i.category || 'Featured',
            badge: i.badge || 'Popular'
          })));
        }
        setVisitPointsPerTap(existing.visitPointsPerTap || 25);
        setNextVisitRewardGoal(existing.nextVisitRewardGoal || 100);
        setNextVisitRewardTitle(existing.nextVisitRewardTitle || '$10.00 Off or Free Specialty Item on Your Next Visit');
        setNextVisitPromoCode(existing.nextVisitPromoCode || 'NEXT-VISIT');
        setLeaderboardXpPerTap(existing.leaderboardXpPerTap || 50);
        setBonusReviewPoints(existing.bonusReviewPoints || 25);
        setSavedCardId(existing.id);
      }
    }
  }, [selectedCardId, cards]);

  // Switch presets when toggling between Business and Contractor on a new card
  const handleSelectRole = (role: 'business' | 'contractor') => {
    setEntityRole(role);
    if (selectedCardId === 'new') {
      if (role === 'contractor') {
        setBusinessName('Carroll County Custom Carpentry & Plowing');
        setLogoEmoji('🔨');
        setCardTheme('gold_foil');
        setPrimaryColor('#fbbf24');
        setCardTagline('Tap to View Services, Request a Free Quote & Earn Repeat-Client Rewards!');
        setShowcaseTitle('Trade Services & Estimate Menu');
        setShowcaseItems(DEFAULT_CONTRACTOR_MENU);
        setNextVisitRewardTitle('$50.00 Off Your Next Project or Priority Seasonal Dispatch');
        setNextVisitPromoCode('TRADE-VIP50');
      } else {
        setBusinessName('Province Lake Diner & Bakery');
        setLogoEmoji('🍕');
        setCardTheme('matte_obsidian');
        setPrimaryColor('#f59e0b');
        setCardTagline('Tap for Our Live Menu, Next-Visit Rewards & Leaderboard XP!');
        setShowcaseTitle('Featured Menu & Specials');
        setShowcaseItems(DEFAULT_BUSINESS_MENU);
        setNextVisitRewardTitle('$10.00 Off or Free Specialty Item on Your Next Visit');
        setNextVisitPromoCode('NEXT-VISIT10');
      }
    }
  };

  const handleAddShowcaseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const item = {
      id: `item-${Date.now().toString(36)}`,
      name: newItemName.trim(),
      description: newItemDesc.trim() || (entityRole === 'contractor' ? 'Licensed local service with fast scheduling.' : 'Freshly prepared with local ingredients.'),
      price: newItemPrice.trim() || (entityRole === 'contractor' ? 'Free Quote' : '$12.00'),
      category: entityRole === 'contractor' ? 'Service' : 'Menu',
      badge: newItemBadge.trim() || 'Featured'
    };
    setShowcaseItems(prev => [...prev, item]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemBadge('');
  };

  const handleRemoveShowcaseItem = (id: string) => {
    setShowcaseItems(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveFreeCard = () => {
    if (!businessName.trim()) return;

    const payload: Omit<NfcCardConfig, 'id' | 'totalTaps' | 'googleConversions' | 'privateFeedbacksCount' | 'createdAt'> = {
      cardName: `${businessName.trim()} — Free Custom ${entityRole === 'contractor' ? 'Contractor' : 'Business'} NFC Card`,
      businessName: businessName.trim(),
      profileType: 'loyalty_rewards',
      entityRole,
      cardTheme,
      cardTagline: cardTagline.trim(),
      showcaseTitle: showcaseTitle.trim(),
      showcaseItems,
      isFreeRegistrationCard: true,
      hardwareFormFactor: 'pvc_card',
      chipType: 'NTAG215',
      contactPhone: contactPhone.trim(),
      googleReviewUrl: `https://www.google.com/search?q=${encodeURIComponent(`${businessName.trim()} ${town}`)}`,
      mode: 'smart_funnel',
      thresholdStars: 4,
      rewardProgramActive: true,
      visitPointsPerTap: Number(visitPointsPerTap) || 25,
      nextVisitRewardGoal: Number(nextVisitRewardGoal) || 100,
      nextVisitRewardTitle: nextVisitRewardTitle.trim(),
      nextVisitPromoCode: nextVisitPromoCode.trim().toUpperCase(),
      leaderboardXpPerTap: Number(leaderboardXpPerTap) || 50,
      bonusReviewPoints: Number(bonusReviewPoints) || 25,
      customHeadline: customHeadline.trim(),
      logoUrl: logoEmoji || '🏪',
      primaryColor,
      assignedLocation: town,
      active: true,
      town
    };

    if (selectedCardId !== 'new' && cards.some(c => c.id === selectedCardId)) {
      updateCard(selectedCardId, payload);
      setSavedCardId(selectedCardId);
    } else {
      const created = addCard(payload);
      setSelectedCardId(created.id);
      setSavedCardId(created.id);
    }

    playDeliveryChime();
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const activeThemeObj = CARD_THEMES.find(t => t.id === cardTheme) || CARD_THEMES[0];
  const visitsNeeded = Math.max(1, Math.ceil((nextVisitRewardGoal || 100) / (visitPointsPerTap || 25)));
  const previewTapUrl = savedCardId ? `/tap/${savedCardId}` : `/tap/${cards[0]?.id || 'card-smoke-world-1'}`;

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Top Announcement Hero */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-black uppercase tracking-widest">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>100% Free Custom NFC Card Included for Every Registered Business & Contractor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight">
            Customize Your <span className="text-amber-400">Free NFC Reward & Menu Card</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Every registered local business, restaurant, and contractor receives a <strong className="text-white">Free Custom NFC Card</strong>. Customize it right here on the site to showcase your <strong className="text-amber-300">live menu or contractor services</strong>, reward customers with <strong className="text-emerald-300">points toward their next visit</strong>, and award <strong className="text-indigo-300">Website Leaderboard XP</strong> on every tap!
          </p>

          {/* Role Toggle Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleSelectRole('business')}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                entityRole === 'business'
                  ? 'bg-amber-400 text-black border-amber-300 shadow-xl shadow-amber-400/20 scale-105'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>🏪 Restaurant / Local Shop Card</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('contractor')}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
                entityRole === 'contractor'
                  ? 'bg-amber-400 text-black border-amber-300 shadow-xl shadow-amber-400/20 scale-105'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>🔨 Contractor / Trade Service Card</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 7 COLUMNS: ON-SITE CARD & REWARDS CUSTOMIZER */}
          <div className="lg:col-span-7 space-y-6">

            {/* Card Selector Bar */}
            <div className="p-5 rounded-3xl bg-[#0d0d14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  Select Card Profile to Customize
                </span>
                <h2 className="text-sm font-black uppercase text-white">
                  Design New Free Card or Edit Existing Business Card
                </h2>
              </div>

              <select
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="new">✨ Create New Free Business / Contractor Card</option>
                {cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.logoUrl || '🏪'} {c.businessName} ({c.town || 'NH'})
                  </option>
                ))}
              </select>
            </div>

            {/* Section 1: Brand Identity & Card Appearance */}
            <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    1. Customize Card Appearance & Identity
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                  FREE REGISTERED PERK
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    {entityRole === 'contractor' ? 'Contractor / Trade Business Name *' : 'Restaurant / Business Name *'}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={entityRole === 'contractor' ? 'e.g. White Mountain Carpentry & Plowing' : 'e.g. Freedom Village Store & Deli'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Town / Service Area
                  </label>
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {towns.map((t) => (
                      <option key={t.id} value={t.fullName}>
                        {t.icon} {t.fullName}
                      </option>
                    ))}
                    <option value="Carroll County, NH">🌲 All Carroll County, NH</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Call or Text Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(603) 555-0199"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Card Icon / Logo Emoji
                  </label>
                  <input
                    type="text"
                    value={logoEmoji}
                    onChange={(e) => setLogoEmoji(e.target.value)}
                    placeholder="🍕 or 🔨"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-base text-center text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Brand Glow Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">
                    Card Surface Finish
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {CARD_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setCardTheme(theme.id);
                          setPrimaryColor(theme.accentDefault);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          cardTheme === theme.id
                            ? 'border-amber-400 bg-amber-400/15 text-white shadow-md'
                            : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-full h-5 rounded-md mb-1.5 ${theme.bgClass} border ${theme.borderClass}`} />
                        <span className="text-[10px] font-bold block leading-tight">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Card Front Tagline / Call-to-Action
                  </label>
                  <input
                    type="text"
                    value={cardTagline}
                    onChange={(e) => setCardTagline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Menu / Contractor Services Showcase Builder */}
            <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  {entityRole === 'contractor' ? (
                    <Wrench className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Utensils className="w-4 h-4 text-amber-400" />
                  )}
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    2. {entityRole === 'contractor' ? 'Showcase Your Trade Services & Rates' : 'Showcase Your Menu & Featured Items'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{showcaseItems.length} Items on Card</span>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Showcase Section Title on Customer Tap Screen
                </label>
                <input
                  type="text"
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Add Item Mini-Form */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  + Add {entityRole === 'contractor' ? 'Service / Estimate Option' : 'Menu Dish / Product'} to Your NFC Card
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={entityRole === 'contractor' ? 'e.g. Driveway Plowing / Deck Repair' : 'e.g. Maple Bacon Waffle / Large Pizza'}
                    className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder={entityRole === 'contractor' ? 'Price / Free Quote' : 'Price (e.g. $12.99)'}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Short description..."
                    className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddShowcaseItem}
                    disabled={!newItemName.trim()}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Card</span>
                  </button>
                </div>
              </div>

              {/* Current Showcase Items List */}
              <div className="space-y-2">
                {showcaseItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-xs font-mono font-black text-amber-400">{item.price}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 text-[9px] font-mono font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveShowcaseItem(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Next-Visit Rewards & Website Leaderboard Points */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0d0d14] to-indigo-500/10 border border-amber-400/30 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    3. Customize Customer Rewards & Website Leaderboard Points
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold">
                  {visitsNeeded} {visitsNeeded === 1 ? 'Tap' : 'Taps'} = Reward Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-amber-300 block mb-1">
                    Next-Visit Points Awarded Per Tap
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    step={5}
                    value={visitPointsPerTap}
                    onChange={(e) => setVisitPointsPerTap(parseInt(e.target.value, 10) || 25)}
                    className="w-full bg-black/50 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-amber-300 block mb-1">
                    Points Goal to Unlock Next-Visit Reward
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={1000}
                    step={25}
                    value={nextVisitRewardGoal}
                    onChange={(e) => setNextVisitRewardGoal(parseInt(e.target.value, 10) || 100)}
                    className="w-full bg-black/50 border border-amber-400/30 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono uppercase text-amber-300 block mb-1">
                    Custom Next-Visit / Repeat-Client Reward Perk
                  </label>
                  <input
                    type="text"
                    value={nextVisitRewardTitle}
                    onChange={(e) => setNextVisitRewardTitle(e.target.value)}
                    placeholder="e.g. $10.00 Off Next Order or Free Appetizer"
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-indigo-300 block mb-1">
                    Website Leaderboard XP Per Tap
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    step={10}
                    value={leaderboardXpPerTap}
                    onChange={(e) => setLeaderboardXpPerTap(parseInt(e.target.value, 10) || 50)}
                    className="w-full bg-black/50 border border-indigo-400/30 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-indigo-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-emerald-300 block mb-1">
                    Redemption Voucher Code
                  </label>
                  <input
                    type="text"
                    value={nextVisitPromoCode}
                    onChange={(e) => setNextVisitPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-black/50 border border-emerald-400/30 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-emerald-300 uppercase"
                  />
                </div>
              </div>

              {/* Save & Claim Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveFreeCard}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Save & Activate My Free Custom NFC Card</span>
                </button>
              </div>

              {savedCardId && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Your Custom NFC Card Is Live on the Site!</span>
                    </div>
                    <Link
                      href={`/tap/${savedCardId}`}
                      className="text-xs font-black text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open Live Tap Screen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/tap/${savedCardId}`;
                        navigator.clipboard.writeText(url);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied Tap Link!' : 'Copy NFC Card Link'}</span>
                    </button>

                    <Link
                      href="/dashboard/programmer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Write to Physical NFC Card</span>
                    </Link>

                    <a
                      href={`sms:5085070305?body=${encodeURIComponent(`Hi Sean! I just customized my FREE NFC Card for ${businessName} (${town}). Can you drop off my physical card?`)}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-black flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Text Sean for Free Physical Card Drop-Off (508) 507-0305</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: LIVE PHYSICAL CARD + CUSTOMER TAP PREVIEW */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">

            {/* 1. Physical Custom NFC Card Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Live Physical NFC Card Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  1st Card 100% FREE
                </span>
              </div>

              <div
                className={`relative rounded-[2rem] p-6 sm:p-7 border-2 ${activeThemeObj.bgClass} ${activeThemeObj.borderClass} shadow-2xl overflow-hidden transition-all duration-300`}
                style={{
                  boxShadow: `0 20px 60px -15px ${primaryColor}35`
                }}
              >
                {/* Ambient Glow */}
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none"
                  style={{ backgroundColor: primaryColor }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Top Row: Brand Logo + NFC Wave Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/15 shadow-lg"
                        style={{ backgroundColor: `${primaryColor}25` }}
                      >
                        {logoEmoji || '🏪'}
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                          {entityRole === 'contractor' ? '🔨 Verified Contractor NFC' : '🍽️ Official Menu & Rewards NFC'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tight text-white mt-1 leading-tight">
                          {businessName || 'Your Business Name'}
                        </h3>
                        <p className="text-[11px] font-mono text-zinc-400">{town}</p>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                      <Wifi className="w-5 h-5 rotate-90" />
                    </div>
                  </div>

                  {/* Middle Tagline */}
                  <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                    {cardTagline}
                  </p>

                  {/* Reward & Leaderboard Badges on Card */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 block">Every Tap Gives</span>
                      <span className="text-xs font-black text-amber-400">
                        +{visitPointsPerTap} Next-Visit Pts
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 block">Site Leaderboard</span>
                      <span className="text-xs font-black text-indigo-300">
                        +{leaderboardXpPerTap} Rank XP
                      </span>
                    </div>
                  </div>

                  {/* Bottom Bar: Call/Text + Tap Prompt */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-300 font-bold">
                      📞 Call or Text: {contactPhone}
                    </span>
                    <span className="text-amber-400 font-black uppercase tracking-wider">
                      TAP PHONE HERE →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Live Customer Phone Tap Experience Preview */}
            <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Interactive Tap Preview
                  </span>
                  <h4 className="text-xs font-black uppercase text-white">
                    What Customers See When They Tap Your Card
                  </h4>
                </div>
                <Link
                  href={previewTapUrl}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] uppercase tracking-wider flex items-center gap-1"
                >
                  <span>Test Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Mini Simulated Phone Screen */}
              <div className="p-4 rounded-2xl bg-[#07070b] border border-white/10 space-y-4">
                {/* Reward Progress Preview */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-indigo-500/15 border border-amber-400/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-amber-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Next-Visit Reward Goal
                    </span>
                    <span className="font-mono font-black text-white">
                      {visitPointsPerTap} / {nextVisitRewardGoal} PTS
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                      style={{ width: `${Math.min(100, Math.round((visitPointsPerTap / nextVisitRewardGoal) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    🎁 Unlocks: <strong className="text-white">{nextVisitRewardTitle}</strong>
                  </p>
                </div>

                {/* Showcased Menu / Services Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-amber-400">
                      {entityRole === 'contractor' ? '🔨' : '🍽️'} {showcaseTitle}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">{showcaseItems.length} Listed</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {showcaseItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                          <span className="text-[10px] text-zinc-400 block truncate">{item.description}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-400 shrink-0">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Call or Text Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${contactPhone.replace(/[^0-9]/g, '')}`}
                    className="py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-[10px] uppercase text-center flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call {businessName.split(' ')[0]}</span>
                  </a>
                  <a
                    href={`sms:${contactPhone.replace(/[^0-9]/g, '')}`}
                    className="py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black text-[10px] uppercase text-center flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Text {businessName.split(' ')[0]}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function CustomNfcPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709] text-white flex items-center justify-center">Loading Free NFC Card Studio...</div>}>
      <CustomNfcStudioContent />
    </Suspense>
  );
}
