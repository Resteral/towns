'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  parseCsvText, 
  autoMapHeaders, 
  generateCsvString, 
  downloadCsvFile,
  BUSINESS_FIELD_SYNONYMS,
  PRODUCT_FIELD_SYNONYMS,
  MARKETPLACE_FIELD_SYNONYMS
} from '@/lib/csv-parser';
import { DirectoryCategory, StorefrontProduct, ReviewProduct } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Table, 
  Trash2, 
  Edit2, 
  ArrowRight, 
  Store, 
  Utensils, 
  ShoppingBag, 
  Layers, 
  RefreshCw, 
  Check, 
  X, 
  Copy,
  ChevronDown,
  Info,
  Database
} from 'lucide-react';

type ImportMode = 'businesses' | 'storefront_products' | 'marketplace_products';

const SAMPLE_BUSINESS_CSV = `Name,Category,Town,Address,Phone,Website,GoogleRating,ReviewCount,Description
Poor Peoples Pub,dining_bars,Sanbornville,28 Meadow St,603-522-8991,https://poorpeoplespub.com,4.6,342,Legendary Carroll County pub with wood-fired burgers and craft beer
River's Edge Grille,dining_bars,Center Ossipee,123 Route 16,603-539-1122,https://riversedge.com,4.8,215,Scenic riverside dining featuring fresh Maine lobster rolls and steaks
Effingham General Store,retail_artisan,Effingham,45 Elm Street,603-539-4400,,4.9,189,Historic country general store with fresh baked pies and local crafts
White Mountain Woodcraft,trades_contractors,Freedom,88 Mountain Rd,603-651-7700,,5.0,94,Handcrafted timber tables and custom pine cabinetry
Lakes Region Marine & Small Engine,auto_marine,Wolfeboro,502 Center St,603-569-2200,https://lakesmarine.com,4.7,112,Full outboard repair and snowmobile maintenance`;

const SAMPLE_MENU_CSV = `Item Name,Price,Category,Description,Badge,Dietary,Calories,ImageUrl
Classic Smash Bacon Burger,14.99,Burgers & Sandwiches,Double smashed beef patties with applewood bacon and secret pub sauce,Bestseller,Dairy,850,https://images.unsplash.com/photo-1568901346375-23c9450c58cd
Fresh Lobster Roll (Warm Butter),24.50,Seafood & Mains,Quarter pound fresh Maine claw & knuckle meat in a toasted brioche bun,Chef Special,Gluten-Free Option,520,https://images.unsplash.com/photo-1533777857889-4be7c70b33f7
Wood-Fired Margherita Pizza,16.00,Pizzas,San Marzano tomato sauce fresh buffalo mozzarella and garden basil,Vegetarian,Vegetarian,780,https://images.unsplash.com/photo-1513104890138-7c749659a591
Local Maple Sugar Donut Stack,7.50,Desserts,Warm cinnamon sugar donuts drizzled with Carroll County grade-A amber maple syrup,Local Favorite,,420,https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5
Crispy Haddock Fish & Chips,18.95,Seafood & Mains,Fresh Atlantic haddock in beer batter served with house tartar and fries,Popular,,910,https://images.unsplash.com/photo-1579208575657-c595a05383b7`;

const SAMPLE_MARKETPLACE_CSV = `Title,Subtitle,Price,Category,Town,SellerName,Badge,Rating,InStock,ImageUrl
Carroll County Amber Maple Syrup 16oz,Pure Single-Origin Harvest,18.00,artisan,Effingham,Mountain View Sugarhouse,Farm Direct,5.0,true,https://images.unsplash.com/photo-1589301760014-d929f3979dbc
Hand-Carved Cedar Coaster Set (4-Pack),Aromatic White Mountain Cedar,24.00,artisan,Freedom,Ossipee Valley Woodcraft,Handmade,4.9,true,https://images.unsplash.com/photo-1615873968403-89e068629265
Obsidian Smart NFC Business Card,Instant Google Reviews & Tap Relay,29.99,cards,Effingham,Townraise Hardware,Best Seller,5.0,true,https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe
Cyber Glass NFC Tabletop Stand,Dual-Sided QR & NFC Tap Zone,49.99,stands,Wolfeboro,Townraise Hardware,Pro Tier,4.9,true,https://images.unsplash.com/photo-1544816155-12df9643f363`;

