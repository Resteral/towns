'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
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
  Phone,
  MessageSquare,
  Flame,
  Copy,
  Check,
  Upload,
  RotateCcw,
  Globe,
  Link2,
  Sparkles,
  QrCode,
  Printer,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig } from '@/lib/types';
import confetti from 'canvas-confetti';

type CardThemeId = NonNullable<NfcCardConfig['cardTheme']>;
type CardFontId = NonNullable<NfcCardConfig['cardFontStyle']>;
type CardPatternId = NonNullable<NfcCardConfig['cardPattern']>;
type HardwareType = NonNullable<NfcCardConfig['hardwareFormFactor']>;

const CARD_THEMES: {
  id: CardThemeId;
  name: string;
  bgClass: string;
  borderClass: string;
  accentDefault: string;
  swatch: string;
}[] = [
  {
    id: 'matte_obsidian',
    name: 'Matte Obsidian',
    bgClass: 'bg-gradient-to-br from-zinc-900 via-[#09090e] to-black',
    borderClass: 'border-amber-400/40',
    accentDefault: '#f59e0b',
    swatch: 'from-zinc-800 to-black',
  },
  {
    id: 'gold_foil',
    name: 'Brushed Gold',
    bgClass: 'bg-gradient-to-br from-amber-950/90 via-[#1a1407] to-black',
    borderClass: 'border-amber-300/60',
    accentDefault: '#fbbf24',
    swatch: 'from-amber-500 to-amber-900',
  },
  {
    id: 'emerald_neon',
    name: 'NH Pine Emerald',
    bgClass: 'bg-gradient-to-br from-emerald-950/90 via-[#071610] to-black',
    borderClass: 'border-emerald-400/50',
    accentDefault: '#10b981',
    swatch: 'from-emerald-500 to-emerald-950',
  },
  {
    id: 'indigo_cyber',
    name: 'Cyber Indigo',
    bgClass: 'bg-gradient-to-br from-indigo-950/90 via-[#0b0b1a] to-black',
    borderClass: 'border-indigo-400/50',
    accentDefault: '#6366f1',
    swatch: 'from-indigo-500 to-indigo-950',
  },
  {
    id: 'crimson_velvet',
    name: 'Crimson Reserve',
    bgClass: 'bg-gradient-to-br from-rose-950/90 via-[#1a090e] to-black',
    borderClass: 'border-rose-400/50',
    accentDefault: '#f43f5e',
    swatch: 'from-rose-500 to-rose-950',
  },
  {
    id: 'brushed_titanium',
    name: 'Brushed Titanium',
    bgClass: 'bg-gradient-to-br from-slate-700 via-slate-900 to-zinc-950',
    borderClass: 'border-slate-300/50',
    accentDefault: '#38bdf8',
    swatch: 'from-slate-400 to-slate-800',
  },
  {
    id: 'walnut_wood',
    name: 'Walnut Wood',
    bgClass: 'bg-gradient-to-br from-[#3b2314] via-[#21130b] to-[#0f0905]',
    borderClass: 'border-amber-500/45',
    accentDefault: '#d97706',
    swatch: 'from-amber-800 to-stone-950',
  },
];

const FONT_STYLES: { id: CardFontId; label: string; headingClass: string }[] = [
  { id: 'modern_bold', label: 'Modern Bold', headingClass: 'font-black italic uppercase tracking-tight' },
  { id: 'classic_serif', label: 'Classic Serif', headingClass: 'font-serif font-bold tracking-normal' },
  { id: 'clean_minimal', label: 'Clean Minimal', headingClass: 'font-bold tracking-tight' },
  { id: 'tech_mono', label: 'Tech Mono', headingClass: 'font-mono font-bold uppercase tracking-wider' },
];

const PATTERNS: { id: CardPatternId; label: string }[] = [
  { id: 'radial_glow', label: 'Radial Glow' },
  { id: 'carbon_mesh', label: 'Carbon Mesh' },
  { id: 'diagonal_stripes', label: 'Diagonal Lines' },
  { id: 'none', label: 'Clean Solid' },
];

