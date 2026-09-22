'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig, ReviewProduct } from '@/lib/types';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import ImageUpload from '@/components/ImageUpload';
import { 
  Radio, 
  Sparkles, 
  Cpu, 
  Scan, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Share2, 
  Smartphone, 
  Palette, 
  Layers, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Wifi, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Utensils, 
  Truck, 
  MessageSquare, 
  Compass, 
  ExternalLink, 
  ShoppingBag, 
  Plus, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  FileCode,
  Tag
} from 'lucide-react';

export type NfcActionType = 'google_review' | 'menu' | 'driver_dispatch' | 'vcard' | 'url' | 'wifi' | 'sms' | 'town_node';
export type NfcFormFactorType = 'card' | 'sticker' | 'stand' | 'wood_puck' | 'keychain';

interface ScannedTagData {
  uid: string;
  chipType: string;
  capacityBytes: number;
  usedBytes: number;
  isLocked: boolean;
  technology: string;
  records: {
    type: string;
    payload: string;
    description: string;
    actionUrl?: string;
  }[];
  timestamp: string;
}

const PRESET_SIMULATED_TAGS: { name: string; desc: string; data: ScannedTagData }[] = [
  {
    name: 'Smoke World Ossipee Smart Review Stand',
    desc: 'NTAG213 • 144 Bytes • Google Review 5-Star Filter',
    data: {
      uid: '04:7B:3A:89:FE:12:80',
      chipType: 'NXP NTAG213 (ISO/IEC 14443-3A)',
      capacityBytes: 144,
      usedBytes: 86,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag • 13.56 MHz',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'https://oasistap.local/tap/card-oasis-smoke-world',
          description: 'Smart Google Review Funnel for Smoke World Ossipee',
          actionUrl: 'https://oasistap.local/tap/card-oasis-smoke-world'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'PNB Eats Roadside Table #4 Stand',
    desc: 'NTAG215 • 504 Bytes • Dine-in Mobile Ordering',
    data: {
      uid: '04:1C:88:52:90:3A:81',
      chipType: 'NXP NTAG215 (High Capacity)',
      capacityBytes: 504,
      usedBytes: 132,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag • 13.56 MHz',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'https://oasistap.local/site/pnb-eats?table=4',
          description: 'PNB Eats Table #4 Dine-In Menu & Instant Ticket',
          actionUrl: 'https://oasistap.local/site/pnb-eats?table=4'
        },
        {
          type: 'Text (NDEF Record #2)',
          payload: 'Table 4 • Roadside Grill • Effingham NH',
          description: 'Location Metadata'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Sean Martin Vanguard Courier Dispatch Tag',
    desc: 'NTAG216 • 888 Bytes • Direct 1-Tap Driver Ping',
    data: {
      uid: '04:99:EE:41:2B:67:88',
      chipType: 'NXP NTAG216 (Vanguard Fleet Unit)',
      capacityBytes: 888,
      usedBytes: 210,
      isLocked: true,
      technology: 'NFC Forum Type 2 Tag • 13.56 MHz',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'tel:5085070305',
          description: 'Emergency / Express Courier Phone Dispatch',
          actionUrl: 'tel:5085070305'
        },
        {
          type: 'URI (NDEF Record #2)',
          payload: 'https://oasistap.local/courier?driver=driver-sean',
          description: 'Online Delivery Booking Route',
          actionUrl: 'https://oasistap.local/courier?driver=driver-sean'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Walt\'s Woodcraft Contractor vCard',
    desc: 'NTAG213 • 144 Bytes • Master Carpenter Contact vCard',
    data: {
      uid: '04:33:AA:19:D4:55:82',
      chipType: 'NXP NTAG213',
      capacityBytes: 144,
      usedBytes: 114,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag',
      records: [
        {
          type: 'Text/vCard',
          payload: 'BEGIN:VCARD\\nFN:Walter Henderson\\nTITLE:Master Carpenter\\nTEL:(603)539-8120\\nEND:VCARD',
          description: 'Walter Henderson - Walt\'s Woodcraft (Effingham NH)',
          actionUrl: 'tel:6035398120'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  }
];

export default function NfcTagReaderCustomizer() {
  const { addCard, playDeliveryChime, products, addToCart } = useNfcStore();

  // Active Main Tab: Reader vs Customizer
  const [activeTab, setActiveTab] = useState<'reader' | 'customizer' | 'export'>('customizer');

  // --- NFC READER STATE ---
  const [isWebNfcScanning, setIsWebNfcScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  const [scannedTag, setScannedTag] = useState<ScannedTagData | null>(PRESET_SIMULATED_TAGS[0].data);
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [hasWebNfcSupport, setHasWebNfcSupport] = useState<boolean>(false);

  // Check Web NFC support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setHasWebNfcSupport(true);
    }
  }, []);

  // --- CUSTOMIZER STATE ---
  const [actionType, setActionType] = useState<NfcActionType>('google_review');
  const [formFactor, setFormFactor] = useState<NfcFormFactorType>('card');

  // Payload Content State
  const [businessName, setBusinessName] = useState('Smoke World Ossipee');
  const [headline, setHeadline] = useState('Tap phone to review us on Google!');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('https://search.google.com/local/writereview?placeid=ChIJb6eBq9f94okRGb_SmokeWorldOss');
  const [customUrl, setCustomUrl] = useState('https://oasistap.local');
  const [vCardData, setVCardData] = useState({
    name: 'Sean Martin',
    title: 'Lead Courier & Vanguard Operator',
    phone: '(508) 507-0305',
    email: 'frijj555@gmail.com',
    town: 'Effingham, NH',
  });
  const [wifiData, setWifiData] = useState({
    ssid: 'CarrollCounty-Guest-WiFi',
    password: 'LakesRegion2026!',
    encryption: 'WPA2'
  });
  const [smsData, setSmsData] = useState({
    phone: '(508) 507-0305',
    message: 'Hi Sean! I need a fast courier run in Carroll County.'
  });
  const [selectedTownNode, setSelectedTownNode] = useState('Effingham');

  // Visual Customization State
  const [selectedColor, setSelectedColor] = useState('#0f172a');
  const [selectedTexture, setSelectedTexture] = useState<'matte' | 'carbon' | 'metal' | 'cyber' | 'holo'>('cyber');
  const [selectedEmoji, setSelectedEmoji] = useState('💨');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [isCopied, setIsCopied] = useState(false);
  const [writeSuccessMsg, setWriteSuccessMsg] = useState<string | null>(null);
  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');

  // Generate target payload string based on active actionType
  const getComputedPayloadUrl = () => {
    switch (actionType) {
      case 'google_review':
        return googleReviewUrl || 'https://search.google.com/local/writereview';
      case 'menu':
        return `https://oasistap.local/site/pnb-eats`;
      case 'driver_dispatch':
        return `tel:${smsData.phone.replace(/[^0-9]/g, '')}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardData.name}\nFN:${vCardData.name}\nORG:${businessName}\nTITLE:${vCardData.title}\nTEL:${vCardData.phone}\nEMAIL:${vCardData.email}\nADR:;;${vCardData.town};;;;\nEND:VCARD`;
      case 'wifi':
        return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
      case 'sms':
        return `sms:${smsData.phone.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(smsData.message)}`;
      case 'town_node':
        return `https://oasistap.local/towns?town=${encodeURIComponent(selectedTownNode)}`;
      case 'url':
      default:
        return customUrl || 'https://oasistap.local';
    }
  };

  // Update QR Code whenever payload changes
  useEffect(() => {
    const payload = getComputedPayloadUrl();
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    }).then(url => setGeneratedQrDataUrl(url)).catch(() => {});
  }, [actionType, googleReviewUrl, customUrl, vCardData, wifiData, smsData, selectedTownNode, businessName]);

  // Handle Real Web NFC Scanning
  const handleStartWebNfcScan = async () => {
    if (!('NDEFReader' in window)) {
      setScanStatusMessage('Web NFC is not supported on this browser. Try Chrome on Android or use our interactive hardware simulator below.');
      return;
    }

    try {
      setIsWebNfcScanning(true);
      setScanStatusMessage('📡 Ready! Hold your phone or physical NFC tag against the NFC antenna...');
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = (event: any) => {
        const serialNumber = event.serialNumber || '04:XX:XX:XX:XX:XX:XX';
        const records = Array.from(event.message.records || []).map((r: any, idx: number) => {
          let text = '';
          try {
            const decoder = new TextDecoder(r.encoding || 'utf-8');
            text = decoder.decode(r.data);
          } catch {
            text = 'Raw NDEF Binary Content';
          }
          return {
            type: r.recordType || `Record #${idx + 1}`,
            payload: text,
            description: `Physical NDEF record of type ${r.recordType}`,
            actionUrl: text.startsWith('http') || text.startsWith('tel:') ? text : undefined
          };
        });

        const newTagData: ScannedTagData = {
          uid: serialNumber,
          chipType: 'Physical NFC Chip (Read via Web NFC API)',
          capacityBytes: 504,
          usedBytes: event.message.records ? event.message.records.length * 64 : 128,
          isLocked: false,
          technology: 'NFC Forum Type 2 / 4 Compatible',
          records: records.length > 0 ? records : [
            { type: 'NDEF Payload', payload: 'Physical tag detected successfully!', description: 'Scanned tag record' }
          ],
          timestamp: new Date().toLocaleTimeString()
        };

        setScannedTag(newTagData);
        setIsWebNfcScanning(false);
        setScanStatusMessage('✅ NFC Tag Scanned & Decoded Successfully!');
        playDeliveryChime();
        confetti({ particleCount: 30, spread: 60 });
      };

      ndef.onreadingerror = () => {
        setScanStatusMessage('⚠️ Could not read NFC tag. Make sure the chip is not locked or damaged.');
        setIsWebNfcScanning(false);
      };
    } catch (err: any) {
      setIsWebNfcScanning(false);
      setScanStatusMessage(`Error starting NFC reader: ${err.message || err}`);
    }
  };

  // Handle Simulated NFC Tap
  const handleSimulateTap = (presetIndex: number) => {
    setIsSimulatingTap(true);
    playDeliveryChime();
    setTimeout(() => {
      setScannedTag(PRESET_SIMULATED_TAGS[presetIndex].data);
      setIsSimulatingTap(false);
      setScanStatusMessage(`✅ Tag tapped: ${PRESET_SIMULATED_TAGS[presetIndex].name}`);
      confetti({ particleCount: 25, spread: 50 });
    }, 400);
  };

  // Import Scanned Tag payload into the Customizer
  const handleImportScannedTag = () => {
    if (!scannedTag || scannedTag.records.length === 0) return;
    const firstRec = scannedTag.records[0];
    if (firstRec.actionUrl?.startsWith('http')) {
      setActionType('url');
      setCustomUrl(firstRec.actionUrl);
    } else if (firstRec.payload.includes('VCARD')) {
      setActionType('vcard');
    } else {
      setActionType('url');
      setCustomUrl(firstRec.payload);
    }
    setActiveTab('customizer');
    setWriteSuccessMsg('Scanned NFC payload imported into Customizer!');
    setTimeout(() => setWriteSuccessMsg(null), 3000);
  };

  // Physical Web NFC Write
  const handleWritePhysicalTag = async () => {
    if (!('NDEFReader' in window)) {
      alert('Web NFC writing requires Chrome on Android or a compatible Web NFC browser. You can export the NDEF payload or order a pre-flashed physical tag below!');
      return;
    }

    try {
      setIsWritingNfc(true);
      const ndef = new (window as any).NDEFReader();
      const payload = getComputedPayloadUrl();
      await ndef.write({
        records: [
          { recordType: actionType === 'url' || actionType === 'google_review' ? 'url' : 'text', data: payload }
        ]
      });
      setIsWritingNfc(false);
      setWriteSuccessMsg('🎉 Successfully encoded and flashed physical NFC tag!');
      playDeliveryChime();
      confetti({ particleCount: 60, spread: 80 });
    } catch (err: any) {
      setIsWritingNfc(false);
      alert(`NFC Write Error: ${err.message || err}. Make sure NFC is enabled in your Android settings.`);
    }
  };

  // Save to Fleet in store
  const handleSaveToFleet = () => {
    const newBeacon = addCard({
      cardName: `${businessName} (${formFactor.toUpperCase()})`,
      businessName,
      googleReviewUrl: actionType === 'google_review' ? googleReviewUrl : getComputedPayloadUrl(),
      mode: 'smart_funnel',
      thresholdStars: 4,
      customHeadline: headline,
      logoUrl: customLogoUrl || selectedEmoji,
      primaryColor: selectedColor,
      active: true,
      assignedLocation: 'Main Counter'
    });

    playDeliveryChime();
    confetti({ particleCount: 50, spread: 70 });
    setWriteSuccessMsg(`Saved "${businessName}" to your active Beacon Fleet! Tap ID: ${newBeacon.id}`);
    setTimeout(() => setWriteSuccessMsg(null), 4000);
  };

  // Add custom physical hardware order to Cart
  const handleOrderPhysicalTag = () => {
    const matchingProduct = products.find(p => p.category === (formFactor === 'stand' ? 'stands' : formFactor === 'sticker' ? 'stickers' : 'cards')) || products[0];
    addToCart(matchingProduct, {
      color: selectedColor,
      businessName,
      logoUrl: customLogoUrl || selectedEmoji
    });
    setWriteSuccessMsg(`Added custom ${formFactor.toUpperCase()} hardware to your Cart!`);
    playDeliveryChime();
    setTimeout(() => setWriteSuccessMsg(null), 3000);
  };

  // Copy NDEF Payload text
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(getComputedPayloadUrl());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Flipper Zero / NDEF File
  const handleDownloadNdefJson = () => {
    const payload = getComputedPayloadUrl();
    const data = {
      name: businessName,
      formFactor,
      actionType,
      chipCompatibility: 'NTAG213 / NTAG215 / NTAG216',
      ndefRecords: [
        {
          type: actionType === 'url' ? 'URI' : 'Text',
          payload
        }
      ],
      qrBackupUrl: generatedQrDataUrl,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nfc-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-payload.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121220] via-[#0d0d16] to-[#08080c] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>13.56MHz Smart Hardware Studio</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white leading-tight">
              NFC Tag Reader & <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                Hardware Customizer
              </span>
            </h1>

            <p className="text-zinc-300 text-xs md:text-sm font-normal leading-relaxed">
              Read and inspect physical NFC chips, decode NDEF records, and custom-design your own <b>Smart Review Cards</b>, <b>Dine-in Menu Stands</b>, <b>Driver Dispatch Tags</b>, and <b>vCards</b> with instant 1-tap encoding.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('customizer')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'customizer'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>1. Customizer & Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'reader'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>2. Tag Reader & Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'export'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>3. Write & Flash NFC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {writeSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{writeSuccessMsg}</span>
          </div>
          <Link href="/dashboard/cards" className="underline hover:text-white flex items-center gap-1">
            <span>Manage Beacon Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: CUSTOMIZER & VISUAL CARD CANVAS                  */}
      {/* ======================================================== */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 6 Cols: Live Interactive Visualizer Canvas */}
          <div className="lg:col-span-6 space-y-6 sticky top-28">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0b0b10] border border-white/10 space-y-6 text-center">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Hardware Canvas</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 text-[10px] uppercase font-bold">
                  {formFactor.toUpperCase()} • 13.56 MHz
                </span>
              </div>

              {/* CARD PREVIEW CANVAS */}
              <div className="relative mx-auto w-full max-w-md aspect-[1.586/1] rounded-[2rem] p-6 shadow-2xl border flex flex-col justify-between overflow-hidden transition-all duration-500 group select-none"
                   style={{
                     backgroundColor: selectedColor,
                     borderColor: 'rgba(255,255,255,0.18)',
                     boxShadow: `0 25px 60px -15px ${selectedColor}90`
                   }}>
                
                {/* Textures / Overlay */}
                {selectedTexture === 'cyber' && (
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />
                )}
                {selectedTexture === 'carbon' && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#00000030_25%,transparent_25%,transparent_75%,#00000030_75%,#00000030),linear-gradient(45deg,#00000030_25%,transparent_25%,transparent_75%,#00000030_75%,#00000030)] [background-size:10px_10px] pointer-events-none opacity-40" />
                )}
                {selectedTexture === 'holo' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-cyan-500/20 to-amber-500/20 pointer-events-none opacity-80" />
                )}
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Card Row */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {customLogoUrl ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/30 bg-black/40 flex items-center justify-center shrink-0 shadow-lg">
                        <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                        {selectedEmoji}
                      </div>
                    )}
                    <div className="text-left">
                      <h4 className="font-black italic text-white text-base tracking-tight leading-tight line-clamp-1">{businessName}</h4>
                      <p className="text-[9px] font-mono uppercase text-white/60 tracking-wider">
                        {actionType === 'google_review' ? 'Google 5-Star NFC Beacon' : actionType === 'driver_dispatch' ? 'Express Courier NFC' : actionType === 'vcard' ? 'Digital vCard NFC' : 'Smart Contactless Tag'}
                      </p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 my-auto text-left space-y-1">
                  {actionType === 'google_review' && (
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                      <span className="text-[10px] font-mono text-white/80 font-bold ml-1">5.0 RATING</span>
                    </div>
                  )}
                  {actionType === 'driver_dispatch' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase">
                      <Truck className="w-3 h-3" />
                      <span>Instant AWD / 4x4 Dispatch</span>
                    </div>
                  )}
                  {actionType === 'vcard' && (
                    <p className="text-xs font-mono text-zinc-300">
                      👤 {vCardData.name} • {vCardData.title}
                    </p>
                  )}
                  <p className="text-sm font-black italic text-white tracking-wide leading-snug">
                    {headline}
                  </p>
                </div>

                {/* Bottom Card Row */}
                <div className="relative z-10 flex justify-between items-end pt-3 border-t border-white/10 text-left">
                  <div className="space-y-0.5">
                    {actionType === 'google_review' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-blue-400">G</span>
                        <span className="text-[11px] font-bold text-red-400">o</span>
                        <span className="text-[11px] font-bold text-yellow-400">o</span>
                        <span className="text-[11px] font-bold text-blue-400">g</span>
                        <span className="text-[11px] font-bold text-green-400">l</span>
                        <span className="text-[11px] font-bold text-red-400">e</span>
                        <span className="text-[10px] font-bold text-white ml-1">Reviews</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        OASIS<span className="text-amber-400">TAP</span>
                      </span>
                    )}
                    <p className="text-[8px] font-mono text-white/40">STANDARDIZED NFC 13.56MHz • NTAG213</p>
                  </div>

                  {/* Dual-Mode QR Backup Box */}
                  {generatedQrDataUrl ? (
                    <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-lg">
                      <img src={generatedQrDataUrl} alt="QR Backup" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons underneath preview */}
              <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                <button
                  onClick={handleSaveToFleet}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save to Active Fleet</span>
                </button>

                <button
                  onClick={handleOrderPhysicalTag}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Order Physical ($19.99)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Customization Controls Form */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Form Factor Selector */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>1. Select Hardware Form Factor:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'card', label: 'Smart PVC Card', desc: 'CR80 Matte Card', icon: '💳' },
                  { id: 'stand', label: 'Counter Stand', desc: 'Acrylic Table Stand', icon: '🏛️' },
                  { id: 'sticker', label: 'Epoxy Sticker', desc: '30mm Waterproof', icon: '🏷️' },
                  { id: 'wood_puck', label: 'Lakeside Puck', desc: 'Engraved Maple', icon: '🪵' },
                  { id: 'keychain', label: 'Driver Key Fob', desc: 'Heavy Duty Fob', icon: '🛡️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormFactor(item.id as NfcFormFactorType)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formFactor === item.id
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-xs font-bold text-white mt-1">{item.label}</p>
                    <p className="text-[9px] text-zinc-400 font-mono">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Action / Payload Selector */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>2. Choose NFC Tap Trigger Action:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'google_review', label: 'Google Review', icon: '⭐' },
                  { id: 'menu', label: 'Dine-In Menu', icon: '🍔' },
                  { id: 'driver_dispatch', label: 'Driver Dispatch', icon: '🚗' },
                  { id: 'vcard', label: 'Digital vCard', icon: '📱' },
                  { id: 'wifi', label: 'Wi-Fi Connect', icon: '📶' },
                  { id: 'sms', label: 'SMS Ping', icon: '💬' },
                  { id: 'town_node', label: 'Town Node', icon: '🌲' },
                  { id: 'url', label: 'Custom URL', icon: '🌐' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      setActionType(act.id as NfcActionType);
                      if (act.id === 'google_review') setHeadline('Tap phone to review us on Google!');
                      if (act.id === 'menu') setHeadline('Tap to view live menu & order!');
                      if (act.id === 'driver_dispatch') setHeadline('Tap phone to dispatch local courier!');
                      if (act.id === 'vcard') setHeadline('Tap phone to save my contact info!');
                      if (act.id === 'wifi') setHeadline('Tap to join Guest High-Speed Wi-Fi!');
                      if (act.id === 'sms') setHeadline('Tap to send instant SMS message!');
                      if (act.id === 'town_node') setHeadline(`Tap to explore ${selectedTownNode} Community Wire!`);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      actionType === act.id
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base block">{act.icon}</span>
                    <span className="text-[11px] font-semibold block mt-0.5">{act.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payload Form Fields */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                {actionType === 'google_review' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Google Review URL or Place ID
                    </label>
                    <input
                      type="text"
                      value={googleReviewUrl}
                      onChange={e => setGoogleReviewUrl(e.target.value)}
                      placeholder="https://search.google.com/local/writereview?placeid=..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'url' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Destination Website / Linktree URL
                    </label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      placeholder="https://instagram.com/mybusiness"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'vcard' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={vCardData.name}
                      onChange={e => setVCardData({...vCardData, name: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={vCardData.title}
                      onChange={e => setVCardData({...vCardData, title: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={vCardData.phone}
                      onChange={e => setVCardData({...vCardData, phone: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={vCardData.email}
                      onChange={e => setVCardData({...vCardData, email: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'wifi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Wi-Fi SSID Network Name"
                      value={wifiData.ssid}
                      onChange={e => setWifiData({...wifiData, ssid: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Wi-Fi Password"
                      value={wifiData.password}
                      onChange={e => setWifiData({...wifiData, password: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'sms' && (
                  <div className="space-y-2">
                    <input
                      type="tel"
                      placeholder="Recipient Phone Number"
                      value={smsData.phone}
                      onChange={e => setSmsData({...smsData, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <textarea
                      placeholder="Pre-filled Message Content"
                      value={smsData.message}
                      onChange={e => setSmsData({...smsData, message: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 h-16"
                    />
                  </div>
                )}

                {actionType === 'town_node' && (
                  <select
                    value={selectedTownNode}
                    onChange={e => setSelectedTownNode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Effingham">Effingham, NH Node</option>
                    <option value="Ossipee">Center Ossipee, NH Node</option>
                    <option value="Freedom">Freedom, NH Node</option>
                    <option value="Wakefield">Wakefield / Sanbornville, NH Node</option>
                    <option value="Conway">Conway / North Conway, NH Node</option>
                  </select>
                )}
              </div>
            </div>

            {/* 3. Text & Branding Customization */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>3. Physical Artwork & Appearance:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Card Header Title</span>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Smoke World Ossipee"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Instruction Prompt</span>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Tap with phone to review!"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Card Color Theme:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { color: '#0f172a', name: 'Midnight Cyber' },
                    { color: '#064e3b', name: 'Carroll Emerald' },
                    { color: '#78350f', name: 'Gold Oak' },
                    { color: '#312e81', name: 'Indigo Pulse' },
                    { color: '#881337', name: 'Crimson Smoke' },
                    { color: '#000000', name: 'Matte Jet Black' },
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-8 h-8 rounded-xl border transition-all ${
                        selectedColor === c.color ? 'border-amber-400 scale-110 shadow-lg' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Texture Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Texture & Finish:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'cyber', label: 'Cyber Dots' },
                    { id: 'carbon', label: 'Carbon Fiber' },
                    { id: 'holo', label: 'Holographic' },
                    { id: 'matte', label: 'Matte Soft' },
                    { id: 'metal', label: 'Clean Glass' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTexture(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-mono transition-all ${
                        selectedTexture === t.id
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-white/5 text-zinc-400 border border-white/5'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji / Avatar picker */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Logo Emoji Icon:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['💨', '⭐', '🍔', '🥪', '🍕', '🚗', '🛻', '🌲', '🔨', '🪵', '☕', '💈', '🏨', '✨'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setSelectedEmoji(em);
                        setCustomLogoUrl('');
                      }}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                        selectedEmoji === em && !customLogoUrl ? 'bg-amber-400 text-black scale-110' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Logo Upload */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-zinc-400 block mb-1">Or Upload Custom Logo / Photo:</span>
                <ImageUpload
                  value={customLogoUrl}
                  onChange={url => setCustomLogoUrl(url)}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: REAL & SIMULATED NFC TAG READER / INSPECTOR       */}
      {/* ======================================================== */}
      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 6 Cols: Hardware Scanning Deck */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    Physical & Virtual NFC Antenna
                  </span>
                  <h3 className="text-xl font-black italic text-white uppercase">NFC Tag Reader</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                  hasWebNfcSupport ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {hasWebNfcSupport ? '🟢 Web NFC Active' : '🟡 Simulator Ready'}
                </span>
              </div>

              {/* Web NFC Scan Button */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#141420] to-[#0d0d12] border border-amber-500/20 space-y-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-3xl shadow-inner">
                  <Radio className={`w-8 h-8 text-amber-400 ${isWebNfcScanning ? 'animate-ping' : 'animate-pulse'}`} />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {isWebNfcScanning ? 'Listening for NFC Signal...' : 'Physical Web NFC Reader'}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Hold any standard NTAG213, NTAG215, Mifare, or contactless review card to your device antenna.
                  </p>
                </div>

                <button
                  onClick={handleStartWebNfcScan}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isWebNfcScanning ? 'Scanning Active (Hold Near Chip)' : 'Start Physical NFC Scan'}</span>
                </button>

                {scanStatusMessage && (
                  <p className="text-[11px] font-mono text-zinc-300 pt-1">
                    {scanStatusMessage}
                  </p>
                )}
              </div>

              {/* Interactive Virtual NFC Tap Simulator */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Interactive Chip Simulator:
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Click any tag to tap</span>
                </div>

                <div className="space-y-2">
                  {PRESET_SIMULATED_TAGS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateTap(idx)}
                      disabled={isSimulatingTap}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/40 rounded-2xl text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {preset.name}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400">
                            {preset.desc}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                        Tap →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Decoded NFC Tag Telemetry & Memory Map */}
          <div className="lg:col-span-6 space-y-6">
            {scannedTag ? (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                      Decoded Telemetry
                    </span>
                    <h3 className="text-xl font-black italic text-white uppercase">Chip Inspection</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Valid NDEF Tag</span>
                  </span>
                </div>

                {/* Technical Specs Table */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Unique ID (UID):</span>
                    <p className="font-bold text-white">{scannedTag.uid}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">IC Type:</span>
                    <p className="font-bold text-amber-400">{scannedTag.chipType}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Lock Status:</span>
                    <p className={`font-bold flex items-center gap-1 ${scannedTag.isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                      {scannedTag.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{scannedTag.isLocked ? 'Locked (Read Only)' : 'Unlocked (Read/Write)'}</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Protocol:</span>
                    <p className="font-bold text-zinc-200">{scannedTag.technology}</p>
                  </div>
                </div>

                {/* Memory Capacity Gauge */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Memory Usage:</span>
                    <span className="text-white font-bold">{scannedTag.usedBytes} / {scannedTag.capacityBytes} Bytes ({Math.round((scannedTag.usedBytes / scannedTag.capacityBytes) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${(scannedTag.usedBytes / scannedTag.capacityBytes) * 100}%` }}
                    />
                  </div>
                </div>

                {/* NDEF Records List */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Decoded NDEF Records ({scannedTag.records.length}):
                  </span>

                  {scannedTag.records.map((rec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                          {rec.type}
                        </span>
                        {rec.actionUrl && (
                          <a
                            href={rec.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>Test Action</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs font-mono text-white font-bold break-all bg-black/40 p-2.5 rounded-xl border border-white/5">
                        {rec.payload}
                      </p>

                      <p className="text-[11px] text-zinc-400 font-light">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Import to Customizer Button */}
                <button
                  onClick={handleImportScannedTag}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  <span>Import Scanned Payload into Customizer</span>
                </button>
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-[#0c0c12] border border-white/10 text-center space-y-4">
                <Radio className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-zinc-400">No NFC Tag Scanned Yet</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Click "Start Physical NFC Scan" with an Android device, or select any of the simulated presets to test tag decoding.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ENCODING & FLASHING WORKSTATION                  */}
      {/* ======================================================== */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 6 Cols: Encoding Action Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-6">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Universal Encoding Station
                </span>
                <h3 className="text-xl font-black italic text-white uppercase">Flash & Program NFC Chips</h3>
                <p className="text-xs text-zinc-400 font-light mt-1">
                  Target: <b>{businessName}</b> ({actionType.toUpperCase()})
                </p>
              </div>

              {/* Method 1: Web NFC Physical Write */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-[#101814] to-[#0a100d] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 1: Direct 1-Tap Web NFC Write</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Chrome Android / Web NFC Supported Browsers</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  Hold a blank NTAG213 / NTAG215 / NTAG216 card against the back of your phone to permanently write this custom payload.
                </p>

                <button
                  onClick={handleWritePhysicalTag}
                  disabled={isWritingNfc}
                  className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isWritingNfc ? 'Encoding Tag (Hold Phone Near Chip)...' : 'Write to Physical NFC Tag'}</span>
                </button>
              </div>

              {/* Method 2: Save to OasisTap Fleet */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 2: Save to Active Beacon Fleet</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Generates instant live /tap test link</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-light">
                  Save this configuration to your Carroll County review hub with real-time tap telemetry and 5-star filtering.
                </p>

                <button
                  onClick={handleSaveToFleet}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save to Fleet</span>
                </button>
              </div>

              {/* Method 3: JSON / NDEF / Flipper Zero Export */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-400/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 3: Export NDEF Specification File</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Compatible with NFC Tools & Flipper Zero</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadNdefJson}
                  className="w-full py-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download NDEF .JSON Payload</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Dual-Mode QR & Payload Inspector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6 text-center">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Dual-Mode Visual Output
                </span>
                <h3 className="text-xl font-black italic text-white uppercase">Printable QR & Payload</h3>
              </div>

              {/* QR Image */}
              {generatedQrDataUrl && (
                <div className="p-4 rounded-3xl bg-white border border-white/20 inline-block shadow-2xl">
                  <img src={generatedQrDataUrl} alt="Dual Mode QR" className="w-48 h-48 mx-auto object-contain" />
                </div>
              )}

              {/* Raw Payload Box */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Compiled NDEF String:</span>
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-amber-400 break-all flex items-center justify-between gap-3">
                  <span className="truncate">{getComputedPayloadUrl()}</span>
                  <button
                    onClick={handleCopyPayload}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
                    title="Copy Payload String"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Order Physical Tag Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#15151f] to-transparent border border-amber-500/20 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Need Pre-Printed Physical NFC Hardware?</h4>
                    <p className="text-xs text-zinc-400 font-light">
                      Custom laser-printed & pre-encoded with your business branding.
                    </p>
                  </div>
                  <span className="text-lg font-black text-amber-400 font-mono">$19.99</span>
                </div>

                <button
                  onClick={handleOrderPhysicalTag}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Physical {formFactor.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
