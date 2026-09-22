'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Star, 
  ArrowRight, 
  Utensils, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Plus
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct } from '@/lib/types';

export default function AiAssistantPage() {
  const { storefronts, importAiScannedMenu } = useNfcStore();
  const [selectedStorefrontId, setSelectedStorefrontId] = useState(storefronts[0]?.id || 'sf-pnb-eats');
  const [activeTab, setActiveTab] = useState<'menu_scanner' | 'review_responder'>('menu_scanner');

  // Menu Scanner State
  const [rawMenuInput, setRawMenuInput] = useState(`The Moose Mountain Burger - $14.99
Double smashed patties, melted sharp cheddar, smoked bacon, caramelized onions, house burger sauce on toasted brioche bun. (Best Seller)

Crispy Buffalo Chicken Flatbread - $13.50
Shredded chicken, spicy buffalo glaze, melted mozzarella, gorgonzola crumbles, scallions, buttermilk ranch drizzle.

Lake Trout Fish & Chips - $16.99
Fresh local beer-battered lake trout, hand-cut fries, house creamy coleslaw, lemon tartar sauce.`);

  const [isScanning, setIsScanning] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<StorefrontProduct[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Review Responder State
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [customerName, setCustomerName] = useState('Sarah J.');
  const [customerReviewText, setCustomerReviewText] = useState('Best steak and cheese sub in Carroll County! The staff was super friendly and food came out in 10 minutes. Will be back every weekend.');
  const [responseTone, setResponseTone] = useState<'grateful_seo' | 'friendly' | 'apology_resolution' | 'concise'>('grateful_seo');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Simulated AI Menu Parsing
  const handleScanMenu = () => {
    setIsScanning(true);
    setTimeout(() => {
      const lines = rawMenuInput.split('\n\n').filter(Boolean);
      const generated: StorefrontProduct[] = lines.map((block, idx) => {
        const firstLine = block.split('\n')[0] || '';
        const descLine = block.split('\n')[1] || 'Handcrafted fresh using premium local ingredients.';
        const priceMatch = firstLine.match(/\$([0-9.]+)/);
        const nameClean = firstLine.replace(/\s*-\s*\$[0-9.]+.*$/, '').trim() || `Special Item #${idx + 1}`;
        const price = priceMatch ? parseFloat(priceMatch[1]) : 12.99;

        return {
          id: `ai-prod-${Date.now()}-${idx}`,
          name: nameClean,
          description: descLine,
          price,
          category: idx === 0 ? 'Burgers & Subs' : idx === 1 ? 'Flatbreads & Pizzas' : 'Seafood & Entrees',
          imageUrl: idx === 0 
            ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80'
            : idx === 1
            ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
          inStock: true,
          badge: idx === 0 ? 'Chef Favorite' : undefined
        };
      });

      setParsedProducts(generated);
      setIsScanning(false);
    }, 1200);
  };

  const handleApplyImport = () => {
    if (parsedProducts.length === 0) return;
    importAiScannedMenu(selectedStorefrontId, parsedProducts);
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      setParsedProducts([]);
    }, 3000);
  };

  // Simulated AI Review Response Generation
  const handleGenerateReply = () => {
    const targetStore = storefronts.find(s => s.id === selectedStorefrontId)?.businessName || 'our team';

    if (reviewStars >= 4) {
      if (responseTone === 'grateful_seo') {
        setGeneratedResponse(`Thank you so much for the 5-star review, ${customerName}! Here at ${targetStore}, our family takes immense pride in handcrafting the best hot subs and pizzas in Carroll County, NH. We can't wait to welcome you back next weekend for another great meal on Route 25!`);
      } else if (responseTone === 'friendly') {
        setGeneratedResponse(`Awesome to hear, ${customerName}! 🌟 It means the world to our kitchen staff. See you real soon!`);
      } else {
        setGeneratedResponse(`Thank you for your high rating and patronage, ${customerName}. We appreciate you supporting local Carroll County dining!`);
      }
    } else {
      setGeneratedResponse(`Hi ${customerName}, thank you for bringing this to our attention. We hold our food and service to the highest standards at ${targetStore} and are deeply sorry that your experience fell short. Please text or call our manager directly at (603) 539-7440 so we can make this right and treat you to your next meal on us.`);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5" />
            AI Business Automation Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            AI Menu Importer & Smart Review Responder
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Turn physical paper menus into live interactive ordering items in 10 seconds, and draft SEO-optimized Google review replies.
          </p>
        </div>

        <Link
          href="/dashboard/storefront"
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start"
        >
          <span>View Live Digital Menus</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Select Restaurant Target */}
      <div className="p-4 bg-[#0d0d12] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-white/60 uppercase">Target Restaurant:</span>
        <select
          value={selectedStorefrontId}
          onChange={(e) => setSelectedStorefrontId(e.target.value)}
          className="w-full sm:w-80 bg-[#181820] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
        >
          {storefronts.map((s) => (
            <option key={s.id} value={s.id}>{s.businessName} ({s.town})</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('menu_scanner')}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'menu_scanner'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>AI Vision Menu Importer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('review_responder');
            handleGenerateReply();
          }}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'review_responder'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Google Review Reply Bot</span>
        </button>
      </div>

      {/* Tab 1: AI Menu Scanner */}
      {activeTab === 'menu_scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Block */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Paper Menu Text or Photo OCR</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Auto-Parser V2</span>
            </div>

            <p className="text-white/60 text-xs leading-relaxed font-light">
              Paste raw text from a physical menu, flyer, or photo OCR transcription. The AI will extract item titles, prices, descriptions, and categories.
            </p>

            <textarea
              rows={8}
              value={rawMenuInput}
              onChange={(e) => setRawMenuInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white/90 focus:outline-none focus:border-amber-400 leading-relaxed"
            />

            <button
              onClick={handleScanMenu}
              disabled={isScanning}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Parsing Menu Elements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Digital Menu Items ➔</span>
                </>
              )}
            </button>
          </div>

          {/* Output Preview Block */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>Extracted Digital Items ({parsedProducts.length})</span>
                </h3>
                {importSuccess && (
                  <span className="text-[10px] text-emerald-400 font-bold animate-bounce flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Published to Live Menu!
                  </span>
                )}
              </div>

              {parsedProducts.length === 0 ? (
                <div className="py-16 text-center text-white/30 text-xs border border-dashed border-white/10 rounded-2xl p-6">
                  Click &quot;Extract Digital Menu Items&quot; to preview structured food products ready for online ordering.
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {parsedProducts.map((p, i) => (
                    <div key={i} className="p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-amber-400">
                            {p.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 line-clamp-1">{p.description}</p>
                      </div>
                      <span className="text-sm font-black text-emerald-400 font-mono">${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {parsedProducts.length > 0 && (
              <button
                onClick={handleApplyImport}
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish {parsedProducts.length} Items to Live Digital Menu</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: AI Review Responder */}
      {activeTab === 'review_responder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Review Input */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Incoming Google Review</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 font-bold">Star Rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setReviewStars(s);
                    handleGenerateReply();
                  }}
                  className={`p-1.5 rounded-lg ${reviewStars >= s ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1">
                Review Text
              </label>
              <textarea
                rows={4}
                value={customerReviewText}
                onChange={(e) => setCustomerReviewText(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/90 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1">
                Response Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setResponseTone('grateful_seo')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    responseTone === 'grateful_seo' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  Grateful & Local SEO
                </button>
                <button
                  onClick={() => setResponseTone('friendly')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    responseTone === 'friendly' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  Friendly & Warm
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReply}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Regenerate AI Draft ➔
            </button>
          </div>

          {/* AI Response Output */}
          <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>Tailored Google Maps Reply</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">SEO Optimized</span>
              </div>

              <div className="p-4 bg-gradient-to-b from-indigo-950/30 to-[#181824] border border-indigo-500/20 rounded-2xl text-xs text-white/90 leading-relaxed font-light mb-6">
                &quot;{generatedResponse || 'Generating response...'}&quot;
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-white/50 space-y-1">
                <span className="text-amber-400 font-bold block">Why this reply works:</span>
                <p>Includes local Carroll County keywords, reinforces hospitality, and gives high-star social proof to potential Google Maps searchers.</p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(generatedResponse)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              {copiedNotice ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNotice ? 'Copied to Clipboard!' : 'Copy Reply to Post on Google Maps'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
