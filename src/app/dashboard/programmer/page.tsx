'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig } from '@/lib/types';
import { EFFINGHAM_AREA_BUSINESSES } from '@/lib/local-businesses';
import {
  generateTapRouterUrl,
  isWebNfcSupported,
  writeNfcRewardCardWithWebNfc,
  scanPhysicalNfcCard
} from '@/lib/nfc-encoder';
import confetti from 'canvas-confetti';
import {
  Cpu,
  Gift,
  Trophy,
  Zap,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Smartphone,
  Store,
  Plus,
  Trash2,
  Radio,
  Flame,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  QrCode
} from 'lucide-react';

export default function NfcRewardCardProgrammerPage() {
  const {
    cards,
    storefronts,
    towns,
    addCard,
    updateCard,
    deleteCard,
    claimBusinessCardTapReward
  } = useNfcStore();

  // Form State for Programming a New or Selected Business Reward Card
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || 'card-sean-vcard');
  const [businessName, setBusinessName] = useState('');
  const [cardName, setCardName] = useState('Next-Visit Reward & Leaderboard Card');
  const [town, setTown] = useState('Effingham, NH');
  const [logoUrl, setLogoUrl] = useState('🎁');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b');
  const [assignedLocation, setAssignedLocation] = useState('Front Counter Register');
  const [storefrontSlug, setStorefrontSlug] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');

  // Next-Visit Reward Program Settings
  const [visitPointsPerTap, setVisitPointsPerTap] = useState<number>(25);
  const [nextVisitRewardGoal, setNextVisitRewardGoal] = useState<number>(100);
  const [nextVisitRewardTitle, setNextVisitRewardTitle] = useState<string>(
    '$10.00 Off or Free Item on Your Next Visit'
  );
  const [nextVisitPromoCode, setNextVisitPromoCode] = useState<string>('NEXTVISIT10');

  // Website Leaderboard XP Settings
  const [leaderboardXpPerTap, setLeaderboardXpPerTap] = useState<number>(50);
  const [bonusReviewPoints, setBonusReviewPoints] = useState<number>(25);
  const [chipType, setChipType] = useState<'NTAG213' | 'NTAG215' | 'NTAG216'>('NTAG215');

  // Hardware Write / Scan Status
  const [nfcStatus, setNfcStatus] = useState<{
    type: 'idle' | 'writing' | 'scanning' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<string | null>(null);

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Populate form from an existing storefront or directory business
  const handleSelectBusinessPreset = (presetValue: string) => {
    if (!presetValue) return;

    const sf = storefronts.find(s => s.id === presetValue);
    if (sf) {
      setBusinessName(sf.businessName);
      setCardName(`${sf.businessName} Next-Visit Reward Card`);
      setTown(`${sf.town}, ${sf.state}`);
      setLogoUrl(sf.logoEmoji || '🏪');
      setPrimaryColor(sf.accentColor || '#f59e0b');
      setStorefrontSlug(sf.slug);
      setGoogleReviewUrl(sf.googleReviewUrl || `https://www.google.com/search?q=${encodeURIComponent(`${sf.businessName} ${sf.town}`)}`);
      setNextVisitPromoCode(`${sf.businessName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 5)}-NEXT`);
      return;
    }

    const dirBiz = EFFINGHAM_AREA_BUSINESSES.find(b => b.id === presetValue);
    if (dirBiz) {
      setBusinessName(dirBiz.name);
      setCardName(`${dirBiz.name} Next-Visit Reward Card`);
      setTown(dirBiz.town);
      setLogoUrl(dirBiz.logoEmoji || '🎁');
      setPrimaryColor(dirBiz.accentColor || '#f59e0b');
      setStorefrontSlug('');
      setGoogleReviewUrl(dirBiz.googleReviewUrl || `https://www.google.com/search?q=${encodeURIComponent(`${dirBiz.name} ${dirBiz.town}`)}`);
      setNextVisitPromoCode(`${dirBiz.name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 5)}-NEXT`);
    }
  };

  // Load an existing card into the editor
  const handleLoadCardIntoEditor = (c: NfcCardConfig) => {
    setSelectedCardId(c.id);
    setBusinessName(c.businessName);
    setCardName(c.cardName);
    setTown(c.town || 'Effingham, NH');
    setLogoUrl(c.logoUrl || '🎁');
    setPrimaryColor(c.primaryColor || '#f59e0b');
    setAssignedLocation(c.assignedLocation || 'Front Counter');
    setStorefrontSlug(c.storefrontSlug || '');
    setGoogleReviewUrl(c.googleReviewUrl || '');
    setVisitPointsPerTap(c.visitPointsPerTap || 25);
    setNextVisitRewardGoal(c.nextVisitRewardGoal || 100);
    setNextVisitRewardTitle(c.nextVisitRewardTitle || '$10.00 Off Your Next Visit');
    setNextVisitPromoCode(c.nextVisitPromoCode || 'NEXTVISIT10');
    setLeaderboardXpPerTap(c.leaderboardXpPerTap || 50);
    setBonusReviewPoints(c.bonusReviewPoints || 25);
  };

  // Create a brand new programmed card in store
  const handleCreateRewardCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    const newCard = addCard({
      cardName: cardName.trim() || `${businessName} Reward Card`,
      businessName: businessName.trim(),
      profileType: 'loyalty_rewards',
      hardwareFormFactor: 'pvc_card',
      chipType,
      googleReviewUrl: googleReviewUrl.trim() || `https://www.google.com/search?q=${encodeURIComponent(`${businessName} ${town}`)}`,
      mode: 'smart_funnel',
      thresholdStars: 4,
      storefrontSlug: storefrontSlug.trim() || undefined,
      rewardProgramActive: true,
      visitPointsPerTap: Number(visitPointsPerTap) || 25,
      nextVisitRewardGoal: Number(nextVisitRewardGoal) || 100,
      nextVisitRewardTitle: nextVisitRewardTitle.trim() || '$10.00 Off Your Next Visit',
      nextVisitPromoCode: nextVisitPromoCode.trim() || 'NEXTVISIT10',
      leaderboardXpPerTap: Number(leaderboardXpPerTap) || 50,
      bonusReviewPoints: Number(bonusReviewPoints) || 25,
      customHeadline: `Tap for Next-Visit Points at ${businessName} + Website Leaderboard XP!`,
      logoUrl: logoUrl || '🎁',
      primaryColor: primaryColor || '#f59e0b',
      assignedLocation: assignedLocation.trim() || 'Front Counter',
      assignedStaff: 'Sean Martin',
      active: true,
      town: town.trim() || 'Effingham, NH'
    });

    setSelectedCardId(newCard.id);
    setNfcStatus({
      type: 'success',
      message: `Created "${newCard.cardName}"! Ready to write to a physical NFC card or copy the Tap URL.`
    });
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
  };

  // Update currently selected card
  const handleUpdateSelectedCard = () => {
    if (!selectedCard) return;
    updateCard(selectedCard.id, {
      cardName: cardName.trim() || `${businessName} Reward Card`,
      businessName: businessName.trim(),
      profileType: 'loyalty_rewards',
      chipType,
      googleReviewUrl: googleReviewUrl.trim(),
      storefrontSlug: storefrontSlug.trim() || undefined,
      rewardProgramActive: true,
      visitPointsPerTap: Number(visitPointsPerTap) || 25,
      nextVisitRewardGoal: Number(nextVisitRewardGoal) || 100,
      nextVisitRewardTitle: nextVisitRewardTitle.trim(),
      nextVisitPromoCode: nextVisitPromoCode.trim(),
      leaderboardXpPerTap: Number(leaderboardXpPerTap) || 50,
      bonusReviewPoints: Number(bonusReviewPoints) || 25,
      logoUrl: logoUrl || '🎁',
      primaryColor: primaryColor || '#f59e0b',
      assignedLocation: assignedLocation.trim(),
      town: town.trim()
    });
    setNfcStatus({
      type: 'success',
      message: `Updated reward & leaderboard settings for ${businessName}!`
    });
  };

  // Flash physical NFC card via Web NFC
  const handleFlashPhysicalCard = async (cardToWrite: NfcCardConfig) => {
    setNfcStatus({
      type: 'writing',
      message: `Hold physical NFC card against the back of your phone to program "${cardToWrite.businessName}"...`
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
    const res = await writeNfcRewardCardWithWebNfc(cardToWrite, origin);
    setNfcStatus({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
    if (res.success) {
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    }
  };

  // Scan physical NFC card
  const handleScanPhysicalCard = async () => {
    setNfcStatus({
      type: 'scanning',
      message: 'Listening for NFC Tag... Hold any physical NFC card against the back of your device.'
    });
    const res = await scanPhysicalNfcCard();
    setNfcStatus({
      type: res.success ? 'success' : 'error',
      message: res.records?.length
        ? `${res.message} • Payload: ${res.records.map(r => r.data).join(', ')}`
        : res.message
    });
  };

  // Simulate customer tap right from the programmer
  const handleSimulateTap = (cardToSim: NfcCardConfig) => {
    const res = claimBusinessCardTapReward(cardToSim.id);
    if (res) {
      setSimResult(
        `Simulated Tap on "${cardToSim.businessName}": Customer earned +${res.visitPointsAdded} Next-Visit Pts (Now ${res.newVisitPoints}/${res.rewardGoal} pts) AND +${res.leaderboardXpAdded} Website Leaderboard XP!`
      );
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
  const activeTapUrl = selectedCard ? generateTapRouterUrl(selectedCard.id, originUrl) : `${originUrl}/tap/card-oasis-main`;
  const visitsNeeded = Math.max(1, Math.ceil((Number(nextVisitRewardGoal) || 100) / (Number(visitPointsPerTap) || 25)));

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-emerald-500/10 border border-amber-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>Sean&apos;s NFC Business Reward & Leaderboard Programmer</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-white">
            Program Business <span className="text-amber-400">Reward & Leaderboard</span> NFC Cards
          </h1>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
            Program physical NFC cards to give to local businesses. Every customer tap awards{' '}
            <strong className="text-amber-300">points toward their next visit reward</strong> at that business AND{' '}
            <strong className="text-indigo-300">XP for the Website Leaderboard &amp; Town Pride Cup</strong>!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/leaderboard"
            className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>View Website Leaderboard</span>
          </Link>
          {selectedCard && (
            <Link
              href={`/tap/${selectedCard.id}`}
              className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Live Customer Tap Page</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid: Left = Programmer Form, Right = Live Card Preview + Hardware Writer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONFIGURE BUSINESS REWARD & LEADERBOARD CARD */}
        <form onSubmit={handleCreateRewardCard} className="lg:col-span-7 space-y-6 bg-[#0d0d14] border border-white/10 rounded-[2.5rem] p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Step 1 • Configure Card Payload</span>
              <h2 className="text-xl font-black italic uppercase text-white">Business &amp; Dual Reward Setup</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
              {visitsNeeded} {visitsNeeded === 1 ? 'Visit' : 'Visits'} = Reward
            </span>
          </div>

          {/* Quick-Fill from Existing Storefront or Local Business */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
              ⚡ Quick-Select Local Business (Or Type Any Custom Business Below)
            </label>
            <select
              onChange={(e) => handleSelectBusinessPreset(e.target.value)}
              defaultValue=""
              className="w-full bg-[#070709] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="">-- Choose a Storefront or Carroll County Business to Auto-Fill --</option>
              <optgroup label="Live Storefronts">
                {storefronts.map(sf => (
                  <option key={sf.id} value={sf.id}>
                    {sf.logoEmoji} {sf.businessName} ({sf.town})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Carroll County Local Businesses">
                {EFFINGHAM_AREA_BUSINESSES.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.logoEmoji} {b.name} ({b.town})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Business Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Yankee Smokehouse"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                Card Label / Placement
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. Front Counter Reward Card"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                Town (For Town Pride Leaderboard)
              </label>
              <input
                type="text"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Effingham, NH"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Icon Emoji
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Brand Color
                </label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-9 bg-white/5 border border-white/10 rounded-xl px-1 py-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SECTION A: NEXT-VISIT BUSINESS REWARD PROGRAM */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-400/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wide">
                  1. Next-Visit Business Reward Program
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 font-bold">
                Unlocks after {visitsNeeded} {visitsNeeded === 1 ? 'tap' : 'taps'}
              </span>
            </div>

            {/* Quick Visit Presets */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: '4 Visits (25 pts/tap)', pts: 25, goal: 100 },
                { label: '2 Visits (50 pts/tap)', pts: 50, goal: 100 },
                { label: '5 Visits (20 pts/tap)', pts: 20, goal: 100 },
                { label: 'Every Visit (100 pts/tap)', pts: 100, goal: 100 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setVisitPointsPerTap(preset.pts);
                    setNextVisitRewardGoal(preset.goal);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all ${
                    visitPointsPerTap === preset.pts && nextVisitRewardGoal === preset.goal
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-amber-400/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-200 mb-1 block">
                  Points Earned Per Visit Tap
                </label>
                <input
                  type="number"
                  min={1}
                  value={visitPointsPerTap}
                  onChange={(e) => setVisitPointsPerTap(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-200 mb-1 block">
                  Points Goal for Next-Visit Reward
                </label>
                <input
                  type="number"
                  min={1}
                  value={nextVisitRewardGoal}
                  onChange={(e) => setNextVisitRewardGoal(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-200 mb-1 block">
                  Next-Visit Reward Perk Title (Shown to Customer)
                </label>
                <input
                  type="text"
                  value={nextVisitRewardTitle}
                  onChange={(e) => setNextVisitRewardTitle(e.target.value)}
                  placeholder="e.g. $10.00 Off Your Next Visit or Free Coffee"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-200 mb-1 block">
                  Redeem Voucher Code
                </label>
                <input
                  type="text"
                  value={nextVisitPromoCode}
                  onChange={(e) => setNextVisitPromoCode(e.target.value.toUpperCase())}
                  placeholder="NEXTVISIT10"
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: WEBSITE LEADERBOARD XP SETTINGS */}
          <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-400/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black uppercase text-white tracking-wide">
                  2. Website Leaderboard Points (/leaderboard)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 font-bold">
                Pioneers Ladder + Town Pride Cup
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 mb-1 block">
                  Leaderboard XP Awarded Per Tap
                </label>
                <input
                  type="number"
                  min={5}
                  value={leaderboardXpPerTap}
                  onChange={(e) => setLeaderboardXpPerTap(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-400"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Added to the customer&apos;s Card Mastery XP &amp; {town} Town Pride score.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 mb-1 block">
                  Bonus XP for 5-Star Google Review
                </label>
                <input
                  type="number"
                  min={0}
                  value={bonusReviewPoints}
                  onChange={(e) => setBonusReviewPoints(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-400"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Extra XP if the customer also taps 5 stars to leave a Google Review.
                </p>
              </div>
            </div>
          </div>

          {/* Save / Create Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-4 px-5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Business NFC Reward Card</span>
            </button>

            {selectedCard && (
              <button
                type="button"
                onClick={handleUpdateSelectedCard}
                className="px-5 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all"
              >
                Update Selected Card
              </button>
            )}
          </div>
        </form>

        {/* RIGHT COLUMN: PHYSICAL NFC HARDWARE WRITER & LIVE CARD PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Physical NFC Card Writer & Scanner Box */}
          <div className="bg-[#0d0d14] border-2 border-amber-400/40 rounded-[2.5rem] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Step 2 • Flash Physical NFC Card
                </span>
                <h3 className="text-lg font-black italic uppercase text-white">
                  Hardware NFC Writer &amp; URL
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Target URL Box */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>NDEF URI PAYLOAD (FOR PHYSICAL NFC CHIP):</span>
                <span className="text-emerald-400 font-bold">{chipType} Ready</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-amber-300 break-all">
                  {activeTapUrl}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeTapUrl);
                    setCopiedUrlId(selectedCard?.id || 'copied');
                    setTimeout(() => setCopiedUrlId(null), 2000);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-white shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrlId === (selectedCard?.id || 'copied') ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
            </div>

            {/* Web NFC Direct Write & Scan Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => selectedCard && handleFlashPhysicalCard(selectedCard)}
                className="w-full py-4 px-5 bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Write to Physical NFC Card Now (Web NFC)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleScanPhysicalCard}
                  className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scan Physical Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectedCard && handleSimulateTap(selectedCard)}
                  className="py-3 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 font-bold text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Simulate Customer Tap</span>
                </button>
              </div>
            </div>

            {/* Status Feedback */}
            {nfcStatus.type !== 'idle' && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-mono ${
                  nfcStatus.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : nfcStatus.type === 'error'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                    : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-200 animate-pulse'
                }`}
              >
                {nfcStatus.message}
              </div>
            )}

            {simResult && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/40 text-xs text-indigo-200 space-y-2">
                <p className="font-bold text-white">🎉 {simResult}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/tap/${selectedCard?.id || 'card-oasis-main'}`}
                    className="text-[10px] font-mono font-bold text-amber-400 underline"
                  >
                    Open Customer Tap Screen →
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="text-[10px] font-mono font-bold text-indigo-300 underline"
                  >
                    Check Updated Leaderboard →
                  </Link>
                </div>
              </div>
            )}

            {/* Live Visual Preview of the Programmed Business Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#151520] to-[#09090d] border border-white/15 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border border-white/15 shadow-lg"
                    style={{ backgroundColor: `${primaryColor}30` }}
                  >
                    {logoUrl || '🎁'}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 block">
                      NFC REWARD &amp; LEADERBOARD CARD
                    </span>
                    <h4 className="text-base font-black italic uppercase text-white leading-tight">
                      {businessName || 'Local Business'}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400">{town}</span>
                  </div>
                </div>
                <QrCode className="w-7 h-7 text-zinc-500" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25">
                  <span className="text-[9px] font-mono uppercase text-zinc-400 block">Next-Visit Points</span>
                  <span className="font-black text-amber-400">+{visitPointsPerTap} Pts / Tap</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/25">
                  <span className="text-[9px] font-mono uppercase text-zinc-400 block">Website Leaderboard</span>
                  <span className="font-black text-indigo-300">+{leaderboardXpPerTap} XP / Tap</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-zinc-300">
                🎁 <strong>{nextVisitRewardGoal} Pts Goal:</strong> {nextVisitRewardTitle} (<code className="text-amber-400">{nextVisitPromoCode}</code>)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALL PROGRAMMED BUSINESS NFC REWARD CARDS FLEET */}
      <div className="bg-[#0d0d14] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Active Business NFC Reward Fleet ({cards.length} Cards)
            </span>
            <h2 className="text-xl font-black italic uppercase text-white">
              Programmed Business Reward &amp; Leaderboard Cards
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => {
            const cardUrl = generateTapRouterUrl(c.id, originUrl);
            const isSelected = c.id === selectedCard?.id;
            return (
              <div
                key={c.id}
                onClick={() => handleLoadCardIntoEditor(c)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 shadow-lg shadow-amber-400/10'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shrink-0"
                        style={{ backgroundColor: `${c.primaryColor || '#f59e0b'}25` }}
                      >
                        {c.logoUrl || '🎁'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black uppercase text-white truncate">
                          {c.businessName}
                        </h3>
                        <p className="text-[10px] font-mono text-zinc-400 truncate">
                          {c.town || 'Effingham, NH'} • {c.totalTaps || 0} Taps
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCard(c.id);
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dual Reward Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-black/40 border border-amber-400/20">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 block">Next-Visit Pts</span>
                      <span className="font-mono font-black text-amber-400">
                        +{c.visitPointsPerTap || 25} / {c.nextVisitRewardGoal || 100} Pts
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-indigo-400/20">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 block">Leaderboard XP</span>
                      <span className="font-mono font-black text-indigo-300">
                        +{c.leaderboardXpPerTap || 50} XP
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 line-clamp-2">
                    🎁 <strong>Next Visit Perk:</strong> {c.nextVisitRewardTitle || '$10 Off Next Visit'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleFlashPhysicalCard(c)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Write NFC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(cardUrl);
                      setCopiedUrlId(c.id);
                      setTimeout(() => setCopiedUrlId(null), 2000);
                    }}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[10px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedUrlId === c.id ? 'Copied' : 'URL'}</span>
                  </button>

                  <Link
                    href={`/tap/${c.id}`}
                    className="py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 font-mono font-bold text-[10px] flex items-center gap-1"
                  >
                    <span>Test</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
