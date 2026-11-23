'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import type { GrocerySearchProduct } from '@/app/api/grocery-search/route';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Truck,
  CheckCircle2,
  Loader2,
  Package,
  Store,
  MessageSquare,
  ExternalLink,
  X,
  Barcode,
  Sparkles,
} from 'lucide-react';

interface ShopCartItem {
  product: GrocerySearchProduct;
  qty: number;
}

const LOCAL_STORES = [
  { id: 'hannaford', name: 'Hannaford Supermarket', location: 'West Ossipee / North Conway, NH', emoji: '🛒' },
  { id: 'walmart', name: 'Walmart Supercenter', location: 'North Conway, NH', emoji: '🔵' },
  { id: 'market-basket', name: 'Market Basket / Local Grocer', location: 'Carroll County Area', emoji: '🧺' },
  { id: 'tractor-supply', name: 'Tractor Supply Co.', location: 'Ossipee, NH', emoji: '🚜' },
  { id: 'home-depot', name: 'The Home Depot', location: 'North Conway, NH', emoji: '🟠' },
];

const QUICK_AISLES = [
  { label: 'Milk & Dairy', query: 'milk' },
  { label: 'Bread & Bakery', query: 'bread' },
  { label: 'Eggs & Breakfast', query: 'cereal' },
  { label: 'Chips & Snacks', query: 'chips' },
  { label: 'Drinks & Soda', query: 'coca cola' },
  { label: 'Coffee', query: 'coffee' },
  { label: 'Pasta & Sauce', query: 'pasta sauce' },
  { label: 'Frozen Pizza', query: 'frozen pizza' },
  { label: 'Peanut Butter', query: 'peanut butter' },
  { label: 'Cookies & Sweets', query: 'oreo' },
];

const DELIVERY_FEE = 9.99;

