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
  Plus,
  Truck,
  Phone,
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront, DeliveryOrder } from '@/lib/types';

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
  showDeliveryForm?: boolean;
  confirmedDeliveryOrder?: DeliveryOrder;
  timestamp: string;
}

export default function AiOrderConciergeWidget() {
  const pathname = usePathname();
  const { storefronts, addToCart, cart, clearCart, placeDeliveryOrder, sendManualSms, playDeliveryChime } = useNfcStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // In-Chat Delivery Dispatch State
  const [custName, setCustName] = useState('Alex Tremblay');
  const [custPhone, setCustPhone] = useState('(603) 555-0199');
  const [custAddress, setCustAddress] = useState('Pine Cove Dock 3, Ossipee Lake (Freedom, NH)');
  const [custPayment, setCustPayment] = useState<'cash_on_delivery' | 'cash_app' | 'venmo' | 'card'>('cash_on_delivery');
  const [custNotes, setCustNotes] = useState('Leave on lakeside table. Text when arrived.');
  const [isDispatching, setIsDispatching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your Carroll County AI Concierge. What are you looking to eat or order today? I can recommend top local dishes and dispatch Sean Martin to deliver straight to your door or boat dock!",
      quickOptions: [
        '🍔 Hungry for Food / Order Lunch & Dinner',
        '🥩 Giant Steak & Cheese Sub',
        '🍕 Best Wood-Fired Pizza & Wings',
        '☕ Morning Coffee & Brioche Bakery',
        '🌲 Campfire Firewood & S\'mores Kit',
        '🚀 Dispatch Sean Martin to Deliver'
      ],
      timestamp: 'Just now'
    }
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping, isDispatching]);

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

    const userMsg: BotMessage = {
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

      // 1. Direct Delivery / Sean Martin Dispatch Request
      if (lower.includes('deliver') || lower.includes('sean') || lower.includes('dispatch') || lower.includes('courier')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🚗 **Sean Martin** is currently on duty in Carroll County with his all-wheel-drive courier vehicle. Fill in your delivery location below to dispatch Sean right away:",
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
      // 2. Food Inquiries
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
        lower.includes('bbq') || 
        lower.includes('gluten')
      ) {
        const matches = findMatchingDishes(text);
        
        let intro = "Here are our top recommended dishes freshly prepared in Carroll County! Tap **Add to Order** on any item to have Sean Martin deliver it:";
        if (lower.includes('pizza')) intro = "🍕 Craving pizza? Here are our top wood-fired and smokehouse pies in town:";
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
              '🚀 Have Sean Martin Deliver This',
              '🥩 Show me Steak & Cheese Subs',
              '🍕 Show me Pizzas',
              '🌲 Campfire Firewood Kit'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } 
      // 3. Firewood / Lake / Concierge
      else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('airbnb') || lower.includes('smores') || lower.includes('boat')) {
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
            text: `I can help you order food, get dockside firewood, or dispatch driver Sean Martin. What can I get started for you?`,
            suggestedDishes: matches.slice(0, 2),
            quickOptions: [
              '🍔 Order Hot Food & Takeout',
              '🚀 Dispatch Sean Martin to Deliver',
              '🌲 Lake Concierge & Dockside Firewood'
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

    // Follow up in chat with delivery dispatch prompt
    setMessages(prev => [
      ...prev,
      {
        id: `ai-added-${Date.now()}`,
        sender: 'ai',
        text: `✅ Added **${dish.name}** ($${dish.price.toFixed(2)}) to your order! Would you like **Sean Martin** to deliver this now, or add more items?`,
        showDeliveryForm: true,
        quickOptions: [
          '🍕 Add a Pizza to Order',
          '🥤 Add Beverages or Sides',
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

    // Calculate items
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

      // Send SMS alert to Sean Martin
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
            <span>AI Food & Order Helper</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[440px] max-h-[660px] flex flex-col bg-[#0b0b14] border border-white/15 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden animate-fadeIn backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-[#0e0e18] to-amber-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white tracking-wide">Oasis AI Food & Courier Bot</h3>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Courier On Duty
                  </span>
                </div>
                <p className="text-[10px] text-white/50">Sean Martin • AWD Delivery Active (Carroll County)</p>
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
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[440px] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Text */}
                <div
                  className={`max-w-[92%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#151522] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Confirmed Delivery Order Tracking Card */}
                  {msg.confirmedDeliveryOrder && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-white">Courier: Sean Martin</div>
                            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              En Route to Pickup • Est ~25 mins
                            </div>
                          </div>
                        </div>

                        <a 
                          href="tel:5085070305"
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>Call Sean</span>
                        </a>
                      </div>

                      <div className="p-2.5 bg-black/40 rounded-xl space-y-1 text-[11px]">
                        <div className="flex justify-between text-white/70">
                          <span>Delivery Address:</span>
                          <span className="text-white font-bold truncate max-w-[170px]">{msg.confirmedDeliveryOrder.deliveryAddress}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Order Total:</span>
                          <span className="text-emerald-400 font-black">${msg.confirmedDeliveryOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/order/${msg.confirmedDeliveryOrder.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-[11px] uppercase tracking-wider rounded-xl text-center shadow-lg"
                        >
                          📡 View Live Radar
                        </Link>
                        <Link
                          href="/driver"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-bold"
                        >
                          Driver Hub
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Inline 1-Click Dispatch Sean Martin Form */}
                  {msg.showDeliveryForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmDispatchSean} className="mt-3 p-3.5 rounded-2xl bg-[#090910] border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <Truck className="w-4 h-4" />
                        <span>Dispatch Courier: Sean Martin</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Your Name & Phone</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              placeholder="Your Name"
                              className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                            />
                            <input
                              type="tel"
                              required
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              placeholder="Phone #"
                              className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Delivery Address / Dock / Firepit</label>
                          <input
                            type="text"
                            required
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            placeholder="e.g. Pine Cove Dock 3, Ossipee Lake"
                            className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Payment Method</label>
                          <select
                            value={custPayment}
                            onChange={(e) => setCustPayment(e.target.value as any)}
                            className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
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
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        {isDispatching ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Sean...</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5" />
                            <span>Confirm & Dispatch Sean Now</span>
                          </>
                        )}
                      </button>
                    </form>
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
              placeholder="Ask for food, firewood, or dispatch Sean to deliver..."
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
