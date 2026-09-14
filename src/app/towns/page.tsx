'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import { TownNode } from '@/lib/types';
import { 
  Radio, Compass, ShieldCheck, MapPin, Truck, 
  ArrowRight, Plus, CheckCircle2, Search, Activity, Sparkles 
} from 'lucide-react';

export default function TownsRadarPage() {
  const router = useRouter();
  const { towns, activeTown, setActiveTown } = useNfcStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTowns = towns.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTown = (town: TownNode) => {
    setActiveTown(town.id);
    router.push(`/marketplace?town=${encodeURIComponent(town.name)}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Decentralized Regional Node Radar</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              Town <span className="text-amber-400">Nodes.</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Regional settlement capacity, active courier transit latency, and independent boutique networks across unified communities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan by town or state..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <Link
              href="/register-town"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Your Town Node</span>
            </Link>
          </div>
        </div>

        {/* Currently Active Town Indicator */}
        <div className="p-6 bg-[#0e0e14] border border-amber-400/30 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{activeTown.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Current Active Node:</span>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold rounded">
                  {activeTown.fullName}
                </span>
              </div>
              <p className="text-base font-black italic text-white">{activeTown.tagline} • Led by {activeTown.vanguardLead}</p>
            </div>
          </div>

          <Link
            href={`/marketplace?town=${encodeURIComponent(activeTown.name)}`}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Browse {activeTown.name} Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* Town Nodes Grid (Matching Oasis Effingham style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTowns.map((town) => {
            const isSelected = activeTown.id === town.id;
            return (
              <div
                key={town.id}
                className={`group relative bg-white/[0.03] border rounded-[3rem] p-8 md:p-10 hover:bg-white/[0.06] transition-all overflow-hidden flex flex-col justify-between min-h-[340px] ${
                  isSelected ? 'border-amber-400/60 shadow-2xl shadow-amber-400/10' : 'border-white/10'
                }`}
              >
                {/* Background Ambient Glow */}
                <div
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-all duration-1000 group-hover:scale-150 pointer-events-none"
                  style={{ backgroundColor: town.accentColor || '#f59e0b' }}
                />

                {/* Top Section */}
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                      {town.icon}
                    </span>

                    <div className={`px-4 py-1.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-widest border ${
                      town.status === 'peak_flow'
                        ? 'bg-amber-400/20 text-amber-400 border-amber-400/30 animate-pulse'
                        : town.status === 'stable'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {town.status === 'peak_flow' ? '● PEAK FLOW' : town.status === 'stable' ? '○ STABLE' : '🚀 LAUNCHING'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">
                      {town.name}
                    </h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                      {town.tagline} • {town.state}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {town.description}
                  </p>
                </div>

                {/* Middle Stats Grid */}
                <div className="pt-6 grid grid-cols-2 gap-6 relative z-10 border-t border-white/5 font-mono">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Boutiques</p>
                    <p className="text-2xl font-black italic text-white leading-none">{town.boutiquesCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">Routes</p>
                    <p className="text-2xl font-black italic text-indigo-400 leading-none">{town.routesCount}</p>
                  </div>
                </div>

                {/* Bottom Lattice & Switch Button */}
                <div className="pt-6 relative z-10 flex items-center justify-between">
                  <button
                    onClick={() => handleSelectTown(town)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'bg-white/10 hover:bg-amber-400 hover:text-black text-white'
                    }`}
                  >
                    {isSelected ? 'Active Node ✓' : 'Switch to Node'}
                  </button>

                  <div className="text-right">
                    <p className="text-3xl font-black italic tracking-tighter text-white/20 group-hover:text-amber-400/80 transition-colors">
                      {town.occupancyLattice}%
                    </p>
                    <p className="text-[7px] font-mono uppercase tracking-widest text-white/30 italic">Occupancy Lattice</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Launch Node Callout */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-8 md:p-12 rounded-[3rem] text-black flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase">
              Don't See Your Town Listed?
            </h3>
            <p className="text-xs md:text-sm font-bold opacity-85 leading-relaxed">
              Launch a community Town Node in 60 seconds. Set up your local courier delivery phone, invite local shops, and activate tap-to-review beacons for your town!
            </p>
          </div>

          <Link
            href="/register-town"
            className="px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
          >
            Launch Your Town Node Now
          </Link>
        </div>

      </div>
    </div>
  );
}
