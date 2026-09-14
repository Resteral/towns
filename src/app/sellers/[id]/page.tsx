'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  ShieldCheck, Star, MapPin, Truck, Phone, 
  ShoppingBag, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params?.id as string;
  const { sellers, products, addToCart } = useNfcStore();

  const seller = sellers.find(s => s.id === sellerId) || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === seller?.id || p.sellerName === seller?.name);

  if (!seller) {
    return (
      <div className="min-h-screen pt-32 pb-32 text-center text-white">
        <p className="text-sm font-mono text-zinc-400">Seller not found.</p>
        <Link href="/sellers" className="mt-4 inline-block text-amber-400 text-xs uppercase font-bold underline">
          Browse All Sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Back link */}
        <Link
          href="/sellers"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sellers</span>
        </Link>

        {/* Hero Profile Card */}
        <div className="bg-[#0b0b10] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative overflow-hidden shadow-2xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-5xl shadow-xl">
                {seller.avatar}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-4xl font-black italic tracking-tight text-white uppercase">
                    {seller.name}
                  </h1>
                  {seller.isVerified && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm font-mono text-amber-400">{seller.role} • {seller.handle}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {seller.town} • Member since {seller.joinedDate}
                </p>
              </div>
            </div>

            {/* Quick stats box */}
            <div className="flex gap-4 font-mono text-center">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[9px] uppercase text-zinc-400">Rating</p>
                <p className="text-2xl font-black italic text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> {seller.rating}
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[9px] uppercase text-zinc-400">Deliveries</p>
                <p className="text-2xl font-black italic text-white">{seller.totalDeliveriesCompleted}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
            {seller.bio}
          </p>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
            <a
              href={`tel:${seller.phone}`}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Contact Seller ({seller.phone})</span>
            </a>

            <Link
              href="/order"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Order Courier Delivery</span>
            </Link>
          </div>
        </div>

        {/* Seller's Products Catalog */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Independent Catalog</span>
              <h2 className="text-2xl font-black italic text-white uppercase">Items from this Seller</h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{sellerProducts.length} Items Listed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellerProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-black font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black italic text-white text-lg">{product.name}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{product.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-2xl font-black italic text-amber-400">{formatCurrency(product.price)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
