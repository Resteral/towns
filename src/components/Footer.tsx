import Link from 'next/link';
import { Radio, ShieldCheck, Zap, Sparkles, Smartphone, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050507] pt-24 pb-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
                <Radio className="w-5 h-5 text-black" />
              </div>
              <span className="font-black italic tracking-tighter text-2xl text-white uppercase">Oasis<span className="text-amber-400">Tap</span></span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              The premier physical-to-digital Google Review acceleration platform. Turn real-world customer interactions into verified 5-star ratings with ultra-responsive NFC cards, tabletop acrylics, and smart review filtering.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO-14443A NFC</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> 0.1s Response</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Smart Funnel</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">Hardware Fleet</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/marketplace?cat=cards" className="hover:text-white transition-colors">Obsidian NFC Smart Cards</Link></li>
              <li><Link href="/marketplace?cat=stands" className="hover:text-white transition-colors">Cyber Glass Tabletop Stands</Link></li>
              <li><Link href="/marketplace?cat=cards" className="hover:text-white transition-colors">Eco-Artisan Bamboo Cards</Link></li>
              <li><Link href="/marketplace?cat=stickers" className="hover:text-white transition-colors">Smart Vinyl 3M Tap Stickers</Link></li>
              <li><Link href="/marketplace?cat=bundles" className="hover:text-white transition-colors">Hospitality Fleet Bundles</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Smart Routing & Care</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/feedback" className="hover:text-white transition-colors text-amber-400">Public Feedback Center</Link></li>
              <li><Link href="/tap/card-oasis-main" className="hover:text-white transition-colors">5-Star Gatekeeper Engine</Link></li>
              <li><Link href="/dashboard/feedback" className="hover:text-white transition-colors">Private Rating Shield</Link></li>
              <li><Link href="/dashboard/analytics" className="hover:text-white transition-colors">Real-Time Tap Radar</Link></li>
              <li><Link href="/dashboard/cards" className="hover:text-white transition-colors">Dynamic Cloud URL Switching</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Merchant Portal</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/eats" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">🍔 Oasis Eats (Food Grid)</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Overview Command Center</Link></li>
              <li><Link href="/dashboard/delivery" className="hover:text-white transition-colors">Delivery Dispatch Radar</Link></li>
              <li><Link href="/dashboard/feedback" className="hover:text-white transition-colors">Shielded Feedback Inbox</Link></li>
              <li><Link href="/dashboard/cards" className="hover:text-white transition-colors">NFC Fleet Manager</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-white transition-colors">Phone Relay Settings</Link></li>
            </ul>
          </div>

          {/* Col 5 - Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">Contact & Support</h4>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <div>
                  <div className="font-black text-white text-xs">Sean Martin</div>
                  <div className="text-[10px] text-amber-400 font-mono">Founding Vanguard Lead</div>
                </div>
              </div>
              <div className="space-y-1 pt-1 font-mono text-[11px]">
                <a 
                  href="tel:5085070305" 
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>508-507-0305</span>
                </a>
                <a 
                  href="mailto:frijj555@gmail.com" 
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors break-all"
                >
                  <span className="text-amber-400 font-bold">@</span>
                  <span>frijj555@gmail.com</span>
                </a>
              </div>
              <div className="pt-1">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center w-full py-1.5 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30 transition-all"
                >
                  Direct Contact Page →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 OasisTap System Labs. Built with Oasis United Core Architecture.</p>
          <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest">
            <span className="text-amber-400/80 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Cloud Nodes Live</span>
            <span>Zero Subscriptions Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
