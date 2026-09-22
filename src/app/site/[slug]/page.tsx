'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Star, MapPin, Phone, Clock, 
  Truck, UtensilsCrossed, ShieldCheck, Sparkles, 
  CheckCircle2, Plus, Minus, X, ArrowRight, Share2, 
  QrCode, ExternalLink, Download, Radio, Send
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct } from '@/lib/types';
import FoodCustomizerModal from '@/components/FoodCustomizerModal';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function StandaloneBusinessSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { storefronts, placeDeliveryOrder, playDeliveryChime } = useNfcStore();
  const storefront = storefronts.find(sf => sf.slug.toLowerCase() === slug.toLowerCase()) || storefronts[0];

  // Cart State
  const [cartItems, setCartItems] = useState<{ product: StorefrontProduct; quantity: number }[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<StorefrontProduct | null>(null);
  const [tableQrUrl, setTableQrUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Checkout Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tip, setTip] = useState(5.00);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleteId, setOrderCompleteId] = useState<string | null>(null);

  // Generate Tabletop QR Code on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, {
        width: 380,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).then(url => setTableQrUrl(url));
    }
  }, []);

  if (!storefront) {
    return (
      <div className="min-h-screen pt-32 text-center space-y-4 text-white">
        <h1 className="text-3xl font-black">Storefront Not Found</h1>
        <p className="text-zinc-400 text-sm">The requested business website does not exist or has been unpublished.</p>
        <Link href="/marketplace" className="text-amber-400 font-bold hover:underline">
          Browse Oasis Marketplace
        </Link>
      </div>
    );
  }

  // Categories
  const categories = ['all', ...Array.from(new Set(storefront.products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all'
    ? storefront.products
    : storefront.products.filter(p => p.category === selectedCategory);

  // Cart Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = fulfillmentType === 'delivery' ? storefront.deliveryFee : 0;
  const total = subtotal + deliveryFee + tip;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: StorefrontProduct) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    playDeliveryChime();
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as { product: StorefrontProduct; quantity: number }[];
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !customerName.trim() || !customerPhone.trim()) return;

    setIsOrdering(true);

    const order = await placeDeliveryOrder({
      customerName,
      customerPhone,
      deliveryAddress: fulfillmentType === 'delivery' ? customerAddress : `[PICKUP AT STORE] ${storefront.address}`,
      deliveryInstructions: deliveryInstructions || undefined,
      items: cartItems.map(item => ({
        id: item.product.id,
        name: `${storefront.businessName}: ${item.product.name}`,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      deliveryFee,
      tip,
      total,
      town: `${storefront.town}, ${storefront.state}`,
    });

    setIsOrdering(false);
    setOrderCompleteId(order.id);
    setCartItems([]);
    playDeliveryChime();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981'],
    });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-amber-400 selection:text-black">
      
      {/* Branded Hero Header */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-white/10">
        {/* Cover Background */}
        {storefront.coverImageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={storefront.coverImageUrl} 
              alt={storefront.businessName} 
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 via-[#070709]/95 to-[#070709]" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Brand Logo & Name */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center text-4xl shadow-2xl shrink-0">
                {storefront.logoEmoji}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                    {storefront.businessName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open for Delivery
                  </span>
                </div>
                <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
                  {storefront.tagline}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{storefront.googleRating}</span>
                    <span className="text-zinc-500 font-normal">({storefront.reviewsCount} Google Reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{storefront.town}, {storefront.state}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {storefront.googleReviewUrl && (
                <a
                  href={storefront.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-400/20 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Review on Google</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              )}

              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                title="Tabletop QR Menu"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>QR Menu</span>
              </button>
            </div>

          </div>

          {/* Quick Telemetry Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-400" />
                Delivery Fee
              </span>
              <p className="text-sm font-black text-white font-mono">${storefront.deliveryFee.toFixed(2)}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                Estimated Prep Time
              </span>
              <p className="text-sm font-black text-white font-mono">{storefront.estimatedPrepTime}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                Order Phone Relay
              </span>
              <p className="text-xs font-bold text-zinc-300 font-mono truncate">{storefront.phone}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Min Order
              </span>
              <p className="text-sm font-black text-white font-mono">${storefront.minOrder.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu / Catalog Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-8">
        
        {/* Hannaford To Go Specific Call-In Banner */}
        {storefront.slug === 'hannaford-to-go' && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/10 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛒</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                    Important: How Hannaford Grocery Pickup Works
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-black italic text-white uppercase">
                  Call Hannaford To-Go at (603) 641-9400 to Order & Pay for Your Groceries!
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                  For customers who need groceries: you must call Hannaford To Go directly at <strong className="text-white">(603) 641-9400</strong> (or place through the Hannaford app) to place and pay for your grocery order. Once you receive your Pickup Name or Confirmation Code, hire local courier <strong>Sean Martin</strong> to pick up your grocery bags curbside and deliver them express to your doorstep!
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <a
                  href="tel:6036419400"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>1. Call (603) 641-9400</span>
                </a>
                <Link
                  href="/courier"
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-amber-400/20 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>2. Book Sean to Deliver ➔</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'All Menu Items' : cat}
              </button>
            ))}
          </div>

          {/* Floating Cart Button */}
          {totalItemCount > 0 && (
            <button
              onClick={() => setShowCheckoutDrawer(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2 hover:scale-105 active:scale-95 animate-bounce"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Order ({totalItemCount}) • ${total.toFixed(2)}</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCart = cartItems.find(i => i.product.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-[#0a0a0f] border border-white/5 hover:border-amber-400/30 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all group hover:shadow-2xl hover:shadow-amber-500/5"
              >
                {/* Product Image */}
                {product.imageUrl && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-zinc-900">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-md">
                        {product.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-sm font-black text-amber-400 font-mono shrink-0">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Add to Order Controls */}
                <div className="pt-2 border-t border-white/5">
                  {inCart ? (
                    <div className="flex items-center justify-between bg-white/5 rounded-xl p-1.5 border border-amber-400/30">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-black text-amber-400">
                        {inCart.quantity} in order
                      </span>
                      <button
                        onClick={() => {
                          if (product.optionGroups && product.optionGroups.length > 0) {
                            setCustomizingProduct(product);
                          } else {
                            handleUpdateQuantity(product.id, 1);
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center text-sm font-black"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (product.optionGroups && product.optionGroups.length > 0) {
                          setCustomizingProduct(product);
                        } else {
                          handleAddToCart(product);
                        }
                      }}
                      className="w-full py-3 bg-white/5 hover:bg-amber-400 hover:text-black text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 group-hover:border-amber-400/40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{product.optionGroups && product.optionGroups.length > 0 ? 'Customize & Add' : 'Add to Order'} • ${product.price.toFixed(2)}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT DRAWER / MODAL */}
      {/* ========================================================================= */}
      {showCheckoutDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0a0a0f] border-l border-white/10 w-full max-w-lg h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black font-black text-lg">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      Your Order
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400">
                      Direct from {storefront.businessName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutDrawer(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderCompleteId ? (
                /* Order Complete View */
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase">
                      Order Dispatched!
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Your order has been relayed directly to {storefront.businessName}’s phone. Prep has begun!
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-mono text-zinc-300 space-y-1">
                    <div>Order Ref: <strong className="text-amber-400">{orderCompleteId}</strong></div>
                    <div>Est. Delivery Time: <strong className="text-white">{storefront.estimatedPrepTime}</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setOrderCompleteId(null);
                      setShowCheckoutDrawer(false);
                    }}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg"
                  >
                    Done & Back to Storefront
                  </button>
                </div>
              ) : (
                /* Order Form & Items */
                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  {/* Fulfillment Type Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        fulfillmentType === 'delivery'
                          ? 'bg-amber-400 text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        fulfillmentType === 'pickup'
                          ? 'bg-amber-400 text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Pickup</span>
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div>
                          <div className="font-bold text-white">{item.product.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500">${item.product.price.toFixed(2)} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-amber-400">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-md bg-amber-400 text-black flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />

                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone for Courier Alerts (e.g. 603-555-0199) *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    />

                    {fulfillmentType === 'delivery' && (
                      <input
                        type="text"
                        required
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Delivery Street Address (Town, Zip) *"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    )}

                    <textarea
                      rows={2}
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="Dropoff notes, gate code, or dietary requests..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  {/* Driver Tip Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Driver Tip</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 5, 8, 10].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setTip(amount)}
                          className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                            tip === amount
                              ? 'bg-amber-400 text-black'
                              : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Totals */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {fulfillmentType === 'delivery' && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Delivery Fee:</span>
                        <span className="text-white">${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Courier Tip:</span>
                      <span className="text-white">${tip.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-amber-400 pt-2 border-t border-white/5">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit Order */}
                  <button
                    type="submit"
                    disabled={isOrdering || cartItems.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isOrdering ? 'Dispatching to Phone...' : `Place ${fulfillmentType.toUpperCase()} Order • $${total.toFixed(2)}`}</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 text-center text-[10px] font-mono text-zinc-500">
              Powered by OasisTap Decentralized Commerce Engine
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TABLETOP QR CODE MODAL */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 text-center shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>In-Store Tabletop QR Stand</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase">
                {storefront.businessName}
              </h3>
              <p className="text-xs text-zinc-400">
                Print and place on tables, counters, or window storefronts. Customers scan to view this menu & order instantly!
              </p>
            </div>

            {tableQrUrl && (
              <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto">
                <img src={tableQrUrl} alt="Storefront QR" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={tableQrUrl}
                download={`${storefront.slug}-tabletop-qr.png`}
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Stand</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Food Customizer Modal */}
      {customizingProduct && (
        <FoodCustomizerModal
          product={customizingProduct}
          store={storefront}
          onClose={() => setCustomizingProduct(null)}
          onAdded={() => {
            setCustomizingProduct(null);
            setShowCheckoutDrawer(true);
          }}
        />
      )}

    </div>
  );
}
