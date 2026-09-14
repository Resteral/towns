'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { TownNode } from '@/lib/types';
import { MapPin, ChevronDown, Check, Plus, Radio, Compass, X } from 'lucide-react';

export default function TownSelector() {
  const { towns, activeTown, setActiveTown } = useNfcStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (townId: string) => {
    setActiveTown(townId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full transition-all text-xs font-mono text-zinc-200 group"
      >
        <span className="text-sm">{activeTown.icon}</span>
        <span className="font-bold text-white group-hover:text-amber-400 transition-colors">{activeTown.name}</span>
        <span className="text-[10px] text-zinc-500 uppercase">{activeTown.state}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-72 bg-[#0c0c11] border border-white/15 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Active Regional Node
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          {/* List of Towns */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {towns.map((town) => {
              const isSelected = activeTown.id === town.id;
              return (
                <button
                  key={town.id}
                  onClick={() => handleSelect(town.id)}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-amber-400/15 border border-amber-400/30 text-white'
                      : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{town.icon}</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{town.name}, {town.state}</p>
                      <p className="text-[9px] font-mono text-zinc-500">{town.tagline}</p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
            <Link
              href="/towns"
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white uppercase flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-indigo-400" />
              <span>Full Radar</span>
            </Link>

            <Link
              href="/register-town"
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:underline uppercase font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Town</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
