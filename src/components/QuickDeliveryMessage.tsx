'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import {
  Send,
  Truck,
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  Bell,
  Loader2,
} from 'lucide-react';

export function QuickDeliveryMessageForm({ onSuccess }: { onSuccess?: () => void }) {
  const { currentUser, notificationSettings } = useNfcStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [pickupStore, setPickupStore] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please enter your name, phone number, and what you need delivered.');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch('/api/message-sean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          pickupStore: pickupStore.trim(),
          dropoffAddress: dropoffAddress.trim(),
          message: message.trim(),
          ntfyTopic: notificationSettings?.ntfyTopic || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not send message. Please call or text (508) 507-0305.');
      } else {
        setSent(true);
        setPickupStore('');
        setDropoffAddress('');
        setMessage('');
        onSuccess?.();
      }
    } catch {
      setError('Connection error — please call or text Sean at (508) 507-0305.');
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 text-center space-y-3">
        <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-black text-white">Message Sent Straight to Sean&apos;s Phone!</h3>
          <p className="text-xs text-zinc-300">
            Sean just got an instant push notification and will text or call you back shortly.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
          >
            Send Another Message
          </button>
          <a
            href="tel:5085070305"
            className="px-4 py-2 rounded-xl bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call (508) 507-0305</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name *"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-400 outline-none"
        />
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your Phone Number *"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-400 outline-none font-mono"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          value={pickupStore}
          onChange={(e) => setPickupStore(e.target.value)}
          placeholder="Store / Restaurant Pickup (optional)"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-400 outline-none"
        />
        <input
          type="text"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          placeholder="Drop-off Address / Town (optional)"
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-400 outline-none"
        />
      </div>

      <textarea
        required
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What do you need picked up or delivered? (e.g. Hannaford groceries, Home Depot parts, takeout order under John...)"
        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-400 outline-none resize-none"
      />

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isSending}
          className="flex-1 py-3 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending to Sean&apos;s Phone...</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Send Instant Delivery Alert to Sean</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <a
          href="sms:5085070305"
          className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 font-bold text-xs flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>SMS</span>
        </a>
      </div>
    </form>
  );
}

export default function FloatingMessageSeanButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  return (
    <>
      {/* Bottom-Left Floating Quick Delivery Message Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-40 px-4 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs shadow-2xl shadow-emerald-500/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
      >
        <Truck className="w-4 h-4" />
        <span>Message Sean for Delivery</span>
      </button>

      {/* Clean Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-[#0d0d15] border border-emerald-500/35 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Instant Push Alert to Sean&apos;s Phone</span>
                </div>
                <h2 className="text-lg font-black text-white mt-0.5">
                  Message Sean for Delivery
                </h2>
                <p className="text-xs text-zinc-400">
                  No account required — sends an instant notification right to Sean Martin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QuickDeliveryMessageForm />
          </div>
        </div>
      )}
    </>
  );
}
