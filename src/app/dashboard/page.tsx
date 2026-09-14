'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { 
  Radio, Star, ShieldCheck, Zap, TrendingUp, 
  ExternalLink, CheckCircle2, AlertTriangle, ArrowRight, 
  Search, Smartphone, MessageSquare, Plus, Save
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { cards, tapLogs, feedbacks, updateCard } = useNfcStore();

  const [globalGoogleUrl, setGlobalGoogleUrl] = useState(
    cards[0]?.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute aggregate stats
  const totalTaps = cards.reduce((acc, c) => acc + (c.totalTaps || 0), 0);
  const totalConversions = cards.reduce((acc, c) => acc + (c.googleConversions || 0), 0);
  const totalShielded = cards.reduce((acc, c) => acc + (c.privateFeedbacksCount || 0), 0);
  const conversionRate = totalTaps > 0 ? Math.round((totalConversions / totalTaps) * 100) : 92;

  const handleUpdateAllUrls = () => {
    cards.forEach((c) => {
      updateCard(c.id, { googleReviewUrl: globalGoogleUrl });
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
            Real-Time Node Telemetry
          </span>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
            Merchant Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cards"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Manage Cards</span>
          </Link>
          <Link
            href="/tap/card-oasis-main"
            target="_blank"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Radio className="w-4 h-4" />
            <span>Simulate Card Tap</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Total Card Taps</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-black italic text-white tracking-tight">{totalTaps}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last week
          </div>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">5-Star Conversion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-400/10 flex items-center justify-center text-emerald-400">
              <Star className="w-4 h-4 fill-emerald-400" />
            </div>
          </div>
          <p className="text-4xl font-black italic text-emerald-400 tracking-tight">{conversionRate}%</p>
          <p className="text-[10px] font-mono text-zinc-500">
            {totalConversions} Google reviews generated
          </p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Negative Reviews Shielded</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-400/10 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-black italic text-indigo-400 tracking-tight">{totalShielded}</p>
          <p className="text-[10px] font-mono text-indigo-300">
            Intercepted privately before Google
          </p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Active Fleet Beacons</span>
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-4xl font-black italic text-white tracking-tight">{cards.length}</p>
          <p className="text-[10px] font-mono text-emerald-400">
            ● 100% Nodes Online & Operational
          </p>
        </div>
      </div>

      {/* Quick Google Review URL / Place ID Configurator Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border border-amber-400/20 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400">Universal Link Routing</span>
            <h3 className="text-xl font-black italic text-white uppercase">Google Review Destination URL</h3>
            <p className="text-xs text-zinc-400">
              When a customer taps any of your NFC cards or standees, they are routed to this official Google Business review link.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={globalGoogleUrl}
            onChange={(e) => setGlobalGoogleUrl(e.target.value)}
            placeholder="https://search.google.com/local/writereview?placeid=..."
            className="flex-1 bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            onClick={handleUpdateAllUrls}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Updated All Cards! ✓' : 'Update All Cards'}</span>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Live Tap Stream & Private Shield Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Taps Stream */}
        <div className="lg:col-span-7 bg-[#0b0b10] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider">Live Feed</span>
              <h3 className="text-xl font-black italic text-white uppercase">Recent NFC Tap Activity</h3>
            </div>
            <span className="px-2.5 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full text-[9px] font-mono font-bold animate-pulse">
              ● Streaming
            </span>
          </div>

          <div className="space-y-3">
            {tapLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                    log.action === 'google_redirect' || log.action === 'direct_redirect'
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      : 'bg-indigo-400/10 text-indigo-400 border border-indigo-400/20'
                  }`}>
                    {log.action === 'google_redirect' || log.action === 'direct_redirect' ? '⭐' : '🛡️'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">
                      {log.action === 'google_redirect' || log.action === 'direct_redirect'
                        ? 'Google Review Forwarded'
                        : 'Private Feedback Submitted'}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {log.businessName} • {log.device} • {formatDate(log.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {log.ratingSelected && (
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {log.ratingSelected} ★
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Private Feedback / Shield Inbox */}
        <div className="lg:col-span-5 bg-[#0b0b10] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider">Negative Shield Inbox</span>
              <h3 className="text-xl font-black italic text-white uppercase">Protected Feedback</h3>
            </div>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No private complaints logged yet.</p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white">{fb.customerName || 'Anonymous Guest'}</p>
                      <p className="text-[9px] font-mono text-zinc-400">
                        {fb.customerEmail || fb.customerPhone || 'No contact provided'} • {formatDate(fb.timestamp)}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-mono font-bold">
                      {fb.rating} ★
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                    "{fb.feedbackText}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
