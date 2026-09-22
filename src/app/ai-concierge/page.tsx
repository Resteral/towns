'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Utensils, 
  ShoppingBag, 
  Check, 
  Plus, 
  Flame, 
  ArrowRight, 
  Star,
  Coffee,
  Waves,
  Wrench,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront } from '@/lib/types';

interface ConciergeMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedDishes?: {
    dish: StorefrontProduct;
    store: MerchantStorefront;
  }[];
  quickOptions?: string[];
  showCheckoutBtn?: boolean;
  timestamp: string;
}

export default function DedicatedAiConciergePage() {
  const { storefronts, addToCart, cart, playDeliveryChime } = useNfcStore();
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ConciergeMsg[]>([
    {
      id: 'msg-start',
      sender: 'ai',
      text: "👋 Welcome to the Carroll County AI Food & Concierge Assistant! What are you craving or looking for today?",
      quickOptions: [
        '🍔 Hungry for Food / Lunch & Dinner',
        '🍕 Best Pizza & Wings in Carroll County',
        '🥩 Giant Steak & Cheese Sub',
        '☕ Morning Coffee & Brioche Bakery',
        '🌾 Gluten-Free & Healthy Options',
        '🌲 Campfire Firewood & Lake S\'mores Kit'
      ],
      timestamp: 'Just now'
    }
  ]);

  // Find matching dishes
  const findMatchingDishes = (query: string) => {
    const q = query.toLowerCase();
    const matches: { dish: StorefrontProduct; store: MerchantStorefront }[] = [];

    storefronts.forEach(store => {
      store.products.forEach(product => {
        const titleMatch = product.name.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);
        const catMatch = product.category.toLowerCase().includes(q);

        const isPizzaQuery = (q.includes('pizza') || q.includes('slice')) && product.category.toLowerCase().includes('pizza');
        const isSubQuery = (q.includes('sub') || q.includes('steak') || q.includes('sandwich') || q.includes('burger')) && (product.category.toLowerCase().includes('sub') || product.category.toLowerCase().includes('burger') || product.name.toLowerCase().includes('sub'));
        const isCoffeeQuery = (q.includes('coffee') || q.includes('bakery') || q.includes('breakfast')) && (product.category.toLowerCase().includes('beverage') || product.category.toLowerCase().includes('bakery'));
        const isGlutenFreeQuery = (q.includes('gluten') || q.includes('gf')) && (product.description.toLowerCase().includes('gluten') || product.badge?.toLowerCase().includes('gluten') || product.name.toLowerCase().includes('trout'));
        const isFoodGeneral = (q.includes('food') || q.includes('dinner') || q.includes('lunch') || q.includes('hungry') || q.includes('eat'));

        if (titleMatch || descMatch || catMatch || isPizzaQuery || isSubQuery || isCoffeeQuery || isGlutenFreeQuery || (isFoodGeneral && (product.badge || matches.length < 3))) {
          matches.push({ dish: product, store });
        }
      });
    });

    if (matches.length === 0) {
      storefronts.forEach(store => {
        if (store.products.length > 0 && matches.length < 3) {
          matches.push({ dish: store.products[0], store });
        }
      });
    }

    return matches.slice(0, 4);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ConciergeMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();

      if (
        lower.includes('food') || 
        lower.includes('eat') || 
        lower.includes('dinner') || 
        lower.includes('lunch') || 
        lower.includes('hungry') || 
        lower.includes('pizza') || 
        lower.includes('sub') || 
        lower.includes('steak') || 
        lower.includes('burger') || 
        lower.includes('coffee') || 
        lower.includes('trout') || 
        lower.includes('wings') || 
        lower.includes('gluten')
      ) {
        const matches = findMatchingDishes(text);
        let intro = "Here are our top recommended dishes prepared fresh in Carroll County! Tap **Add to Order** to add any dish to your cart:";
        if (lower.includes('pizza')) intro = "🍕 Looking for hot pizza? Here are our top wood-fired & smokehouse pies:";
        if (lower.includes('sub') || lower.includes('steak')) intro = "🥩 Hot and savory subs made fresh on Route 25:";
        if (lower.includes('coffee') || lower.includes('breakfast')) intro = "☕ Single-origin espresso and artisan bakery breakfast items:";
        if (lower.includes('gluten')) intro = "🌾 Here are great gluten-conscious options:";

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: intro,
            suggestedDishes: matches,
            quickOptions: [
              '🥩 Show me Steak & Cheese Subs',
              '🍕 Show me Pizzas',
              '☕ Coffee & Bakery Treats',
              '🚀 View All Restaurant Menus'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const matches = findMatchingDishes('food');
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "I can help you order food, find local services, or dispatch dockside firewood. Here are a few popular selections:",
            suggestedDishes: matches.slice(0, 2),
            quickOptions: [
              '🍔 Show Best Food & Takeout',
              '🌲 Lake Concierge & Firewood',
              '🎁 Loyalty Rewards Hub'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      setIsTyping(false);
      playDeliveryChime();
    }, 600);
  };

  const handleAddDish = (dish: StorefrontProduct, store: MerchantStorefront) => {
    addToCart({
      id: `food-${dish.id}-${Date.now()}`,
      name: dish.name,
      slug: dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subtitle: `${store.businessName} • ${store.town}`,
      description: dish.description,
      price: dish.price,
      rating: 5.0,
      reviewsCount: 1,
      category: 'food',
      features: dish.badge ? [dish.badge] : [],
      imageUrl: dish.imageUrl,
      inStock: true,
      sellerName: store.businessName,
      sellerPhone: store.phone,
      town: `${store.town}, ${store.state}`,
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });

    setAddedItemNotice(`Added "${dish.name}" to cart!`);
    playDeliveryChime();
    setTimeout(() => setAddedItemNotice(null), 3000);

    setMessages(prev => [
      ...prev,
      {
        id: `ai-add-${Date.now()}`,
        sender: 'ai',
        text: `✅ Added **${dish.name}** ($${dish.price.toFixed(2)}) to your cart! You can order more or proceed straight to checkout.`,
        showCheckoutBtn: true,
        quickOptions: [
          '🍕 Add a Pizza to Order',
          '🥤 Add Beverages & Sides',
          '🛒 Checkout Now'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e0e18] to-indigo-950/40 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live 24/7 AI Food Concierge
              </div>
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
                Carroll County Smart Food & Order Bot
              </h1>
            </div>
          </div>

          <Link
            href="/cart"
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 self-start sm:self-center shadow-lg shadow-amber-400/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </Link>
        </div>

        {/* Added Item Toast */}
        {addedItemNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{addedItemNotice}</span>
            </div>
            <Link href="/cart" className="text-xs font-black underline hover:text-white">
              Proceed to Cart →
            </Link>
          </div>
        )}

        {/* Main Chat Stream */}
        <div className="bg-[#0b0b14] border border-white/10 rounded-3xl p-6 space-y-5 min-h-[500px] shadow-2xl">
          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 leading-relaxed text-xs md:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#141422] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Checkout Button */}
                  {msg.showCheckoutBtn && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Proceed to Delivery Checkout ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                      </Link>
                    </div>
                  )}

                  {/* Suggested Food Cards */}
                  {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {msg.suggestedDishes.map(({ dish, store }) => (
                        <div
                          key={dish.id}
                          className="p-3 rounded-2xl bg-[#0c0c16] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate">{dish.name}</h4>
                              <p className="text-[10px] text-white/50 truncate mt-0.5">{store.businessName} • {store.town}</p>
                              <div className="text-xs font-black text-amber-400 mt-1">${dish.price.toFixed(2)}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[10px] text-white/40 font-mono">{dish.calories || 'Chef Special'}</span>
                            <button
                              onClick={() => handleAddDish(dish, store)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Order</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Option Chips */}
                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                    {msg.quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt.replace(/^[^\w\s]+/, '').trim())}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-amber-300 hover:text-white transition-all text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-white/30 font-mono px-1 mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#141422] border border-white/10 rounded-2xl px-4 py-2.5 w-32 text-white/50 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Thinking...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 pt-4 border-t border-white/10"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tell me what you're hungry for (e.g. 'I want a steak & cheese sub', 'pepperoni pizza', 'cold brew')..."
              className="flex-1 bg-[#131320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Ask Bot</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
