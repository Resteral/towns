'use client';

import { useState, useEffect } from 'react';
import { useNfcStore } from '@/lib/store';
import { NfcFormFactor, NfcHardwareOrder, MerchantStorefront } from '@/lib/types';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, Check, Sparkles, Truck, QrCode, 
  Radio, ShieldCheck, Download, Plus, 
  Minus, Layers, Smartphone, Copy, CheckCircle2,
  DollarSign, MapPin, Phone, User, Store, ArrowRight
} from 'lucide-react';

interface NfcHardwareOption {
  id: NfcFormFactor;
  name: string;
  emoji: string;
  unitPrice: number;
  badge: string;
  description: string;
  idealFor: string;
  dimensions: string;
  material: string;
  imageUrl: string;
}

const HARDWARE_OPTIONS: NfcHardwareOption[] = [
  {
    id: 'acrylic_table_stand',
    name: 'Dual-Sided Crystal Acrylic Table Stand',
    emoji: '🌟',
    unitPrice: 24.99,
    badge: '★ Best for Cafes & Diners',
    description: 'Commercial shatterproof acrylic stand with embedded high-gain NTAG215 microchip and laser-engraved table QR code backing.',
    idealFor: 'Indoor dining tables, cafe counters & booths',
    dimensions: '4" x 6" Free-Standing Base',
    material: 'Commercial UV-Resistant Clear Acrylic',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wood_table_tent',
    name: 'Hearth Wood Table Tent (Solid Pine / Oak)',
    emoji: '🪵',
    unitPrice: 28.99,
    badge: 'Artisan & Brewery Favorite',
    description: 'Handcrafted solid wood table tent with hidden internal NFC inlay and precision laser-branded logo and table numbers.',
    idealFor: 'Rustic pubs, breweries, steakhouses & bakeries',
    dimensions: '3.5" x 5.5" A-Frame Tent',
    material: 'Natural Carroll County Solid Pine / Oak',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pvc_table_disc',
    name: 'Waterproof 3M Table Tap Disc (35mm)',
    emoji: '🔘',
    unitPrice: 12.50,
    badge: 'Patio & Bar Tops',
    description: 'Sub-1mm ultra-slim disc with heavy-duty 3M VHB adhesive. Waterproof, alcohol-cleaner resistant, and weatherproof.',
    idealFor: 'Outdoor patio picnic tables, high-top bar surfaces',
    dimensions: '35mm Diameter (1.37")',
    material: 'Matte IP68 Waterproof PVC + 3M VHB',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'waitstaff_badge',
    name: 'Waitstaff Smart Lanyard Badge',
    emoji: '🪪',
    unitPrice: 18.99,
    badge: 'Server Tap-to-Order & Tips',
    description: 'Wearable staff badge with embedded high-frequency NFC microchip. Customers tap the server badge for instant menu and tip relay.',
    idealFor: 'Waitstaff, bartenders, food truck staff & couriers',
    dimensions: 'Standard Credit Card Size (CR80)',
    material: 'Reinforced PVC with Metal Lanyard Clip',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'custom',
    name: 'Executive Metal / Matte VIP NFC Card',
    emoji: '📇',
    unitPrice: 19.99,
    badge: 'Managers & VIP Pass',
    description: 'Premium stainless steel or matte black PVC card with laser-engraved branding. Pocket-sized digital menu & contact pass.',
    idealFor: 'Business owners, catering coordinators & managers',
    dimensions: '3.375" x 2.125" (CR80)',
    material: 'Brushed Metal / Ultra-Matte PVC',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bar_counter_mat',
    name: 'Commercial Countertop Bar Mat Tap Zone',
    emoji: '🍺',
    unitPrice: 38.00,
    badge: 'High-Volume Tap Zone',
    description: 'Heavy-duty non-slip silicone bar runner mat with embedded waterproof NFC transponder. Customers tap glasses and phones at the bar.',
    idealFor: 'Bar counters, order pickup windows & hostess stands',
    dimensions: '18" x 12" Silicone Runner',
    material: 'Heavy Food-Grade Non-Slip Silicone',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'keychain_tag',
    name: 'Rugged Keyring NFC Tag Fob',
    emoji: '🔑',
    unitPrice: 9.99,
    badge: 'Pocket Courier & Keyring',
    description: 'Tough ABS plastic waterproof fob with stainless steel keyring. Great for delivery drivers, fleet keys, and instant customer pass.',
    idealFor: 'Keys, toolboxes, vehicle dashboards & couriers',
    dimensions: '40mm x 32mm Fob',
    material: 'Ultrasonically Welded ABS Plastic',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  }
];

