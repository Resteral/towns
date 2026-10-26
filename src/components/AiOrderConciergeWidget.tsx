'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Sparkles,
  Send,
  X,
  ShoppingBag,
  Check,
  MessageSquare,
  RefreshCw,
  Plus,
  Truck,
  Phone,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  Store,
  Hammer,
  Gift,
  Trophy,
  Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront, DeliveryOrder, NfcCardConfig } from '@/lib/types';

interface BotMessage {
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

export default function AiOrderConciergeWidget() {
  const pathname = usePathname();
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

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Customer Delivery & Pickup Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custPayment, setCustPayment] = useState<'cash_on_delivery' | 'cash_app' | 'venmo' | 'card'>('cash_on_delivery');
  const [custNotes, setCustNotes] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  // Custom Any-Store Pickup State
  const [customStoreName, setCustomStoreName] = useState('Local Takeout / Hardware Store');
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm your **Carroll County AI Courier & Business Assistant**.\n\n• **For Businesses & Contractors:** I can help you claim & customize your **100% Free Custom NFC Card** to showcase your menu or trade services, reward customers with Next-Visit Points, and boost Website Leaderboard XP!\n• **For Customers:** I can dispatch **Sean Martin** (`Call or Text (508) 507-0305`) to pick up takeout, groceries, hardware, or dockside firewood from any local spot!",
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

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping, isDispatching]);

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

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

      // 1. Free Custom NFC Card / Business / Contractor / Menu & Rewards Assistant
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
              '🎨 Open Full NFC Customizer Studio (/custom-nfc)',
              '🏪 Build Full Storefront (/create-storefront)',
              '📞 Call or Text Sean (508-507-0305)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 2. Call or Text Sean Directly
      else if (lower.includes('508') || lower.includes('call') || lower.includes('text') || lower.includes('phone') || lower.includes('sean')) {
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
      }
      // 3. Firewood / Lake Delivery
      else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('camp')) {
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
      }
      // 4. Store Pickup / Takeout / Hardware / Groceries
      else if (
        lower.includes('pickup') ||
        lower.includes('deliver') ||
        lower.includes('food') ||
        lower.includes('eat') ||
        lower.includes('hardware') ||
        lower.includes('grocery') ||
        lower.includes('order')
      ) {
        const matches = findMatchingDishes(text);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🚚 **Any-Store Pickup & Courier Delivery:**\n\nOrder takeout, groceries, or hardware from **any local store in Carroll County** (pay the store by phone, prepay Sean via Cash App `$frijj555` / Venmo `@Sean-Martin-NH`, or pay cash on delivery), and dispatch Sean Martin below:",
            suggestedDishes: matches.length > 0 ? matches : undefined,
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call or Text Sean (508-507-0305)',
              '🎁 Claim Free Business / Contractor NFC Card',
              '🪵 Order Dockside Firewood ($8.50)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 5. Default Helpful Assistant Response
      else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "I can help you **customize your Free Business or Contractor NFC Card** (to showcase your menu/services & give customers Next-Visit Rewards + Leaderboard XP), or **dispatch courier Sean Martin** (`Call or Text (508) 507-0305`) for any store pickup or delivery! How can I help?",
            quickOptions: [
              '🎁 Claim Free Business / Contractor NFC Card',
              '🔨 Setup Contractor NFC Card & Services',
              '🚚 Request Store Pickup & Delivery',
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

  // In-Chat Free NFC Card Generator Handler
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

    confetti({
      particleCount: 95,
      spread: 80,
      origin: { y: 0.6 }
    });
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

    setAddedItemNotice(`Added "${dish.name}" to cart!`);
    playDeliveryChime();
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  // Standard Delivery Dispatch
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
        id: 'item-firewood',
        name: 'Dockside Kiln-Dried Hardwood Firewood Bundle (2 Bundles)',
        price: 17.00,
        quantity: 1
      }
    ];

    const subtotal = orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const deliveryFee = 4.99;
    const tip = 5.00;
    const total = subtotal + deliveryFee + tip;

    try {
      const newOrder = await placeDeliveryOrder({
        customerName: custName || 'Local Customer',
        customerPhone: custPhone || '(603) 555-0199',
        deliveryAddress: custAddress || 'Effingham, NH',
        deliveryInstructions: custNotes,
        serviceType: 'standard_delivery',
        paymentMethod: custPayment,
        paymentStatus: custPayment === 'cash_on_delivery' ? 'pay_on_delivery' : 'pending_verification',
        restaurantName: customStoreName || 'Sean Martin Direct Courier',
        restaurantAddress: `${customStoreTown}, NH`,
        town: customStoreTown,
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
        'Townraise AI Dispatch',
        `🚨 NEW AI BOT DELIVERY: Order #${newOrder.id} for ${custName} (${custPhone}) at ${custAddress}. Total: $${total.toFixed(2)}.`,
        'Contractor Emergency Lead Instant Dispatch'
      );

      clearCart();
      setIsDispatching(false);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      playDeliveryChime();

      setMessages(prev => [
        ...prev,
        {
          id: `ai-dispatched-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **Order Confirmed!** Courier **Sean Martin** has been dispatched for immediate pickup and delivery!`,
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

  // Call-Ahead & Any-Store Pickup Dispatch
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
          text: `🎉 **Pickup Dispatched to Sean Martin!**\n\nSean has received your request to pick up from **${storeTitle}** and deliver directly to **${custAddress || 'your location'}**!`,
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
            <span>AI Courier & Free NFC Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[460px] max-h-[700px] flex flex-col bg-[#0b0b14] border border-white/15 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden animate-fadeIn backdrop-blur-xl">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-[#0e0e18] to-amber-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white tracking-wide">AI Courier & Business Bot</h3>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Sean On Duty
                  </span>
                </div>
                <p className="text-[10px] text-white/60">Call or Text (508) 507-0305 • Free Business NFC Cards</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="tel:5085070305"
                className="p-2 text-emerald-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                title="Call Sean (508) 507-0305"
              >
                <Phone className="w-4 h-4" />
              </a>
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
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[470px] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Text */}
                <div
                  className={`max-w-[95%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#151522] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Direct Call or Text Sean Action Bar */}
                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <a
                        href="tel:5085070305"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-black text-[10px] uppercase flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call (508) 507-0305</span>
                      </a>
                      <a
                        href="sms:5085070305"
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-black text-[10px] uppercase flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Text (508) 507-0305</span>
                      </a>
                    </div>
                  )}

                  {/* IN-CHAT FREE CUSTOM NFC CARD BUILDER FOR BUSINESSES & CONTRACTORS */}
                  {msg.showNfcCardBuilder && !msg.createdNfcCard && (
                    <form
                      onSubmit={handleCreateFreeNfcCardInChat}
                      className="mt-3 p-3.5 rounded-2xl bg-[#090910] border border-amber-400/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-black uppercase text-amber-400 flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5" /> Free Custom NFC Card Builder
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          100% Free
                        </span>
                      </div>

                      {/* Role Selector */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setNfcRole('business');
                            setNfcEmoji('🏪');
                            setNfcRewardPerk('$10.00 Off or Free Specialty Item on Next Visit');
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase border flex items-center justify-center gap-1 ${
                            nfcRole === 'business'
                              ? 'bg-amber-400 text-black border-amber-300'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}
                        >
                          <Store className="w-3 h-3" />
                          <span>Business / Menu</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNfcRole('contractor');
                            setNfcEmoji('🔨');
                            setNfcRewardPerk('$50.00 Off Next Service Call or Priority Dispatch');
                          }}
                          className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase border flex items-center justify-center gap-1 ${
                            nfcRole === 'contractor'
                              ? 'bg-amber-400 text-black border-amber-300'
                              : 'bg-white/5 text-zinc-400 border-white/10'
                          }`}
                        >
                          <Hammer className="w-3 h-3" />
                          <span>Contractor / Trade</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={nfcBizName}
                          onChange={(e) => setNfcBizName(e.target.value)}
                          placeholder={nfcRole === 'contractor' ? 'Contractor / Trade Name *' : 'Restaurant / Business Name *'}
                          className="w-full bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={nfcTown}
                            onChange={(e) => setNfcTown(e.target.value)}
                            placeholder="Town (e.g. Effingham, NH)"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="tel"
                            value={nfcPhone}
                            onChange={(e) => setNfcPhone(e.target.value)}
                            placeholder="Call/Text Phone #"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={nfcFeaturedItemName}
                            onChange={(e) => setNfcFeaturedItemName(e.target.value)}
                            placeholder={nfcRole === 'contractor' ? 'Featured Service (e.g. Deck Build)' : 'Featured Menu Dish'}
                            className="col-span-2 bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={nfcFeaturedItemPrice}
                            onChange={(e) => setNfcFeaturedItemPrice(e.target.value)}
                            placeholder="Price / Quote"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>

                        <input
                          type="text"
                          value={nfcRewardPerk}
                          onChange={(e) => setNfcRewardPerk(e.target.value)}
                          placeholder="Customer Next-Visit Reward Perk"
                          className="w-full bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-black/50 border border-white/10">
                            <span className="text-[9px] text-amber-300 font-mono block">Next-Visit Pts / Tap</span>
                            <input
                              type="number"
                              value={nfcVisitPts}
                              onChange={(e) => setNfcVisitPts(parseInt(e.target.value, 10) || 25)}
                              className="w-full bg-transparent text-xs font-mono font-black text-white focus:outline-none"
                            />
                          </div>
                          <div className="p-2 rounded-lg bg-black/50 border border-white/10">
                            <span className="text-[9px] text-indigo-300 font-mono block">Leaderboard XP / Tap</span>
                            <input
                              type="number"
                              value={nfcLeaderboardXp}
                              onChange={(e) => setNfcLeaderboardXp(parseInt(e.target.value, 10) || 50)}
                              className="w-full bg-transparent text-xs font-mono font-black text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Generate My Free Custom NFC Card</span>
                      </button>
                    </form>
                  )}

                  {/* CREATED FREE NFC CARD CONFIRMATION CARD */}
                  {msg.createdNfcCard && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900 via-[#090910] to-black border-2 border-amber-400/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{msg.createdNfcCard.logoUrl || '🏪'}</span>
                          <div>
                            <div className="text-xs font-black uppercase text-white">{msg.createdNfcCard.businessName}</div>
                            <div className="text-[10px] font-mono text-amber-300">
                              +{msg.createdNfcCard.visitPointsPerTap} Visit Pts • +{msg.createdNfcCard.leaderboardXpPerTap} Leaderboard XP
                            </div>
                          </div>
                        </div>
                        <Wifi className="w-4 h-4 text-amber-400 rotate-90" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/tap/${msg.createdNfcCard.id}`}
                          onClick={() => setIsOpen(false)}
                          className="py-2 px-3 rounded-xl bg-amber-400 text-black font-black text-[10px] uppercase text-center"
                        >
                          Test Customer Tap →
                        </Link>
                        <Link
                          href={`/custom-nfc?cardId=${msg.createdNfcCard.id}`}
                          onClick={() => setIsOpen(false)}
                          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase text-center"
                        >
                          Full Studio Editor
                        </Link>
                      </div>
                    </div>
                  )}

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
                              Dispatched • Est ~20-30 mins
                            </div>
                          </div>
                        </div>

                        <a
                          href="tel:5085070305"
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>Call or Text Sean</span>
                        </a>
                      </div>

                      <div className="p-2.5 bg-black/40 rounded-xl space-y-1 text-[11px]">
                        <div className="flex justify-between text-white/70">
                          <span>Pickup Store:</span>
                          <span className="text-amber-400 font-bold">{msg.confirmedDeliveryOrder.restaurantName}</span>
                        </div>
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
                          📡 Track Live Order
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CALL-AHEAD & ANY-STORE PICKUP FORM */}
                  {msg.showCallAheadForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmCallAheadPickup} className="mt-3 p-3.5 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                          <PhoneCall className="w-4 h-4" />
                          <span>Any-Store Pickup & Delivery</span>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                          Sean Martin Courier
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Restaurant / Store Name *</label>
                            <input
                              type="text"
                              required
                              value={customStoreName}
                              onChange={(e) => setCustomStoreName(e.target.value)}
                              placeholder="e.g. Local Pizza / Hardware"
                              className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Town</label>
                            <input
                              type="text"
                              value={customStoreTown}
                              onChange={(e) => setCustomStoreTown(e.target.value)}
                              placeholder="Effingham / Ossipee"
                              className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">What should Sean pick up?</label>
                          <input
                            type="text"
                            value={callItemDescription}
                            onChange={(e) => setCallItemDescription(e.target.value)}
                            placeholder="e.g. 2 Large Pizzas, Hardware supplies, Groceries..."
                            className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-white/50 block mb-1">How are you paying for the items?</label>
                          <div className="space-y-1.5">
                            {[
                              { id: 'paid_phone', label: '💳 I Paid the Store Over the Phone', desc: 'Pickup fee only ($4.99) — give Sean your pickup name/order #' },
                              { id: 'prepay_sean', label: '💚 Prepay Sean ($frijj555 / @Sean-Martin-NH)', desc: 'Sean buys the items at the register & delivers receipt' },
                              { id: 'cash_delivery', label: '💵 Cash on Delivery', desc: 'Pay cash for items + delivery at your door/dock' },
                            ].map((opt) => (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => setCallPickupType(opt.id as any)}
                                className={`w-full p-2 rounded-xl border text-left transition-all ${
                                  callPickupType === opt.id
                                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm'
                                    : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white'
                                }`}
                              >
                                <div className="text-[11px] font-bold">{opt.label}</div>
                                <div className="text-[9px] text-white/40 mt-0.5">{opt.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Pickup Name / Order #</label>
                            <input
                              type="text"
                              required
                              value={callPickupNameOrCode}
                              onChange={(e) => setCallPickupNameOrCode(e.target.value)}
                              placeholder="e.g. Order under Alex"
                              className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                            />
                          </div>

                          {callPickupType !== 'paid_phone' && (
                            <div>
                              <label className="text-[9px] uppercase font-bold text-white/50 block mb-0.5">Est. Item Cost ($)</label>
                              <input
                                type="number"
                                step="0.50"
                                required
                                value={callEstimatedCost}
                                onChange={(e) => setCallEstimatedCost(e.target.value)}
                                className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            placeholder="Your Name *"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="tel"
                            required
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            placeholder="Your Phone # *"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <input
                          type="text"
                          required
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          placeholder="Delivery Address / Lake Dock / Job Site *"
                          className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isDispatching ? 'Dispatching Sean...' : 'Dispatch Sean to Pick Up & Deliver'}</span>
                      </button>
                    </form>
                  )}

                  {/* Standard In-Chat Order Dispatch Form */}
                  {msg.showDeliveryForm && !msg.showCallAheadForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmDispatchSean} className="mt-3 p-3.5 rounded-2xl bg-[#090910] border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <Truck className="w-4 h-4" />
                        <span>Dispatch Courier: Sean Martin</span>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={custName}
                            onChange={(e) => setCustName(e.target.value)}
                            placeholder="Your Name *"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="tel"
                            required
                            value={custPhone}
                            onChange={(e) => setCustPhone(e.target.value)}
                            placeholder="Your Phone # *"
                            className="bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>

                        <input
                          type="text"
                          required
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          placeholder="Delivery Address / Dock / Campsite *"
                          className="w-full bg-[#141420] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                        />

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

                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isDispatching ? 'Dispatching...' : 'Confirm & Dispatch Sean Now'}</span>
                      </button>
                    </form>
                  )}

                  {/* Interactive Registered Storefront Dish Cards */}
                  {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.suggestedDishes.map(({ dish, store }) => (
                        <div
                          key={dish.id}
                          className="p-2.5 rounded-xl bg-[#0c0c16] border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-[11px] truncate">{dish.name}</h4>
                            <p className="text-[10px] text-white/50 truncate">{store.businessName} • ${dish.price.toFixed(2)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddDishToCart(dish, store)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase rounded-md shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Interactive Reply Chips */}
                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt)}
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
              placeholder="Ask about Free NFC Cards, store pickup, or courier..."
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
