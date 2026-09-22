'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  NfcMenuProduct, NfcHardwareOrder, NfcFormFactor, 
  MerchantStorefront, StorefrontProduct,
  ManagedServicePackage, ClientServiceSubscription, ServiceAutomationBot, ServiceCategory
} from '@/lib/types';
import QRCode from 'qrcode';
import { 
  Crown, Cpu, CreditCard, ShoppingBag, Store, Plus, 
  Check, X, Flame, Search, ArrowRight, Radio, ShieldCheck, 
  Trash2, Edit3, ExternalLink, Printer, QrCode, Sparkles, 
  Layers, Package, Truck, DollarSign, Clock, RefreshCw, 
  AlertCircle, ChevronRight, Settings, Eye, EyeOff, Tag,
  Bot, Zap, Play, CheckCircle2, UserCheck, Briefcase, Star,
  Smartphone, MessageSquare, ShieldAlert, Calendar, Users
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    nfcMenuProducts, 
    nfcHardwareOrders,
    storefronts,
    managedServices,
    clientSubscriptions,
    automationBots,
    addNfcMenuProduct,
    updateNfcMenuProduct,
    deleteNfcMenuProduct,
    toggleNfcMenuProductPublish,
    addNfcHardwareOrder,
    updateNfcHardwareOrderStatus,
    toggleStorefrontProductStock,
    updateStorefrontProductPrice,
    addStorefrontProduct,
    addManagedService,
    updateManagedService,
    deleteManagedService,
    enrollClientSubscription,
    updateClientSubscriptionStatus,
    toggleAutomationBot,
    triggerAutomationBotManual,
    playDeliveryChime,
    userMembership
  } = useNfcStore();

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'sell_nfc_menus' | 'nfc_writer' | 'hardware_orders' | 'menu_stock_controller' | 'automation_bots' | 'managed_services'
  >('sell_nfc_menus');

  // Filter & Search states
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<NfcMenuProduct | null>(null);
  const [printQrDataUrl, setPrintQrDataUrl] = useState<string>('');
  const [showFlashModal, setShowFlashModal] = useState<NfcMenuProduct | null>(null);
  const [showEnrollClientModal, setShowEnrollClientModal] = useState<boolean>(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState<boolean>(false);

  // Web NFC Flasher State
  const [writerSelectedStore, setWriterSelectedStore] = useState<string>(storefronts[0]?.slug || 'pnb-eats');
  const [writerTableNumber, setWriterTableNumber] = useState<string>('');
  const [writerCustomUrl, setWriterCustomUrl] = useState<string>('');
  const [isNfcWriting, setIsNfcWriting] = useState<boolean>(false);
  const [nfcWriteSuccess, setNfcWriteSuccess] = useState<boolean>(false);
  const [nfcWriteError, setNfcWriteError] = useState<string | null>(null);
  const [writerQrCodeUrl, setWriterQrCodeUrl] = useState<string>('');

  // Menu Stock Controller State
  const [stockSelectedStoreId, setStockSelectedStoreId] = useState<string>(storefronts[0]?.id || 'sf-pnb-eats');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<boolean>(false);

  // Form states for creating new NFC product
  const [newProdTitle, setNewProdTitle] = useState<string>('');
  const [newProdSubtitle, setNewProdSubtitle] = useState<string>('');
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdStoreSlug, setNewProdStoreSlug] = useState<string>(storefronts[0]?.slug || 'pnb-eats');
  const [newProdTable, setNewProdTable] = useState<string>('');
  const [newProdFormFactor, setNewProdFormFactor] = useState<NfcFormFactor>('acrylic_table_stand');
  const [newProdChipType, setNewProdChipType] = useState<'NTAG213' | 'NTAG215' | 'NTAG216'>('NTAG215');
  const [newProdPrice, setNewProdPrice] = useState<string>('24.99');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<string>('39.99');
  const [newProdInventory, setNewProdInventory] = useState<string>('50');
  const [newProdBadge, setNewProdBadge] = useState<string>('★ New Release');
  const [newProdImage, setNewProdImage] = useState<string>('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80');
  const [newProdAccent, setNewProdAccent] = useState<string>('#f59e0b');
  const [newProdFeatures, setNewProdFeatures] = useState<string>('Pre-loaded with live menu URL\nHigh-density NFC microchip\nWeatherproof & scratch-resistant\nNo app required for diners');

  // Form states for adding new dish to restaurant
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishPrice, setNewDishPrice] = useState<string>('14.99');
  const [newDishCategory, setNewDishCategory] = useState<string>('Chef Specials');
  const [newDishImage, setNewDishImage] = useState<string>('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80');
  const [newDishCalories, setNewDishCalories] = useState<string>('650 cal');
  const [newDishBadge, setNewDishBadge] = useState<string>('Chef Special');

  // Form states for enrolling a new client
  const [clientBizName, setClientBizName] = useState<string>('');
  const [clientContactName, setClientContactName] = useState<string>('');
  const [clientContactPhone, setClientContactPhone] = useState<string>('');
  const [clientTown, setClientTown] = useState<string>('Effingham, NH');
  const [clientPackageId, setClientPackageId] = useState<string>(managedServices[0]?.id || 'srv-reputation-engine');
  const [clientCustomFee, setClientCustomFee] = useState<string>('99.00');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Form states for creating a new managed service
  const [newSrvName, setNewSrvName] = useState<string>('');
  const [newSrvTagline, setNewSrvTagline] = useState<string>('');
  const [newSrvDesc, setNewSrvDesc] = useState<string>('');
  const [newSrvCategory, setNewSrvCategory] = useState<ServiceCategory>('reputation_reviews');
  const [newSrvMonthly, setNewSrvMonthly] = useState<string>('99.00');
  const [newSrvSetup, setNewSrvSetup] = useState<string>('49.00');
  const [newSrvDeliverables, setNewSrvDeliverables] = useState<string>('Custom NFC Hardware Included\nAutomated Customer Follow-up SMS\nMonthly Growth Report');
  const [newSrvAutomations, setNewSrvAutomations] = useState<string>('Auto-Review Dispatcher\nNegative Feedback Shield');
  const [newSrvRecommended, setNewSrvRecommended] = useState<string>('Local Retail, Dining & Services');
  const [newSrvEmoji, setNewSrvEmoji] = useState<string>('⚡');

  // Selected Storefronts helpers
  const currentWriterStore = useMemo(() => {
    return storefronts.find(s => s.slug === writerSelectedStore) || storefronts[0];
  }, [storefronts, writerSelectedStore]);

  const currentStockStore = useMemo(() => {
    return storefronts.find(s => s.id === stockSelectedStoreId) || storefronts[0];
  }, [storefronts, stockSelectedStoreId]);

  // Computed live writer target URL
  const targetLiveUrl = useMemo(() => {
    if (writerCustomUrl.trim()) return writerCustomUrl.trim();
    if (typeof window !== 'undefined') {
      const base = window.location.origin;
      const tableParam = writerTableNumber.trim() ? `?table=${encodeURIComponent(writerTableNumber.trim())}` : '';
      return `${base}/site/${writerSelectedStore}${tableParam}`;
    }
    return `https://oasistap.com/site/${writerSelectedStore}`;
  }, [writerSelectedStore, writerTableNumber, writerCustomUrl]);

  // Generate QR for writer
  useEffect(() => {
    QRCode.toDataURL(targetLiveUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    }).then(url => setWriterQrCodeUrl(url)).catch(() => {});
  }, [targetLiveUrl]);

  // Generate QR for printable modal
  useEffect(() => {
    if (showPrintModal && typeof window !== 'undefined') {
      const tentUrl = showPrintModal.menuUrl.startsWith('http') 
        ? showPrintModal.menuUrl 
        : `${window.location.origin}/site/${showPrintModal.targetRestaurantSlug}`;
      QRCode.toDataURL(tentUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => setPrintQrDataUrl(url)).catch(() => {});
    }
  }, [showPrintModal]);

  // Filtered NFC Menu Products
  const filteredNfcProducts = useMemo(() => {
    return nfcMenuProducts.filter(p => {
      const matchForm = selectedFormFactor === 'all' || p.formFactor === selectedFormFactor;
      const matchQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetRestaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchForm && matchQuery;
    });
  }, [nfcMenuProducts, selectedFormFactor, searchQuery]);

  // Calculate High-level Admin KPI Stats
  const totalHardwareSold = useMemo(() => {
    return nfcMenuProducts.reduce((acc, p) => acc + (p.unitsSold || 0), 0);
  }, [nfcMenuProducts]);

  const totalHardwareRevenue = useMemo(() => {
    const fromOrders = nfcHardwareOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const estimatedDirect = nfcMenuProducts.reduce((acc, p) => acc + (p.unitsSold * p.price), 0);
    return Math.max(fromOrders, estimatedDirect);
  }, [nfcMenuProducts, nfcHardwareOrders]);

  const totalInventoryUnits = useMemo(() => {
    return nfcMenuProducts.reduce((acc, p) => acc + (p.inventoryCount || 0), 0);
  }, [nfcMenuProducts]);

  const totalMRR = useMemo(() => {
    return clientSubscriptions
      .filter(s => s.status === 'active')
      .reduce((acc, s) => acc + s.monthlyFee, 0);
  }, [clientSubscriptions]);

  const activeAutomationsCount = useMemo(() => {
    return automationBots.filter(b => b.isActive).length;
  }, [automationBots]);

  // Web NFC Write Handler
  const handleWriteNfc = async (urlToWrite: string) => {
    setIsNfcWriting(true);
    setNfcWriteError(null);
    setNfcWriteSuccess(false);

    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      try {
        // @ts-ignore - Web NFC API
        const ndef = new NDEFReader();
        await ndef.write({
          records: [
            { recordType: 'url', data: urlToWrite },
            { recordType: 'text', data: `OasisTap Menu Node: ${urlToWrite}` }
          ]
        });
        setNfcWriteSuccess(true);
        playDeliveryChime();
        setTimeout(() => setNfcWriteSuccess(false), 4000);
      } catch (err: any) {
        console.error('NFC Write Error:', err);
        setNfcWriteError(err?.message || 'NFC Write Failed or Cancelled. Please ensure NFC is enabled on your device.');
      } finally {
        setIsNfcWriting(false);
      }
    } else {
      setTimeout(() => {
        setIsNfcWriting(false);
        setNfcWriteSuccess(true);
        playDeliveryChime();
        setTimeout(() => setNfcWriteSuccess(false), 4000);
      }, 1200);
    }
  };

  // Submit Create New NFC Product
  const handleCreateNfcProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle.trim()) return;

    const matchedStore = storefronts.find(s => s.slug === newProdStoreSlug) || storefronts[0];
    const generatedMenuUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/site/${matchedStore.slug}`
      : `https://oasistap.com/site/${matchedStore.slug}`;

    const featuresList = newProdFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    addNfcMenuProduct({
      title: newProdTitle.trim(),
      subtitle: newProdSubtitle.trim() || `Pre-Programmed NFC Stand for ${matchedStore.businessName}`,
      description: newProdDesc.trim() || `Commercial smart table hardware pre-encoded with live digital ordering for ${matchedStore.businessName}.`,
      targetRestaurantSlug: matchedStore.slug,
      targetRestaurantName: matchedStore.businessName,
      menuUrl: generatedMenuUrl,
      tableNumber: newProdTable.trim() || undefined,
      formFactor: newProdFormFactor,
      chipType: newProdChipType,
      price: parseFloat(newProdPrice) || 24.99,
      originalPrice: parseFloat(newProdOriginalPrice) || 39.99,
      inventoryCount: parseInt(newProdInventory) || 50,
      badge: newProdBadge.trim() || undefined,
      coverImageUrl: newProdImage.trim() || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      accentColor: newProdAccent,
      isPublished: true,
      features: featuresList.length > 0 ? featuresList : ['Pre-encoded with live digital menu', 'High-density NFC microchip', 'No app required'],
      dimensions: newProdFormFactor === 'acrylic_table_stand' ? '4" x 6" Free-Standing Base' : '35mm Disc',
      material: newProdFormFactor === 'wood_table_tent' ? 'Solid NH Maple' : 'Shatterproof Acrylic'
    });

    setNewProdTitle('');
    setNewProdSubtitle('');
    setNewProdDesc('');
    setShowCreateProductModal(false);
  };

  // Submit Add New Dish to Restaurant
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !currentStockStore) return;

    const newProd: StorefrontProduct = {
      id: `dish-${Date.now().toString(36)}`,
      name: newDishName.trim(),
      description: newDishDesc.trim() || 'Freshly prepared specialty dish made to order.',
      price: parseFloat(newDishPrice) || 12.99,
      category: newDishCategory.trim() || 'Chef Specials',
      imageUrl: newDishImage.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      inStock: true,
      badge: newDishBadge.trim() || undefined,
      calories: newDishCalories.trim() || undefined,
    };

    addStorefrontProduct(currentStockStore.id, newProd);
    setNewDishName('');
    setNewDishDesc('');
    setShowAddMenuItemModal(false);
  };

  // Submit Enroll Client in Managed Retainer
  const handleEnrollClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientBizName.trim()) return;

    const pkg = managedServices.find(s => s.id === clientPackageId) || managedServices[0];
    const fee = parseFloat(clientCustomFee) || pkg.monthlyPrice;

    enrollClientSubscription({
      clientBusinessName: clientBizName.trim(),
      contactName: clientContactName.trim() || 'Business Manager',
      contactPhone: clientContactPhone.trim() || '(603) 555-0100',
      town: clientTown.trim() || 'Effingham, NH',
      packageId: pkg.id,
      packageName: pkg.name,
      monthlyFee: fee,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      automationsActive: true,
      notes: clientNotes.trim() || undefined
    });

    setClientBizName('');
    setClientContactName('');
    setClientContactPhone('');
    setShowEnrollClientModal(false);
  };

  // Submit Create New Managed Service Package
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;

    const delivList = newSrvDeliverables.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    const autoList = newSrvAutomations.split('\n').map(a => a.trim()).filter(a => a.length > 0);

    addManagedService({
      name: newSrvName.trim(),
      slug: newSrvName.trim().toLowerCase().replace(/\s+/g, '-'),
      tagline: newSrvTagline.trim() || 'Turnkey Automated Business Growth',
      description: newSrvDesc.trim() || 'Hands-off automated managed service for local Carroll County merchants.',
      category: newSrvCategory,
      monthlyPrice: parseFloat(newSrvMonthly) || 99.00,
      setupFee: parseFloat(newSrvSetup) || 0.00,
      badge: '★ Featured Service',
      includedDeliverables: delivList,
      automationsIncluded: autoList,
      recommendedFor: newSrvRecommended.trim() || 'Local Businesses',
      iconEmoji: newSrvEmoji.trim() || '⚡',
      accentColor: '#f59e0b',
      isPublished: true,
      contractTerm: 'monthly'
    });

    setNewSrvName('');
    setNewSrvTagline('');
    setNewSrvDesc('');
    setShowCreateServiceModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-600/10 to-amber-500/5 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              <span>Town Vanguard Master Admin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
              Automation & Managed Services Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-2xl">
              Manage sellable automated services ($49–$399/mo), program & sell pre-encoded NFC table stands, trigger automated review/dispatch bots, and control restaurant menu stock in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEnrollClientModal(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enroll Paying Client ($/mo)</span>
            </button>

            <button
              onClick={() => setShowCreateProductModal(true)}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Sell NFC Hardware</span>
            </button>

            <Link
              href="/services"
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Services Storefront 💼</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Monthly Recurring Revenue (MRR) */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Client Retainer MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(totalMRR)}<span className="text-xs text-zinc-500 font-normal">/mo</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            {clientSubscriptions.filter(s => s.status === 'active').length} Active Merchant Subscriptions
          </div>
        </div>

        {/* Card 2: Active Automation Bots */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Active Automation Bots</span>
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">
            {activeAutomationsCount} <span className="text-xs text-zinc-400 font-bold">Bots Live</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            Auto-Reviews, GPS & Scheduler
          </div>
        </div>

        {/* Card 3: NFC Hardware Sold */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Hardware Deployed</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalHardwareSold} <span className="text-xs text-amber-400 font-bold">Units</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            {formatCurrency(totalHardwareRevenue)} Gross Sales
          </div>
        </div>

        {/* Card 4: Services Offered */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Turnkey Services</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {managedServices.length} <span className="text-xs text-zinc-400 font-bold">Packages</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            $49 to $399/mo Retainers
          </div>
        </div>

        {/* Card 5: Connected Restaurant Menus */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Connected Kitchens</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {storefronts.length} <span className="text-xs text-emerald-400 font-bold">Live</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            Effingham, Ossipee, Freedom, Conway
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0a0f] border border-white/5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('automation_bots')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'automation_bots'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>🤖 Automation Bots ({automationBots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('managed_services')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'managed_services'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>💼 Managed Client Retainers ({clientSubscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sell_nfc_menus')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'sell_nfc_menus'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛒 NFC Menu Hardware ({nfcMenuProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nfc_writer')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'nfc_writer'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>⚡ Web NFC Flasher</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware_orders')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'hardware_orders'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>📦 Hardware Dispatch ({nfcHardwareOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu_stock_controller')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'menu_stock_controller'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>🍽️ Menu Stock Controller</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: AUTOMATION BOTS & WORKFLOWS */}
      {/* ========================================================================= */}
      {activeTab === 'automation_bots' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Active Automated Service Bots</span>
              </h3>
              <p className="text-xs text-zinc-400">
                These bots run 24/7 on autopilot to handle customer follow-ups, negative review defense, route telemetry, and recurring monthly client billing.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                ✓ All Bot Triggers Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationBots.map((bot) => (
              <div
                key={bot.id}
                className={`p-6 rounded-3xl bg-[#0e0e14] border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                  bot.isActive ? 'border-amber-400/30 shadow-amber-500/5' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{bot.iconEmoji}</span>
                    <button
                      onClick={() => toggleAutomationBot(bot.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        bot.isActive
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${bot.isActive ? 'bg-black animate-ping' : 'bg-zinc-500'}`} />
                      <span>{bot.isActive ? 'Active' : 'Paused'}</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">{bot.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{bot.description}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1.5 text-[11px] font-mono">
                    <div className="text-zinc-400">
                      ⚡ Trigger: <strong className="text-amber-400">{bot.triggerEvent}</strong>
                    </div>
                    <div className="text-zinc-400 truncate">
                      ➔ Action: <span className="text-emerald-400">{bot.actionOutput}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="text-zinc-500 font-mono text-[10px]">
                    Executed <strong>{bot.executionCount}</strong> times
                  </div>

                  <button
                    onClick={() => triggerAutomationBotManual(bot.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black text-zinc-300 font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test Trigger</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MANAGED CLIENT RETAINERS & SERVICES MARKETPLACE */}
      {/* ========================================================================= */}
      {activeTab === 'managed_services' && (
        <div className="space-y-8">
          
          {/* Active Subscribed Clients Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e0e14] border border-white/5">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enrolled Business Clients (Active Monthly Retainers)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Local Carroll County businesses paying monthly retainers for automated reputation management, digital menus, courier errands, and Airbnb concierges.
                </p>
              </div>

              <button
                onClick={() => setShowEnrollClientModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Client</span>
              </button>
            </div>

            <div className="space-y-3">
              {clientSubscriptions.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-black text-white">{client.clientBusinessName}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                        {client.status}
                      </span>
                      <span className="text-xs text-zinc-500">• {client.town}</span>
                    </div>

                    <p className="text-xs text-amber-400/90 font-medium">
                      Plan: {client.packageName}
                    </p>

                    <div className="text-xs text-zinc-400 flex items-center gap-3">
                      <span>Contact: <strong className="text-white">{client.contactName}</strong> ({client.contactPhone})</span>
                      {client.notes && <span className="text-zinc-500 italic truncate max-w-xs">— {client.notes}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400">
                        {formatCurrency(client.monthlyFee)}<span className="text-xs text-zinc-500 font-normal">/mo</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Next Bill: {client.nextBillingDate}
                      </span>
                    </div>

                    <button
                      onClick={() => updateClientSubscriptionStatus(client.id, client.status === 'active' ? 'paused' : 'active')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        client.status === 'active'
                          ? 'bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      }`}
                    >
                      {client.status === 'active' ? 'Pause Plan' : 'Reactivate Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Turnkey Managed Services Catalog */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Turnkey Service Packages Available to Sell ($/mo)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Ready-to-sell packages with automated delivery workflows. Available directly on your customer storefront.
                </p>
              </div>

              <button
                onClick={() => setShowCreateServiceModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Service Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managedServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{service.iconEmoji}</span>
                      {service.badge && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-medium">{service.tagline}</p>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed pt-1">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-zinc-300">
                      <div className="font-bold text-white text-xs">Included Deliverables:</div>
                      {service.includedDeliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-emerald-400">
                          {formatCurrency(service.monthlyPrice)}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">/month</span>
                      </div>
                      {(service.setupFee ?? 0) > 0 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          +{formatCurrency(service.setupFee!)} setup
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setClientPackageId(service.id);
                        setClientCustomFee(service.monthlyPrice.toString());
                        setShowEnrollClientModal(true);
                      }}
                      className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Enroll Client on This Plan ➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SELL & MANAGE NFC MENU HARDWARE */}
      {/* ========================================================================= */}
      {activeTab === 'sell_nfc_menus' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'acrylic_table_stand', label: 'Acrylic Stands' },
                { id: 'wood_table_tent', label: 'Wood Tents' },
                { id: 'pvc_table_disc', label: 'Table Discs' },
                { id: 'waitstaff_badge', label: 'Staff Badges' },
                { id: 'outdoor_drive_thru', label: 'Drive-Thru / Curbside' },
                { id: 'keychain_tag', label: 'Keychains' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormFactor(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFormFactor === tab.id
                      ? 'bg-white text-black font-black'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search NFC hardware & menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNfcProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <div>
                  <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                    <img
                      src={product.coverImageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" />
                      <span>{product.formFactor.replace(/_/g, ' ')}</span>
                    </div>

                    {product.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[11px]">
                      <span className="text-zinc-400 truncate max-w-[180px]">
                        Target: <strong className="text-white">{product.targetRestaurantName}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                        {product.chipType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {product.inventoryCount} units in stock • {product.unitsSold} sold
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleNfcMenuProductPublish(product.id)}
                          title={product.isPublished ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-xl border transition-all ${
                            product.isPublished 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {product.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => deleteNfcMenuProduct(product.id)}
                          title="Delete Product"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-zinc-400 pt-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowFlashModal(product);
                      handleWriteNfc(product.menuUrl);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Flash Tag ⚡</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(product)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Table Tent 🖨️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DIRECT WEB NFC MENU FLASHER & QR ENCODER */}
      {/* ========================================================================= */}
      {activeTab === 'nfc_writer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-6 shadow-xl">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Direct Web NFC Flasher</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Program NFC Card or Table Stand
                </h2>
                <p className="text-xs text-zinc-400">
                  Select a local restaurant storefront and assign a table number. Tap your NFC card, acrylic stand, or table disc against your phone or USB NFC reader to write the live digital menu destination.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">
                    Target Restaurant / Kitchen Storefront
                  </label>
                  <select
                    value={writerSelectedStore}
                    onChange={(e) => setWriterSelectedStore(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    {storefronts.map(store => (
                      <option key={store.slug} value={store.slug} className="bg-zinc-900 text-white">
                        {store.logoEmoji || '🍽️'} {store.businessName} ({store.town}, {store.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">
                      Table / Seat Assignment (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4, Bar Seat A, Patio 2"
                      value={writerTableNumber}
                      onChange={(e) => setWriterTableNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">
                      NFC Microchip Format
                    </label>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-zinc-300 font-mono flex items-center justify-between">
                      <span>NDEF URI (NTAG213/215/216)</span>
                      <span className="text-emerald-400 font-bold">Standard</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">
                    Calculated Live Destination URL
                  </label>
                  <div className="p-3.5 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-amber-400 truncate">
                      {targetLiveUrl}
                    </span>
                    <a
                      href={targetLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white shrink-0"
                      title="Test URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => handleWriteNfc(targetLiveUrl)}
                    disabled={isNfcWriting}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isNfcWriting
                        ? 'bg-amber-400/50 text-black cursor-wait animate-pulse'
                        : 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 active:scale-[0.98]'
                    }`}
                  >
                    {isNfcWriting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Hold NFC Tag to Phone Back...</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-5 h-5" />
                        <span>Flash This Menu URL to Tag ⚡</span>
                      </>
                    )}
                  </button>

                  {nfcWriteSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                      <Check className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="font-black uppercase tracking-wider">NFC Tag Successfully Programmed!</div>
                        <div className="font-normal text-[11px] text-emerald-300/80">Tag is now ready for diners to tap and order at {currentWriterStore?.businessName}.</div>
                      </div>
                    </div>
                  )}

                  {nfcWriteError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div>
                        <strong className="block font-bold">NFC Writing Notice:</strong>
                        <span>{nfcWriteError} (Use the instant QR code fallback on the right!)</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e14] border border-white/5 flex flex-col items-center justify-center text-center space-y-5 shadow-xl">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Live Hardware Preview</span>
                <h3 className="text-lg font-black text-white">Table Stand & QR Tent</h3>
              </div>

              <div className="w-64 p-6 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-400/40 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="space-y-1">
                  <span className="text-2xl">{currentWriterStore?.logoEmoji || '🥪'}</span>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">
                    {currentWriterStore?.businessName}
                  </h4>
                  {writerTableNumber && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                      {writerTableNumber}
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-inner inline-block mx-auto">
                  {writerQrCodeUrl ? (
                    <img src={writerQrCodeUrl} alt="Table QR" className="w-36 h-36 mx-auto" />
                  ) : (
                    <div className="w-36 h-36 bg-zinc-200 animate-pulse rounded-xl" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center justify-center gap-1">
                    <Radio className="w-3 h-3" />
                    <span>Tap Phone or Scan QR</span>
                  </div>
                  <p className="text-[9px] text-zinc-400">
                    Instant Digital Menu & Doorstep Delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                {writerQrCodeUrl && (
                  <a
                    href={writerQrCodeUrl}
                    download={`${writerSelectedStore}-table-qr.png`}
                    className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Download QR Image</span>
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HARDWARE ORDERS & FULFILLMENT PIPELINE */}
      {/* ========================================================================= */}
      {activeTab === 'hardware_orders' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div>
              <h3 className="text-base font-black text-white">Merchant Hardware Orders</h3>
              <p className="text-xs text-zinc-400">Manage NFC table hardware fulfillment, programming verification, and courier hand-off.</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 font-mono text-xs font-bold">
              {nfcHardwareOrders.length} Active Orders
            </span>
          </div>

          <div className="space-y-4">
            {nfcHardwareOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'in_transit' ? 'bg-indigo-500/20 text-indigo-400' :
                      order.status === 'programmed_qa' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-zinc-500">• {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h4 className="text-base font-black text-white">
                    {order.quantity}x {order.productTitle}
                  </h4>

                  <div className="text-xs text-zinc-400 space-y-1">
                    <div>
                      Merchant: <strong className="text-white">{order.buyerBusinessName || order.buyerName}</strong> • {order.buyerPhone}
                    </div>
                    <div>
                      Delivery Address: <span className="text-zinc-300">{order.deliveryAddress}</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-400/90 truncate">
                      Encoded URL: {order.programmedUrl}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-right">
                    <div className="text-xl font-black text-emerald-400">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">
                      {order.paidStatus === 'paid' ? '✓ Paid Online' : '⚡ Cash / Invoice'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'pending_flash' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'programmed_qa')}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Mark Flashed & QA ✓
                      </button>
                    )}

                    {order.status === 'programmed_qa' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'in_transit')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Dispatch with Sean 🚚
                      </button>
                    )}

                    {order.status === 'in_transit' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'delivered')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Mark Delivered 🏁
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MULTI-RESTAURANT MENU & STOCK CONTROLLER */}
      {/* ========================================================================= */}
      {activeTab === 'menu_stock_controller' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-mono uppercase text-zinc-400 shrink-0">
                Select Restaurant:
              </label>
              <select
                value={stockSelectedStoreId}
                onChange={(e) => setStockSelectedStoreId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                {storefronts.map(store => (
                  <option key={store.id} value={store.id} className="bg-zinc-900 text-white">
                    {store.logoEmoji || '🍽️'} {store.businessName} ({store.products.length} items)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddMenuItemModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish / Special</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentStockStore?.products.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-[#0e0e14] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.inStock ? 'border-white/5' : 'border-red-500/20 opacity-70 bg-red-950/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{item.name}</h4>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 text-[9px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{item.description}</p>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">Category: {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {editingPriceId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.25"
                        value={editingPriceValue}
                        onChange={(e) => setEditingPriceValue(e.target.value)}
                        className="w-20 bg-white/10 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(editingPriceValue);
                          if (!isNaN(val) && val > 0) {
                            updateStorefrontProductPrice(currentStockStore.id, item.id, val);
                          }
                          setEditingPriceId(null);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingPriceId(item.id);
                        setEditingPriceValue(item.price.toString());
                      }}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right group"
                      title="Click to edit price"
                    >
                      <span className="text-sm font-black text-emerald-400 block group-hover:text-amber-400 transition-colors">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-[8px] text-zinc-500 font-mono">Click to edit</span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleStorefrontProductStock(currentStockStore.id, item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      item.inStock
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {item.inStock ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>86'd (Sold Out)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENROLL PAYING CLIENT */}
      {/* ========================================================================= */}
      {showEnrollClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>Client Onboarding</span>
                </div>
                <h3 className="text-xl font-black text-white">Enroll Business in Managed Retainer</h3>
              </div>
              <button onClick={() => setShowEnrollClientModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollClient} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Business / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yankee Smokehouse BBQ or Pine Cove Chalet"
                  value={clientBizName}
                  onChange={(e) => setClientBizName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Owner / Manager Name"
                    value={clientContactName}
                    onChange={(e) => setClientContactName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="(603) 539-XXXX"
                    value={clientContactPhone}
                    onChange={(e) => setClientContactPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Town / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Center Ossipee, NH"
                    value={clientTown}
                    onChange={(e) => setClientTown(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Monthly Rate ($/mo)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={clientCustomFee}
                    onChange={(e) => setClientCustomFee(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Select Managed Retainer Package</label>
                <select
                  value={clientPackageId}
                  onChange={(e) => {
                    setClientPackageId(e.target.value);
                    const sel = managedServices.find(s => s.id === e.target.value);
                    if (sel) setClientCustomFee(sel.monthlyPrice.toString());
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {managedServices.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                      {s.iconEmoji} {s.name} ({formatCurrency(s.monthlyPrice)}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Special Contract Notes / Hardware</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 6 table stands delivered. Negative feedback shield active."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowEnrollClientModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider"
                >
                  Activate Retainer & Automations 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW MANAGED SERVICE PACKAGE */}
      {/* ========================================================================= */}
      {showCreateServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Create New Managed Service Package</h3>
                <p className="text-xs text-zinc-400">Offer automated recurring monthly services to local businesses</p>
              </div>
              <button onClick={() => setShowCreateServiceModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Service Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Courier & Supply Run Retainer"
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Monthly Price ($/mo) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newSrvMonthly}
                    onChange={(e) => setNewSrvMonthly(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">One-Time Setup ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={newSrvSetup}
                    onChange={(e) => setNewSrvSetup(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Included Deliverables (1 per line)</label>
                <textarea
                  rows={3}
                  value={newSrvDeliverables}
                  onChange={(e) => setNewSrvDeliverables(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateServiceModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider"
                >
                  Publish Service 💼
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW NFC MENU PRODUCT */}
      {/* ========================================================================= */}
      {showCreateProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <Plus className="w-4 h-4" />
                  <span>Hardware Catalog Manager</span>
                </div>
                <h3 className="text-xl font-black text-white">Create NFC Menu Product for Sale</h3>
              </div>
              <button
                onClick={() => setShowCreateProductModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNfcProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acrylic Dual-Sided Tap-to-Order Stand"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Form Factor</label>
                  <select
                    value={newProdFormFactor}
                    onChange={(e) => setNewProdFormFactor(e.target.value as NfcFormFactor)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="acrylic_table_stand" className="bg-zinc-900">Acrylic Table Stand</option>
                    <option value="wood_table_tent" className="bg-zinc-900">Rustic Wood Table Tent</option>
                    <option value="pvc_table_disc" className="bg-zinc-900">Self-Adhesive PVC Table Disc</option>
                    <option value="waitstaff_badge" className="bg-zinc-900">Waitstaff / Bartender Badge</option>
                    <option value="outdoor_drive_thru" className="bg-zinc-900">Outdoor Drive-Thru / Curbside Tag</option>
                    <option value="keychain_tag" className="bg-zinc-900">VIP Patron Re-Order Keychain</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">NFC Chip Memory</label>
                  <select
                    value={newProdChipType}
                    onChange={(e) => setNewProdChipType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="NTAG213" className="bg-zinc-900">NTAG213 (144 Bytes Standard)</option>
                    <option value="NTAG215" className="bg-zinc-900">NTAG215 (504 Bytes High Density)</option>
                    <option value="NTAG216" className="bg-zinc-900">NTAG216 (888 Bytes Large Capacity)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Pre-Encoded Restaurant Menu</label>
                  <select
                    value={newProdStoreSlug}
                    onChange={(e) => setNewProdStoreSlug(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {storefronts.map(s => (
                      <option key={s.slug} value={s.slug} className="bg-zinc-900">
                        {s.logoEmoji || '🍽️'} {s.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Table Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Table #1"
                    value={newProdTable}
                    onChange={(e) => setNewProdTable(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Retail Comparison ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateProductModal(false)}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                >
                  Publish NFC Product 🚀
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE TABLE STAND TENT */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative text-center">
            
            <button
              onClick={() => setShowPrintModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>NFC Smart Table Tent</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                {showPrintModal.targetRestaurantName}
              </h3>
              {showPrintModal.tableNumber && (
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase">
                  {showPrintModal.tableNumber}
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl border-4 border-dashed border-zinc-300 inline-block mx-auto">
              {printQrDataUrl && (
                <img src={printQrDataUrl} alt="Table Tent QR" className="w-52 h-52 mx-auto" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Tap Phone to Back of Stand or Scan QR
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Browse full food menu, craft drinks, calorie counts & order table delivery
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Table Tent</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DISH TO RESTAURANT */}
      {/* ========================================================================= */}
      {showAddMenuItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Add Dish to {currentStockStore?.businessName}</h3>
                <p className="text-xs text-zinc-400">Instantly appears on the live digital menu</p>
              </div>
              <button onClick={() => setShowAddMenuItemModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maple Smoked Pork Belly Bites"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Price ($) *</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Appetizers"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation details..."
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddMenuItemModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider"
                >
                  Add to Menu 🍽️
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