interface CsvImporterHubProps {
  initialMode?: ImportMode;
  targetStorefrontId?: string;
  onImportComplete?: (importedCount: number) => void;
}

export default function CsvImporterHub({
  initialMode = 'businesses',
  targetStorefrontId,
  onImportComplete
}: CsvImporterHubProps) {
  const { 
    directoryListings, 
    storefronts, 
    products, 
    bulkImportDirectoryListings, 
    bulkImportStorefrontProducts, 
    bulkImportMarketplaceProducts,
    activeTown
  } = useNfcStore();

  const [mode, setMode] = useState<ImportMode>(initialMode);
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>(
    targetStorefrontId || storefronts[0]?.id || ''
  );
  const [rawInputText, setRawInputText] = useState<string>('');
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessResult, setImportSuccessResult] = useState<{
    count: number;
    mode: ImportMode;
    timestamp: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active mapping schema based on mode
  const currentSynonymsMap = useMemo(() => {
    switch (mode) {
      case 'businesses': return BUSINESS_FIELD_SYNONYMS;
      case 'storefront_products': return PRODUCT_FIELD_SYNONYMS;
      case 'marketplace_products': return MARKETPLACE_FIELD_SYNONYMS;
    }
  }, [mode]);

  // Target schema fields list
  const targetFields = useMemo(() => {
    return Object.keys(currentSynonymsMap);
  }, [currentSynonymsMap]);

  // Parse Raw Text whenever text changes or is loaded
  const handleParseText = (text: string) => {
    setRawInputText(text);
    if (!text.trim()) {
      setParsedHeaders([]);
      setParsedRows([]);
      setSelectedRowIndices(new Set());
      return;
    }

    const { headers, rows } = parseCsvText(text);
    setParsedHeaders(headers);
    setParsedRows(rows);

    // Auto-map headers
    const autoMap = autoMapHeaders(headers, currentSynonymsMap);
    setFieldMappings(autoMap);

    // Select all parsed rows by default
    const allIndices = new Set(rows.map((_, i) => i));
    setSelectedRowIndices(allIndices);
    setImportSuccessResult(null);
  };

  // Handle file drop or upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParseText(content);
    };
    reader.readAsText(file);
  };

  // Load preset sample CSV
  const handleLoadSample = (sampleType: ImportMode) => {
    setMode(sampleType);
    let sample = SAMPLE_BUSINESS_CSV;
    if (sampleType === 'storefront_products') sample = SAMPLE_MENU_CSV;
    if (sampleType === 'marketplace_products') sample = SAMPLE_MARKETPLACE_CSV;
    handleParseText(sample);
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    let content = '';
    let fileName = '';
    if (mode === 'businesses') {
      content = SAMPLE_BUSINESS_CSV;
      fileName = 'townraise_restaurants_businesses_template.csv';
    } else if (mode === 'storefront_products') {
      content = SAMPLE_MENU_CSV;
      fileName = 'townraise_menu_products_template.csv';
    } else {
      content = SAMPLE_MARKETPLACE_CSV;
      fileName = 'townraise_marketplace_inventory_template.csv';
    }
    downloadCsvFile(content, fileName);
  };

  // Export current live data to CSV
  const handleExportCurrentData = () => {
    if (mode === 'businesses') {
      const data = directoryListings.map(d => ({
        Name: d.name,
        Category: d.category,
        CategoryLabel: d.categoryLabel,
        Town: d.town,
        Address: d.address,
        Phone: d.phone,
        Website: d.website || '',
        GoogleRating: d.googleRating,
        ReviewCount: d.reviewCount,
        IsClaimed: d.isClaimed,
      }));
      downloadCsvFile(generateCsvString(data), 'carroll_county_directory_export.csv');
    } else if (mode === 'storefront_products') {
      const sf = storefronts.find(s => s.id === selectedStorefrontId) || storefronts[0];
      const data = (sf?.products || []).map(p => ({
        ItemName: p.name,
        Price: p.price,
        Category: p.category,
        Description: p.description,
        Badge: p.badge || '',
        InStock: p.inStock,
        Calories: p.calories || '',
        ImageUrl: p.imageUrl,
      }));
      downloadCsvFile(generateCsvString(data), `${sf?.slug || 'storefront'}_products_export.csv`);
    } else {
      const data = products.map(p => ({
        Title: p.name,
        Subtitle: p.subtitle,
        Price: p.price,
        Category: p.category,
        Town: p.town || 'Effingham',
        SellerName: p.sellerName || 'Townraise Artisan',
        Rating: p.rating,
        InStock: p.inStock,
        ImageUrl: p.imageUrl,
      }));
      downloadCsvFile(generateCsvString(data), 'townraise_marketplace_products_export.csv');
    }
  };

  // Toggle row selection
  const toggleRowSelection = (index: number) => {
    const next = new Set(selectedRowIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedRowIndices(next);
  };

  const toggleSelectAll = () => {
    if (selectedRowIndices.size === parsedRows.length) {
      setSelectedRowIndices(new Set());
    } else {
      setSelectedRowIndices(new Set(parsedRows.map((_, i) => i)));
    }
  };

  const deleteRow = (index: number) => {
    const updated = parsedRows.filter((_, i) => i !== index);
    setParsedRows(updated);
    const nextSelected = new Set<number>();
    updated.forEach((_, i) => {
      if (selectedRowIndices.has(i)) nextSelected.add(i);
    });
    setSelectedRowIndices(nextSelected);
  };

  // Execute Bulk Import
  const handleExecuteImport = () => {
    if (selectedRowIndices.size === 0) return;
    setIsProcessing(true);

    const rowsToImport = parsedRows.filter((_, idx) => selectedRowIndices.has(idx));
    let importedCount = 0;

    try {
      if (mode === 'businesses') {
        const formattedListings = rowsToImport.map(row => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Name'] || row['name'] || 'Unnamed Business';
          const rawCat = (fieldMappings.category && row[fieldMappings.category]) || row['Category'] || 'dining_bars';
          
          let category: DirectoryCategory = 'dining_bars';
          const catLower = rawCat.toLowerCase();
          if (catLower.includes('bar') || catLower.includes('din') || catLower.includes('food') || catLower.includes('restaurant')) category = 'dining_bars';
          else if (catLower.includes('contract') || catLower.includes('trade') || catLower.includes('carp') || catLower.includes('roof')) category = 'trades_contractors';
          else if (catLower.includes('lodge') || catLower.includes('cabin') || catLower.includes('hotel') || catLower.includes('camp')) category = 'lodging_cabins';
          else if (catLower.includes('auto') || catLower.includes('marine') || catLower.includes('engine') || catLower.includes('boat')) category = 'auto_marine';
          else if (catLower.includes('health') || catLower.includes('well') || catLower.includes('spa') || catLower.includes('gym')) category = 'health_wellness';
          else if (catLower.includes('retail') || catLower.includes('store') || catLower.includes('art') || catLower.includes('shop')) category = 'retail_artisan';
          else if (catLower.includes('prof') || catLower.includes('serv') || catLower.includes('law') || catLower.includes('realt')) category = 'professional_services';

          const town = (fieldMappings.town && row[fieldMappings.town]) || row['Town'] || activeTown?.name || 'Effingham';
          const address = (fieldMappings.address && row[fieldMappings.address]) || row['Address'] || `${town}, NH`;
          const phone = (fieldMappings.phone && row[fieldMappings.phone]) || row['Phone'] || '(603) 508-0305';
          const website = (fieldMappings.website && row[fieldMappings.website]) || row['Website'] || undefined;
          const googleRating = Number((fieldMappings.googleRating && row[fieldMappings.googleRating]) || row['GoogleRating'] || 4.8);
          const reviewCount = Number((fieldMappings.reviewCount && row[fieldMappings.reviewCount]) || row['ReviewCount'] || 12);
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || '';

          const categoryLabels: Record<DirectoryCategory, string> = {
            dining_bars: 'Dining & Craft Bars',
            trades_contractors: 'Trades & Contractors',
            lodging_cabins: 'Lakeside Lodging & Cabins',
            auto_marine: 'Auto, 4x4 & Marine',
            health_wellness: 'Health & Mountain Wellness',
            retail_artisan: 'Retail & Heritage Goods',
            professional_services: 'Professional Services',
          };

          return {
            name,
            category,
            categoryLabel: categoryLabels[category],
            town,
            state: 'NH',
            address,
            phone,
            website,
            googleRating: isNaN(googleRating) ? 4.8 : googleRating,
            reviewCount: isNaN(reviewCount) ? 24 : reviewCount,
            isClaimed: true,
            claimedBy: name,
            verifiedBadge: true,
            nfcEnabled: true,
            offersDelivery: category === 'dining_bars',
            coverImage: category === 'dining_bars' 
              ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800' 
              : 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800',
            description,
            tags: [category, town, 'Verified Local'],
          };
        });

        bulkImportDirectoryListings(formattedListings);
        importedCount = formattedListings.length;

      } else if (mode === 'storefront_products') {
        const targetSfId = selectedStorefrontId || storefronts[0]?.id || 'storefront-sean-tap';
        const formattedProducts = rowsToImport.map((row, i) => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Item Name'] || row['name'] || `Menu Item ${i + 1}`;
          const price = Number((fieldMappings.price && row[fieldMappings.price]) || row['Price'] || 12.99);
          const category = (fieldMappings.category && row[fieldMappings.category]) || row['Category'] || 'Mains';
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || 'Fresh local ingredients made to order.';
          const badge = (fieldMappings.badge && row[fieldMappings.badge]) || row['Badge'] || undefined;
          const imageUrl = (fieldMappings.imageUrl && row[fieldMappings.imageUrl]) || row['ImageUrl'] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
          const calories = (fieldMappings.calories && row[fieldMappings.calories]) || row['Calories'] || undefined;

          return {
            name,
            price: isNaN(price) ? 9.99 : price,
            category,
            description,
            imageUrl,
            badge,
            calories,
            inStock: true,
          };
        });

        bulkImportStorefrontProducts(targetSfId, formattedProducts);
        importedCount = formattedProducts.length;

      } else {
        // marketplace_products
        const formattedProducts = rowsToImport.map((row, i) => {
          const name = (fieldMappings.name && row[fieldMappings.name]) || row['Title'] || row['name'] || `Artisan Good ${i + 1}`;
          const price = Number((fieldMappings.price && row[fieldMappings.price]) || row['Price'] || 24.99);
          const subtitle = (fieldMappings.subtitle && row[fieldMappings.subtitle]) || row['Subtitle'] || 'Crafted in Carroll County';
          const description = (fieldMappings.description && row[fieldMappings.description]) || row['Description'] || 'Locally crafted authentic mountain goods.';
          const town = (fieldMappings.town && row[fieldMappings.town]) || row['Town'] || 'Effingham';
          const sellerName = (fieldMappings.sellerName && row[fieldMappings.sellerName]) || row['SellerName'] || 'Local Artisan';
          const imageUrl = (fieldMappings.imageUrl && row[fieldMappings.imageUrl]) || row['ImageUrl'] || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc';
          const badge = (fieldMappings.badge && row[fieldMappings.badge]) || row['Badge'] || 'Local Craft';
          const rating = Number((fieldMappings.rating && row[fieldMappings.rating]) || row['Rating'] || 5.0);

          return {
            name,
            subtitle,
            description,
            price: isNaN(price) ? 19.99 : price,
            category: 'artisan' as const,
            features: ['Locally Made', '100% Guaranteed', 'Carroll County Pioneer'],
            imageUrl,
            inStock: true,
            badge,
            rating: isNaN(rating) ? 5.0 : rating,
            reviewsCount: 14,
            town,
            sellerName,
          };
        });

        bulkImportMarketplaceProducts(formattedProducts);
        importedCount = formattedProducts.length;
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setImportSuccessResult({
        count: importedCount,
        mode,
        timestamp: new Date().toLocaleTimeString(),
      });

      if (onImportComplete) {
        onImportComplete(importedCount);
      }

      // Reset parser table
      setParsedRows([]);
      setParsedHeaders([]);
      setRawInputText('');
      setSelectedRowIndices(new Set());

    } catch (err) {
      console.error('Import failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ======================================================== */}
      {/* 1. IMPORT MODE SELECTION & STATS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mode 1: Restaurants & Businesses */}
        <button
          onClick={() => { setMode('businesses'); handleLoadSample('businesses'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'businesses'
              ? 'bg-amber-400/10 border-amber-400 shadow-xl shadow-amber-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'businesses' ? 'bg-amber-400 text-black' : 'bg-white/10 text-amber-400'
            }`}>
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              {directoryListings.length} Live in Directory
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
            🏪 Restaurants & Businesses
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Bulk import restaurants, stores, contractors, and lodging into the Carroll County Directory.
          </p>
        </button>

        {/* Mode 2: Digital Menus & Storefront Products */}
        <button
          onClick={() => { setMode('storefront_products'); handleLoadSample('storefront_products'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'storefront_products'
              ? 'bg-orange-400/10 border-orange-400 shadow-xl shadow-orange-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'storefront_products' ? 'bg-orange-400 text-black' : 'bg-white/10 text-orange-400'
            }`}>
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              {storefronts.reduce((acc, sf) => acc + sf.products.length, 0)} Menu Dishes
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-orange-300 transition-colors">
            🍕 Digital Menus & Dishes
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Import food dishes, prices, categories, and dietary tags directly to a storefront digital menu.
          </p>
        </button>

        {/* Mode 3: Marketplace & Artisan Inventory */}
        <button
          onClick={() => { setMode('marketplace_products'); handleLoadSample('marketplace_products'); }}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            mode === 'marketplace_products'
              ? 'bg-emerald-400/10 border-emerald-400 shadow-xl shadow-emerald-500/10'
              : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'marketplace_products' ? 'bg-emerald-400 text-black' : 'bg-white/10 text-emerald-400'
            }`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              {products.length} Artisan Items
            </span>
          </div>
          <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
            🛍️ Marketplace Inventory
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Bulk upload local syrups, woodwork, NFC hardware, and handcrafted goods for sale.
          </p>
        </button>
      </div>

      {/* Target Storefront Selector if in menu mode */}
      {mode === 'storefront_products' && (
        <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Utensils className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Target Storefront for Imported Menu Items</div>
              <div className="text-[10px] text-zinc-400">Dishes will be added directly to this business's tap-to-order menu.</div>
            </div>
          </div>

          <select
            value={selectedStorefrontId}
            onChange={(e) => setSelectedStorefrontId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black/80 border border-orange-500/40 text-orange-200 text-xs font-bold focus:outline-none focus:border-orange-400"
          >
            {storefronts.map(sf => (
              <option key={sf.id} value={sf.id}>
                {sf.businessName} ({sf.town}, NH) — {sf.products.length} current items
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DRAG & DROP / FILE UPLOAD & TEMPLATE DOWNLOAD ZONE */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-400" />
              <span>Upload or Paste Your CSV Data</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Supports Google Sheets exports, Excel CSV, TSV tab-delimited, and standard formatted spreadsheets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Sample CSV Template</span>
            </button>

            <button
              onClick={handleExportCurrentData}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Current Data</span>
            </button>
          </div>
        </div>

        {/* Upload Box */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-2xl p-8 text-center cursor-pointer transition-all bg-black/40 hover:bg-white/[0.02] space-y-3 group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv, .tsv, .txt" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div className="text-sm font-bold text-white">
            Click to upload your <span className="text-amber-400">.CSV</span> or <span className="text-amber-400">.TSV</span> spreadsheet file
          </div>
          <p className="text-xs text-zinc-500">
            or drag and drop your exported spreadsheet here
          </p>
        </div>

        {/* Direct Textarea Paste fallback */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Or Paste Raw CSV / Excel Clipboard Text Directly:</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLoadSample(mode)}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline font-bold"
              >
                Load Sample {mode === 'businesses' ? 'Directory' : mode === 'storefront_products' ? 'Menu' : 'Marketplace'} CSV
              </button>
              {rawInputText && (
                <button
                  onClick={() => handleParseText('')}
                  className="text-[11px] text-red-400 hover:text-red-300 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={rawInputText}
            onChange={(e) => handleParseText(e.target.value)}
            rows={4}
            placeholder={`e.g. Name,Category,Town,Address,Phone,Website,GoogleRating\nEffingham Pizzeria,dining_bars,Effingham,12 Elm St,603-555-0199,https://effinghampizza.com,4.9`}
            className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400 resize-y"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. PARSED RESULTS, COLUMN MAPPER & INTERACTIVE DATA GRID */}
      {/* ======================================================== */}
      {parsedRows.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-amber-500/30 space-y-6 backdrop-blur-xl animate-in fade-in-50">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black">
                {parsedRows.length}
              </div>
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>Extracted {parsedRows.length} Rows</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    {selectedRowIndices.size} Selected for Import
                  </span>
                </h4>
                <p className="text-xs text-zinc-400">Review column mappings and toggle rows below before committing.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-all"
              >
                {selectedRowIndices.size === parsedRows.length ? 'Deselect All' : 'Select All'}
              </button>

              <button
                onClick={handleExecuteImport}
                disabled={isProcessing || selectedRowIndices.size === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Import {selectedRowIndices.size} Records Now</span>
              </button>
            </div>
          </div>

          {/* Smart Column Mapping Configurator */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Smart Column Mappings (Detected vs. Target Field)</span>
              </span>
              <span className="text-[10px] text-zinc-500">Auto-detected from CSV headers</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {targetFields.map(field => {
                const mappedHeader = fieldMappings[field] || '';
                return (
                  <div key={field} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400/90 uppercase font-bold block">{field}</span>
                    <select
                      value={mappedHeader}
                      onChange={(e) => setFieldMappings(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-2 py-1 rounded-lg bg-black/80 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="">(None / Skip)</option>
                      {parsedHeaders.map((h, i) => (
                        <option key={i} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spreadsheet Data Grid */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/60">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0b14] border-b border-white/10 text-zinc-400 text-[10px] uppercase font-mono sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRowIndices.size === parsedRows.length && parsedRows.length > 0} 
                        onChange={toggleSelectAll}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                      />
                    </th>
                    <th className="p-3">#</th>
                    {parsedHeaders.map((header, idx) => (
                      <th key={idx} className="p-3 font-black text-zinc-300">
                        {header}
                      </th>
                    ))}
                    <th className="p-3 w-12 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {parsedRows.map((row, rowIdx) => {
                    const isSelected = selectedRowIndices.has(rowIdx);
                    return (
                      <tr 
                        key={rowIdx} 
                        className={`transition-colors ${
                          isSelected ? 'bg-amber-400/[0.04] hover:bg-amber-400/[0.08]' : 'opacity-40 hover:opacity-80 bg-black/40'
                        }`}
                      >
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => toggleRowSelection(rowIdx)}
                            className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                          />
                        </td>
                        <td className="p-3 font-mono text-[10px] text-zinc-500">{rowIdx + 1}</td>
                        {parsedHeaders.map((header, colIdx) => (
                          <td key={colIdx} className="p-3 text-zinc-200 font-mono text-xs max-w-[200px] truncate">
                            {row[header] || <span className="text-zinc-600 italic">—</span>}
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => deleteRow(rowIdx)}
                            title="Remove row"
                            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom commit bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-zinc-400">
              Committing will instantly store records in Townraise local lattice and update all public views.
            </div>

            <button
              onClick={handleExecuteImport}
              disabled={isProcessing || selectedRowIndices.size === 0}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import Selected {selectedRowIndices.size} Records</span>
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 4. POST-IMPORT SUCCESS NOTIFICATION & SHORTCUTS */}
      {/* ======================================================== */}
      {importSuccessResult && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/40 space-y-4 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-black flex items-center justify-center font-black text-xl">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Successfully Imported {importSuccessResult.count} {importSuccessResult.mode === 'businesses' ? 'Businesses' : importSuccessResult.mode === 'storefront_products' ? 'Menu Dishes' : 'Artisan Products'}!
              </h3>
              <p className="text-xs text-emerald-300">
                Data was committed at {importSuccessResult.timestamp} and is immediately live across Carroll County hubs.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {importSuccessResult.mode === 'businesses' && (
              <>
                <Link
                  href="/directory"
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center gap-2 shadow"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View in Business Directory →</span>
                </Link>
                <Link
                  href="/eats"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>View Food & Dining →</span>
                </Link>
              </>
            )}

            {importSuccessResult.mode === 'storefront_products' && (
              <>
                <Link
                  href={`/site/${storefronts.find(s => s.id === selectedStorefrontId)?.slug || 'sean-custom-store'}`}
                  className="px-4 py-2.5 rounded-xl bg-orange-400 text-black font-black text-xs uppercase tracking-wider hover:bg-orange-300 transition-all flex items-center gap-2 shadow"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>View Digital Tap Menu →</span>
                </Link>
                <Link
                  href="/dashboard/storefront"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Manage in Storefront Portal →</span>
                </Link>
              </>
            )}

            {importSuccessResult.mode === 'marketplace_products' && (
              <>
                <Link
                  href="/marketplace"
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-300 transition-all flex items-center gap-2 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>View in Artisan Marketplace →</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
