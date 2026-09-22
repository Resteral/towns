'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useNfcStore, PRESET_USERS } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { calculateCardProgression } from '@/lib/card-leveling';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  User, 
  Check, 
  Store, 
  Hammer, 
  Truck, 
  Gift, 
  Compass, 
  Trophy, 
  LogOut, 
  PlusCircle, 
  MapPin, 
  Phone,
  LayoutDashboard,
  Coins,
  Crown,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function HeroTapSimulator() {
  const { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    loyaltyWallet,
    storeHunterStamps, 
    passportStamps,
    activeTown
  } = useNfcStore();

  const [isSwitching, setIsSwitching] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick_roles' | 'custom_login'>('quick_roles');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customTown, setCustomTown] = useState(activeTown.name || 'Effingham');
  const [customRole, setCustomRole] = useState<UserRole>('resident');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  const handleSelectPreset = (user: UserProfile) => {
    loginUser(user);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setFeedbackMsg(`Welcome back, ${user.name}!`);
    setIsSwitching(false);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const isDriverRole = customRole === 'driver';
    const avatar = isDriverRole ? '🚗' : (customRole === 'merchant' ? '🥪' : customRole === 'contractor' ? '🔨' : '🌲');

    const newUser = registerUser({
      name: customName.trim(),
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@townraise.org`,
      phone: customPhone.trim() || '(508) 507-0305',
      role: customRole,
      avatar,
      town: customTown,
      state: 'NH',
      badge: isDriverRole ? 'Verified Community Courier' : `${customTown} Resident`,
      isDriver: isDriverRole
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setFeedbackMsg(`Account created for ${newUser.name}! +50 Welcome Points added.`);
    setIsSwitching(false);
    setCustomName('');
    setCustomPhone('');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 blur-3xl rounded-[3rem] opacity-70 -z-10 animate-pulse-slow" />

      {/* Simulator Device Frame */}
      <div className="bg-[#0b0b10] border-2 border-white/10 rounded-[2.5rem] p-4 sm:p-5 shadow-2xl shadow-black/80">
        <div className="relative bg-[#050508] border border-white/10 rounded-[2rem] p-5 sm:p-6 min-h-[560px] flex flex-col justify-between overflow-hidden">
          
          {/* Top Notch & Telemetry Bar */}
          <div className="flex justify-between items-center pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                Townraise Member Hub
              </span>
            </div>
            <div className="w-16 h-3 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-1 bg-zinc-800 rounded-full" />
            </div>
            <span className="text-[9px] font-mono text-amber-400 font-bold">Carroll County, NH</span>
          </div>

          {/* Toast Notification */}
          {feedbackMsg && (
            <div className="p-3 my-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 py-4 flex flex-col justify-center">
            
            {/* STATE 1: User Logged In & Active Digital Pass */}
            {currentUser && !isSwitching ? (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Resident Digital Pass Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#12121a] to-[#0a0a0f] border border-amber-400/30 shadow-xl relative overflow-hidden space-y-4">
                  
                  {/* Decorative background watermark */}
                  <div className="absolute top-2 right-3 opacity-10 text-5xl font-black font-mono select-none pointer-events-none">
                    NH
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                        {currentUser.avatar || '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-black text-white">{currentUser.name}</h4>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold uppercase">
                            Active Pass
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{currentUser.town || 'Effingham'}, NH • {currentUser.badge || 'Verified Resident'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Stats Row */}
                  <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Points</span>
                      <span className="text-xs font-black font-mono text-amber-400">
                        {loyaltyWallet?.userPoints || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Tier</span>
                      <span className="text-xs font-black text-purple-300 truncate block">
                        Lv.{cardProgression.currentLevel}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Taps</span>
                      <span className="text-xs font-black font-mono text-cyan-300">
                        {(storeHunterStamps?.length || 0) + (passportStamps?.length || 0)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Multi</span>
                      <span className="text-xs font-black font-mono text-indigo-300">
                        {cardProgression.multiplier}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 text-left pl-1">
                    Quick Account Shortcuts:
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/hunter-profile"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>My Profile & Pass</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/rewards"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-400" />
                        <span>Redeem Rewards</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/store-hunting"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-purple-400" />
                        <span>Store Hunting</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/dashboard"
                      className="p-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        <span>Dashboard Portal</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>

                {/* Switch Role Button */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => setIsSwitching(true)}
                    className="text-amber-400 hover:underline flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Switch Role / Account</span>
                  </button>

                  <button
                    onClick={() => logoutUser()}
                    className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            ) : (
              /* STATE 2: Log In / Switch Account Form */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                
                <div className="text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-mono font-bold uppercase">
                    <Sparkles className="w-3 h-3" /> Instant Member Access
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                    Sign In to Townraise
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Connect your account to claim courier deliveries, trade leads, and local store hunting discounts.
                  </p>
                </div>

                {/* Tabs: 1-Click Roles vs Quick Sign In */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('quick_roles')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      activeTab === 'quick_roles' 
                        ? 'bg-amber-400 text-black shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⚡ 1-Click Roles
                  </button>
                  <button
                    onClick={() => setActiveTab('custom_login')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      activeTab === 'custom_login' 
                        ? 'bg-amber-400 text-black shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ✍️ Create / Custom Sign In
                  </button>
                </div>

                {/* Tab 1: 1-Click Preset Roles */}
                {activeTab === 'quick_roles' && (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {PRESET_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectPreset(user)}
                        className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{user.avatar}</span>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              {user.badge} • {user.town}, NH
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-1 rounded-lg bg-white/5 group-hover:bg-amber-400 group-hover:text-black text-[9px] font-black uppercase tracking-wider transition-all shrink-0">
                          Log In ➔
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab 2: Custom Sign In Form */}
                {activeTab === 'custom_login' && (
                  <form onSubmit={handleCustomLogin} className="space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Phone Number</label>
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          placeholder="(603) 555-0199"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Town Node</label>
                        <select
                          value={customTown}
                          onChange={(e) => setCustomTown(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="Effingham">Effingham, NH</option>
                          <option value="Ossipee">Ossipee, NH</option>
                          <option value="Freedom">Freedom, NH</option>
                          <option value="Wolfeboro">Wolfeboro, NH</option>
                          <option value="Conway">Conway, NH</option>
                          <option value="Tamworth">Tamworth, NH</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Your Primary Role</label>
                      <select
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="resident">🌲 Resident & Scavenger Hunter</option>
                        <option value="merchant">🏪 Storefront & Restaurant Owner</option>
                        <option value="contractor">🛠️ Trade Contractor & Builder</option>
                        <option value="driver">🚚 Community Courier Driver (4x4)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Account & Log In</span>
                    </button>
                  </form>
                )}

                {currentUser && (
                  <button
                    onClick={() => setIsSwitching(false)}
                    className="w-full py-1.5 text-center text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    ← Back to Active Profile ({currentUser.name})
                  </button>
                )}

              </div>
            )}

          </div>

          {/* Device Footer Information */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>TOWNRAISE DECENTRALIZED IDENTITY</span>
            <span className="text-amber-400/80 font-bold">LIVE PASS</span>
          </div>

        </div>
      </div>
    </div>
  );
}
