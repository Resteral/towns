'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { calculateCardProgression } from '@/lib/card-leveling';
import AuthModal from '@/components/AuthModal';
import confetti from 'canvas-confetti';
import {
  User,
  Edit3,
  MapPin,
  Phone,
  Mail,
  Trophy,
  Gift,
  CreditCard,
  Truck,
  QrCode,
  Copy,
  Check,
  Upload,
  ExternalLink,
  Flame,
  Sparkles,
  CheckCircle2,
  X,
  LogIn,
  ShieldCheck,
  Printer,
  ArrowRight,
  Tag,
} from 'lucide-react';

const PROFILE_EXTRAS_KEY = 'townraise_profile_extras_v1';

interface ProfileExtras {
  bio: string;
  photoDataUrl: string;
  cashApp: string;
  venmo: string;
}

const AVATAR_CHOICES = ['👑', '🌲', '🚗', '🔨', '🏪', '🍕', '🏔️', '⚡', '🎯', '🐻'];

const TOWNS = [
  'Effingham',
  'Ossipee',
  'Freedom',
  'Conway',
  'Wolfeboro',
  'Tamworth',
  'Wakefield',
];

export default function HunterProfilePage() {
  const {
    currentUser,
    loginUser,
    cards,
    deliveryOrders,
    storeHunterStamps,
    passportStamps,
    loyaltyWallet,
    loyaltyRewards,
    redeemLoyaltyReward,
    playDeliveryChime,
  } = useNfcStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'nfc' | 'rewards' | 'pass'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);

  // Editable Profile State
  const [name, setName] = useState(currentUser?.name || 'Carroll County Member');
  const [town, setTown] = useState(currentUser?.town || 'Effingham');
  const [phone, setPhone] = useState(currentUser?.phone || '(508) 507-0305');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '🌲');
  const [bio, setBio] = useState('Carroll County local exploring deals, supporting small businesses & earning Townraise rewards.');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [cashApp, setCashApp] = useState('');
  const [venmo, setVenmo] = useState('');

  // Sync from currentUser & localStorage extras
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setTown(currentUser.town || 'Effingham');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || '🌲');
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(PROFILE_EXTRAS_KEY);
        if (raw) {
          const parsed: ProfileExtras = JSON.parse(raw);
          if (parsed.bio !== undefined) setBio(parsed.bio);
          if (parsed.photoDataUrl !== undefined) setPhotoDataUrl(parsed.photoDataUrl);
          if (parsed.cashApp !== undefined) setCashApp(parsed.cashApp);
          if (parsed.venmo !== undefined) setVenmo(parsed.venmo);
        }
      } catch {
        // ignore
      }
    }
  }, [currentUser]);

  const cardProgression = useMemo(
    () => calculateCardProgression(storeHunterStamps, passportStamps),
    [storeHunterStamps, passportStamps]
  );

  const activeNfcCards = useMemo(() => cards.filter((c) => c.active), [cards]);

  const unlockedPerks = useMemo(
    () =>
      storeHunterStamps.map((stamp) => ({
        ...stamp.unlockedPerk,
        storeName: stamp.storeName,
        town: stamp.town,
        stampedAt: stamp.timestamp,
      })),
    [storeHunterStamps]
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setPhotoDataUrl(canvas.toDataURL('image/png'));
        }
      };
      if (typeof reader.result === 'string') {
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    loginUser({
      id: currentUser?.id || `member-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || currentUser?.email || 'member@townraise.com',
      phone: phone.trim(),
      role: currentUser?.role || 'resident',
      avatar,
      town,
      state: 'NH',
      badge: currentUser?.badge || 'Verified Member',
      isDriver: currentUser?.isDriver ?? false,
      driverMemberId: currentUser?.driverMemberId,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      const extras: ProfileExtras = {
        bio: bio.trim(),
        photoDataUrl,
        cashApp: cashApp.trim(),
        venmo: venmo.trim(),
      };
      localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(extras));
    }

    setIsEditing(false);
    setSaveMessage('Profile updated!');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleRedeem = (rewardId: string, title: string) => {
    const ok = redeemLoyaltyReward(rewardId);
    if (ok) {
      playDeliveryChime();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setRedeemMessage(`Unlocked "${title}"! Added to your Rewards Wallet.`);
    } else {
      setRedeemMessage('Not enough points yet to redeem this reward.');
    }
    setTimeout(() => setRedeemMessage(null), 4000);
  };

  const memberId = currentUser?.id?.toUpperCase() || 'TR-MEMBER-01';
  const roleLabel =
    currentUser?.role === 'admin'
      ? 'Founder & Admin'
      : currentUser?.role === 'driver'
      ? '4x4 Courier Driver'
      : currentUser?.role === 'merchant'
      ? 'Business Owner'
      : currentUser?.role === 'contractor'
      ? 'Local Contractor'
      : 'Carroll County Member';

  const qrData =
    typeof window !== 'undefined'
      ? `${window.location.origin}/profile?member=${encodeURIComponent(memberId)}`
      : `https://townraise.com/profile?member=${encodeURIComponent(memberId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=ffffff&color=000000&data=${encodeURIComponent(
    qrData
  )}`;

  const totalPoints = loyaltyWallet?.userPoints ?? 0;

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* PROFILE HEADER CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0e0e16] to-[#09090e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar / Uploaded Photo */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-amber-400/15 border-2 border-amber-400/40 flex items-center justify-center text-4xl overflow-hidden shadow-lg">
                  {photoDataUrl ? (
                    <img src={photoDataUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    avatar
                  )}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black shadow">
                  Lvl {cardProgression.currentLevel}
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white truncate">{name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {roleLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {town}, NH
                  </span>
                  {phone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      {phone}
                    </span>
                  )}
                  {email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {email}
                    </span>
                  )}
                </div>

                {bio && <p className="text-xs text-zinc-300 max-w-xl pt-1 leading-relaxed">{bio}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Close Editor' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentUser ? 'Switch Account' : 'Sign In'}</span>
              </button>
            </div>
          </div>

          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* INLINE PROFILE EDITOR */}
          {isEditing && (
            <form
              onSubmit={handleSaveProfile}
              className="p-5 rounded-2xl bg-black/50 border border-amber-400/30 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Customize Your Profile</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Upload + Emoji Picker */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{photoDataUrl ? 'Change Photo' : 'Upload Profile Photo'}</span>
                </button>
                {photoDataUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl('')}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_CHOICES.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setPhotoDataUrl('');
                        setAvatar(em);
                      }}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border ${
                        !photoDataUrl && avatar === em
                          ? 'bg-amber-400/20 border-amber-400'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Home Town</label>
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e16] border border-white/15 text-xs text-white"
                  >
                    {TOWNS.map((t) => (
                      <option key={t} value={t}>
                        {t}, NH
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Cash App (Optional)</label>
                  <input
                    type="text"
                    value={cashApp}
                    onChange={(e) => setCashApp(e.target.value)}
                    placeholder="$yourtag"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-emerald-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Venmo (Optional)</label>
                  <input
                    type="text"
                    value={venmo}
                    onChange={(e) => setVenmo(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-cyan-300 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Short Bio</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* 4 CLEAN STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Reward Points</span>
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{totalPoints.toLocaleString()}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rank Level</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                Lvl {cardProgression.currentLevel}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active NFC Cards</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{activeNfcCards.length}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-orange-400" />
                <span>Courier Orders</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">{deliveryOrders.length}</div>
            </div>
          </div>
        </div>

        {/* CLEAN 4-TAB BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-[#0d0d14] border border-white/10">
          {[
            { id: 'overview', label: 'Overview & Orders', icon: Truck },
            { id: 'nfc', label: `My NFC Cards (${activeNfcCards.length})`, icon: CreditCard },
            { id: 'rewards', label: 'Rewards & Perks', icon: Gift },
            { id: 'pass', label: 'Digital Member Pass', icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & RECENT ORDERS */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Quick Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/deals"
                className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 hover:border-orange-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-orange-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> Local &amp; Penny Deals
                  </div>
                  <div className="text-xs text-zinc-400">Home Depot $0.01 &amp; local sales</div>
                </div>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </Link>

              <Link
                href="/custom-nfc"
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> Free NFC Card Studio
                  </div>
                  <div className="text-xs text-zinc-400">Design &amp; customize your card</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>

              <Link
                href="/courier"
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Book 4x4 Courier
                  </div>
                  <div className="text-xs text-zinc-400">Same-day local pickup &amp; delivery</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Recent Courier &amp; Delivery Orders</h2>
                <Link href="/courier" className="text-xs font-bold text-amber-400 hover:underline">
                  + New Pickup
                </Link>
              </div>

              {deliveryOrders.length === 0 ? (
                <p className="text-xs text-zinc-400 py-4">
                  No delivery orders yet. Book a local pickup anytime and it will appear right here!
                </p>
              ) : (
                <div className="space-y-2.5">
                  {deliveryOrders.slice(0, 6).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-white">
                          Order #{ord.orderNumber} — {ord.pickupStoreName || ord.restaurantName || 'Local Pickup'}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {ord.deliveryAddress} • {ord.items.length} item{ord.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-emerald-400">
                          ${ord.total.toFixed(2)}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-bold uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY NFC CARDS */}
        {activeTab === 'nfc' && (
          <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">My Custom NFC Reward Cards</h2>
              <Link
                href="/custom-nfc"
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs"
              >
                + Design New Free Card
              </Link>
            </div>

            {activeNfcCards.length === 0 ? (
              <p className="text-xs text-zinc-400 py-4">
                You haven&apos;t created a custom NFC card yet. Every local business &amp; contractor gets their first card 100% free!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeNfcCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-white/10 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                        {card.logoImageUrl ? (
                          <img src={card.logoImageUrl} alt={card.businessName} className="w-full h-full object-cover" />
                        ) : (
                          card.logoUrl || '🏪'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{card.businessName}</div>
                        <div className="text-xs text-zinc-400 truncate">
                          {card.nextVisitRewardTitle || 'Next-Visit Rewards + Leaderboard XP'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <Link
                        href={`/custom-nfc?cardId=${card.id}`}
                        className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center"
                      >
                        Customize
                      </Link>
                      <Link
                        href={`/tap/${card.id}`}
                        className="flex-1 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold text-center flex items-center justify-center gap-1"
                      >
                        <span>Live Tap Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REWARDS & PERKS VAULT */}
        {activeTab === 'rewards' && (
          <div className="space-y-5">
            {redeemMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold">
                {redeemMessage}
              </div>
            )}

            <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Redeemable Townraise Rewards</h2>
                <span className="text-xs font-bold text-amber-400">
                  Balance: {totalPoints.toLocaleString()} pts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loyaltyRewards.slice(0, 6).map((rew) => (
                  <div
                    key={rew.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{rew.title}</div>
                      <div className="text-xs text-zinc-400 mt-0.5">{rew.description}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs font-black text-amber-400">{rew.pointsCost} pts</span>
                      <button
                        onClick={() => handleRedeem(rew.id, rew.title)}
                        disabled={totalPoints < rew.pointsCost}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-white/10 disabled:text-zinc-500 text-black font-bold text-xs"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {unlockedPerks.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#0d0d14] border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span>Unlocked In-Store Perks</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unlockedPerks.map((perk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/25 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{perk.storeName}</div>
                        <div className="text-[11px] text-emerald-300 truncate">{perk.discountLabel}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(perk.voucherCode);
                          setCopiedCode(perk.voucherCode);
                          setTimeout(() => setCopiedCode(null), 1800);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-white shrink-0 flex items-center gap-1"
                      >
                        {copiedCode === perk.voucherCode ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{perk.voucherCode}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DIGITAL MEMBER PASS */}
        {activeTab === 'pass' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0d0d15] to-indigo-500/15 border border-amber-400/35 max-w-lg mx-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Townraise Carroll County Pass
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">{name}</h2>
                <p className="text-xs text-zinc-400">
                  {town}, NH • {roleLabel}
                </p>
              </div>
              <div className="p-2 rounded-2xl bg-white shadow-lg">
                <img src={qrUrl} alt="Member QR Pass" className="w-24 h-24 object-contain" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-zinc-400 block">Member ID</span>
                <span className="font-mono font-bold text-white">{memberId}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-zinc-400 block">Points &amp; Level</span>
                <span className="font-bold text-amber-400">
                  {totalPoints.toLocaleString()} pts • Lvl {cardProgression.currentLevel}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(memberId);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 1800);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied ID!' : 'Copy Member ID'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Pass</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
