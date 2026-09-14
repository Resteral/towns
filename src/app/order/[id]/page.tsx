'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Truck, CheckCircle2, Clock, MapPin, Phone, 
  Navigation, ArrowLeft, Radio, ShieldCheck, Sparkles, 
  Store, User, MessageCircle, AlertCircle, RefreshCw, Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { deliveryOrders, updateOrderStatus } = useNfcStore();

  const order = deliveryOrders.find(o => o.id === orderId) || deliveryOrders[0];

  // Simulated GPS route progress percentage (0 to 100)
  const [gpsProgress, setGpsProgress] = useState(35);
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (!order) return;
    if (order.status === 'pending') {
      setGpsProgress(15);
      setEtaMinutes(25);
    } else if (order.status === 'accepted') {
      setGpsProgress(45);
      setEtaMinutes(18);
    } else if (order.status === 'out_for_delivery') {
      setGpsProgress(75);
      setEtaMinutes(8);
    } else if (order.status === 'delivered') {
      setGpsProgress(100);
      setEtaMinutes(0);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-32 text-center text-white px-6">
        <p className="text-sm font-mono text-zinc-400">Order not found.</p>
        <Link href="/eats" className="mt-4 inline-block text-amber-400 text-xs uppercase font-bold underline">
          Browse Oasis Eats Menu
        </Link>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Order Dispatched', desc: 'Relayed to Sean Martin & kitchen dispatch', icon: Radio },
    { id: 'accepted', label: 'Kitchen Prepping', desc: 'Fresh food being cooked & packaged', icon: Store },
    { id: 'out_for_delivery', label: 'Courier En Route', desc: 'Driver is on the road with your meal', icon: Truck },
    { id: 'delivered', label: 'Delivered', desc: 'Arrived at your doorstep. Enjoy!', icon: Sparkles },
  ];

  const currentStepIdx = steps.findIndex(s => s.id === order.status);
  const activeIdx = currentStepIdx === -1 ? 0 : currentStepIdx;

  const handleSimulateStatus = (nextStatus: 'pending' | 'accepted' | 'out_for_delivery' | 'delivered') => {
    updateOrderStatus(order.id, nextStatus);
    if (nextStatus === 'delivered') {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-32 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
        
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/eats"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Oasis Eats</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Live GPS Connected</span>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#0b0b10] border border-white/10 rounded-[3rem] p-6 md:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          
          {/* Header Banner with ETA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[9px] font-mono font-bold uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>DoorDash / UberEats Live Dispatch Radar</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase text-white">
                Delivery Order #{order.orderNumber}
              </h1>
              <p className="text-xs text-zinc-400">
                Placed on {formatDate(order.createdAt)} • Destination: {order.town || 'Effingham, NH'}
              </p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-right">
              <p className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Estimated Arrival</p>
              <p className="text-3xl font-black italic text-white">
                {order.status === 'delivered' ? 'Delivered 🎉' : `${etaMinutes} mins`}
              </p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, idx) => {
                const isComplete = idx <= activeIdx;
                return (
                  <div key={step.id} className="space-y-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      isComplete ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/30' : 'bg-zinc-800'
                    }`} />
                    <p className={`text-[9px] font-mono font-bold uppercase hidden sm:block ${
                      isComplete ? 'text-amber-400' : 'text-zinc-600'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Current Active Step Banner */}
            <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black italic text-white uppercase">{steps[activeIdx]?.label}</p>
                  <p className="text-xs text-zinc-400">{steps[activeIdx]?.desc}</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-Time Update</span>
              </div>
            </div>
          </div>

          {/* Simulated Interactive Live GPS Map Canvas (DoorDash/UberEats Style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] text-amber-400">
                <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Live Courier GPS Track</span>
              </span>
              <span>Speed: 28 mph • On Route 25</span>
            </div>

            <div className="relative h-64 w-full bg-[#0a0f18] border border-white/10 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
              {/* Map grid pattern styling */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Simulated road polyline */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 60 180 Q 200 40 400 130 T 700 80"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 180 Q 200 40 400 130 T 700 80"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Waypoint 1: Restaurant Pin */}
              <div className="absolute left-10 bottom-12 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg border border-indigo-400">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-black uppercase bg-black/80 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/30">
                  Kitchen / Grill
                </span>
              </div>

              {/* Waypoint 2: Moving Courier Vehicle */}
              <div 
                className="absolute transition-all duration-700 flex flex-col items-center gap-1 z-20"
                style={{
                  left: `${Math.min(85, Math.max(15, gpsProgress))}%`,
                  top: `${Math.sin(gpsProgress / 15) * 30 + 90}px`,
                }}
              >
                <div className="relative">
                  <span className="absolute -inset-2 bg-amber-400/40 rounded-full animate-ping pointer-events-none" />
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 border border-amber-300">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-[9px] font-mono font-black uppercase bg-black/90 px-2 py-0.5 rounded text-amber-300 border border-amber-400/40 whitespace-nowrap shadow-lg">
                  Sean Martin (Courier)
                </span>
              </div>

              {/* Waypoint 3: Customer House Pin */}
              <div className="absolute right-10 top-12 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg border border-emerald-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono font-black uppercase bg-black/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                  Your Doorstep
                </span>
              </div>
            </div>
          </div>

          {/* Assigned Courier Card (DoorDash style) */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20 shrink-0">
                  <div className="w-full h-full bg-[#0b0b12] rounded-[14px] flex items-center justify-center text-2xl">
                    👑
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-base">Sean Martin</h3>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                      Founding Courier Lead
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Silver Subaru Outback (All-Wheel Drive) • 5.0 ★ (340+ Deliveries)
                  </p>
                </div>
              </div>

              {/* Direct Call & SMS Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href="tel:5085070305"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
                <a
                  href="sms:5085070305"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Text</span>
                </a>
              </div>
            </div>
          </div>

          {/* Delivery Destination & Dropoff Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase text-zinc-500">Dropoff Address</span>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white leading-snug">{order.deliveryAddress}</p>
                  {order.deliveryInstructions && (
                    <p className="text-[11px] text-amber-400/90 pt-1 italic">
                      Special Note: "{order.deliveryInstructions}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase text-zinc-500">Recipient Contact</span>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{order.customerName}</p>
                  <p className="text-xs font-mono text-zinc-400">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Food Receipt */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <span className="text-[9px] font-mono uppercase text-zinc-500">Customized Items In Order</span>
            <div className="space-y-2 font-mono text-xs">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between items-start text-zinc-300 pb-1 border-b border-white/[0.02]">
                  <div>
                    <span className="font-bold text-white">{it.quantity}x {it.name}</span>
                    {it.notes && <p className="text-[10px] text-zinc-500 italic pl-4">{it.notes}</p>}
                  </div>
                  <span>{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between text-zinc-400">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Express Courier Fee:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Courier Driver Tip:</span>
                <span>{formatCurrency(order.tip)}</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-base font-sans font-black italic text-white">
                <span>Total Amount:</span>
                <span className="text-amber-400 text-xl">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls (For testing all DoorDash stages) */}
          <div className="p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="uppercase font-bold text-amber-400">⚡ Test Radar Simulation Controls</span>
              <span>Click to test live status progression:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSimulateStatus('pending')}
                className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  order.status === 'pending'
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                1. Dispatched
              </button>
              <button
                onClick={() => handleSimulateStatus('accepted')}
                className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  order.status === 'accepted'
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                2. Prepping
              </button>
              <button
                onClick={() => handleSimulateStatus('out_for_delivery')}
                className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  order.status === 'out_for_delivery'
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                3. On the Road
              </button>
              <button
                onClick={() => handleSimulateStatus('delivered')}
                className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  order.status === 'delivered'
                    ? 'bg-emerald-500 text-black border-emerald-500'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                4. Delivered 🎉
              </button>
            </div>
          </div>

          {/* Notification Proof Badge */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>NOTIFICATION DISPATCH: PHONE RELAY DISPATCHED TO (508) 507-0305</span>
            <span className="text-emerald-400 font-bold">● RELAY ACTIVE</span>
          </div>

        </div>
      </div>
    </div>
  );
}
