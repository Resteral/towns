'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  Send,
  ShoppingBag,
  Check,
  Plus,
  ArrowRight,
  Truck,
  Phone,
  PhoneCall,
  RefreshCw,
  Store,
  Hammer,
  Gift,
  MessageSquare,
  Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront, DeliveryOrder, NfcCardConfig } from '@/lib/types';

interface ConciergeMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedDishes?: {
    dish: StorefrontProduct;
    store: MerchantStorefront;
  }[];
  quickOptions?: string[];
  showDeliveryForm?: boolean;
  showCallAheadForm?: boolean;
  showNfcCardBuilder?: boolean;
  createdNfcCard?: NfcCardConfig;
  confirmedDeliveryOrder?: DeliveryOrder;
  timestamp: string;
}

export default function DedicatedAiConciergePage() {
  const {
    storefronts,
    addToCart,
    cart,
    clearCart,
    placeDeliveryOrder,
    sendManualSms,
    playDeliveryChime,
    addCard,
    activeTown
  } = useNfcStore();

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // In-Chat Dispatch State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPayment, setCustPayment] = useState<'cash_on_delivery' | 'cash_app' | 'venmo' | 'card'>('cash_on_delivery');
  const [custNotes, setCustNotes] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Call-Ahead / Any-Store Pickup State
  const [customStoreName, setCustomStoreName] = useState('Local Restaurant / Hardware Store');
  const [customStoreTown, setCustomStoreTown] = useState(activeTown?.name || 'Effingham');
  const [callPickupType, setCallPickupType] = useState<'paid_phone' | 'prepay_sean' | 'cash_delivery'>('paid_phone');
  const [callPickupNameOrCode, setCallPickupNameOrCode] = useState('');
  const [callEstimatedCost, setCallEstimatedCost] = useState('25.00');
  const [callItemDescription, setCallItemDescription] = useState('');

  // In-Chat Free Custom NFC Card Builder State (for Businesses & Contractors)
  const [nfcRole, setNfcRole] = useState<'business' | 'contractor'>('business');
  const [nfcBizName, setNfcBizName] = useState('');
  const [nfcTown, setNfcTown] = useState(activeTown?.fullName || 'Effingham, NH');
  const [nfcPhone, setNfcPhone] = useState('');
  const [nfcEmoji, setNfcEmoji] = useState('🏪');
  const [nfcFeaturedItemName, setNfcFeaturedItemName] = useState('');
  const [nfcFeaturedItemPrice, setNfcFeaturedItemPrice] = useState('$12.99');
  const [nfcRewardPerk, setNfcRewardPerk] = useState('$10.00 Off or Free Specialty Item on Next Visit');
  const [nfcVisitPts, setNfcVisitPts] = useState(25);
  const [nfcLeaderboardXp, setNfcLeaderboardXp] = useState(50);

  const [messages, setMessages] = useState<ConciergeMsg[]>([
    {
      id: 'msg-start',
      sender: 'ai',
      text: "👋 Welcome to the **Carroll County AI Courier & Business Assistant**!\n\n• **Businesses & Contractors:** Every registered business and contractor gets a **100% Free Custom NFC Card**! I can help you customize it right here to showcase your menu or trade services, reward customers with Next-Visit Points, and award Website Leaderboard XP.\n• **Customers & Residents:** Need takeout, groceries, hardware, or dockside firewood picked up and delivered? Dispatch **Sean Martin** (`Call or Text (508) 507-0305`) from any local store!",
      quickOptions: [
        '🎁 Claim Free Business / Contractor NFC Card',
        '🔨 Setup Contractor NFC Card & Services',
        '🚚 Request Store Pickup & Delivery',
        '🪵 Order Dockside Firewood ($8.50)',
        '📞 Call or Text Sean (508-507-0305)'
      ],
      timestamp: 'Just now'
    }
  ]);

  const findMatchingDishes = (query: string) => {
    const q = query.toLowerCase();
    const matches: { dish: StorefrontProduct; store: MerchantStorefront }[] = [];

    storefronts.forEach(store => {
      store.products.forEach(product => {
        if (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          matches.length < 3
        ) {
          matches.push({ dish: product, store });
        }
      });
    });

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
        lower.includes('nfc') ||
        lower.includes('card') ||
        lower.includes('reward') ||
        lower.includes('leaderboard') ||
        lower.includes('customize') ||
        lower.includes('showcase') ||
        lower.includes('contractor') ||
        lower.includes('business') ||
        lower.includes('storefront')
      ) {
        const isContractorQuery = lower.includes('contractor') || lower.includes('trade') || lower.includes('service');
        setNfcRole(isContractorQuery ? 'contractor' : 'business');
        setNfcEmoji(isContractorQuery ? '🔨' : '🏪');
        setNfcRewardPerk(
          isContractorQuery
            ? '$50.00 Off Next Service Call or Priority Dispatch'
            : '$10.00 Off or Free Specialty Item on Next Visit'
        );
        setNfcFeaturedItemPrice(isContractorQuery ? 'Free Estimate' : '$12.99');

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: isContractorQuery
              ? "🔨 **Free Contractor NFC Card Assistant:** Every registered contractor in Carroll County gets a **100% Free Custom NFC Card**!\n\nCustomize your card below to showcase your trade services & rates, give repeat clients Next-Visit / Referral points, and award Website Leaderboard XP on every tap:"
              : "🎁 **Free Business & Restaurant NFC Card Assistant:** Every registered business gets a **100% Free Custom NFC Card**!\n\nCustomize your card right here to showcase your menu, give customers points toward their next visit, and award Website Leaderboard XP:",
            showNfcCardBuilder: true,
            quickOptions: [
              '🚚 Request Store Pickup & Delivery',
              '📞 Call or Text Sean (508-507-0305)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (lower.includes('508') || lower.includes('call') || lower.includes('text') || lower.includes('phone') || lower.includes('sean')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "📞 **Direct Dispatch Line — Sean Martin:**\n\nYou can **Call or Text (508) 507-0305** anytime for:\n• Express takeout, grocery, or hardware pickup & delivery\n• Free physical NFC card drop-off & programming for your business or contracting trade\n• Dockside kiln-dried firewood delivery\n\nOr fill out the pickup dispatch form below:",
            showCallAheadForm: true,
            quickOptions: [
              '🎁 Claim Free Business / Contractor NFC Card',
              '🚚 Request Store Pickup & Delivery',
              '🪵 Order Dockside Firewood ($8.50)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('camp')) {
        setCustomStoreName('Sean Martin Dockside Firewood');
        setCallItemDescription('Kiln-Dried Hardwood Firewood Bundles ($8.50/bundle)');
        setCallEstimatedCost('17.00');
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🪵 **Dockside & Campsite Firewood Delivery:** Sean Martin delivers certified pest-free kiln-dried hardwood bundles ($8.50/bundle) right to your lake dock, campsite, or driveway!\n\nEnter your delivery location below to dispatch Sean now:",
            showDeliveryForm: true,
            quickOptions: [
              '📞 Call or Text Sean (508-507-0305)',
              '🚚 Request Store Pickup & Delivery',
              '🎁 Claim Free Business / Contractor NFC Card'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const matches = findMatchingDishes(text);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🚚 **Any-Store Pickup & Business NFC Assistant:**\n\nOrder takeout, groceries, or hardware from **any local store in Carroll County** below, or ask me to generate your **Free Custom Business / Contractor NFC Card**!",
            suggestedDishes: matches.length > 0 ? matches : undefined,
            showCallAheadForm: true,
            quickOptions: [
              '🎁 Claim Free Business / Contractor NFC Card',
              '🔨 Setup Contractor NFC Card & Services',
              '📞 Call or Text Sean (508-507-0305)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      setIsTyping(false);
      playDeliveryChime();
    }, 450);
  };

  const handleCreateFreeNfcCardInChat = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBizName = nfcBizName.trim() || (nfcRole === 'contractor' ? 'Carroll County Custom Contracting' : 'Local Carroll County Kitchen');
    const featuredItem = nfcFeaturedItemName.trim() || (nfcRole === 'contractor' ? 'On-Site Estimate & Service Call' : 'House Signature Special');

    const newCard = addCard({
      cardName: `${cleanBizName} — Free Custom NFC Card`,
      businessName: cleanBizName,
      profileType: 'loyalty_rewards',
      entityRole: nfcRole,
      cardTheme: nfcRole === 'contractor' ? 'gold_foil' : 'matte_obsidian',
      cardTagline: `Tap for ${cleanBizName} ${nfcRole === 'contractor' ? 'Services & Quotes' : 'Menu'}, Next-Visit Rewards & Leaderboard XP!`,
      showcaseTitle: nfcRole === 'contractor' ? 'Featured Trade Services & Rates' : 'Featured Menu & Specials',
      showcaseItems: [
        {
          id: `item-${Date.now()}`,
          name: featuredItem,
          description: nfcRole === 'contractor' ? 'Licensed local trade professional — call or text for scheduling.' : 'Freshly prepared local favorite.',
          price: nfcFeaturedItemPrice || (nfcRole === 'contractor' ? 'Free Quote' : '$12.99'),
          category: nfcRole === 'contractor' ? 'Service' : 'Menu',
          badge: 'Featured'
        }
      ],
      isFreeRegistrationCard: true,
      hardwareFormFactor: 'pvc_card',
      chipType: 'NTAG215',
      contactPhone: nfcPhone.trim() || '(508) 507-0305',
      googleReviewUrl: `https://www.google.com/search?q=${encodeURIComponent(`${cleanBizName} ${nfcTown}`)}`,
      mode: 'smart_funnel',
      thresholdStars: 4,
      rewardProgramActive: true,
      visitPointsPerTap: Number(nfcVisitPts) || 25,
      nextVisitRewardGoal: 100,
      nextVisitRewardTitle: nfcRewardPerk.trim() || '$10.00 Off Next Visit',
      nextVisitPromoCode: `NEXT-${cleanBizName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 5) || 'VIP'}`,
      leaderboardXpPerTap: Number(nfcLeaderboardXp) || 50,
      bonusReviewPoints: 25,
      customHeadline: `How was your experience with ${cleanBizName}?`,
      logoUrl: nfcEmoji || (nfcRole === 'contractor' ? '🔨' : '🏪'),
      primaryColor: '#f59e0b',
      assignedLocation: nfcTown,
      active: true,
      town: nfcTown
    });

    confetti({ particleCount: 95, spread: 80, origin: { y: 0.6 } });
    playDeliveryChime();

    setMessages(prev => [
      ...prev,
      {
        id: `ai-nfc-created-${Date.now()}`,
        sender: 'ai',
        text: `🎉 **Your Free Custom NFC Card for ${cleanBizName} is Live!**\n\nEvery tap showcases **${featuredItem}**, awards customers **+${newCard.visitPointsPerTap} Next-Visit Points** toward **"${newCard.nextVisitRewardTitle}"**, and gives them **+${newCard.leaderboardXpPerTap} Website Leaderboard XP**!`,
        createdNfcCard: newCard,
        quickOptions: [
          '🚚 Request Store Pickup & Delivery',
          '📞 Call or Text Sean (508-507-0305)'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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

    setAddedItemNotice(`Added "${dish.name}" to cart!`);
    playDeliveryChime();
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  const handleConfirmCallAheadPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    const estCost = parseFloat(callEstimatedCost) || 0;
    const deliveryFee = 4.99;
    const tip = 4.00;
    const total = (callPickupType === 'paid_phone' ? 0 : estCost) + deliveryFee + tip;

    const paymentMethod = callPickupType === 'prepay_sean' ? 'cash_app' : callPickupType === 'cash_delivery' ? 'cash_on_delivery' : 'card';
    const paymentStatus = callPickupType === 'paid_phone' ? 'prepaid' : 'pay_on_delivery';
    const storeTitle = customStoreName.trim() || 'Local Carroll County Store';

    try {
      const newOrder = await placeDeliveryOrder({
        customerName: custName || 'Local Customer',
        customerPhone: custPhone || '(603) 555-0199',
        deliveryAddress: custAddress || 'Effingham, NH',
        deliveryInstructions: `[CALL-AHEAD PICKUP] Store: ${storeTitle} (${customStoreTown}). Order/Name: "${callPickupNameOrCode}". Items: ${callItemDescription}`,
        serviceType: callPickupType === 'paid_phone' ? 'store_pickup' : 'prepaid_buy',
        paymentMethod,
        paymentStatus,
        restaurantName: storeTitle,
        restaurantAddress: `${customStoreTown}, NH`,
        pickupStoreName: storeTitle,
        pickupStoreAddress: `${customStoreTown}, NH`,
        pickupOrderCode: callPickupNameOrCode || 'Customer Pickup',
        estimatedItemCost: estCost,
        town: customStoreTown,
        items: [
          {
            id: `pickup-${Date.now()}`,
            name: `${storeTitle} Pickup (${callItemDescription || 'Customer Order'})`,
            price: estCost,
            quantity: 1,
            notes: `Pickup Name/Code: "${callPickupNameOrCode}"`
          }
        ],
        subtotal: estCost,
        deliveryFee,
        tip,
        total: total === 0 ? deliveryFee + tip : total,
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
        'Townraise Pickup Dispatch',
        `🚨 NEW STORE PICKUP: Order #${newOrder.id} at ${storeTitle} (${customStoreTown}) under "${callPickupNameOrCode}". Deliver to ${custAddress}.`,
        'Contractor Emergency Lead Instant Dispatch'
      );

      setIsDispatching(false);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      playDeliveryChime();

      setMessages(prev => [
        ...prev,
        {
          id: `ai-pickup-dispatched-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **Pickup Dispatched to Sean Martin!**\n\nSean has received the alert to pick up your order at **${storeTitle}** and deliver it directly to **${custAddress || 'your location'}**!`,
          confirmedDeliveryOrder: newOrder,
          quickOptions: [
            '📞 Call or Text Sean (508-507-0305)',
            '🎁 Claim Free Business / Contractor NFC Card'
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
                AI Courier & Free Business NFC Card Assistant • Sean Martin
              </div>
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
                Carroll County AI Courier & Business Concierge
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="tel:5085070305"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call or Text (508) 507-0305</span>
            </a>

            <Link
              href="/custom-nfc"
              className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Free NFC Card Studio</span>
            </Link>

            <Link
              href="/cart"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </Link>
          </div>
        </div>

        {addedItemNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center justify-between">
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
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[94%] md:max-w-[85%] rounded-2xl p-4 leading-relaxed text-xs md:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#141422] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <a
                        href="tel:5085070305"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-black text-xs uppercase flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call (508) 507-0305</span>
                      </a>
                      <a
                        href="sms:5085070305"
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-black text-xs uppercase flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Text (508) 507-0305</span>
                      </a>
                    </div>
                  )}

                  {/* IN-CHAT FREE CUSTOM NFC CARD BUILDER */}
                  {msg.showNfcCardBuilder && !msg.createdNfcCard && (
                    <form
                      onSubmit={handleCreateFreeNfcCardInChat}
                      className="mt-4 p-4 rounded-2xl bg-[#090910] border border-amber-400/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black uppercase text-amber-400 flex items-center gap-1.5">
                          <Gift className="w-4 h-4" /> Free Custom NFC Card Builder
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          100% Free for Businesses & Contractors
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNfcRole('business');
                            setNfcEmoji('🏪');
                            setNfcRewardPerk('$10.00 Off or Free Specialty Item on Next Visit');
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-black uppercase border flex items-center justify-center gap-1.5 ${
                            nfcRole === 'business'
                              ? 'bg-amber-400 text-black border-amber-300'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Business / Restaurant</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNfcRole('contractor');
                            setNfcEmoji('🔨');
                            setNfcRewardPerk('$50.00 Off Next Service Call or Priority Dispatch');
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-black uppercase border flex items-center justify-center gap-1.5 ${
                            nfcRole === 'contractor'
                              ? 'bg-amber-400 text-black border-amber-300'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}
                        >
                          <Hammer className="w-3.5 h-3.5" />
                          <span>Contractor / Trade</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          value={nfcBizName}
                          onChange={(e) => setNfcBizName(e.target.value)}
                          placeholder={nfcRole === 'contractor' ? 'Contractor / Trade Name *' : 'Restaurant / Business Name *'}
                          className="sm:col-span-2 bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={nfcTown}
                          onChange={(e) => setNfcTown(e.target.value)}
                          placeholder="Town (e.g. Effingham, NH)"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="tel"
                          value={nfcPhone}
                          onChange={(e) => setNfcPhone(e.target.value)}
                          placeholder="Call or Text Phone #"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                        <input
                          type="text"
                          value={nfcFeaturedItemName}
                          onChange={(e) => setNfcFeaturedItemName(e.target.value)}
                          placeholder={nfcRole === 'contractor' ? 'Featured Service (e.g. Deck Build / Plowing)' : 'Featured Menu Item'}
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={nfcFeaturedItemPrice}
                          onChange={(e) => setNfcFeaturedItemPrice(e.target.value)}
                          placeholder="Price / Free Estimate"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                        <input
                          type="text"
                          value={nfcRewardPerk}
                          onChange={(e) => setNfcRewardPerk(e.target.value)}
                          placeholder="Customer Next-Visit Reward Perk"
                          className="sm:col-span-2 bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 fill-black" />
                        <span>Generate & Activate My Free Custom NFC Card</span>
                      </button>
                    </form>
                  )}

                  {msg.createdNfcCard && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-[#090910] to-black border-2 border-amber-400/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{msg.createdNfcCard.logoUrl || '🏪'}</span>
                          <div>
                            <div className="text-sm font-black uppercase text-white">{msg.createdNfcCard.businessName}</div>
                            <div className="text-xs font-mono text-amber-300">
                              +{msg.createdNfcCard.visitPointsPerTap} Next-Visit Pts • +{msg.createdNfcCard.leaderboardXpPerTap} Leaderboard XP
                            </div>
                          </div>
                        </div>
                        <Wifi className="w-5 h-5 text-amber-400 rotate-90" />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <Link
                          href={`/tap/${msg.createdNfcCard.id}`}
                          className="py-2.5 px-3 rounded-xl bg-amber-400 text-black font-black text-xs uppercase text-center"
                        >
                          Test Customer Tap →
                        </Link>
                        <Link
                          href={`/custom-nfc?cardId=${msg.createdNfcCard.id}`}
                          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase text-center"
                        >
                          Open Full NFC Studio
                        </Link>
                      </div>
                    </div>
                  )}

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
                              Dispatched • Est ~20-30 mins
                            </div>
                          </div>
                        </div>

                        <a
                          href="tel:5085070305"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call or Text (508) 507-0305</span>
                        </a>
                      </div>

                      <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between text-white/70">
                          <span>Pickup Store:</span>
                          <span className="text-amber-400 font-bold">{msg.confirmedDeliveryOrder.restaurantName}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Delivery Address:</span>
                          <span className="text-white font-bold">{msg.confirmedDeliveryOrder.deliveryAddress}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Total:</span>
                          <span className="text-emerald-400 font-black">${msg.confirmedDeliveryOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/order/${msg.confirmedDeliveryOrder.id}`}
                        className="block w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl text-center shadow-lg"
                      >
                        📡 View Live Order Radar
                      </Link>
                    </div>
                  )}

                  {/* Any-Store Pickup Form */}
                  {msg.showCallAheadForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmCallAheadPickup} className="mt-4 p-4 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                          <PhoneCall className="w-4 h-4" />
                          <span>Any-Store Pickup & Courier Dispatch</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                          Sean Martin Courier
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          required
                          value={customStoreName}
                          onChange={(e) => setCustomStoreName(e.target.value)}
                          placeholder="Restaurant / Store Name *"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={customStoreTown}
                          onChange={(e) => setCustomStoreTown(e.target.value)}
                          placeholder="Town (e.g. Effingham / Ossipee)"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={callItemDescription}
                          onChange={(e) => setCallItemDescription(e.target.value)}
                          placeholder="Items to pick up..."
                          className="sm:col-span-2 bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          value={callPickupNameOrCode}
                          onChange={(e) => setCallPickupNameOrCode(e.target.value)}
                          placeholder="Pickup Name or Order # *"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="number"
                          step="0.50"
                          value={callEstimatedCost}
                          onChange={(e) => setCallEstimatedCost(e.target.value)}
                          placeholder="Estimated Cost ($)"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="Your Name *"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="tel"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="Your Phone # *"
                          className="bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          placeholder="Delivery Address / Lake Dock / Job Site *"
                          className="sm:col-span-2 bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>{isDispatching ? 'Dispatching Sean...' : 'Dispatch Sean to Pick Up & Deliver'}</span>
                      </button>
                    </form>
                  )}

                  {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {msg.suggestedDishes.map(({ dish, store }) => (
                        <div
                          key={dish.id}
                          className="p-3 rounded-xl bg-[#0c0c16] border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{dish.name}</div>
                            <div className="text-[10px] text-white/50">{store.businessName} • ${dish.price.toFixed(2)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddDish(dish, store)}
                            className="px-3 py-1.5 bg-amber-400 text-black font-black text-xs rounded-lg"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-2 mt-2.5 max-w-[94%]">
                    {msg.quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt)}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-amber-300 hover:text-white transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-white/30 font-mono px-1 mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 bg-[#141422] border border-white/10 rounded-2xl px-4 py-2.5 w-32 text-white/50 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-4 border-t border-white/10 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask to customize your Free NFC Card, showcase your menu/services, or dispatch Sean..."
              className="flex-1 bg-[#141422] border border-white/15 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
