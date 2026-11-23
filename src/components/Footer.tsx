'use client';

import Link from 'next/link';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050508] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand & Quick Links */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/townraise-logo.png"
                alt="Townraise"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Carroll County&apos;s simple local hub for shopping deals, Home Depot penny finds, 4x4 courier pickups, and free business &amp; contractor NFC reward cards.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Shop &amp; Save
              </div>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/shop" className="text-emerald-400 font-bold hover:text-emerald-300">
                    🛒 Shop Groceries (Live API)
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="text-orange-400 font-bold hover:text-orange-300">
                    🪙 Local &amp; Penny Deals
                  </Link>
                </li>
                <li>
                  <Link href="/courier" className="hover:text-white">
                    4x4 Courier Pickup
                  </Link>
                </li>
                <li>
                  <Link href="/directory" className="hover:text-white">
                    Local Businesses
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white">
                    Leaderboard &amp; XP
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Businesses
              </div>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/custom-nfc" className="text-amber-400 font-bold hover:text-amber-300">
                    💳 Free NFC Card
                  </Link>
                </li>
                <li>
                  <Link href="/create-storefront" className="hover:text-white">
                    Register Storefront
                  </Link>
                </li>
                <li>
                  <Link href="/work" className="hover:text-white">
                    Contractors &amp; Trades
                  </Link>
                </li>
                <li>
                  <Link href="/ai-concierge" className="hover:text-white">
                    AI Helper Bot
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              Call or Text Sean Martin
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="tel:5085070305"
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call (508) 507-0305</span>
              </a>
              <a
                href="sms:5085070305"
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text</span>
              </a>
            </div>
            <a
              href="mailto:frijj555@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-300"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>frijj555@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Townraise • Carroll County, NH</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-zinc-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-zinc-300">
              Contact
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-300">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
