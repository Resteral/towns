'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MessageSquare, ShieldCheck, Zap, 
  MapPin, Send, CheckCircle2, User, Sparkles, Building2, Radio
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function ContactPage() {
  const { activeTown, submitGeneralFeedback } = useNfcStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<'town_takeover' | 'nfc_cards' | 'business_storefront' | 'delivery_dispatch' | 'other'>('town_takeover');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitGeneralFeedback({
      businessName: topic === 'business_storefront' ? 'Storefront Inquiry' : 'Oasis Node Dispatch',
      rating: 5,
      category: 'suggestion',
      customerName: name || 'Anonymous Node Citizen',
      customerPhone: phone || undefined,
      customerEmail: email || undefined,
      feedbackText: `[Topic: ${topic.toUpperCase()}] ${message}`,
      town: activeTown.fullName,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-6 md:px-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Direct Node Communications</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">
            Contact <span className="text-amber-400">Sean Martin</span> & Node Support
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Need NFC review cards programmed for your town, want to launch a town node, set up your business storefront, or dispatch local deliveries? Reach out directly.
          </p>
        </div>

        {/* Lead Vanguard Card + Direct Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Vanguard Profile Card */}
          <div className="lg:col-span-1 p-8 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl relative overflow-hidden space-y-6 flex flex-col justify-between shadow-2xl shadow-amber-500/5">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20">
                  <div className="w-full h-full bg-[#0d0d12] rounded-[14px] flex items-center justify-center text-3xl">
                    👑
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Sean Martin</h2>
                  <p className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Founding Vanguard Lead</p>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Effingham & Regional Hub, NH
                  </p>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                Direct coordinator for physical-to-digital Google Review NFC deployment, decentralized town takeover onboarding, merchant storefront creation, and express phone notification relays.
              </p>

              {/* Quick direct contact links */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:5085070305"
                  className="flex items-center justify-between p-4 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-white group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-amber-300 uppercase font-bold">Direct Phone / SMS</div>
                      <div className="text-sm font-bold tracking-tight">508-507-0305</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform font-bold">Call →</span>
                </a>

                <a
                  href="mailto:frijj555@gmail.com"
                  className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-white group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-indigo-300 uppercase font-bold">Direct Email</div>
                      <div className="text-sm font-bold tracking-tight break-all">frijj555@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform font-bold">Email →</span>
                </a>
              </div>
            </div>

            {/* Live Service Guarantee Badges */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-amber-400 font-black text-sm">&lt; 15 Mins</div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Response Time</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-emerald-400 font-black text-sm">Active Node</div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Effingham Hub</div>
              </div>
            </div>
          </div>

          {/* Inquiry / Message Dispatch Form */}
          <div className="lg:col-span-2 p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant In-App Dispatch</span>
              </div>
              <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">Send Direct Message / Request</h2>
              <p className="text-xs text-zinc-400">
                Submit an inquiry below and it will be routed straight to Sean Martin’s notification center and feedback radar.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Transmission Dispatched!</h3>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Your request has been logged and sent to Sean Martin ({`(508) 507-0305`} / {`frijj555@gmail.com`}). You can expect a response shortly!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Walt Henderson"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Phone Number (Optional for SMS Reply)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (603) 555-0142"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. merchant@localbusiness.com"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as any)}
                      className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="town_takeover">🚩 Launch / Take Over Town Node</option>
                      <option value="nfc_cards">💳 Program Google Review NFC Cards</option>
                      <option value="business_storefront">🏪 Create Custom Business Website</option>
                      <option value="delivery_dispatch">🚚 Delivery & Dispatch Setup</option>
                      <option value="other">💬 General Question / Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Your Message / Business Details <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell Sean what you need: your business name, town location, or how you'd like to collaborate..."
                    className="w-full bg-[#0e0e14] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transmitted to {activeTown.fullName} Vanguard Node</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Transmission</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Access Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Create a Business Website</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Launch a standalone branded website with online ordering and automatic marketplace catalog syncing.
            </p>
            <Link href="/create-storefront" className="text-xs text-amber-400 hover:underline font-bold inline-block">
              Launch Site Builder →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Program Review Cards</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan surrounding businesses in Effingham and neighboring towns, extract Place IDs, and flash NFC cards.
            </p>
            <Link href="/dashboard/programmer" className="text-xs text-indigo-400 hover:underline font-bold inline-block">
              Open NFC Programmer →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Town Takeover Command</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Become the official Vanguard Lead for your town, onboard merchants, and run decentralized delivery networks.
            </p>
            <Link href="/dashboard/town-command" className="text-xs text-emerald-400 hover:underline font-bold inline-block">
              Open Town Command →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
