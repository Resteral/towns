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
  Filter,
  Truck,
  Phone,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront, DeliveryOrder } from '@/lib/types';

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
  showDeliveryForm?: boolean;
  confirmedDeliveryOrder?: DeliveryOrder;
  timestamp: string;
}

export default function DedicatedAiConciergePage() {
  const { storefronts, addToCart, cart, clearCart, placeDeliveryOrder, sendManualSms, playDeliveryChime } = useNfcStore();
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // In-Chat Dispatch State
  const [custName, setCustName] = useState('Alex Tremblay');
  const [custPhone, setCustPhone] = useState('(603) 555-0199');
  const [custAddress, setCustAddress] = useState('Pine Cove Dock 3, Ossipee Lake (Freedom, NH)');
  const [custPayment, setCustPayment] = useState<'cash_on_delivery' | 'cash_app' | 'venmo' | 'card'>('cash_on_delivery');
  const [custNotes, setCustNotes] = useState('Leave on dock table. Text when arrived.');
  const [isDispatching, setIsDispatching] = useState(false);

  const [messages, setMessages] = useState<ConciergeMsg[]>([
    {
      id: 'msg-start',
      sender: 'ai',
      text: "👋 Welcome to the Carroll County AI Food & Concierge Assistant! What are you craving today? I can suggest top-rated local dishes and immediately dispatch courier Sean Martin to deliver to your door or boat dock!",
      quickOptions: [
        '🍔 Hungry for Food / Lunch & Dinner',
        '🥩 Giant Steak & Cheese Sub',
        '🍕 Best Wood-Fired Pizza & Wings',
        '☕ Morning Coffee & Brioche Bakery',
        '🌲 Campfire Firewood & S\'mores Kit',
        '🚀 Dispatch Sean Martin to Deliver'
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

      // 1. Delivery Request
      if (lower.includes('deliver') || lower.includes('sean') || lower.includes('dispatch') || lower.includes('courier')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🚗 **Sean Martin** is on duty in Carroll County with his all-wheel-drive courier vehicle. Enter your delivery location below to dispatch Sean immediately:",
            showDeliveryForm: true,
            quickOptions: [
              '🍔 Add Steak & Cheese Sub First',
              '🍕 Add Smoked Pizza First',
              '🌲 Add Campfire Firewood Bundle'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 2. Food
      else if (
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
        let intro = "Here are our top recommended dishes prepared fresh in Carroll County! Tap **Add to Order** on any dish to have Sean Martin deliver it:";
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
              '🚀 Have Sean Martin Deliver This',
              '🥩 Show me Steak & Cheese Subs',
              '🍕 Show me Pizzas',
              '🌲 Campfire Firewood Kit'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } 
      // 3. Firewood / Lake
      else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('airbnb') || lower.includes('smores')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🌲 Visiting Lake Ossipee or Lake Winnipesaukee? Sean Martin delivers kiln-dried hardwood firewood bundles & deluxe s'mores kits directly to public boat launches, lakeside firepits, and private docks in ~25-35 minutes!",
            showDeliveryForm: true,
            quickOptions: [
              '🔥 Dispatch Firewood + S\'mores to Dock ($41.49)',
              '🌊 Check Lake Water Temperature',
              '🍔 Show Food Delivery Menus'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 4. Default
      else {
        const matches = findMatchingDishes('food');
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "I can help you order food, get dockside firewood, or dispatch driver Sean Martin. What can I get started for you?",
            suggestedDishes: matches.slice(0, 2),
            quickOptions: [
              '🍔 Show Best Food & Takeout',
              '🚀 Dispatch Sean Martin to Deliver',
              '🌲 Lake Concierge & Firewood'
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
        text: `✅ Added **${dish.name}** ($${dish.price.toFixed(2)}) to your order! Would you like **Sean Martin** to deliver this now?`,
        showDeliveryForm: true,
        quickOptions: [
          '🍕 Add a Pizza to Order',
          '🥤 Add Beverages & Sides',
          '🛒 View Shopping Cart'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // In-Chat Instant Dispatch Sean Martin
  const handleConfirmDispatchSean = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    const orderItems = cart.length > 0 ? cart.map(c => ({
      id: c.product.id,
      name: c.product.name,
      price: c.product.price,
      quantity: c.quantity
    })) : [
      {
        id: 'item-sub-pnb',
        name: 'The Big Mountain Steak & Cheese Sub (12")',
        price: 17.49,
        quantity: 1
      },
      {
        id: 'item-fries',
        name: 'Hand-Cut Seasoned Fries (Basket)',
        price: 4.99,
        quantity: 1
      }
    ];

    const subtotal = orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const deliveryFee = 4.99;
    const tip = 5.00;
    const total = subtotal + deliveryFee + tip;

    try {
      const newOrder = await placeDeliveryOrder({
        customerName: custName,
        customerPhone: custPhone,
        deliveryAddress: custAddress,
        deliveryInstructions: custNotes,
        serviceType: 'standard_delivery',
        paymentMethod: custPayment,
        paymentStatus: custPayment === 'cash_on_delivery' ? 'pay_on_delivery' : 'pending_verification',
        restaurantName: 'PNB Eats Roadside Grill & Local Kitchens',
        restaurantAddress: 'Route 25, Carroll County, NH',
        town: 'Carroll County / Freedom / Ossipee',
        items: orderItems,
        subtotal,
        deliveryFee,
        tip,
        total,
        driver: {
          name: 'Sean Martin',
          phone: '(508) 507-0305',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          vehicle: 'All-Wheel Drive Courier (AWD)',
          rating: 5.0,
          totalDeliveries: 412
        }
      });

      sendManualSms(
        '(508) 507-0305',
        'Sean Martin',
        'Oasis AI Dispatch',
        `🚨 NEW AI BOT DELIVERY: Order #${newOrder.id} for ${custName} (${custPhone}) at ${custAddress}. Total: $${total.toFixed(2)}. Courier Sean assigned!`,
        'Contractor Emergency Lead Instant Dispatch'
      );

      clearCart();
      setIsDispatching(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      playDeliveryChime();

      setMessages(prev => [
        ...prev,
        {
          id: `ai-dispatched-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **Order Confirmed!** Courier **Sean Martin** has been dispatched for immediate pickup and delivery!`,
          confirmedDeliveryOrder: newOrder,
          quickOptions: [
            '📡 Track Sean on Live Radar',
            '📞 Call Sean (508-507-0305)',
            '🍔 Order Something Else'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setIsDispatching(false);
    }
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
                Sean Martin On Duty • AWD Courier
              </div>
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
                Carroll County AI Food & Courier Dispatch
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:5085070305"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Sean</span>
            </a>

            <Link
              href="/cart"
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </Link>
          </div>
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
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
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
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Confirmed Delivery Order Tracking Card */}
                  {msg.confirmedDeliveryOrder && (
                    <div className="mt-4 p-4 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-white">Courier: Sean Martin</div>
                            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              En Route to Pickup • Est ~25 mins
                            </div>
                          </div>
                        </div>

                        <a 
                          href="tel:5085070305"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>(508) 507-0305</span>
                        </a>
                      </div>

                      <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between text-white/70">
                          <span>Delivery Address:</span>
                          <span className="text-white font-bold">{msg.confirmedDeliveryOrder.deliveryAddress}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Order Total:</span>
                          <span className="text-emerald-400 font-black">${msg.confirmedDeliveryOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Link
                          href={`/order/${msg.confirmedDeliveryOrder.id}`}
                          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl text-center shadow-lg"
                        >
                          📡 View Live GPS Radar Tracking
                        </Link>
                        <Link
                          href="/driver"
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                        >
                          Driver Hub
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Inline 1-Click Dispatch Sean Martin Form */}
                  {msg.showDeliveryForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmDispatchSean} className="mt-4 p-4 rounded-2xl bg-[#090910] border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <Truck className="w-4 h-4" />
                        <span>Dispatch Courier: Sean Martin (AWD Vehicle)</span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Your Name</label>
                            <input
                              type="text"
                              required
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Mobile Phone #</label>
                            <input
                              type="tel"
                              required
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Delivery Address / Boat Dock / Cabin</label>
                          <input
                            type="text"
                            required
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Payment Method</label>
                          <select
                            value={custPayment}
                            onChange={(e) => setCustPayment(e.target.value as any)}
                            className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          >
                            <option value="cash_on_delivery">💵 Cash on Delivery / Hand to Sean</option>
                            <option value="cash_app">💚 Cash App ($frijj555)</option>
                            <option value="venmo">💙 Venmo (@Sean-Martin-NH)</option>
                            <option value="card">💳 Credit Card / Apple Pay</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        {isDispatching ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Sean...</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4" />
                            <span>Confirm & Dispatch Sean Now</span>
                          </>
                        )}
                      </button>
                    </form>
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
              placeholder="Tell me what you're hungry for or ask Sean to deliver..."
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
