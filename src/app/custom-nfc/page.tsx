'use client';

import NfcTagReaderCustomizer from '@/components/NfcTagReaderCustomizer';
import Link from 'next/link';
import { ArrowLeft, Radio, Sparkles, ShieldCheck } from 'lucide-react';

export default function CustomNfcPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/cards"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to NFC Card Fleet</span>
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NFC 13.56 MHz Standard Type 2 / Type 4 Ready</span>
          </div>
        </div>

        {/* Main NFC Tag Reader & Customizer Studio */}
        <NfcTagReaderCustomizer />
        
      </div>
    </div>
  );
}
