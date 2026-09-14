'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, Radio, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Smartphone, ExternalLink, RotateCcw } from 'lucide-react';

export default function HeroTapSimulator() {
  const [isTapped, setIsTapped] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleTap = () => {
    setIsTapped(true);
    setSelectedRating(null);
    setFeedbackSent(false);
    setFeedbackText('');
  };

  const handleRate = (stars: number) => {
    setSelectedRating(stars);
    if (stars >= 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setIsTapped(false);
    setSelectedRating(null);
    setFeedbackSent(false);
    setFeedbackText('');
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 blur-3xl rounded-[3rem] opacity-70 -z-10 animate-pulse-slow" />

      {/* Simulator Device Frame */}
      <div className="bg-[#0e0e13] border-2 border-white/10 rounded-[3rem] p-4 shadow-2xl shadow-black/80">
        <div className="relative bg-[#050507] border border-white/5 rounded-[2.5rem] p-6 min-h-[580px] flex flex-col justify-between overflow-hidden">
          
          {/* Phone Top Notch & NFC Beacon Sensor */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400">NFC BEACON READY</span>
            </div>
            <div className="w-20 h-4 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-1.5 bg-zinc-800 rounded-full" />
            </div>
            <span className="text-[9px] font-mono text-zinc-500">5G • 100%</span>
          </div>

          {/* Main Display Area */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            {!isTapped ? (
              /* State 0: Waiting for Tap */
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="relative inline-block">
                  {/* Glowing NFC rings */}
                  <div className="w-28 h-28 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <Radio className="w-10 h-10 text-amber-400 animate-bounce" />
                    </div>
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-black font-black text-[8px] uppercase tracking-widest rounded-full shadow-lg">
                    Tap Zone
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black italic tracking-tighter text-white uppercase">
                    Touch Card to Phone
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Simulate what your customer sees immediately when their smartphone brushes against your card.
                  </p>
                </div>

                {/* Simulated Physical NFC Card you can click */}
                <div
                  onClick={handleTap}
                  className="cursor-pointer group relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-amber-400/30 p-4 rounded-2xl shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300 max-w-xs mx-auto"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-amber-400" />
                      <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-300">OASIS REVIEW CARD</span>
                    </div>
                    <span className="text-xs">⚡</span>
                  </div>
                  <div className="py-4 text-left">
                    <p className="text-[9px] font-bold uppercase text-amber-400">Oasis Coffee & Bakery</p>
                    <p className="text-sm font-black italic text-white tracking-tight">Tap to Rate 5 Stars</p>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <span>NFC CHIP #8841</span>
                    <span className="text-amber-400 font-bold group-hover:underline">CLICK TO TAP ⚡</span>
                  </div>
                </div>
              </div>
            ) : selectedRating === null ? (
              /* State 1: Card Tapped -> Smart Gatekeeper Rating Prompt */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500 w-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-2xl">
                  ☕
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-2">
                    <CheckCircle2 className="w-3 h-3" /> NFC Tap Detected
                  </div>
                  <h4 className="text-lg font-black italic tracking-tighter text-white">
                    Oasis Coffee & Craft Bakery
                  </h4>
                  <p className="text-xs text-zinc-400">
                    How was your experience with Dave today?
                  </p>
                </div>

                {/* 5-Star Interactive Rating Selector */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Select your rating</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(star)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-amber-400 hover:bg-amber-400/10 hover:scale-125 transition-all text-zinc-500 hover:text-amber-400 group"
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-[8px] text-zinc-500 font-mono">
                    Smart Funnel: 4-5★ routes to Google • 1-3★ opens private feedback
                  </p>
                </div>
              </div>
            ) : selectedRating >= 4 ? (
              /* State 2A: 4-5 Stars -> Celebratory Direct Google Redirect Prompt */
              <div className="space-y-6 animate-in fade-in zoom-in duration-500 w-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-3xl">
                  🎉
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center gap-1 text-amber-400">
                    {Array.from({ length: selectedRating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="text-xl font-black italic text-white tracking-tight">
                    Thank You for 5 Stars!
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Redirecting to the official Google Business review form so your review goes live on Google Maps in 1 click.
                  </p>
                </div>

                <a
                  href="https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    Post on Google Maps <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              </div>
            ) : (
              /* State 2B: 1-3 Stars -> Private Shield Feedback Form */
              <div className="space-y-4 animate-in fade-in zoom-in duration-500 w-full text-left">
                <div className="flex items-center gap-2 p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    Rating Shield Active: Private Manager Feedback
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">
                    We appreciate your honest feedback
                  </h4>
                  <p className="text-xs text-zinc-400">
                    How can our manager make this right for you?
                  </p>
                </div>

                {!feedbackSent ? (
                  <div className="space-y-3">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Tell the store manager what happened..."
                      className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 resize-none"
                    />
                    <button
                      onClick={() => setFeedbackSent(true)}
                      className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition-all"
                    >
                      Submit Directly to Store Manager
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-emerald-300">Feedback dispatched privately.</p>
                    <p className="text-[10px] text-zinc-400">Your Google profile rating remains protected.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset / Demo controller footer */}
          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-500">TAP SIMULATOR v2.4</span>
            {isTapped && (
              <button
                onClick={handleReset}
                className="text-[9px] font-bold text-amber-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