const HARDWARE_OPTIONS: { id: HardwareType; label: string; emoji: string; desc: string }[] = [
  { id: 'pvc_card', label: 'PVC Tap Card', emoji: '💳', desc: 'Wallet-sized card' },
  { id: 'acrylic_stand', label: 'Counter Stand', emoji: '🪧', desc: 'For registers & tables' },
  { id: 'wood_plaque', label: 'Wood Plaque', emoji: '🪵', desc: 'Laser-engraved walnut' },
  { id: 'keychain_fob', label: 'Keychain Fob', emoji: '🔑', desc: 'For trucks & keys' },
];

const QUICK_EMOJIS = ['🍕', '☕', '🍔', '🔨', '🪵', '❄️', '🔧', '🏠', '🌿', '💈', '🛍️', '🚚'];

interface TemplatePreset {
  id: string;
  label: string;
  emoji: string;
  role: 'business' | 'contractor';
  businessName: string;
  theme: CardThemeId;
  color: string;
  tagline: string;
  showcaseTitle: string;
  rewardTitle: string;
  promoCode: string;
  items: { id: string; name: string; description: string; price: string; category: string; badge: string }[];
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: 'restaurant',
    label: 'Restaurant / Cafe',
    emoji: '🍕',
    role: 'business',
    businessName: 'Province Lake Diner & Bakery',
    theme: 'matte_obsidian',
    color: '#f59e0b',
    tagline: 'Tap for Our Live Menu, Next-Visit Rewards & Leaderboard XP!',
    showcaseTitle: 'Featured Menu & Specials',
    rewardTitle: '$10.00 Off or Free Specialty Item on Next Visit',
    promoCode: 'NEXT-VISIT10',
    items: [
      { id: 'r-1', name: 'House Signature Special', description: 'Freshly prepared local favorite made to order daily.', price: '$14.99', category: 'Popular', badge: 'Best Seller' },
      { id: 'r-2', name: 'Artisan Combo & Drink', description: 'Includes your choice of side and house-brewed beverage.', price: '$11.50', category: 'Combos', badge: 'Fan Favorite' },
      { id: 'r-3', name: 'Local Loyalty Treat', description: 'Free with 100 Next-Visit NFC Tap Points!', price: 'FREE (100 Pts)', category: 'Rewards', badge: 'NFC Perk' },
    ],
  },
  {
    id: 'contractor',
    label: 'Contractor / Builder',
    emoji: '🔨',
    role: 'contractor',
    businessName: 'White Mountain Carpentry & Remodeling',
    theme: 'walnut_wood',
    color: '#d97706',
    tagline: 'Tap to View Services, Request a Free Quote & Earn Repeat-Client Rewards!',
    showcaseTitle: 'Trade Services & Estimates',
    rewardTitle: '$50.00 Off Your Next Project or Priority Scheduling',
    promoCode: 'TRADE-VIP50',
    items: [
      { id: 'c-1', name: 'On-Site Estimate & Walkthrough', description: 'Full project estimate, material list & timeline.', price: 'FREE Estimate', category: 'Consultation', badge: 'Fast Response' },
      { id: 'c-2', name: 'Decks, Framing & Finish Carpentry', description: 'Licensed & insured Carroll County craftsmanship.', price: 'Custom Quote', category: 'Build', badge: 'Verified Pro' },
      { id: 'c-3', name: 'Standard Handyman Service Call', description: 'Priority scheduling for repeat NFC card holders.', price: 'From $95', category: 'Service', badge: '10% NFC Perk' },
    ],
  },
  {
    id: 'barber',
    label: 'Barber / Salon',
    emoji: '💈',
    role: 'business',
    businessName: 'North Country Cuts & Shave',
    theme: 'crimson_velvet',
    color: '#f43f5e',
    tagline: 'Tap to Book Your Next Cut, Earn Loyalty Points & Climb the Leaderboard!',
    showcaseTitle: 'Cuts, Fades & Grooming',
    rewardTitle: 'Free Haircut or Beard Trim on Your 5th Visit',
    promoCode: 'FRESH-CUT',
    items: [
      { id: 'b-1', name: 'Classic Haircut & Fade', description: 'Precision cut, hot towel finish & razor neck shave.', price: '$30.00', category: 'Hair', badge: 'Popular' },
      { id: 'b-2', name: 'Beard Trim & Lineup', description: 'Hot lather shaping and conditioning oil.', price: '$18.00', category: 'Beard', badge: 'Add-On' },
    ],
  },
  {
    id: 'shop',
    label: 'Shop / Farmstand',
    emoji: '🛍️',
    role: 'business',
    businessName: 'Effingham Country Store & Farmstand',
    theme: 'emerald_neon',
    color: '#10b981',
    tagline: 'Tap for Fresh Local Goods, Weekly Specials & Next-Visit Rewards!',
    showcaseTitle: 'Local Goods & Weekly Specials',
    rewardTitle: '15% Off Your Next Local Basket',
    promoCode: 'LOCAL15',
    items: [
      { id: 's-1', name: 'Pure NH Maple Syrup (Quart)', description: 'Locally tapped Grade A dark amber syrup.', price: '$19.99', category: 'Local', badge: 'NH Grown' },
      { id: 's-2', name: 'Fresh Sourdough & Farm Eggs Bundle', description: 'Baked fresh every morning with pasture-raised eggs.', price: '$13.50', category: 'Bundle', badge: 'Daily Drop' },
    ],
  },
  {
    id: 'plow',
    label: 'Plow / Landscaping',
    emoji: '❄️',
    role: 'contractor',
    businessName: 'Lakes Region Snow Plow & Lawn Care',
    theme: 'brushed_titanium',
    color: '#38bdf8',
    tagline: 'Tap for 24/7 Driveway Plowing, Sanding & Seasonal Property Maintenance!',
    showcaseTitle: 'Seasonal Services & Rates',
    rewardTitle: '1 Free Driveway Sanding or Spring Cleanup Credit',
    promoCode: 'SNOW-VIP',
    items: [
      { id: 'p-1', name: 'Driveway Plowing (Per Storm)', description: 'Reliable 4x4 storm clearing across Carroll County.', price: 'From $65', category: 'Winter', badge: '24/7 Storm' },
      { id: 'p-2', name: 'Lawn Mowing & Fall Cleanup', description: 'Weekly residential & lakehouse property care.', price: 'Free Quote', category: 'Summer', badge: 'Reliable' },
    ],
  },
];

