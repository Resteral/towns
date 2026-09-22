'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Townraise Service Worker registered successfully:', registration.scope);
          },
          (err) => {
            console.warn('Townraise Service Worker registration failed:', err);
          }
        );
      });
    }

    // 2. Check if already running in standalone / PWA mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(Boolean(isStandaloneMode));
    if (isStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect Platform (iOS vs Android/Desktop)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIos(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // 4. Capture native beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt banner after 2 seconds if not dismissed previously
      const dismissed = sessionStorage.getItem('townraise_install_banner_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not installed, show banner after brief delay
    if (isIosDevice && !isStandaloneMode) {
      const dismissed = sessionStorage.getItem('townraise_install_banner_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('Townraise was successfully installed to home screen!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native Android / Desktop Chrome install
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Installation error:', err);
      }
    } else if (isIos) {
      // iOS doesn't support programmatic install - show interactive visual modal
      setShowIosModal(true);
    } else {
      // Generic fallback (e.g. desktop safari or other browsers)
      setShowIosModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('townraise_install_banner_dismissed', 'true');
  };

  // If already running as standalone app, don't show the banner
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING BOTTOM INSTALL PROMPT BANNER */}
      {/* ======================================================== */}
      {showBanner && (
        <aside
          aria-label="Install App Prompt"
          className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 max-w-md bg-[#0a0a10]/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-amber-500/20 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center overflow-hidden">
                <img 
                  src="/townraise-logo.png" 
                  alt="Townraise Icon" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to emoji if logo image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xl hidden">👑</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  Install Townraise App
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Home App
                  </span>
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Add Townraise to your phone home screen for 1-tap full-screen access, live courier dispatch, and offline speed.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isIos ? 'Add to Home Screen' : 'Install App (1-Tap)'}
                </button>
                <button
                  type="button"
                  onClick={handleDismissBanner}
                  className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 2. iOS / GENERIC ADD-TO-HOME STEP-BY-STEP MODAL */}
      {/* ======================================================== */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-slate-100 overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <div className="w-full h-full bg-[#09090e] rounded-[14px] flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Add Townraise to Home Screen
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run standalone with native phone app speed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions Steps */}
            <div className="space-y-3 relative z-10">
              
              {/* Step 1 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Tap the Safari Share button</span>
                  <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                    Look for the square icon with an arrow <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> at the bottom or top of your browser.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Select "Add to Home Screen"</span>
                  <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                    Scroll down in the share menu and tap <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> <strong className="text-slate-200">"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Tap "Add" in Top-Right Corner</span>
                  <p className="text-slate-400 mt-0.5">
                    Townraise will now appear on your phone home screen just like an App Store app!
                  </p>
                </div>
              </div>

            </div>

            {/* App Features Perks */}
            <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center relative z-10">
              <div className="p-1">
                <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">Full Screen</p>
                <p className="text-[9px] text-slate-400">No browser address bar</p>
              </div>
              <div className="p-1 border-x border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">Fast Shift HUD</p>
                <p className="text-[9px] text-slate-400">1-tap courier dispatch</p>
              </div>
              <div className="p-1">
                <Globe className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">Offline Ready</p>
                <p className="text-[9px] text-slate-400">Cached local maps</p>
              </div>
            </div>

            {/* Close / Got it */}
            <div className="mt-6 relative z-10">
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Got It, Let's Add It!
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
