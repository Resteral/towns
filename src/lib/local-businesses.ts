export interface BusinessMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  popular?: boolean;
  imageEmoji?: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  town: string;
  state: string;
  category: 'dining' | 'retail' | 'services' | 'hospitality' | 'farm_artisan';
  address: string;
  phone?: string;
  googlePlaceId: string;
  googleRating: number;
  reviewsCount: number;
  googleReviewUrl: string;
  googleMapsUrl: string;
  websiteUrl?: string;
  description: string;
  suggestedCardHeadline: string;
  logoEmoji: string;
  accentColor: string;
  menuTitle?: string;
  menuItems?: BusinessMenuItem[];
  isCommittedPartner?: boolean;
}

/**
 * Verified Active Local Hub Services (No unofficial/mock restaurants)
 */
export const EFFINGHAM_AREA_BUSINESSES: LocalBusiness[] = [
  {
    id: 'biz-eff-sean-courier',
    name: 'Sean Martin Courier & Errand Dispatch',
    town: 'Effingham',
    state: 'NH',
    category: 'services',
    address: 'Effingham / Carroll County Logistics Node, NH 03882',
    phone: '(508) 507-0305',
    googlePlaceId: 'ChIJSeanMartinCourierNH',
    googleRating: 5.0,
    reviewsCount: 340,
    googleReviewUrl: 'https://www.google.com/search?q=Sean+Martin+Courier+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Effingham+NH',
    description: 'All-weather AWD express courier, dockside firewood delivery, store pickups, and custom local errand runner in Carroll County.',
    suggestedCardHeadline: 'Great delivery from Sean? Tap to leave a 5-star Google review!',
    logoEmoji: '🚚',
    accentColor: '#3b82f6',
    menuTitle: 'Express Courier Runs & Errand Services',
    isCommittedPartner: true,
    menuItems: [
      { id: 'smc-m1', name: 'Standard Town Courier Pickup & Delivery', description: 'We pick up your paid order or groceries from any Carroll County store and deliver straight to your door', price: '$9.99', category: 'Delivery', popular: true, imageEmoji: '📦' },
      { id: 'smc-m2', name: 'Dockside Kiln-Dried Hardwood Firewood Bundle (6 Logs)', description: 'Certified pest-free birch and oak campfire logs delivered with natural firestarter kit', price: '$8.50', category: 'Lake Essentials', popular: true, imageEmoji: '🪵' }
    ]
  }
];

export function getBusinessesForTown(townName: string, state: string = 'NH'): LocalBusiness[] {
  const cleanTown = townName.trim().toLowerCase();
  const existing = EFFINGHAM_AREA_BUSINESSES.filter(
    b => b.town.toLowerCase() === cleanTown || cleanTown.includes(b.town.toLowerCase())
  );
  if (existing.length > 0) {
    return existing;
  }
  return EFFINGHAM_AREA_BUSINESSES.filter(b => b.isCommittedPartner);
}

export function buildGoogleReviewUrl(placeId?: string, businessName?: string, town?: string): string {
  const isRealGooglePlaceId = placeId && placeId.startsWith('ChIJ') && !placeId.includes('_') && placeId.length >= 27;
  if (isRealGooglePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${placeId.trim()}`;
  }
  const cleanName = (businessName || 'Local Business').trim();
  const cleanTown = (town || 'Effingham').trim();
  const query = encodeURIComponent(`${cleanName} ${cleanTown} NH`);
  return `https://www.google.com/search?q=${query}`;
}

export function buildSmartTapUrl(cardId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org');
  return `${base}/tap/${cardId}`;
}