const QUANTITY_BUNDLES = [
  { qty: 1, label: 'Single Sample (1 Stand)', discountPct: 0 },
  { qty: 5, label: 'Small Cafe Pack (5 Tables)', discountPct: 5 },
  { qty: 10, label: 'Dining Room Fleet (10 Tables)', discountPct: 12 },
  { qty: 20, label: 'Full Restaurant Fleet (20 Tables)', discountPct: 20 },
];

export default function NfcHardwareOrderModal({
  defaultStorefront,
  onClose,
}: {
  defaultStorefront?: Partial<MerchantStorefront> | MerchantStorefront;
  onClose: () => void;
}) {
  const { storefronts, addNfcHardwareOrder, currentUser, playDeliveryChime } = useNfcStore();

  // Target Storefront
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>(
    defaultStorefront?.id || storefronts[0]?.id || ''
  );
  const activeStorefront = storefronts.find(s => s.id === selectedStorefrontId) || defaultStorefront || storefronts[0];

  // Hardware Selection
  const [selectedFormFactor, setSelectedFormFactor] = useState<NfcFormFactor>('acrylic_table_stand');
  const [quantity, setQuantity] = useState<number>(5);
  const [tableAssignmentMode, setTableAssignmentMode] = useState<'universal' | 'numbered'>('numbered');
  const [startTableNumber, setStartTableNumber] = useState<number>(1);
  const [chipType, setChipType] = useState<'NTAG213' | 'NTAG215' | 'NTAG216'>('NTAG215');
  const [customHeadline, setCustomHeadline] = useState<string>('Tap Phone to View Menu & Order!');

  // Buyer & Delivery Info
  const [buyerName, setBuyerName] = useState<string>(currentUser?.name || 'Sean Martin');
  const [buyerPhone, setBuyerPhone] = useState<string>(currentUser?.phone || '(508) 507-0305');
  const [buyerEmail, setBuyerEmail] = useState<string>(currentUser?.email || 'frijj555@gmail.com');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(activeStorefront?.address || 'Historic Route 153, Effingham, NH');
  const [paymentOption, setPaymentOption] = useState<'pay_on_delivery' | 'paid'>('pay_on_delivery');

  // Preview & QR
  const [previewQrUrl, setPreviewQrUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderCompleteReceipt, setOrderCompleteReceipt] = useState<NfcHardwareOrder | null>(null);

  // Active hardware config object
  const activeHardware = HARDWARE_OPTIONS.find(h => h.id === selectedFormFactor) || HARDWARE_OPTIONS[0];

  // Base and discounted calculations
  const bundle = QUANTITY_BUNDLES.find(b => b.qty === quantity);
  const discountMultiplier = bundle ? (1 - bundle.discountPct / 100) : 1;
  const unitPrice = activeHardware.unitPrice * discountMultiplier;
  const subtotal = unitPrice * quantity;
  const courierDeliveryFee = 4.50;
  const totalAmount = subtotal + courierDeliveryFee;

  // Compute Programmed URLs
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
  const baseMenuUrl = activeStorefront ? `${origin}/site/${activeStorefront.slug}` : `${origin}/site/oasis-roastery-bakehouse`;

  const tableAssignments: string[] = [];
  if (tableAssignmentMode === 'numbered') {
    for (let i = 0; i < quantity; i++) {
      const tableNum = startTableNumber + i;
      tableAssignments.push(`${baseMenuUrl}?table=${tableNum}`);
    }
  } else {
    for (let i = 0; i < quantity; i++) {
      tableAssignments.push(baseMenuUrl);
    }
  }

  // Update QR Preview
  useEffect(() => {
    QRCode.toDataURL(baseMenuUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(url => setPreviewQrUrl(url)).catch(() => {});
  }, [baseMenuUrl]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !deliveryAddress.trim()) return;

    setIsSubmitting(true);

    const orderNumber = `NFC-HW-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = addNfcHardwareOrder({
      orderNumber,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerEmail: buyerEmail.trim() || undefined,
      buyerBusinessName: activeStorefront?.businessName || buyerName,
      deliveryAddress: deliveryAddress.trim(),
      productId: `hw-${selectedFormFactor}`,
      productTitle: `${activeHardware.name} (${quantity} Pack)`,
      formFactor: selectedFormFactor,
      targetRestaurantName: activeStorefront?.businessName || 'My Business',
      quantity,
      unitPrice: Number(unitPrice.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'pending_flash',
      programmedUrl: baseMenuUrl,
      tableAssignments,
      chipType,
      paidStatus: paymentOption,
    });

    setIsSubmitting(false);
    setOrderCompleteReceipt(newOrder);
    playDeliveryChime();

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#6366f1']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-xl font-bold">
              📦
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Order Physical NFC Cards & Tabletop Stands</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold uppercase">
                  Pre-Encoded by Sean Martin
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Pre-programmed with your live website and digital menu. Shipped or express-couriered to your business door.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderCompleteReceipt ? (
          /* ========================================================================= */
          /* ORDER RECEIPT & CONFIRMATION */
          /* ========================================================================= */
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h4 className="text-2xl sm:text-3xl font-black text-white uppercase italic">
                NFC Hardware Order Dispatched!
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Your order for <strong className="text-white">{orderCompleteReceipt.quantity}x {orderCompleteReceipt.productTitle}</strong> has been queued for laser engraving and QA flashing.
              </p>
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl max-w-lg mx-auto text-left font-mono text-xs text-zinc-300 space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Order Reference:</span>
                <span className="text-amber-400 font-bold">{orderCompleteReceipt.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Target Menu URL:</span>
                <span className="text-white truncate max-w-[240px]">{orderCompleteReceipt.programmedUrl}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Table Numbering:</span>
                <span className="text-emerald-400 font-bold">
                  {orderCompleteReceipt.tableAssignments && orderCompleteReceipt.tableAssignments.length > 1
                    ? `Tables 1 through ${orderCompleteReceipt.quantity} (Distinct QR)`
                    : 'Universal Menu Tap'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500">Delivery Address:</span>
                <span className="text-white">{orderCompleteReceipt.deliveryAddress}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-amber-400">${orderCompleteReceipt.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* HARDWARE CONFIGURATOR FORM */
          /* ========================================================================= */
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            
            {/* Step 1: Target Storefront / Menu Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                1. Target Website & Menu Destination
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {storefronts.map((sf) => (
                  <button
                    key={sf.id}
                    type="button"
                    onClick={() => {
                      setSelectedStorefrontId(sf.id);
                      setDeliveryAddress(sf.address);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      selectedStorefrontId === sf.id
                        ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {sf.logoEmoji}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <p className="text-xs font-bold text-white truncate">{sf.businessName}</p>
                      <p className="text-[10px] font-mono text-zinc-400 truncate">townraise.org/site/{sf.slug}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Form Factor Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                2. Choose Physical NFC Hardware Form Factor
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {HARDWARE_OPTIONS.map((opt) => {
                  const isSelected = selectedFormFactor === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedFormFactor(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 shadow-xl'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-2xl">{opt.emoji}</span>
                          <span className="text-xs font-mono font-black text-amber-400">
                            ${opt.unitPrice.toFixed(2)}/ea
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                            {opt.name}
                          </h4>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block mt-0.5">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500 flex justify-between">
                        <span>{opt.dimensions}</span>
                        <span className="text-zinc-400 font-bold">{opt.material.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Quantity & Table Numbering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-3xl bg-white/[0.02] border border-white/5">
              
              {/* Quantity Bundles */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Fleet Quantity & Bundle Discounts:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUANTITY_BUNDLES.map((b) => (
                    <button
                      key={b.qty}
                      type="button"
                      onClick={() => setQuantity(b.qty)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        quantity === b.qty
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold">{b.label}</p>
                      {b.discountPct > 0 && (
                        <p className="text-[10px] font-mono text-emerald-400 font-bold">Save {b.discountPct}%</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Numbering Mode */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Table Numbering & URL Assignment:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTableAssignmentMode('numbered')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tableAssignmentMode === 'numbered'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">Distinct Tables 1..N</p>
                    <p className="text-[10px] text-zinc-400">?table=1, ?table=2 for each stand</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTableAssignmentMode('universal')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      tableAssignmentMode === 'universal'
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">Universal Menu Tap</p>
                    <p className="text-[10px] text-zinc-400">Same URL across all cards</p>
                  </button>
                </div>

                {tableAssignmentMode === 'numbered' && (
                  <div className="flex items-center gap-2 pt-1 text-xs font-mono">
                    <span className="text-zinc-400">Starting Table Number:</span>
                    <input
                      type="number"
                      min="1"
                      value={startTableNumber}
                      onChange={(e) => setStartTableNumber(parseInt(e.target.value) || 1)}
                      className="w-16 px-2.5 py-1 bg-black/60 border border-white/10 rounded-lg text-center text-white"
                    />
                    <span className="text-amber-400 font-bold">
                      ➔ Tables {startTableNumber} to {startTableNumber + quantity - 1}
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Step 4: Buyer Details & Delivery */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                3. Business Delivery & Courier Contact
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Business Email</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                    Delivery Street Address / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 42 Mountain Rd, Effingham, NH"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary & Submit Button */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-transparent border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 font-mono text-xs">
                <div className="text-zinc-400">
                  <span>{quantity}x {activeHardware.name} @ ${unitPrice.toFixed(2)}/ea</span>
                </div>
                <div className="text-sm font-black text-white flex items-center gap-2">
                  <span>Total (incl. courier prep):</span>
                  <span className="text-xl text-amber-400 font-mono">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching Hardware...' : `Confirm & Order Hardware ($${totalAmount.toFixed(2)})`}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
