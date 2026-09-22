'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Utensils, 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  Flame, 
  Waves, 
  Wrench, 
  MessageSquare,
  DollarSign,
  Maximize2,
  Minimize2,
  RefreshCw,
  Star,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront } from '@/lib/types';

interface BotMessage {
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

export default function AiOrderConciergeWidget() {
  const pathname = usePathname();
  const { storefronts, addToCart, cart, playDeliveryChime } = useNfcStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your Carroll County AI Concierge. What are you in the mood for today?",
      quickOptions: [
        '🍔 Hungry for Food / Order Lunch & Dinner',
        '🍕 Best Pizza & Wings in Carroll County',
        '🥩 Giant Steak & Cheese Sub',
        '☕ Morning Coffee & Brioche Bakery',
        '🌲 Lake Concierge & Campfire Firewood',
        '🛠️ Need a Local Contractor / Trades'
      ],
      timestamp: 'Just now'
    }
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Don't display on specific fullscreen routes if needed (e.g. tap routes)
  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  // Find matching dishes across all storefronts
  const findMatchingDishes = (query: string) => {
    const q = query.toLowerCase();
    const matches: { dish: StorefrontProduct; store: MerchantStorefront }[] = [];

    storefronts.forEach(store => {
      store.products.forEach(product => {
        const titleMatch = product.name.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);
        const catMatch = product.category.toLowerCase().includes(q);

        // Keyword heuristics
        const isPizzaQuery = (q.includes('pizza') || q.includes('slice') || q.includes('pie')) && product.category.toLowerCase().includes('pizza');
        const isSubQuery = (q.includes('sub') || q.includes('steak') || q.includes('sandwich') || q.includes('burger')) && (product.category.toLowerCase().includes('sub') || product.category.toLowerCase().includes('burger') || product.name.toLowerCase().includes('sub') || product.name.toLowerCase().includes('sandwich'));
        const isCoffeeQuery = (q.includes('coffee') || q.includes('bakery') || q.includes('breakfast') || q.includes('drink')) && (product.category.toLowerCase().includes('beverage') || product.category.toLowerCase().includes('bakery') || product.category.toLowerCase().includes('lunch'));
        const isGlutenFreeQuery = (q.includes('gluten') || q.includes('healthy') || q.includes('gf')) && (product.description.toLowerCase().includes('gluten') || product.badge?.toLowerCase().includes('gluten') || product.name.toLowerCase().includes('trout') || product.name.toLowerCase().includes('salad'));
        const isFoodGeneral = (q.includes('food') || q.includes('dinner') || q.includes('lunch') || q.includes('hungry') || q.includes('eat') || q.includes('menu'));

        if (titleMatch || descMatch || catMatch || isPizzaQuery || isSubQuery || isCoffeeQuery || isGlutenFreeQuery || (isFoodGeneral && (product.badge || matches.length < 3))) {
          matches.push({ dish: product, store });
        }
      });
    });

    // Fallback if generic query: grab top 3 popular dishes
    if (matches.length === 0) {
      storefronts.forEach(store => {
        if (store.products.length > 0 && matches.length < 3) {
          matches.push({ dish: store.products[0], store });
        }
      });
    }