function CustomNfcStudioContent() {
  const searchParams = useSearchParams();
  const cardIdParam = searchParams?.get('cardId');
  const roleParam = searchParams?.get('role');

  const { cards, addCard, updateCard, towns, activeTown, playDeliveryChime } = useNfcStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCardId, setSelectedCardId] = useState<string>(cardIdParam || 'new');
  const [activeTab, setActiveTab] = useState<'design' | 'menu' | 'rewards'>('design');
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  const [entityRole, setEntityRole] = useState<'business' | 'contractor'>(
    roleParam === 'contractor' ? 'contractor' : 'business'
  );
  const [businessName, setBusinessName] = useState(TEMPLATES[0].businessName);
  const [town, setTown] = useState(activeTown?.fullName || 'Effingham, NH');
  const [contactPhone, setContactPhone] = useState('(603) 539-5500');
  const [logoEmoji, setLogoEmoji] = useState(TEMPLATES[0].emoji);
  const [logoImageUrl, setLogoImageUrl] = useState<string>('');
  const [cardTheme, setCardTheme] = useState<CardThemeId>(TEMPLATES[0].theme);
  const [cardFontStyle, setCardFontStyle] = useState<CardFontId>('modern_bold');
  const [cardPattern, setCardPattern] = useState<CardPatternId>('radial_glow');
  const [hardwareFormFactor, setHardwareFormFactor] = useState<HardwareType>('pvc_card');
  const [primaryColor, setPrimaryColor] = useState(TEMPLATES[0].color);
  const [cardTagline, setCardTagline] = useState(TEMPLATES[0].tagline);
  const [customHeadline, setCustomHeadline] = useState('How was your experience with us today?');

  // Social & Web Links
  const [contactWebsite, setContactWebsite] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');

  // Menu / Services Showcase
  const [showcaseTitle, setShowcaseTitle] = useState(TEMPLATES[0].showcaseTitle);
  const [showcaseItems, setShowcaseItems] = useState(TEMPLATES[0].items);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');

  // Rewards & Leaderboard
  const [visitPointsPerTap, setVisitPointsPerTap] = useState(25);
  const [nextVisitRewardGoal, setNextVisitRewardGoal] = useState(100);
  const [nextVisitRewardTitle, setNextVisitRewardTitle] = useState(TEMPLATES[0].rewardTitle);
  const [nextVisitPromoCode, setNextVisitPromoCode] = useState(TEMPLATES[0].promoCode);
  const [leaderboardXpPerTap, setLeaderboardXpPerTap] = useState(50);
  const [bonusReviewPoints, setBonusReviewPoints] = useState(25);

  const [savedCardId, setSavedCardId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load existing card if selected
  useEffect(() => {
    if (selectedCardId && selectedCardId !== 'new') {
      const existing = cards.find((c) => c.id === selectedCardId);
      if (existing) {
        setEntityRole(existing.entityRole || 'business');
        setBusinessName(existing.businessName);
        setTown(existing.town || 'Effingham, NH');
        setContactPhone(existing.contactPhone || '(603) 539-5500');
        setLogoEmoji(existing.logoUrl || '🏪');
        setLogoImageUrl(existing.logoImageUrl || '');
        setCardTheme(existing.cardTheme || 'matte_obsidian');
        setCardFontStyle(existing.cardFontStyle || 'modern_bold');
        setCardPattern(existing.cardPattern || 'radial_glow');
        setHardwareFormFactor(existing.hardwareFormFactor || 'pvc_card');
        setPrimaryColor(existing.primaryColor || '#f59e0b');
        setCardTagline(existing.cardTagline || `Tap for ${existing.businessName} Menu & Rewards`);
        setCustomHeadline(existing.customHeadline || `How was your visit to ${existing.businessName}?`);
        setContactWebsite(existing.contactWebsite || '');
        setContactInstagram(existing.contactInstagram || '');
        setContactFacebook(existing.contactFacebook || '');
        setGoogleReviewUrl(existing.googleReviewUrl || '');
        setShowcaseTitle(existing.showcaseTitle || 'Featured Menu & Specials');
        if (existing.showcaseItems && existing.showcaseItems.length > 0) {
          setShowcaseItems(
            existing.showcaseItems.map((i) => ({
              id: i.id,
              name: i.name,
              description: i.description,
              price: i.price,
              category: i.category || 'Featured',
              badge: i.badge || 'Popular',
            }))
          );
        }
        setVisitPointsPerTap(existing.visitPointsPerTap || 25);
        setNextVisitRewardGoal(existing.nextVisitRewardGoal || 100);
        setNextVisitRewardTitle(existing.nextVisitRewardTitle || '$10.00 Off on Your Next Visit');
        setNextVisitPromoCode(existing.nextVisitPromoCode || 'NEXT-VISIT');
        setLeaderboardXpPerTap(existing.leaderboardXpPerTap || 50);
        setBonusReviewPoints(existing.bonusReviewPoints || 25);
        setSavedCardId(existing.id);
      }
    }
  }, [selectedCardId, cards]);

  // Apply 1-click template
  const applyTemplate = (tpl: TemplatePreset) => {
    setSelectedCardId('new');
    setEntityRole(tpl.role);
    setBusinessName(tpl.businessName);
    setLogoEmoji(tpl.emoji);
    setCardTheme(tpl.theme);
    setPrimaryColor(tpl.color);
    setCardTagline(tpl.tagline);
    setShowcaseTitle(tpl.showcaseTitle);
    setShowcaseItems(tpl.items);
    setNextVisitRewardTitle(tpl.rewardTitle);
    setNextVisitPromoCode(tpl.promoCode);
  };

  // Compress uploaded logo image to clean 200x200 PNG data URL
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setLogoImageUrl(canvas.toDataURL('image/png'));
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddShowcaseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setShowcaseItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now().toString(36)}`,
        name: newItemName.trim(),
        description:
          newItemDesc.trim() ||
          (entityRole === 'contractor' ? 'Licensed local trade service.' : 'Freshly made locally.'),
        price: newItemPrice.trim() || (entityRole === 'contractor' ? 'Free Quote' : '$12.00'),
        category: entityRole === 'contractor' ? 'Service' : 'Menu',
        badge: newItemBadge.trim() || 'Featured',
      },
    ]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemBadge('');
  };

  const handleSaveFreeCard = () => {
    if (!businessName.trim()) return;

    const payload: Omit<
      NfcCardConfig,
      'id' | 'totalTaps' | 'googleConversions' | 'privateFeedbacksCount' | 'createdAt'
    > = {
      cardName: `${businessName.trim()} — Free Custom ${entityRole === 'contractor' ? 'Contractor' : 'Business'} NFC Card`,
      businessName: businessName.trim(),
      profileType: 'loyalty_rewards',
      entityRole,
      cardTheme,
      cardFontStyle,
      cardPattern,
      logoImageUrl: logoImageUrl || undefined,
      cardTagline: cardTagline.trim(),
      showcaseTitle: showcaseTitle.trim(),
      showcaseItems,
      isFreeRegistrationCard: true,
      hardwareFormFactor,
      chipType: 'NTAG215',
      contactPhone: contactPhone.trim(),
      contactWebsite: contactWebsite.trim() || undefined,
      contactInstagram: contactInstagram.trim() || undefined,
      contactFacebook: contactFacebook.trim() || undefined,
      googleReviewUrl:
        googleReviewUrl.trim() ||
        `https://www.google.com/search?q=${encodeURIComponent(`${businessName.trim()} ${town}`)}`,
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
      town,
    };

    if (selectedCardId !== 'new' && cards.some((c) => c.id === selectedCardId)) {
      updateCard(selectedCardId, payload);
      setSavedCardId(selectedCardId);
    } else {
      const created = addCard(payload);
      setSelectedCardId(created.id);
      setSavedCardId(created.id);
    }

    playDeliveryChime();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  const activeThemeObj = CARD_THEMES.find((t) => t.id === cardTheme) || CARD_THEMES[0];
  const activeFontObj = FONT_STYLES.find((f) => f.id === cardFontStyle) || FONT_STYLES[0];
  const activeHardwareObj = HARDWARE_OPTIONS.find((h) => h.id === hardwareFormFactor) || HARDWARE_OPTIONS[0];
  const previewTapUrl = savedCardId ? `/tap/${savedCardId}` : `/tap/${cards[0]?.id || 'preview'}`;
  const fullTapUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${previewTapUrl}` : `https://townraise.com${previewTapUrl}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=ffffff&color=000000&data=${encodeURIComponent(
    fullTapUrl
  )}`;

  const patternStyle: React.CSSProperties =
    cardPattern === 'carbon_mesh'
      ? {
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }
      : cardPattern === 'diagonal_stripes'
      ? {
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 12px)',
        }
      : {};

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>1st Custom NFC Card 100% Free for Every Local Business &amp; Contractor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Custom NFC Card <span className="text-amber-400">Design Studio</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Upload your logo, pick your material finish &amp; hardware style, add your menu or services, and preview both the front and QR back of your card live.
            </p>
          </div>

          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="bg-[#0e0e16] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400 shrink-0"
          >
            <option value="new">✨ Create New Free Card</option>
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.logoUrl || '🏪'} Edit: {c.businessName}
              </option>
            ))}
          </select>
        </div>

        {/* 1-CLICK STARTER TEMPLATES */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick-Start Templates (1-Click Fill)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 text-xs font-bold text-zinc-200 hover:text-amber-200 transition-all flex items-center gap-1.5"
              >
                <span>{tpl.emoji}</span>
                <span>{tpl.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN 2-COLUMN STUDIO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLUMNS: TABBED CUSTOMIZER */}
          <div className="lg:col-span-7 space-y-5">
            {/* Clean 3-Step Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#0d0d14] border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'design'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>1. Design &amp; Logo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'menu'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>2. Menu / Services ({showcaseItems.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rewards')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'rewards'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>3. Rewards &amp; Links</span>
              </button>
            </div>

            {/* TAB 1: DESIGN, LOGO, FINISH, FONT, HARDWARE */}
            {activeTab === 'design' && (
              <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-5">
                {/* Role Switch */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEntityRole('business')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      entityRole === 'business'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300'
                        : 'bg-white/[0.03] border-white/10 text-zinc-400'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Business / Restaurant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityRole('contractor')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      entityRole === 'contractor'
                        ? 'bg-emerald-400/15 border-emerald-400 text-emerald-300'
                        : 'bg-white/[0.03] border-white/10 text-zinc-400'
                    }`}
                  >
                    <Hammer className="w-4 h-4" />
                    <span>Contractor / Trade</span>
                  </button>
                </div>

                {/* Business Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Business / Contractor Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Town</label>
                    <select
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {towns.map((t) => (
                        <option key={t.id} value={t.fullName}>
                          {t.fullName}
                        </option>
                      ))}
                      <option value="Carroll County, NH">All Carroll County, NH</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Call or Text Phone
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Card Tagline (Printed on Front)
                    </label>
                    <input
                      type="text"
                      value={cardTagline}
                      onChange={(e) => setCardTagline(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Custom Logo Upload + Emoji Picker */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Upload Custom Logo Image or Pick Icon</span>
                    </span>
                    {logoImageUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoImageUrl('')}
                        className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{logoImageUrl ? 'Change Logo Image' : 'Upload Logo (PNG/JPG)'}</span>
                    </button>

                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_EMOJIS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            setLogoImageUrl('');
                            setLogoEmoji(em);
                          }}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-all ${
                            !logoImageUrl && logoEmoji === em
                              ? 'bg-amber-400/20 border-amber-400 scale-110'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7 Card Finishes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 block">
                    Card Surface Finish
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CARD_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          setCardTheme(theme.id);
                          setPrimaryColor(theme.accentDefault);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          cardTheme === theme.id
                            ? 'border-amber-400 bg-amber-400/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${theme.swatch} border border-white/25 shrink-0`}
                        />
                        <span className="text-[11px] font-bold truncate">{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color, Font Style & Surface Pattern */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                      Accent Glow Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl bg-transparent border border-white/15 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full bg-black/50 border border-white/15 rounded-xl px-2.5 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                      Typography Style
                    </label>
                    <select
                      value={cardFontStyle}
                      onChange={(e) => setCardFontStyle(e.target.value as CardFontId)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      {FONT_STYLES.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                      Surface Pattern
                    </label>
                    <select
                      value={cardPattern}
                      onChange={(e) => setCardPattern(e.target.value as CardPatternId)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    >
                      {PATTERNS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hardware Form Factor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 block">
                    Physical Hardware Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HARDWARE_OPTIONS.map((hw) => (
                      <button
                        key={hw.id}
                        type="button"
                        onClick={() => setHardwareFormFactor(hw.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          hardwareFormFactor === hw.id
                            ? 'border-amber-400 bg-amber-400/15 text-white'
                            : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-sm">{hw.emoji}</div>
                        <div className="text-xs font-bold mt-0.5">{hw.label}</div>
                        <div className="text-[10px] text-zinc-400">{hw.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MENU / SERVICES SHOWCASE */}
            {activeTab === 'menu' && (
              <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Showcase Section Title
                  </label>
                  <input
                    type="text"
                    value={showcaseTitle}
                    onChange={(e) => setShowcaseTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  {showcaseItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{item.name}</div>
                        <div className="text-xs text-zinc-400 truncate">{item.description}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-amber-400">{item.price}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowcaseItems((prev) => prev.filter((i) => i.id !== item.id))
                          }
                          className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleAddShowcaseItem}
                  className="p-4 rounded-2xl bg-black/40 border border-amber-400/25 space-y-3"
                >
                  <div className="text-xs font-bold text-amber-300">
                    + Add {entityRole === 'contractor' ? 'Trade Service' : 'Menu Item'}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder={entityRole === 'contractor' ? 'Service name' : 'Item name'}
                      className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="Price (e.g. $12.99 or Free Quote)"
                      className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      placeholder="Short description"
                      className="sm:col-span-2 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Card</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: REWARDS, LEADERBOARD & SOCIAL LINKS */}
            {activeTab === 'rewards' && (
              <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Next-Visit Pts / Tap
                    </label>
                    <input
                      type="number"
                      value={visitPointsPerTap}
                      onChange={(e) => setVisitPointsPerTap(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Points to Unlock Reward
                    </label>
                    <input
                      type="number"
                      value={nextVisitRewardGoal}
                      onChange={(e) => setNextVisitRewardGoal(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Website Leaderboard XP
                    </label>
                    <input
                      type="number"
                      value={leaderboardXpPerTap}
                      onChange={(e) => setLeaderboardXpPerTap(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-sm text-indigo-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Next-Visit Reward Prize
                    </label>
                    <input
                      type="text"
                      value={nextVisitRewardTitle}
                      onChange={(e) => setNextVisitRewardTitle(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      Promo / Reward Code
                    </label>
                    <input
                      type="text"
                      value={nextVisitPromoCode}
                      onChange={(e) => setNextVisitPromoCode(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">
                      5-Star Review Bonus Pts
                    </label>
                    <input
                      type="number"
                      value={bonusReviewPoints}
                      onChange={(e) => setBonusReviewPoints(Number(e.target.value))}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                    />
                  </div>
                </div>

                {/* Social & Website Links */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-amber-400" />
                    <span>Website, Socials &amp; Google Review Link (Optional)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="url"
                      value={contactWebsite}
                      onChange={(e) => setContactWebsite(e.target.value)}
                      placeholder="Website (https://...)"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="url"
                      value={googleReviewUrl}
                      onChange={(e) => setGoogleReviewUrl(e.target.value)}
                      placeholder="Direct Google Review Link"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={contactInstagram}
                      onChange={(e) => setContactInstagram(e.target.value)}
                      placeholder="Instagram (@handle)"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={contactFacebook}
                      onChange={(e) => setContactFacebook(e.target.value)}
                      placeholder="Facebook page URL or name"
                      className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SAVE CTA */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0e0e16] to-emerald-500/15 border border-amber-400/35 space-y-4">
              <button
                type="button"
                onClick={handleSaveFreeCard}
                className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20"
              >
                {selectedCardId !== 'new'
                  ? 'Save Custom NFC Card Updates'
                  : 'Save & Activate My Free Custom NFC Card'}
              </button>

              {savedCardId && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Custom NFC Card Saved &amp; Live!
                    </span>
                    <Link
                      href={`/tap/${savedCardId}`}
                      className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open Tap Screen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/tap/${savedCardId}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied Link!' : 'Copy Tap Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Print Proof</span>
                    </button>

                    <Link
                      href="/dashboard/programmer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Program NFC Chip</span>
                    </Link>

                    <a
                      href={`sms:5085070305?&body=${encodeURIComponent(
                        `Hi Sean! I just designed my FREE ${activeHardwareObj.label} NFC Card for ${businessName} (${town}). Can you program & drop it off?`
                      )}`}
                      className="px-3.5 py-2 rounded-xl bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Text Sean for Free Card Drop-Off</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: LIVE FRONT & BACK CARD FLIP + PHONE TAP PREVIEW */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Front / Back Toggle */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-amber-400">
                  Live {activeHardwareObj.emoji} {activeHardwareObj.label} Preview
                </span>
                <button
                  type="button"
                  onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Flip to {cardSide === 'front' ? 'QR Back' : 'Front'}</span>
                </button>
              </div>

              {/* PHYSICAL CARD VISUAL (FRONT OR BACK) */}
              <div
                className={`relative rounded-[1.75rem] p-6 border-2 ${activeThemeObj.bgClass} ${activeThemeObj.borderClass} shadow-2xl overflow-hidden transition-all duration-300 min-h-[265px] flex flex-col justify-between`}
                style={{
                  ...patternStyle,
                  boxShadow: `0 20px 60px -15px ${primaryColor}40`,
                }}
              >
                {cardPattern === 'radial_glow' && (
                  <div
                    className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-35 pointer-events-none"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}

                {cardSide === 'front' ? (
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border border-white/15 shadow-lg overflow-hidden shrink-0"
                          style={{ backgroundColor: `${primaryColor}25` }}
                        >
                          {logoImageUrl ? (
                            <img
                              src={logoImageUrl}
                              alt={businessName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            logoEmoji || '🏪'
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                            {entityRole === 'contractor' ? '🔨 Verified Contractor' : '🍽️ Menu & Rewards'}
                          </span>
                          <h3
                            className={`text-lg sm:text-xl text-white mt-1 leading-tight ${activeFontObj.headingClass}`}
                          >
                            {businessName || 'Your Business Name'}
                          </h3>
                          <p className="text-[11px] font-mono text-zinc-400">{town}</p>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                        <Wifi className="w-5 h-5 rotate-90" />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-200 leading-relaxed">{cardTagline}</p>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-[8px] font-mono uppercase text-zinc-400 block">
                          Every Tap Gives
                        </span>
                        <span className="text-xs font-black" style={{ color: primaryColor }}>
                          +{visitPointsPerTap} Next-Visit Pts
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-[8px] font-mono uppercase text-zinc-400 block">
                          Site Leaderboard
                        </span>
                        <span className="text-xs font-black text-indigo-300">
                          +{leaderboardXpPerTap} Rank XP
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-300 font-bold">📞 {contactPhone}</span>
                      <span className="font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                        TAP PHONE HERE →
                      </span>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD WITH REAL QR CODE */
                  <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
                    <div className="space-y-2.5 flex-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono uppercase text-amber-300">
                        <QrCode className="w-3 h-3" />
                        <span>Backup QR + NTAG215 Chip</span>
                      </span>
                      <h4 className={`text-base text-white ${activeFontObj.headingClass}`}>
                        {businessName}
                      </h4>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        Tap top of iPhone/Android or scan QR code to view menu, claim{' '}
                        <strong className="text-amber-300">{nextVisitRewardTitle}</strong> &amp; earn{' '}
                        <strong className="text-indigo-300">+{leaderboardXpPerTap} XP</strong>.
                      </p>
                      <div className="text-[10px] font-mono text-zinc-400 space-y-0.5">
                        <div>📞 {contactPhone}</div>
                        {contactWebsite && (
                          <div className="flex items-center gap-1 truncate">
                            <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{contactWebsite}</span>
                          </div>
                        )}
                        {contactInstagram && <div>IG: {contactInstagram}</div>}
                      </div>
                    </div>

                    <div className="p-2 rounded-2xl bg-white shrink-0 shadow-lg">
                      <img
                        src={qrImageUrl}
                        alt="Card Backup QR Code"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MINI PHONE TAP PREVIEW */}
            <div className="p-5 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-xs font-bold uppercase text-white">
                  Customer Phone Tap Screen Preview
                </h4>
                <Link
                  href={previewTapUrl}
                  className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] flex items-center gap-1"
                >
                  <span>Test Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-[#07070b] border border-white/10 space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Next-Visit Reward
                    </span>
                    <span className="font-mono font-bold text-white">
                      {visitPointsPerTap} / {nextVisitRewardGoal} PTS
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                      style={{
                        width: `${Math.min(100, Math.round((visitPointsPerTap / Math.max(1, nextVisitRewardGoal)) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    🎁 {nextVisitRewardTitle}
                  </p>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {showcaseItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                        <span className="text-[10px] text-zinc-400 block truncate">{item.description}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${contactPhone.replace(/[^0-9]/g, '')}`}
                    className="py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] text-center flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`sms:${contactPhone.replace(/[^0-9]/g, '')}`}
                    className="py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] text-center flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Text</span>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center">
          Loading Custom NFC Card Studio...
        </div>
      }
    >
      <CustomNfcStudioContent />
    </Suspense>
  );
}
