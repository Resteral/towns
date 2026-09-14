'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Star, Radio, ShieldCheck, CheckCircle2, ExternalLink, 
  Sparkles, MessageSquare, ArrowRight, Heart, ThumbsUp 
} from 'lucide-react';

export default function TapRouterPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = (params?.id as string) || 'card-oasis-main';
  const { cards, recordTap, submitFeedback } = useNfcStore();

  const [card, setCard] = useState<NfcCardConfig | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Find matching card or fallback
    const foundCard = cards.find(c => c.id === cardId) || cards[0];
    if (foundCard) {
      setCard(foundCard);

      // If direct mode, redirect after a moment
      if (foundCard.mode === 'direct_google') {
        setIsRedirecting(true);
        recordTap(foundCard.id, 'direct_redirect');
        const timer = setTimeout(() => {
          if (foundCard.googleReviewUrl) {
            window.location.href = foundCard.googleReviewUrl;
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [cardId, cards]);

  const handleRate = (stars: number) => {
    if (!card) return;
    setSelectedRating(stars);

    if (stars >= (card.thresholdStars || 4)) {
      // 4-5 Stars: Direct to Google
      recordTap(card.id, 'google_redirect', stars);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setIsRedirecting(true);

      setTimeout(() => {
        if (card.googleReviewUrl) {
          window.location.href = card.googleReviewUrl;
        }
      }, 1400);
    } else {
      // 1-3 Stars: Negative Shield / Feedback
      recordTap(card.id, 'private_feedback', stars);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !feedbackText.trim()) return;

    submitFeedback(card.id, selectedRating || 3, feedbackText, {
      name: customerName,
      phone: customerContact.includes('@') ? undefined : customerContact,
      email: customerContact.includes('@') ? customerContact : undefined,
    });
    setFeedbackSent(true);
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070709] text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Locating NFC Beacon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-black relative overflow-hidden">
      
      {/* Background glow tailored to card color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[140px] opacity-40 pointer-events-none rounded-full"
        style={{ backgroundColor: card.primaryColor || '#f59e0b' }}
      />

      <div className="w-full max-w-md bg-[#0f0f15] border border-white/10 rounded-[3rem] p-6 md:p-8 shadow-2xl relative z-10 space-y-8 animate-in zoom-in-95 duration-500">
        
        {/* Top Header: Business Logo & Verification badge */}
        <div className="text-center space-y-3">
          <div 
            className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-xl border border-white/10"
            style={{ backgroundColor: `${card.primaryColor || '#f59e0b'}25` }}
          >
            {card.logoUrl || '⭐'}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono font-bold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Google Review Node</span>
            </div>
            <h1 className="text-2xl font-black italic tracking-tight text-white uppercase">{card.businessName}</h1>
            {card.assignedStaff && (
              <p className="text-xs text-amber-400 font-medium">Served with pride by {card.assignedStaff}</p>
            )}
          </div>
        </div>

        {/* Dynamic Card State */}
        {card.mode === 'direct_google' || isRedirecting ? (
          /* Direct Redirect / Success Loading Screen */
          <div className="text-center space-y-6 py-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🎉
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black italic text-white">Opening Google Reviews...</h2>
              <p className="text-xs text-zinc-400">
                Forwarding your review directly to Google Maps.
              </p>
            </div>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-amber-400 animate-pulse" />
            </div>
            <a
              href={card.googleReviewUrl}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-mono"
            >
              <span>Click here if not redirected</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : selectedRating === null ? (
          /* Rating Selector Screen */
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-center space-y-4">
              <p className="text-sm font-bold text-zinc-200">
                {card.customHeadline || 'How was your experience today?'}
              </p>

              {/* 5 Stars Buttons */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHighlighted = (hoveredRating !== null ? star <= hoveredRating : false);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => handleRate(star)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-400/20 hover:scale-125 active:scale-95 transition-all text-zinc-600 hover:text-amber-400 group"
                    >
                      <Star className={`w-7 h-7 fill-current ${isHighlighted ? 'text-amber-400' : ''}`} />
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Tap a star to submit review</p>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center items-center gap-4 text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Patron</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Tap Submission</span>
            </div>
          </div>
        ) : selectedRating < (card.thresholdStars || 4) && !feedbackSent ? (
          /* Private Rating Shield / Manager Feedback Form */
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">Direct Manager Escalation</p>
                <p className="text-[10px] text-indigo-200/70">Your thoughts go straight to the business owner privately.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Phone or Email (Optional for followup)
                </label>
                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="e.g. (603) 555-0199"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  How can we improve? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Let the store manager know what we could have done better..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
              >
                Send Private Note to Manager
              </button>
            </div>
          </form>
        ) : (
          /* Private Feedback Success State */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black italic text-white uppercase">Thank You</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Your message has been dispatched directly to the store manager. We appreciate you helping us improve!
              </p>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-zinc-600">
          <span>OASISTAP PROTOCOL</span>
          <span>NODE ID: {card.id}</span>
        </div>
      </div>
    </div>
  );
}