    // Limit to 4 top items
    return matches.slice(0, 4);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // AI Logic processing
    setTimeout(() => {
      const lower = text.toLowerCase();

      // 1. Food Inquiries
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
        lower.includes('bbq') || 
        lower.includes('gluten')
      ) {
        const matches = findMatchingDishes(text);
        
        let intro = "Here are our top recommended dishes freshly prepared in Carroll County! Tap **Add to Order** on any item to start your meal:";
        if (lower.includes('pizza')) intro = "🍕 Craving pizza? Here are our best wood-fired and smokehouse pizzas in town:";
        if (lower.includes('sub') || lower.includes('steak')) intro = "🥩 Nothing beats a hot New England sub! Check out these customer favorites:";
        if (lower.includes('coffee') || lower.includes('breakfast')) intro = "☕ Fresh morning brews and bakery items ready for pickup or delivery:";
        if (lower.includes('gluten')) intro = "🌾 Here are great gluten-conscious & delicious options available today:";

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
              '☕ Coffee & Breakfast',
              '🚀 View Full Delivery Menus'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } 
      // 2. Firewood / Lake / Concierge
      else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('airbnb') || lower.includes('smores') || lower.includes('boat')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🌲 Visiting Lake Ossipee or Lake Winnipesaukee? We provide dockside firewood bundles & s'mores kit delivery, lake condition HUDs, and keyless check-in guides directly through our Lake Concierge portal!",
            quickOptions: [
              '🔥 Order Dockside Firewood Bundle ($24.99)',
              '🌊 Check Lake Water Temperature',
              '🍔 Show Me Food Delivery for Cabin'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 3. Trades / Contractors
      else if (lower.includes('contractor') || lower.includes('trade') || lower.includes('roof') || lower.includes('plumb') || lower.includes('carpenter') || lower.includes('builder')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🛠️ Looking for verified Carroll County trades? Post your project on our Trades Board or browse verified local carpenters, roofers, landscapers, and mechanics with 1-click quote requests!",
            quickOptions: [
              '🔨 Post a Free Quote Request',
              '👷 Browse Verified Contractors',
              '🍔 Show Food Delivery Menus'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 4. Default / General Inquiry
      else {
        const matches = findMatchingDishes('food');
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `I'd love to help you find whatever you need in Carroll County! Are you hungry for some delicious local food, or looking for local services? Here are a few popular options:`,
            suggestedDishes: matches.slice(0, 2),
            quickOptions: [
              '🍔 Show Best Food & Takeout',
              '🌲 Lake Concierge & Dock Delivery',
              '🎁 Check My Loyalty Rewards Points'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      setIsTyping(false);
      playDeliveryChime();
    }, 600);
  };

  // Add a recommended dish to the cart
  const handleAddDishToCart = (dish: StorefrontProduct, store: MerchantStorefront) => {
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
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 }
    });

    setAddedItemNotice(`Added "${dish.name}" to cart!`);
    playDeliveryChime();
    setTimeout(() => setAddedItemNotice(null), 3000);

    // Follow up in chat
    setMessages(prev => [
      ...prev,
      {
        id: `ai-added-${Date.now()}`,
        sender: 'ai',
        text: `✅ Added **${dish.name}** ($${dish.price.toFixed(2)}) to your cart! Would you like to add anything else or proceed to delivery checkout?`,
        showCheckoutBtn: true,
        quickOptions: [
          '🍕 Add a Pizza to Order',
          '🥤 Add Beverages or Sides',
          '🛒 Ready to Checkout'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceHover">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative px-4 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-2xl shadow-amber-500/30 border border-white/20 flex items-center gap-2.5 transition-all transform hover:scale-105"
          >
            <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
            <span>AI Food & Concierge Bot</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[640px] flex flex-col bg-[#0b0b14] border border-white/15 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden animate-fadeIn backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-[#0e0e18] to-amber-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white tracking-wide">Oasis AI Food Concierge</h3>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-white/50">Ask for food, firewood, or local recommendations</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/cart"
                className="p-2 text-white/60 hover:text-amber-400 rounded-xl hover:bg-white/5 transition-colors relative"
                title="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-black font-black text-[9px] flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toast Notification when item is added */}
          {addedItemNotice && (
            <div className="p-2.5 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{addedItemNotice}</span>
              </div>
              <Link href="/cart" className="text-[10px] underline font-black text-white hover:text-emerald-200">
                Go to Cart →
              </Link>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[420px] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Text */}
                <div
                  className={`max-w-[90%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#151522] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Checkout Button if suggested */}
                  {msg.showCheckoutBtn && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                      <Link
                        href="/cart"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Checkout Now ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                      </Link>
                    </div>
                  )}

                  {/* Interactive Food Recommendation Cards */}
                  {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                    <div className="mt-3 space-y-2.5">
                      {msg.suggestedDishes.map(({ dish, store }) => (
                        <div
                          key={dish.id}
                          className="p-2.5 rounded-xl bg-[#0c0c16] border border-white/10 flex items-center gap-3 hover:border-amber-400/40 transition-all"
                        >
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-bold text-white text-[11px] truncate">{dish.name}</h4>
                              <span className="font-black text-amber-400 text-xs shrink-0">${dish.price.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-white/50 truncate mt-0.5">{store.businessName} • {store.town}</p>
                            
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-[9px] text-white/40 font-mono">{dish.calories || 'Chef Special'}</span>
                              <button
                                onClick={() => handleAddDishToCart(dish, store)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider rounded-md shadow-sm transition-all flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to Order</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Interactive Reply Chips */}
                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                    {msg.quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt.replace(/^[^\w\s]+/, '').trim())}
                        className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-amber-300/90 hover:text-white transition-all text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[8px] text-white/30 font-mono px-1 mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#151522] border border-white/10 rounded-2xl px-3 py-2 w-28 text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] ml-1">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0e0e18] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="What are you craving? (e.g. Steak sub, pizza, firewood)..."
              className="flex-1 bg-[#161626] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black rounded-xl transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
