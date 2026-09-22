'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Sparkles, 
  Music, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Tag, 
  X, 
  Radio, 
  Gift, 
  ArrowRight,
  ShoppingBag,
  Utensils,
  Waves
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { TownEvent } from '@/lib/types';

export default function EventsPage() {
  const { events, rsvpToEvent, addTownEvent, towns } = useNfcStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);

  // Add Event Form State
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [town, setTown] = useState('Effingham, NH');
  const [venueAddress, setVenueAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TownEvent['category']>('live_music');
  const [categoryLabel, setCategoryLabel] = useState('Live Music');
  const [description, setDescription] = useState('');
  const [priceText, setPriceText] = useState('Free Admission');

  const categories = [
    { label: 'All Happenings', value: 'all', icon: Calendar },
    { label: 'Live Music & Patio', value: 'live_music', icon: Music },
    { label: 'Markets & Fairs', value: 'market_fair', icon: ShoppingBag },
    { label: 'Food & Pub Nights', value: 'food_drink', icon: Utensils },
    { label: 'Lake & Outdoors', value: 'outdoors', icon: Waves },
  ];

  const filteredEvents = events.filter(e => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const handleRsvpClick = (event: TownEvent) => {
    rsvpToEvent(event.id);
    if (!event.isUserRsvpd) {
      setRsvpNotice(`RSVP confirmed for "${event.title}"! +25 Loyalty Points added to your wallet.`);
    } else {
      setRsvpNotice(`RSVP cancelled for "${event.title}".`);
    }
    setTimeout(() => setRsvpNotice(null), 3000);
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venueAddress || !date || !time) return;

    addTownEvent({
      title,
      organizer: organizer || 'Local Host',
      town,
      venueAddress,
      date,
      time,
      category,
      categoryLabel,
      description: description || 'Local community event in Carroll County, NH.',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      nfcPassActive: true,
      pointsReward: 35,
      priceText: priceText || 'Free Entry',
      tags: ['Local Event', town, categoryLabel],
    });

    setShowAddEventModal(false);
    setTitle('');
    setOrganizer('');
    setVenueAddress('');
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black uppercase tracking-widest mb-6">
          <Calendar className="w-4 h-4 text-pink-400 animate-pulse" />
          Carroll County Community & Live Music Radar
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-tight mb-4">
          What&apos;s Happening in <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-pink-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
            Our Lake & Mountain Towns
          </span>
        </h1>

        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          Find live bands, lakeside patio gatherings, weekend farmers markets, and pub trivia. RSVP with your Oasis Pass to earn loyalty reward points.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl shadow-pink-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Community Event (+50 Pts)</span>
          </button>
        </div>
      </div>

      {/* RSVP Notification Toast */}
      {rsvpNotice && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{rsvpNotice}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-white text-black font-black shadow-lg scale-105'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-pink-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#0d0d12] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-pink-500/40 transition-all group"
          >
            <div>
              {/* Cover Image Header */}
              <div className="relative h-56 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/50"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-pink-300 font-bold uppercase">
                    {event.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/90 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Gift className="w-3.5 h-3.5" />
                    +{event.pointsReward} Pts
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white font-mono font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    {event.date} • {event.time}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white/80 font-bold">
                    {event.priceText}
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-6">
                <div className="text-xs text-white/40 font-mono mb-1">
                  Hosted by <strong className="text-white">{event.organizer}</strong>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-pink-300 transition-colors mb-2">
                  {event.title}
                </h3>

                <p className="text-white/60 text-xs leading-relaxed font-light mb-4">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-white/60 font-medium mb-4">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{event.venueAddress} ({event.town})</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / RSVP */}
            <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Users className="w-4 h-4 text-pink-400" />
                <span className="font-bold text-white">{event.attendeesCount} Locals Going</span>
              </div>

              <button
                onClick={() => handleRsvpClick(event)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  event.isUserRsvpd
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {event.isUserRsvpd ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RSVP Confirmed (Going)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>RSVP & Claim +{event.pointsReward} Pts</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setShowAddEventModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">Community Hub</span>
                <h3 className="text-xl font-black text-white">Post an Event</h3>
              </div>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturday Live Acoustic at the Lake"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Organizer / Venue Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pizza Barn"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value as TownEvent['category'];
                      setCategory(val);
                      const matched = categories.find(c => c.value === val);
                      if (matched) setCategoryLabel(matched.label);
                    }}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  >
                    <option value="live_music">Live Music & Patio</option>
                    <option value="market_fair">Markets & Fairs</option>
                    <option value="food_drink">Food & Pub Nights</option>
                    <option value="outdoors">Lake & Outdoors</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturday, Oct 3"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6:00 PM – 9:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Venue Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="89 Main St, Center Ossipee"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Admission / Pricing
                  </label>
                  <input
                    type="text"
                    placeholder="Free Entry"
                    value={priceText}
                    onChange={(e) => setPriceText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell locals what to expect..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-pink-500/20 mt-4"
              >
                Publish Event to Community Calendar ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