export default function InstacartStyleShopPage() {
  const { placeDeliveryOrder, currentUser } = useNfcStore();

  const [selectedStoreId, setSelectedStoreId] = useState(LOCAL_STORES[0].id);
  const [customStoreName, setCustomStoreName] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('milk');
  const [results, setResults] = useState<GrocerySearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Shopping Cart
  const [cart, setCart] = useState<ShopCartItem[]>([]);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);

  // Add Custom / Non-Grocery Item (produce by weight, hardware, etc.)
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemBrand, setCustomItemBrand] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('5.00');

  // Checkout Form
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [town, setTown] = useState('Effingham, NH');
  const [substitutionPref, setSubstitutionPref] = useState('Best similar match');
  const [paymentMethod, setPaymentMethod] = useState<'cash_app' | 'venmo' | 'cash_on_delivery'>('cash_app');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    total: number;
    storeName: string;
    smsBody: string;
  } | null>(null);

  const selectedStore = useMemo(() => {
    if (customStoreName.trim()) {
      return { id: 'custom', name: customStoreName.trim(), location: 'Carroll County, NH', emoji: '🏪' };
    }
    return LOCAL_STORES.find((s) => s.id === selectedStoreId) || LOCAL_STORES[0];
  }, [selectedStoreId, customStoreName]);

  const fetchProducts = async (query: string) => {
    const q = query.trim();
    if (!q) return;
    setIsLoading(true);
    setSearchError(null);
    setActiveQuery(q);

    try {
      const res = await fetch(`/api/grocery-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data.products) ? data.products : []);
      if (!data.products || data.products.length === 0) {
        setSearchError(
          `No packaged products matched "${q}". You can still add it using "+ Add Custom Item"!`
        );
      }
    } catch {
      setSearchError('Live product catalog took too long. Try searching again or add a custom item.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts('milk');
  }, []);

  const addToShopCart = (product: GrocerySearchProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromShopCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    const price = Math.max(0.01, parseFloat(customItemPrice) || 5.0);
    const customProduct: GrocerySearchProduct = {
      id: `custom-${Date.now()}`,
      barcode: 'CUSTOM',
      name: customItemName.trim(),
      brand: customItemBrand.trim() || selectedStore.name,
      quantity: 'Custom Request',
      imageUrl: '',
      category: 'Custom Item',
      estimatedPrice: price,
    };
    addToShopCart(customProduct);
    setCustomItemName('');
    setCustomItemBrand('');
    setCustomItemPrice('5.00');
    setShowCustomModal(false);
  };

  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.qty, 0), [cart]);
  const subtotal = useMemo(
    () => Number(cart.reduce((acc, i) => acc + i.product.estimatedPrice * i.qty, 0).toFixed(2)),
    [cart]
  );
  const grandTotal = useMemo(
    () => Number((subtotal + (cart.length > 0 ? DELIVERY_FEE : 0)).toFixed(2)),
    [subtotal, cart.length]
  );

  const getQtyInCart = (id: string) => cart.find((i) => i.product.id === id)?.qty || 0;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || cart.length === 0) {
      return;
    }
    setIsSubmitting(true);

    const deliveryItems = cart.map((c) => ({
      id: c.product.id,
      name: `${c.product.brand} — ${c.product.name}${c.product.quantity ? ` (${c.product.quantity})` : ''}`,
      price: c.product.estimatedPrice,
      quantity: c.qty,
      notes: c.product.barcode !== 'CUSTOM' ? `UPC: ${c.product.barcode}` : 'Custom item',
    }));

    const order = await placeDeliveryOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: `${deliveryAddress.trim()}, ${town}`,
      deliveryInstructions: `Store: ${selectedStore.name} | Subs: ${substitutionPref}${notes ? ` | Notes: ${notes}` : ''}`,
      items: deliveryItems,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      tip: 0,
      total: grandTotal,
      town,
      restaurantName: selectedStore.name,
      pickupStoreName: selectedStore.name,
      pickupStoreAddress: selectedStore.location,
      orderType: 'delivery',
      serviceType: 'prepaid_buy',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pay_on_delivery' : 'pending_verification',
      estimatedItemCost: subtotal,
    });

    const itemLines = cart
      .map((c) => `• ${c.qty}x ${c.product.brand} ${c.product.name} (~$${c.product.estimatedPrice.toFixed(2)})`)
      .join('\n');

    const smsBody = `Hi Sean! New Townraise Shop Order #${order.orderNumber}\nStore: ${selectedStore.name}\nItems:\n${itemLines}\nEst. Total (w/ $9.99 delivery): $${grandTotal.toFixed(2)}\nPayment: ${paymentMethod === 'cash_app' ? 'Cash App ($serum37)' : paymentMethod === 'venmo' ? 'Venmo (@seanstax)' : 'Cash on Delivery'}\nSubs: ${substitutionPref}\nDeliver to: ${customerName.trim()}, ${deliveryAddress.trim()}, ${town}\nPhone: ${customerPhone.trim()}`;

    setCompletedOrder({
      orderNumber: order.orderNumber,
      total: grandTotal,
      storeName: selectedStore.name,
      smsBody,
    });
    setCart([]);
    setShowCheckout(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-22 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Product Search (Open Food Facts API) • Local 4x4 Delivery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Shop Local Groceries &amp; Stores
          </h1>
          <p className="text-sm text-zinc-400">
            Search millions of real grocery items or UPC barcodes, build your cart, and Sean Martin shops &amp; delivers straight to your door.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Custom Item</span>
          </button>

          <button
            onClick={() => setIsCartOpenMobile(true)}
            className="lg:hidden px-4 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black flex items-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>

      {/* ORDER CONFIRMED BANNER */}
      {completedOrder && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <h2 className="text-lg font-black text-white">
                  Order #{completedOrder.orderNumber} Sent for {completedOrder.storeName}!
                </h2>
                <p className="text-xs text-zinc-300">
                  Estimated total (including $9.99 delivery): <strong className="text-emerald-300">${completedOrder.total.toFixed(2)}</strong> — Final item total matches your paper store receipt.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCompletedOrder(null)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`sms:5085070305?&body=${encodeURIComponent(completedOrder.smsBody)}`}
              className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>1-Tap Text Shopping List to Sean (508-507-0305)</span>
            </a>

            <a
              href={`https://cash.app/$serum37/${completedOrder.total.toFixed(2)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-2"
            >
              <span>Pay via Cash App ($serum37)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://venmo.com/seanstax?txn=pay&amount=${completedOrder.total.toFixed(2)}&note=Townraise%20Order%20${completedOrder.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-2"
            >
              <span>Pay via Venmo (@seanstax)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* STORE PICKER */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Choose Store to Shop From</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LOCAL_STORES.map((store) => {
            const active = selectedStoreId === store.id && !customStoreName.trim();
            return (
              <button
                key={store.id}
                onClick={() => {
                  setSelectedStoreId(store.id);
                  setCustomStoreName('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  active
                    ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-500/15'
                    : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{store.emoji}</span>
                <span>{store.name}</span>
              </button>
            );
          })}

          <input
            type="text"
            value={customStoreName}
            onChange={(e) => setCustomStoreName(e.target.value)}
            placeholder="Or type any other local store..."
            className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-amber-400 outline-none min-w-[200px]"
          />
        </div>
      </div>

      {/* MAIN 2-COLUMN LAYOUT (CATALOG + STICKY CART) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: SEARCH + AISLES + LIVE PRODUCT GRID */}
        <div className="lg:col-span-8 space-y-5">
          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchProducts(searchInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any grocery brand, item, or 12-digit UPC barcode..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:border-amber-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Quick Aisles */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AISLES.map((aisle) => (
              <button
                key={aisle.query}
                onClick={() => {
                  setSearchInput(aisle.query);
                  fetchProducts(aisle.query);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeQuery.toLowerCase() === aisle.query.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                {aisle.label}
              </button>
            ))}
          </div>

          {/* Results Area */}
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-zinc-400">
              <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
              <span className="text-sm">Searching real US grocery catalog for &quot;{activeQuery}&quot;...</span>
            </div>
          ) : searchError && results.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-3">
              <p className="text-sm text-zinc-300">{searchError}</p>
              <button
                onClick={() => {
                  setCustomItemName(activeQuery);
                  setShowCustomModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs"
              >
                + Add &quot;{activeQuery}&quot; as Custom Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {results.map((item) => {
                const qty = getQtyInCart(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#0c0c12] border border-white/10 hover:border-amber-400/35 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2.5">
                      {/* Product Photo */}
                      <div className="aspect-square rounded-xl bg-white/95 p-2 flex items-center justify-center overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-zinc-400" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-amber-400 truncate">
                          {item.brand}
                        </div>
                        <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {item.name}
                        </h3>
                        {item.quantity && (
                          <div className="text-[10px] text-zinc-400 truncate">{item.quantity}</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-emerald-400">
                          ~${item.estimatedPrice.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-zinc-500">est.</span>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-amber-400 text-black rounded-xl p-1 font-black text-xs">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 hover:bg-black/10 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span>{qty} in cart</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 hover:bg-black/10 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToShopCart(item)}
                          className="w-full py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: STICKY INSTACART-STYLE CART SIDEBAR */}
        <div
          className={`lg:col-span-4 lg:sticky lg:top-20 ${
            isCartOpenMobile
              ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-end sm:items-center justify-center'
              : 'hidden lg:block'
          }`}
        >
          <div className="w-full max-w-md lg:max-w-none bg-[#0c0c14] border border-white/15 rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>Your Shopping Cart ({cartCount})</span>
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Shopping at: <strong className="text-white">{selectedStore.name}</strong>
                </p>
              </div>
              {isCartOpenMobile && (
                <button
                  onClick={() => setIsCartOpenMobile(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <ShoppingCart className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-semibold text-zinc-300">Your cart is empty</p>
                <p className="text-xs text-zinc-500">
                  Search any item on the left or click &quot;Add Custom Item&quot; for produce, meat, or Home Depot supplies.
                </p>
              </div>
            ) : !showCheckout ? (
              <>
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-zinc-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{product.name}</div>
                        <div className="text-[11px] text-emerald-400 font-semibold">
                          ~${(product.estimatedPrice * qty).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromShopCart(product.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Est. Items Subtotal</span>
                    <span>~${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Local 4x4 Delivery Fee</span>
                    <span>${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-1">
                    <span>Estimated Total</span>
                    <span className="text-amber-400">~${grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Exact item total is matched to your paper store receipt upon delivery.
                  </p>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Proceed to Delivery Checkout</span>
                </button>
              </>
            ) : (
              /* CHECKOUT FORM */
              <form onSubmit={handlePlaceOrder} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase">Delivery Details</span>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ← Back to Cart
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Your Mobile Phone *"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street Address / Lakehouse *"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none"
                  >
                    <option value="Effingham, NH">Effingham, NH</option>
                    <option value="Ossipee, NH">Ossipee, NH</option>
                    <option value="Freedom, NH">Freedom, NH</option>
                    <option value="Conway, NH">Conway, NH</option>
                    <option value="Wolfeboro, NH">Wolfeboro, NH</option>
                    <option value="Tamworth, NH">Tamworth, NH</option>
                    <option value="Wakefield, NH">Wakefield, NH</option>
                  </select>

                  <select
                    value={substitutionPref}
                    onChange={(e) => setSubstitutionPref(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none"
                  >
                    <option value="Best similar match">Sub: Best match</option>
                    <option value="Text me first">Sub: Text me first</option>
                    <option value="Refund if out">Sub: Refund if out</option>
                  </select>
                </div>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash_app' | 'venmo' | 'cash_on_delivery')}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-emerald-500/30 text-xs text-white outline-none"
                >
                  <option value="cash_app">💚 Cash App ($serum37)</option>
                  <option value="venmo">💙 Venmo (@seanstax)</option>
                  <option value="cash_on_delivery">💵 Cash on Delivery</option>
                </select>

                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, porch drop-off, or brand notes (optional)"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none focus:border-amber-400"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending Order...' : `Place Order (~$${grandTotal.toFixed(2)})`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ADD CUSTOM ITEM MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <form
            onSubmit={handleAddCustomItem}
            className="w-full max-w-md bg-[#0e0e16] border border-amber-400/30 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Barcode className="w-4 h-4 text-amber-400" />
                <span>Add Custom Store Item</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              Add fresh produce (e.g. &quot;3 lbs bananas&quot;), deli meat, or a Home Depot SKU/tool.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                required
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Item name & size (e.g. 2 lbs Honeycrisp Apples)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={customItemBrand}
                onChange={(e) => setCustomItemBrand(e.target.value)}
                placeholder="Preferred brand or SKU # (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white outline-none focus:border-amber-400"
              />
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Estimated Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 text-black text-xs font-black"
              >
                Add to Cart
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
