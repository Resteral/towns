'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore, PRESET_USERS } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { 
  X, 
  User, 
  Check, 
  Truck, 
  ShieldCheck, 
  LogOut, 
  Store, 
  Hammer, 
  Sparkles, 
  Phone, 
  MapPin, 
  Car, 
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Radio
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    deliveryDrivers, 
    toggleDriverStatus,
    loyaltyWallet 
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'presets' | 'register'>('presets');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    town: 'Effingham',
    state: 'NH',
    role: 'driver' as UserRole,
    avatar: '🚗',
    vehicleName: 'Subaru Outback AWD',
    isDriver: true
  });
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentDriverRecord = currentUser?.isDriver 
    ? deliveryDrivers.find(d => d.id === currentUser.driverMemberId || d.email === currentUser.email || d.phone === currentUser.phone)
    : null;

  const handleSelectPreset = (user: UserProfile) => {
    loginUser(user);
    setSuccessMsg(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    const isDriverRole = registerForm.role === 'driver' || registerForm.isDriver;
    const avatar = isDriverRole ? (registerForm.avatar || '🚗') : (registerForm.role === 'merchant' ? '🥪' : registerForm.role === 'contractor' ? '🔨' : '🌲');

    const newUser = registerUser({
      name: registerForm.name,
      email: registerForm.email || `${registerForm.name.toLowerCase().replace(/\s+/g, '.')}@carrollcounty.local`,
      phone: registerForm.phone,
      role: registerForm.role,
      avatar,
      town: registerForm.town,
      state: registerForm.state,
      badge: isDriverRole ? 'Verified Community Courier' : `${registerForm.town} Resident`,
      isDriver: isDriverRole
    });

    setSuccessMsg(`Welcome, ${newUser.name}! Your account is active.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Carroll County Community Auth & Telemetry</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
              {currentUser ? 'Your Profile & Account' : 'Sign In or Join Our Towns'}
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Connect to on-the-go delivery dispatches, instant contractor leads, and local rewards.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Active Logged In View */}
        {currentUser && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner">
                  {currentUser.avatar || '👑'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentUser.town}, {currentUser.state} • {currentUser.phone}</span>
                  </p>
                  {currentUser.badge && (
                    <p className="text-[11px] font-mono text-amber-400 font-bold mt-1">
                      ✨ {currentUser.badge}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/hunter-profile"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black uppercase tracking-wider transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                >
                  <User className="w-4 h-4" />
                  <span>Hunter Profile</span>
                </Link>

                <button
                  onClick={() => {
                    logoutUser();
                    setSuccessMsg('Logged out successfully.');
                    setTimeout(() => setSuccessMsg(''), 1500);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Driver Duty Shift Switcher */}
            {currentUser.isDriver && (
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Driver Duty Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                      currentDriverRecord?.status === 'online_ready' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                        : currentDriverRecord?.status === 'on_delivery'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-zinc-700/40 text-zinc-400 border border-zinc-600'
                    }`}>
                      {currentDriverRecord?.status === 'online_ready' ? '🟢 Online & Ready for Runs' : currentDriverRecord?.status === 'on_delivery' ? '🟡 On Active Run' : '🔴 Off Duty'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                    {currentDriverRecord?.vehicleName || 'AWD Vanguard Vehicle'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (currentDriverRecord) {
                        toggleDriverStatus(currentDriverRecord.id);
                      }
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
                      currentDriverRecord?.status === 'online_ready'
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                    }`}
                  >
                    {currentDriverRecord?.status === 'online_ready' ? 'Go Off Duty' : 'Go Online Now'}
                  </button>
                  <Link
                    href="/drivers"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all flex items-center gap-1"
                  >
                    <span>View Roster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Selector for Switcher / Registration */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            ⚡ 1-Click Role Switcher ({PRESET_USERS.length})
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            ➕ Register New Member / Driver
          </button>
        </div>

        {/* TAB 1: 1-Click Role Switcher */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Select any verified local identity for instant access:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_USERS.map((preset) => {
                const isSelected = currentUser?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/50 shadow-lg shadow-amber-400/10'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-white/5 border border-white/10">
                          {preset.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{preset.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            📍 {preset.town}, {preset.state}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        preset.role === 'driver' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        preset.role === 'merchant' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        preset.role === 'contractor' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {preset.role}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-zinc-400 font-light">
                      {preset.badge || `${preset.town} Member`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Register New Driver / Member */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sam Miller"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Phone (SMS Pings) *</label>
                <input 
                  type="tel"
                  required
                  placeholder="(603) 555-0123"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  placeholder="sam@gmail.com"
                  value={registerForm.email}
                  onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Primary Town</label>
                <select
                  value={registerForm.town}
                  onChange={e => setRegisterForm({...registerForm, town: e.target.value})}
                  className="w-full px-4 py-3 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Effingham">Effingham, NH</option>
                  <option value="Center Ossipee">Center Ossipee, NH</option>
                  <option value="Freedom">Freedom, NH</option>
                  <option value="Wakefield">Wakefield / Sanbornville, NH</option>
                  <option value="Conway">Conway / North Conway, NH</option>
                  <option value="Wolfeboro">Wolfeboro, NH</option>
                  <option value="Tamworth">Tamworth, NH</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Account Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'driver', label: '🚗 Delivery Driver', desc: 'Accept runs & earn' },
                  { role: 'resident', label: '🌲 Town Resident', desc: 'Order food & groceries' },
                  { role: 'merchant', label: '🥪 Shop Owner', desc: 'List menu & goods' },
                  { role: 'contractor', label: '🔨 Contractor', desc: 'Receive work leads' },
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setRegisterForm({
                        ...registerForm, 
                        role: r.role as UserRole,
                        isDriver: r.role === 'driver',
                        avatar: r.role === 'driver' ? '🚗' : r.role === 'merchant' ? '🥪' : r.role === 'contractor' ? '🔨' : '🌲'
                      });
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      registerForm.role === r.role
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">{r.label}</p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {registerForm.role === 'driver' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Driver Vehicle & Capabilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    placeholder="Vehicle (e.g. Subaru Outback AWD / Ford F-150)"
                    value={registerForm.vehicleName}
                    onChange={e => setRegisterForm({...registerForm, vehicleName: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Ready for Hannaford, PNB Eats & Express Runs</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Account & Start</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Townraise Decentralized Auth</span>
          <Link 
            href="/drivers" 
            onClick={onClose} 
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View Active Online Driver Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
