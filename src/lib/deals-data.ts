export type DealCategory =
  | 'home_depot_penny'
  | 'grocery'
  | 'hardware'
  | 'clearance'
  | 'local_shop';

export type PennyStage = 'penny_01' | 'drop_03' | 'clearance_06' | 'local_deal';

export interface LocalShoppingDeal {
  id: string;
  title: string;
  storeName: string;
  storeAddress?: string;
  town: string;
  category: DealCategory;
  pennyStage: PennyStage;
  sku?: string;
  department?: string;
  aisleOrBay?: string;
  originalPrice: number;
  dealPrice: number;
  savingsBadge: string;
  description: string;
  proTip?: string;
  verifiedCount: number;
  soldOutCount: number;
  postedBy: string;
  postedAt: string;
  externalUrl?: string;
}

export const DEALS_STORAGE_KEY = 'townraise_local_deals_v1';

export const INITIAL_LOCAL_DEALS: LocalShoppingDeal[] = [
  // =========================================================================
  // HOME DEPOT PENNY DEALS ($0.01) & CLEARANCE WATCH (.03 / .06)
  // =========================================================================
  {
    id: 'hd-penny-1',
    title: 'Husky 14-in-1 Painter\'s Multi-Tool (Clearance SKU)',
    storeName: 'The Home Depot — North Conway',
    storeAddress: '1450 White Mountain Hwy, North Conway, NH',
    town: 'Conway',
    category: 'home_depot_penny',
    pennyStage: 'penny_01',
    sku: '1006482914',
    department: 'Paint & Tools',
    aisleOrBay: 'Paint Aisle Endcap / Top Overhead Bay',
    originalPrice: 12.97,
    dealPrice: 0.01,
    savingsBadge: '$0.01 PENNY DEAL',
    description:
      'Old packaging SKU has officially pennied out in the Home Depot system. Look behind newer stock on the hooks or in the overhead carton boxes.',
    proTip: 'Scan with the Home Depot app (if it shows "Not Sold in Store" or blank price, check self-checkout).',
    verifiedCount: 19,
    soldOutCount: 2,
    postedBy: 'Sean Martin',
    postedAt: 'Today',
    externalUrl: 'https://www.homedepot.com/s/1006482914',
  },
  {
    id: 'hd-penny-2',
    title: 'Commercial Electric 4-Pack LED Recessed Downlight 6 in.',
    storeName: 'The Home Depot — North Conway',
    storeAddress: '1450 White Mountain Hwy, North Conway, NH',
    town: 'Conway',
    category: 'home_depot_penny',
    pennyStage: 'penny_01',
    sku: '1005194382',
    department: 'Lighting & Electrical',
    aisleOrBay: 'Electrical Aisle 9 — Top Stock Pallet',
    originalPrice: 39.97,
    dealPrice: 0.01,
    savingsBadge: '$0.01 PENNY DEAL',
    description:
      'Previous-gen 3000K 4-pack boxes marked down through .06 and .03 last month and now ringing up for 1 cent at self-checkout.',
    proTip: 'Check the white/orange clearance boxes in the overhead bays above the recessed lighting aisle.',
    verifiedCount: 27,
    soldOutCount: 3,
    postedBy: 'Carroll County Hunter',
    postedAt: 'Today',
    externalUrl: 'https://www.homedepot.com/s/1005194382',
  },
  {
    id: 'hd-penny-3',
    title: 'HDX 27-Gallon Heavy-Duty Storage Tote (Seasonal Lid Color)',
    storeName: 'The Home Depot — Rochester / North Conway',
    storeAddress: 'North Conway & Rochester NH Stores',
    town: 'Conway',
    category: 'home_depot_penny',
    pennyStage: 'penny_01',
    sku: '1007318204',
    department: 'Storage & Organization',
    aisleOrBay: 'Seasonal Clearance / Garden Center Overhead',
    originalPrice: 11.98,
    dealPrice: 0.01,
    savingsBadge: '$0.01 PENNY DEAL',
    description:
      'Limited seasonal lid color SKU pennied out after seasonal reset. Regular black/yellow totes are full price — match the exact SKU on the barcode.',
    proTip: 'Match the last 4 digits (8204) on the sticker before heading to self-checkout.',
    verifiedCount: 14,
    soldOutCount: 4,
    postedBy: 'Lakes Region Deals',
    postedAt: 'Yesterday',
    externalUrl: 'https://www.homedepot.com/s/1007318204',
  },
  {
    id: 'hd-penny-4',
    title: 'Milwaukee SHOCKWAVE Impact Driver Bit Set (40-Piece Promo)',
    storeName: 'The Home Depot — North Conway',
    storeAddress: '1450 White Mountain Hwy, North Conway, NH',
    town: 'Conway',
    category: 'home_depot_penny',
    pennyStage: 'drop_03',
    sku: '1008941276',
    department: 'Power Tool Accessories',
    aisleOrBay: 'Hardware Clearance Endcap (Yellow Tag)',
    originalPrice: 29.97,
    dealPrice: 7.03,
    savingsBadge: '.03 WATCH (PENNY SOON)',
    description:
      'Currently at the final .03 clearance markdown (~76% off). Great deal right now, and any leftover units will drop to $0.01 in ~2–3 weeks.',
    proTip: 'Ending in .03 means final markdown before penny-out. Grab now at $7.03 or watch closely!',
    verifiedCount: 22,
    soldOutCount: 1,
    postedBy: 'Sean Martin',
    postedAt: 'Today',
    externalUrl: 'https://www.homedepot.com/s/1008941276',
  },
  {
    id: 'hd-penny-5',
    title: 'Defiant Motion-Activated Outdoor LED Floodlight (Bronze)',
    storeName: 'The Home Depot — Tilton / North Conway',
    storeAddress: 'North Conway & Tilton NH Stores',
    town: 'Conway',
    category: 'home_depot_penny',
    pennyStage: 'clearance_06',
    sku: '1004829105',
    department: 'Outdoor Lighting',
    aisleOrBay: 'Lighting Clearance Bay',
    originalPrice: 49.97,
    dealPrice: 24.06,
    savingsBadge: '.06 CLEARANCE (52% OFF)',
    description:
      'Yellow-tag clearance ending in .06 (6 weeks from .03 drop). Solid 50%+ discount already for homeowners & contractors.',
    proTip: 'Prices ending in .06 drop to .03 in ~6 weeks, then $0.01 three weeks after that.',
    verifiedCount: 11,
    soldOutCount: 0,
    postedBy: 'North Country Builder',
    postedAt: '2 days ago',
    externalUrl: 'https://www.homedepot.com/s/1004829105',
  },

  // =========================================================================
  // LOCAL AREA SHOPPING DEALS (CARROLL COUNTY & LAKES REGION)
  // =========================================================================
  {
    id: 'local-deal-1',
    title: 'Hannaford Weekly Meat & Produce Bundles (Up to 40% Off)',
    storeName: 'Hannaford Supermarket — Ossipee & North Conway',
    storeAddress: 'Route 16, West Ossipee, NH',
    town: 'Ossipee',
    category: 'grocery',
    pennyStage: 'local_deal',
    department: 'Groceries & Butcher',
    originalPrice: 35.0,
    dealPrice: 19.99,
    savingsBadge: '43% OFF WEEKLY FLYER',
    description:
      'Family-pack chicken breasts, ground beef manager specials, and local apples on weekly flyer sale. Check the morning yellow-sticker meat markdowns before 10 AM.',
    proTip: 'Need groceries picked up? Call or Text Sean at (508) 507-0305 for same-day Ossipee/Effingham delivery.',
    verifiedCount: 31,
    soldOutCount: 0,
    postedBy: 'Sean Martin',
    postedAt: 'Today',
  },
  {
    id: 'local-deal-2',
    title: 'Tractor Supply Seasonal Wood Pellets & Workwear Clearance',
    storeName: 'Tractor Supply Co. — Ossipee',
    storeAddress: 'Route 16, Ossipee, NH',
    town: 'Ossipee',
    category: 'hardware',
    pennyStage: 'local_deal',
    department: 'Farm, Workwear & Heating',
    originalPrice: 44.99,
    dealPrice: 17.99,
    savingsBadge: '60% OFF CLEARANCE',
    description:
      'Red-tag clearance on insulated work gloves, Ridgecut jackets, and seasonal lawn & garden tools along the back clearance aisle.',
    proTip: 'Ask about open-bag pet food & feed discounts at the front counter.',
    verifiedCount: 16,
    soldOutCount: 0,
    postedBy: 'Effingham Local',
    postedAt: 'Today',
  },
  {
    id: 'local-deal-3',
    title: 'Walmart North Conway Clearance Aisle — Household & Tools',
    storeName: 'Walmart Supercenter — North Conway',
    storeAddress: '46 North-South Rd, North Conway, NH',
    town: 'Conway',
    category: 'clearance',
    pennyStage: 'local_deal',
    department: 'Clearance Aisle (Garden & Auto)',
    originalPrice: 28.0,
    dealPrice: 7.0,
    savingsBadge: '75% OFF YELLOW TAG',
    description:
      'Hidden clearance rollbacks on automotive fluids, camping gear, and small kitchen appliances in the clearance aisle near Garden Center.',
    proTip: 'Use the Walmart app barcode scanner in-store — many items ring up cheaper than the shelf sticker.',
    verifiedCount: 24,
    soldOutCount: 1,
    postedBy: 'Conway Bargain Hunter',
    postedAt: 'Yesterday',
  },
  {
    id: 'local-deal-4',
    title: 'Settlers Green Outlets — Extra 20–50% Off Clearance Racks',
    storeName: 'Settlers Green Outlet Village',
    storeAddress: '2 Common Ct, North Conway, NH',
    town: 'Conway',
    category: 'local_shop',
    pennyStage: 'local_deal',
    department: 'Apparel, Shoes & Gear',
    originalPrice: 80.0,
    dealPrice: 32.0,
    savingsBadge: 'TAX-FREE NH OUTLETS',
    description:
      'Tax-free New Hampshire outlet clearance racks at Columbia, L.L.Bean Outlet, Nike, and Carter\'s — stackable with free Customer Service coupon book.',
    proTip: 'Stop by the Settlers Green Customer Service desk for the free local VIP coupon sheet.',
    verifiedCount: 18,
    soldOutCount: 0,
    postedBy: 'Valley Shopper',
    postedAt: 'Today',
  },
  {
    id: 'local-deal-5',
    title: 'Aubuchon & Local Hardware — Contractor Bulk Fasteners & Winter Prep',
    storeName: 'Local Hardware — Wolfeboro / Wakefield / Ossipee',
    storeAddress: 'Wolfeboro & Wakefield Area',
    town: 'Wolfeboro',
    category: 'hardware',
    pennyStage: 'local_deal',
    department: 'Hardware & Home Improvement',
    originalPrice: 24.99,
    dealPrice: 14.99,
    savingsBadge: '40% OFF LOCAL DEAL',
    description:
      'Great local savings on weatherstripping, ice melt bags, and contractor fastener boxes without driving all the way to the big box stores.',
    proTip: 'Need supplies dropped right to your jobsite? Dispatch Sean Martin 4x4 Courier.',
    verifiedCount: 9,
    soldOutCount: 0,
    postedBy: 'Wolfeboro Trades',
    postedAt: '2 days ago',
  },
];

export function loadLocalDeals(): LocalShoppingDeal[] {
  if (typeof window === 'undefined') return INITIAL_LOCAL_DEALS;
  try {
    const raw = localStorage.getItem(DEALS_STORAGE_KEY);
    if (!raw) return INITIAL_LOCAL_DEALS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LOCAL_DEALS;
  } catch {
    return INITIAL_LOCAL_DEALS;
  }
}

export function saveLocalDeals(deals: LocalShoppingDeal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(deals));
  } catch {
    // ignore storage quota errors
  }
}
