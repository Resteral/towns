'use client';

import { useState, useEffect } from 'react';
import { 
  ReviewProduct, NfcCardConfig, TapLog, PrivateFeedback, 
  CartItem, DeliveryOrder, NotificationSettings, DeliveryItem,
  SellerProfile, ShoutoutPost, TownNode, UserMembership, MembershipTier,
  MerchantStorefront, StorefrontProduct
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_CARDS, INITIAL_TAP_LOGS, 
  INITIAL_FEEDBACKS, INITIAL_SELLERS, INITIAL_SHOUTOUTS, INITIAL_TOWNS 
} from './mock-data';

const STORAGE_KEYS = {
  CARDS: 'pulpulse_cards_v1',
  LOGS: 'pulpulse_logs_v1',
  FEEDBACKS: 'pulpulse_feedbacks_v1',
  CART: 'pulpulse_cart_v1',
  DELIVERY_ORDERS: 'pulpulse_delivery_orders_v1',
  NOTIFICATION_SETTINGS: 'pulpulse_notifications_v1',
  SELLERS: 'pulpulse_sellers_v1',
  SHOUTOUTS: 'pulpulse_shoutouts_v1',
  PRODUCTS: 'pulpulse_products_v1',
  TOWNS: 'pulpulse_towns_v1',
  ACTIVE_TOWN_ID: 'pulpulse_active_town_id_v1',
  MEMBERSHIP: 'pulpulse_membership_v1',
  STOREFRONTS: 'pulpulse_storefronts_v1',
};

const INITIAL_STOREFRONTS: MerchantStorefront[] = [
  {
    id: 'sf-pnb-eats',
    slug: 'pnb-eats',
    businessName: 'PNB Eats Roadside Grill',
    tagline: 'Effingham’s Favorite Breakfasts, Hot Subs & Hand-Tossed Pizzas',
    description: 'Family-operated roadside kitchen serving fresh comfort food made with love on Route 25. Order express delivery straight to your doorstep in Effingham, Freedom, and Ossipee.',
    logoEmoji: '🥪',
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-7440',
    email: 'contact@pnbeats.com',
    address: 'NH-25, Effingham, NH 03882',
    town: 'Effingham',
    state: 'NH',
    accentColor: '#f59e0b',
    deliveryFee: 3.99,
    minOrder: 12.00,
    estimatedPrepTime: '20-30 mins',
    googlePlaceId: 'ChIJ_yXq6zN64okRTG3n6qN8Eff',
    googleRating: 4.8,
    reviewsCount: 184,
    googleReviewUrl: 'https://www.google.com/search?q=PNB+Eats+Effingham+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    products: [
      {
        id: 'pnb-prod-1',
        name: 'The Big Mountain Steak & Cheese Sub',
        description: 'Shaved ribeye steak, melted American & provolone, grilled peppers, onions, and mushrooms on a toasted French sub roll.',
        price: 13.99,
        category: 'Hot Subs',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        calories: '840 cal',
        dietaryTags: ['Hearty', 'Chef Special'],
        optionGroups: [
          {
            id: 'size',
            title: 'Sub Size',
            required: true,
            type: 'single',
            choices: [
              { id: 's-8', name: '8" Regular Sub', priceDelta: 0 },
              { id: 's-12', name: '12" Giant Sub', priceDelta: 3.50 }
            ]
          },
          {
            id: 'cheese',
            title: 'Cheese Selection',
            type: 'single',
            choices: [
              { id: 'c-prov', name: 'Melted Provolone & American (Standard)', priceDelta: 0 },
              { id: 'c-cheddar', name: 'Sharp Cabot Vermont Cheddar', priceDelta: 1.00 },
              { id: 'c-pepperjack', name: 'Spicy Pepper Jack', priceDelta: 0.75 }
            ]
          },
          {
            id: 'extras',
            title: 'Extra Add-ons',
            type: 'multiple',
            choices: [
              { id: 'e-bacon', name: 'Applewood Smoked Bacon Strips', priceDelta: 2.25 },
              { id: 'e-mushrooms', name: 'Extra Sautéed Portobello Mushrooms', priceDelta: 1.25 },
              { id: 'e-jalapenos', name: 'Pickled Hot Cherry Peppers', priceDelta: 0.85 },
              { id: 'e-garlic-aioli', name: 'Side of House Garlic Herb Aioli', priceDelta: 0.75 }
            ]
          }
        ]
      },
      {
        id: 'pnb-prod-2',
        name: 'Effingham Rustic Supreme Pizza',
        description: 'Hand-tossed garlic crust, whole-milk mozzarella, crispy pepperoni, Italian fennel sausage, green bell peppers, and red onions.',
        price: 19.50,
        category: 'Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Local Favorite',
        calories: '280 cal/slice',
        dietaryTags: ['Wood-Fired Style'],
        optionGroups: [
          {
            id: 'pizza-size',
            title: 'Pizza Size',
            required: true,
            type: 'single',
            choices: [
              { id: 'pz-12', name: '12" Medium (6 Slices)', priceDelta: 0 },
              { id: 'pz-16', name: '16" Large (8 Slices)', priceDelta: 4.50 },
              { id: 'pz-gf', name: '12" Cauliflower Gluten-Free Crust', priceDelta: 3.50 }
            ]
          },
          {
            id: 'crust-style',
            title: 'Crust Style',
            type: 'single',
            choices: [
              { id: 'cr-regular', name: 'Classic Golden Crisp', priceDelta: 0 },
              { id: 'cr-garlic-butter', name: 'Garlic Herb Butter Glaze', priceDelta: 1.00 },
              { id: 'cr-well-done', name: 'Extra Crispy Well-Done Bake', priceDelta: 0 }
            ]
          },
          {
            id: 'pizza-toppings',
            title: 'Extra Toppings',
            type: 'multiple',
            choices: [
              { id: 'tp-mozz', name: 'Extra Whole Milk Mozzarella', priceDelta: 2.00 },
              { id: 'tp-hot-honey', name: 'Drizzle of Mike’s Hot Honey', priceDelta: 1.50 },
              { id: 'tp-garlic-dip', name: 'Ranch & Marinara Dipping Cups (2)', priceDelta: 1.25 }
            ]
          }
        ]
      },
      {
        id: 'pnb-prod-3',
        name: 'Crispy Jumbo Chicken Wings (10-Pack)',
        description: 'Never frozen jumbo wings tossed in your choice of house sauces. Served with crisp celery sticks and homemade blue cheese.',
        price: 15.99,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Game Day Special',
        calories: '920 cal',
        optionGroups: [
          {
            id: 'wing-sauce',
            title: 'Wing Flavor',
            required: true,
            type: 'single',
            choices: [
              { id: 'w-buff-med', name: 'Classic Medium Buffalo', priceDelta: 0 },
              { id: 'w-buff-hot', name: 'Firecracker Ghost Pepper Buffalo', priceDelta: 0 },
              { id: 'w-maple-bbq', name: 'Pure NH Maple Smoked BBQ', priceDelta: 0.50 },
              { id: 'w-garlic-parm', name: 'Roasted Garlic Parmesan', priceDelta: 0.50 },
              { id: 'w-dry-rub', name: 'Lemon Pepper Dry Rub', priceDelta: 0 }
            ]
          },
          {
            id: 'wing-dip',
            title: 'Dipping Sauce',
            type: 'single',
            choices: [
              { id: 'd-blue', name: 'Chunky Blue Cheese Dressing', priceDelta: 0 },
              { id: 'd-ranch', name: 'Buttermilk Herb Ranch', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'pnb-prod-4',
        name: 'Maple Glazed Fried Dough Bites',
        description: 'Crispy golden fried dough tossed in cinnamon sugar and served with warm Carroll County pure maple syrup dip.',
        price: 7.99,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Local Legend',
        calories: '490 cal'
      },
    ],
  },
  {
    id: 'sf-pizza-barn',
    slug: 'pizza-barn-smokehouse',
    businessName: 'Pizza Barn & Smokehouse',
    tagline: 'Slow-Smoked Meats, Wood-Fired Pies & Loaded Rustic Sides',
    description: 'Iconic Ossipee landmark smoking pork shoulders for 14 hours over local applewood and serving rustic brick-oven pizzas for delivery.',
    logoEmoji: '🍕',
    coverImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-2244',
    email: 'orders@pizzabarnnh.com',
    address: 'Route 16, Center Ossipee, NH 03814',
    town: 'Ossipee',
    state: 'NH',
    accentColor: '#ef4444',
    deliveryFee: 4.49,
    minOrder: 15.00,
    estimatedPrepTime: '25-35 mins',
    googlePlaceId: 'ChIJX99f7RN74okROb-12345678',
    googleRating: 4.9,
    reviewsCount: 312,
    googleReviewUrl: 'https://www.google.com/search?q=Pizza+Barn+Effingham+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    products: [
      {
        id: 'pb-prod-1',
        name: 'Applewood Smoked Pulled Pork Platter',
        description: '1/2 lb slow-smoked pulled pork, tangy vinegar BBQ mop, homemade coleslaw, and grilled buttered cornbread.',
        price: 16.50,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Pitmaster Choice',
        calories: '980 cal',
        optionGroups: [
          {
            id: 'bbq-side',
            title: 'Choose 2 Sides',
            type: 'multiple',
            choices: [
              { id: 'sd-slaw', name: 'Crunchy Cider Slaw', priceDelta: 0 },
              { id: 'sd-beans', name: 'Smoked Pit Baked Beans', priceDelta: 0 },
              { id: 'sd-fries', name: 'Cajun Seasoned Waffle Fries', priceDelta: 1.00 },
              { id: 'sd-mac', name: '4-Cheese Baked Mac & Cheese', priceDelta: 1.50 }
            ]
          }
        ]
      },
      {
        id: 'pb-prod-2',
        name: 'Sweet Heat Buffalo Chicken Pizza (16")',
        description: 'Crispy fried chicken bites tossed in sweet hot buffalo, mozzarella, gorgonzola crumbles, and ranch swirl.',
        price: 21.00,
        category: 'Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        calories: '310 cal/slice'
      },
      {
        id: 'pb-prod-3',
        name: 'Loaded Pulled Pork Barn Waffle Fries',
        description: 'Crispy seasoned waffle fries piled high with applewood pulled pork, melted cheddar jack, pickled jalapeños, and BBQ drizzle.',
        price: 12.99,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '860 cal'
      }
    ]
  },
  {
    id: 'sf-freedom-village-store',
    slug: 'freedom-village-store',
    businessName: 'Freedom Village Store & Cafe',
    tagline: 'Historic Provisions, Artisan Baked Goods & Local Heritage Crafts',
    description: 'Volunteer-supported historic community store offering fresh morning coffee, homemade scones, local maple syrup, and New Hampshire crafts.',
    logoEmoji: '🏡',
    coverImageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-7988',
    email: 'info@freedomvillagestore.com',
    address: 'Elm Street, Freedom, NH 03836',
    town: 'Freedom',
    state: 'NH',
    accentColor: '#10b981',
    deliveryFee: 3.49,
    minOrder: 10.00,
    estimatedPrepTime: '15-25 mins',
    googlePlaceId: 'ChIJZ49fEzl64okRNM8wL384Fre',
    googleRating: 4.9,
    reviewsCount: 168,
    googleReviewUrl: 'https://www.google.com/search?q=Freedom+Village+Store+Freedom+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    products: [
      {
        id: 'fvs-prod-1',
        name: 'Freedom Blueberry Crumb Scone (2-Pack)',
        description: 'Freshly baked daily with wild Maine blueberries and crystal sugar topping.',
        price: 6.50,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Fresh Daily',
        calories: '320 cal'
      },
      {
        id: 'fvs-prod-2',
        name: 'Pure NH Grade A Amber Maple Syrup (16oz)',
        description: 'Wood-fired maple syrup tapped from local Carroll County sugar maples.',
        price: 16.00,
        category: 'Pantry',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        inStock: true,
      },
      {
        id: 'fvs-prod-3',
        name: 'Village Roastery Hot Coffee Traveler (96oz)',
        description: 'Freshly brewed dark roast coffee in insulated pour tote with 8 cups, organic sugars, and whole milk.',
        price: 24.00,
        category: 'Beverage',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
      }
    ],
  },
  {
    id: 'sf-oasis-roastery',
    slug: 'oasis-roastery-bakehouse',
    businessName: 'Oasis Artisan Roastery & Bakehouse',
    tagline: 'Single-Origin Nitro Cold Brews, Hearth Sourdough & Morning Brioche',
    description: 'Effingham’s flagship specialty cafe featuring hearth-baked sourdough bread, single-origin espressos, and artisan brunch boxes.',
    logoEmoji: '☕',
    coverImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    phone: '(508) 507-0305',
    email: 'frijj555@gmail.com',
    address: 'Historic Route 153, Effingham, NH 03882',
    town: 'Effingham',
    state: 'NH',
    accentColor: '#6366f1',
    deliveryFee: 2.99,
    minOrder: 10.00,
    estimatedPrepTime: '15-20 mins',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleRating: 5.0,
    reviewsCount: 428,
    googleReviewUrl: 'https://www.google.com/search?q=Oasis+Artisan+Roastery+Effingham+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    products: [
      {
        id: 'oas-prod-1',
        name: 'Nitro Cold Brew Growler (64oz Fresh Pour)',
        description: 'Signature cold brew steeped for 24 hours with notes of dark chocolate and toasted hazelnuts.',
        price: 18.00,
        category: 'Coffee',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Customer Pick',
        optionGroups: [
          {
            id: 'coldbrew-flavor',
            title: 'Syrup / Flavor Shot',
            type: 'single',
            choices: [
              { id: 'fl-none', name: 'Black / Pure Brew', priceDelta: 0 },
              { id: 'fl-vanilla', name: 'Madagascar Vanilla Bean', priceDelta: 1.00 },
              { id: 'fl-maple', name: 'Local NH Smoked Maple Syrup', priceDelta: 1.25 }
            ]
          }
        ]
      },
      {
        id: 'oas-prod-2',
        name: 'Artisan Wood-Fired Country Sourdough Loaf',
        description: 'Naturally fermented 36-hour sourdough boule with crisp blistered crust and soft airy crumb.',
        price: 8.50,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Hearth Baked',
      },
      {
        id: 'oas-prod-3',
        name: 'Maple Glazed Brioche Cinnamon Roll (4-Pack)',
        description: 'Warm fluffy brioche rolls swirled with Saigon cinnamon and drenched in pure maple cream cheese frosting.',
        price: 16.00,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
      }
    ]
  }
];

const DEFAULT_MEMBERSHIP: UserMembership = {
  tier: 'vanguard_master',
  tierName: 'Town Vanguard Master',
  active: true,
  memberId: 'MEM-SEAN-001',
  memberName: 'Sean Martin',
  memberEmail: 'frijj555@gmail.com',
  memberTown: 'Effingham, NH',
  joinedDate: new Date().toISOString().split('T')[0],
  renewsAt: '2027-01-01',
  billingCycle: 'annual',
  price: 758,
  perks: [
    'Official Town Node territory rights',
    'Multi-shop batch review scanner & flasher',
    'Printable merchant onboarding kits',
    'Revenue share on local deliveries',
    'Master Vanguard Badge'
  ],
  avatarEmoji: '👑',
  customBadge: 'Founding Vanguard',
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  phoneNumber: '(508) 507-0305',
  enableSms: true,
  enableTelegram: false,
  telegramBotToken: '',
  telegramChatId: '',
  enableDiscord: false,
  discordWebhookUrl: '',
  enableSoundChime: true,
};

const INITIAL_DELIVERY_ORDERS: DeliveryOrder[] = [
  {
    id: 'ord-881',
    orderNumber: '881',
    customerName: 'Marcus Vance',
    customerPhone: '(603) 555-0142',
    customerEmail: 'marcus.v@example.com',
    deliveryAddress: '42 Pine Hill Rd, Effingham, NH 03882',
    deliveryInstructions: 'Leave by the side porch under the awning. Gate code is #4412.',
    items: [
      { id: 'i-1', name: 'Cold Brew Growler (64oz)', quantity: 1, price: 18.00 },
      { id: 'i-2', name: 'Artisan Sourdough Loaf', quantity: 2, price: 8.50 },
      { id: 'i-3', name: 'Obsidian Smart NFC Review Card', quantity: 1, price: 29.99 },
    ],
    subtotal: 64.99,
    deliveryFee: 4.99,
    tip: 10.00,
    total: 79.98,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    estimatedDeliveryTime: '20-30 mins',
    notifiedPhone: true,
    notificationLog: 'Dispatched to Phone & Telegram Bot',
    town: 'Effingham, NH',
  },
  {
    id: 'ord-880',
    orderNumber: '880',
    customerName: 'Sarah Jenkins',
    customerPhone: '(603) 555-0981',
    deliveryAddress: '118 Mountain View Way, Ossipee, NH',
    deliveryInstructions: 'Ring doorbell once please!',
    items: [
      { id: 'i-4', name: 'Cyber Glass Countertop Stand', quantity: 1, price: 49.99 },
      { id: 'i-5', name: 'Maple Glazed Brioche Box (4-Pack)', quantity: 1, price: 16.00 },
    ],
    subtotal: 65.99,
    deliveryFee: 4.99,
    tip: 8.00,
    total: 78.98,
    status: 'delivered',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    deliveredAt: new Date(Date.now() - 55 * 60000).toISOString(),
    notifiedPhone: true,
    notificationLog: 'Dispatched to Phone (603) 555-0199',
    town: 'Ossipee, NH',
  },
];

export function useNfcStore() {
  const [towns, setTowns] = useState<TownNode[]>(INITIAL_TOWNS);
  const [activeTownId, setActiveTownId] = useState<string>('town-effingham');
  const [products, setProducts] = useState<ReviewProduct[]>(INITIAL_PRODUCTS);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLERS);
  const [shoutouts, setShoutouts] = useState<ShoutoutPost[]>(INITIAL_SHOUTOUTS);
  const [cards, setCards] = useState<NfcCardConfig[]>(INITIAL_CARDS);
  const [tapLogs, setTapLogs] = useState<TapLog[]>(INITIAL_TAP_LOGS);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedback[]>(INITIAL_FEEDBACKS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(INITIAL_DELIVERY_ORDERS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [userMembership, setUserMembership] = useState<UserMembership>(DEFAULT_MEMBERSHIP);
  const [storefronts, setStorefronts] = useState<MerchantStorefront[]>(INITIAL_STOREFRONTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTowns = localStorage.getItem(STORAGE_KEYS.TOWNS);
      if (storedTowns) setTowns(JSON.parse(storedTowns));

      const storedTownId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TOWN_ID);
      if (storedTownId) setActiveTownId(storedTownId);

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedSellers = localStorage.getItem(STORAGE_KEYS.SELLERS);
      if (storedSellers) setSellers(JSON.parse(storedSellers));

      const storedShoutouts = localStorage.getItem(STORAGE_KEYS.SHOUTOUTS);
      if (storedShoutouts) setShoutouts(JSON.parse(storedShoutouts));

      const storedCards = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (storedCards) setCards(JSON.parse(storedCards));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (storedLogs) setTapLogs(JSON.parse(storedLogs));

      const storedFeedbacks = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.DELIVERY_ORDERS);
      if (storedOrders) setDeliveryOrders(JSON.parse(storedOrders));

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (storedNotifications) setNotificationSettings(JSON.parse(storedNotifications));

      const storedMembership = localStorage.getItem(STORAGE_KEYS.MEMBERSHIP);
      if (storedMembership) setUserMembership(JSON.parse(storedMembership));

      const storedStorefronts = localStorage.getItem(STORAGE_KEYS.STOREFRONTS);
      if (storedStorefronts) setStorefronts(JSON.parse(storedStorefronts));
    } catch (e) {
      console.error('Failed to load from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const activeTown = towns.find(t => t.id === activeTownId) || towns[0] || INITIAL_TOWNS[0];

  const setActiveTown = (townId: string) => {
    setActiveTownId(townId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TOWN_ID, townId);
  };

  const registerTown = (townData: Omit<TownNode, 'id' | 'status' | 'boutiquesCount' | 'routesCount' | 'occupancyLattice' | 'joinedDate'>) => {
    const townSlug = townData.name.toLowerCase().replace(/\s+/g, '-');
    const newTown: TownNode = {
      ...townData,
      id: `town-${townSlug}-${Date.now().toString(36)}`,
      status: 'launching',
      boutiquesCount: 1,
      routesCount: 2,
      occupancyLattice: 25,
      joinedDate: new Date().toISOString().split('T')[0],
      accentColor: townData.accentColor || '#f59e0b',
    };

    const updatedTowns = [newTown, ...towns];
    setTowns(updatedTowns);
    setActiveTown(newTown.id);
    localStorage.setItem(STORAGE_KEYS.TOWNS, JSON.stringify(updatedTowns));

    addShoutout({
      authorName: newTown.vanguardLead || `${newTown.name} Node Vanguard`,
      authorHandle: `@${townSlug}_vanguard`,
      authorAvatar: newTown.icon || '🏡',
      authorBadge: 'Town Node Launched',
      content: `🚀 New Town Node Initialized: ${newTown.fullName}! Local discovery lattice and express phone delivery dispatch are now live for ${newTown.name}.`,
      tag: 'news',
      town: newTown.fullName,
    });

    return newTown;
  };

  // Audio Chime Player
  const playDeliveryChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15);
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.30);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  // Feedback Center Handlers
  const updateFeedbackStatus = (feedbackId: string, status: PrivateFeedback['status'], replyNote?: string) => {
    const updated = feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          status,
          replyNote: replyNote !== undefined ? replyNote : fb.replyNote,
          resolvedAt: status === 'resolved' ? new Date().toISOString() : fb.resolvedAt,
        };
      }
      return fb;
    });
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  };

  const resolveFeedbackWithCoupon = (feedbackId: string, couponCode: string = 'OASIS15') => {
    const updated = feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          status: 'resolved' as const,
          resolutionAction: `Dispatched Win-Back ${couponCode} (15% Off) to customer contact`,
          resolvedAt: new Date().toISOString(),
        };
      }
      return fb;
    });
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  };

  const submitGeneralFeedback = (data: Omit<PrivateFeedback, 'id' | 'timestamp' | 'status'>) => {
    const newFeedback: PrivateFeedback = {
      ...data,
      id: `fb-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      status: 'new',
      town: data.town || activeTown.fullName,
    };
    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
    return newFeedback;
  };

  // Social Shoutouts Handlers
  const addShoutout = (post: Omit<ShoutoutPost, 'id' | 'timestamp' | 'reactions' | 'userReactions'>) => {
    const newShoutout: ShoutoutPost = {
      ...post,
      id: `shout-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      reactions: { voltage: 1, fire: 1, heart: 1 },
      userReactions: { voltage: true },
      town: post.town || activeTown.fullName,
    };
    const updated = [newShoutout, ...shoutouts];
    setShoutouts(updated);
    localStorage.setItem(STORAGE_KEYS.SHOUTOUTS, JSON.stringify(updated));
    return newShoutout;
  };

  const reactToShoutout = (shoutoutId: string, reactionType: 'voltage' | 'fire' | 'heart') => {
    const updated = shoutouts.map(shout => {
      if (shout.id === shoutoutId) {
        const isReacted = shout.userReactions?.[reactionType];
        const newCount = (shout.reactions[reactionType] || 0) + (isReacted ? -1 : 1);
        return {
          ...shout,
          reactions: {
            ...shout.reactions,
            [reactionType]: Math.max(0, newCount),
          },
          userReactions: {
            ...shout.userReactions,
            [reactionType]: !isReacted,
          },
        };
      }
      return shout;
    });
    setShoutouts(updated);
    localStorage.setItem(STORAGE_KEYS.SHOUTOUTS, JSON.stringify(updated));
  };

  // Community Product Listing Handlers
  const addCommunityProduct = (productData: Omit<ReviewProduct, 'id' | 'rating' | 'reviewsCount' | 'inStock'>) => {
    const newProduct: ReviewProduct = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      town: productData.town || activeTown.fullName,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    addShoutout({
      authorName: productData.sellerName || 'Community Artisan',
      authorHandle: `@${(productData.sellerName || 'artisan').toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: '✨',
      authorBadge: 'Fresh Drop',
      content: `🎉 New Arrival dropped on Marketplace: "${productData.name}" for $${productData.price.toFixed(2)} in ${newProduct.town}! Available for express local delivery.`,
      tag: 'drop',
      town: newProduct.town,
    });

    return newProduct;
  };

  const addSeller = (sellerData: Omit<SellerProfile, 'id' | 'rating' | 'reviewsCount' | 'totalProductsCount' | 'totalDeliveriesCompleted' | 'joinedDate'>) => {
    const newSeller: SellerProfile = {
      ...sellerData,
      id: `seller-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewsCount: 1,
      totalProductsCount: 1,
      totalDeliveriesCompleted: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      town: sellerData.town || activeTown.fullName,
    };
    const updated = [newSeller, ...sellers];
    setSellers(updated);
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(updated));
    return newSeller;
  };

  // Card Handlers
  const saveCards = (newCards: NfcCardConfig[]) => {
    setCards(newCards);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(newCards));
  };

  const addCard = (card: Omit<NfcCardConfig, 'id' | 'totalTaps' | 'googleConversions' | 'privateFeedbacksCount' | 'createdAt'>) => {
    const newCard: NfcCardConfig = {
      ...card,
      id: `card-${Date.now().toString(36)}`,
      totalTaps: 0,
      googleConversions: 0,
      privateFeedbacksCount: 0,
      createdAt: new Date().toISOString(),
      town: card.town || activeTown.fullName,
    };
    const updated = [newCard, ...cards];
    saveCards(updated);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<NfcCardConfig>) => {
    const updated = cards.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCards(updated);
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    saveCards(updated);
  };

  // Tap & Feedback Handlers
  const recordTap = (cardId: string, action: TapLog['action'], ratingSelected?: number) => {
    const card = cards.find(c => c.id === cardId);
    const newLog: TapLog = {
      id: `tap-${Date.now().toString(36)}`,
      cardId,
      businessName: card?.businessName || 'Demo Business',
      timestamp: new Date().toISOString(),
      device: typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'iOS' : 'Android',
      action,
      ratingSelected,
      location: card?.town || activeTown.fullName || 'Local Customer Beacon'
    };

    const updatedLogs = [newLog, ...tapLogs];
    setTapLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    if (card) {
      const updatedCard: NfcCardConfig = {
        ...card,
        totalTaps: (card.totalTaps || 0) + 1,
        googleConversions: action === 'google_redirect' || action === 'direct_redirect' ? (card.googleConversions || 0) + 1 : card.googleConversions,
        privateFeedbacksCount: action === 'private_feedback' ? (card.privateFeedbacksCount || 0) + 1 : card.privateFeedbacksCount,
      };
      updateCard(cardId, updatedCard);
    }
  };

  const submitFeedback = (cardId: string, rating: number, feedbackText: string, customerInfo?: { name?: string; phone?: string; email?: string }) => {
    const card = cards.find(c => c.id === cardId);
    const newFeedback: PrivateFeedback = {
      id: `fb-${Date.now().toString(36)}`,
      cardId,
      businessName: card?.businessName || 'Demo Business',
      timestamp: new Date().toISOString(),
      rating,
      category: 'experience',
      customerName: customerInfo?.name,
      customerPhone: customerInfo?.phone,
      customerEmail: customerInfo?.email,
      feedbackText,
      status: 'new',
      town: card?.town || activeTown.fullName,
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
    recordTap(cardId, 'private_feedback', rating);
  };

  // Cart Handlers
  const addToCart = (product: ReviewProduct, options?: { color?: string; businessName?: string; logoUrl?: string }) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === options?.color && item.customBusinessName === options?.businessName);
      let nextCart;
      if (existing) {
        nextCart = prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        nextCart = [...prev, {
          product,
          quantity: 1,
          selectedColor: options?.color || product.colorOptions?.[0],
          customBusinessName: options?.businessName,
          customLogoUrl: options?.logoUrl
        }];
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
      return nextCart;
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      let nextCart;
      if (quantity <= 0) {
        nextCart = prev.filter((_, i) => i !== index);
      } else {
        nextCart = prev.map((item, i) => i === index ? { ...item, quantity } : item);
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  // Delivery & Notification Handlers
  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...notificationSettings, ...newSettings };
    setNotificationSettings(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(updated));
  };

  const placeDeliveryOrder = async (orderData: Omit<DeliveryOrder, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'notifiedPhone' | 'notificationLog'>) => {
    const orderNumber = Math.floor(100 + Math.random() * 900).toString();
    const newOrder: DeliveryOrder = {
      ...orderData,
      id: `ord-${orderNumber}`,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-35 mins',
      notifiedPhone: true,
      notificationLog: 'Relayed to merchant phone & dispatch network',
      town: orderData.town || activeTown.fullName,
    };

    const updated = [newOrder, ...deliveryOrders];
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));

    if (notificationSettings.enableSoundChime) {
      playDeliveryChime();
    }

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder, settings: notificationSettings }),
      });
    } catch (e) {
      console.error('Failed to notify backend', e);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    const updated = deliveryOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt,
        };
      }
      return order;
    });
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));
  };

  const subscribeMembership = (
    tier: MembershipTier,
    billingCycle: 'monthly' | 'annual',
    memberName: string,
    memberTown: string,
    memberEmail?: string
  ): UserMembership => {
    const priceMap: Record<MembershipTier, { monthly: number; annual: number; name: string; perks: string[]; badge: string; emoji: string }> = {
      free: {
        monthly: 0,
        annual: 0,
        name: 'Guest Citizen',
        perks: ['Browse public marketplace', 'View community shoutouts'],
        badge: 'Guest',
        emoji: '🌱',
      },
      citizen: {
        monthly: 9,
        annual: 86,
        name: 'Town Citizen Pass',
        perks: ['10% Off all marketplace orders', 'Verified Citizen badge on community wire', 'Exclusive town drops access', 'Support local couriers'],
        badge: 'Verified Citizen',
        emoji: '🌟',
      },
      merchant_pro: {
        monthly: 29,
        annual: 278,
        name: 'Merchant Pro Beacon',
        perks: ['Unlimited NFC card beacon fleet', 'Direct Phone & Telegram delivery notification relay', 'Negative review shield protection', 'Printable high-res QR stands', 'Priority courier dispatch'],
        badge: 'Pro Merchant',
        emoji: '⚡',
      },
      vanguard_master: {
        monthly: 79,
        annual: 758,
        name: 'Town Vanguard Master',
        perks: ['Official Town Node territory rights', 'Multi-shop batch review scanner & flasher', 'Printable merchant onboarding kits', 'Revenue share on local deliveries', 'Master Vanguard Badge'],
        badge: 'Vanguard Master',
        emoji: '👑',
      },
    };

    const details = priceMap[tier];
    const renewDate = new Date();
    if (billingCycle === 'monthly') {
      renewDate.setMonth(renewDate.getMonth() + 1);
    } else {
      renewDate.setFullYear(renewDate.getFullYear() + 1);
    }

    const newMembership: UserMembership = {
      tier,
      tierName: details.name,
      active: true,
      memberId: `OASIS-${tier.toUpperCase().substring(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      memberName: memberName.trim() || 'Town Member',
      memberEmail: memberEmail?.trim(),
      memberTown: memberTown || activeTown.fullName,
      joinedDate: new Date().toISOString().split('T')[0],
      renewsAt: renewDate.toISOString().split('T')[0],
      billingCycle,
      price: billingCycle === 'monthly' ? details.monthly : details.annual,
      perks: details.perks,
      avatarEmoji: details.emoji,
      customBadge: details.badge,
    };

    setUserMembership(newMembership);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(newMembership));

    addShoutout({
      authorName: newMembership.memberName,
      authorHandle: `@${newMembership.memberName.toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: newMembership.avatarEmoji || '🌟',
      authorBadge: newMembership.customBadge,
      content: `🎉 Just subscribed to the ${newMembership.tierName} for ${newMembership.memberTown}! Excited to support our local decentralized node network.`,
      tag: 'news',
      town: newMembership.memberTown,
    });

    return newMembership;
  };

  const cancelMembership = () => {
    const cancelled: UserMembership = {
      ...userMembership,
      active: false,
      tier: 'free',
      tierName: 'Guest Citizen',
    };
    setUserMembership(cancelled);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(cancelled));
  };

  // Storefront & Business Website Methods
  const createStorefront = (data: Omit<MerchantStorefront, 'id' | 'createdAt'>): MerchantStorefront => {
    const newStorefront: MerchantStorefront = {
      ...data,
      id: `sf-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedStorefronts = [newStorefront, ...storefronts];
    setStorefronts(updatedStorefronts);
    localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(updatedStorefronts));

    // If listing on marketplace, auto-sync products and seller profile
    if (newStorefront.listOnMarketplace) {
      // 1. Add Seller Profile
      const newSeller: SellerProfile = {
        id: `seller-${newStorefront.slug}`,
        name: newStorefront.businessName,
        handle: `@${newStorefront.slug.replace(/-/g, '_')}`,
        role: newStorefront.tagline,
        bio: newStorefront.description,
        town: `${newStorefront.town}, ${newStorefront.state}`,
        rating: newStorefront.googleRating || 5.0,
        reviewsCount: newStorefront.reviewsCount || 1,
        avatar: newStorefront.logoEmoji || '🏪',
        badge: 'Verified Merchant',
        phone: newStorefront.phone,
        email: newStorefront.email,
        isVerified: true,
        totalProductsCount: newStorefront.products.length,
        totalDeliveriesCompleted: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setSellers(prev => [newSeller, ...prev]);

      // 2. Add products
      const newReviewProducts: ReviewProduct[] = newStorefront.products.map(p => ({
        id: `prod-${p.id}`,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        subtitle: p.description.substring(0, 50),
        description: p.description,
        price: p.price,
        rating: 5.0,
        reviewsCount: 1,
        category: 'food',
        features: ['Fresh Prep', 'Local Delivery Eligible', '100% Quality Guaranteed'],
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        inStock: p.inStock,
        sellerId: newSeller.id,
        sellerName: newStorefront.businessName,
        sellerPhone: newStorefront.phone,
        town: `${newStorefront.town}, ${newStorefront.state}`,
        badge: p.badge,
      }));
      setProducts(prev => [...newReviewProducts, ...prev]);

      // 3. Post social wire shoutout
      addShoutout({
        authorName: newStorefront.businessName,
        authorHandle: `@${newStorefront.slug.replace(/-/g, '_')}`,
        authorAvatar: newStorefront.logoEmoji || '🏪',
        authorBadge: 'New Storefront Live',
        content: `🎉 ${newStorefront.businessName} just launched their standalone delivery website & marketplace storefront in ${newStorefront.town}! Order delivery directly to your phone.`,
        tag: 'drop',
        town: `${newStorefront.town}, ${newStorefront.state}`,
      });
    }

    return newStorefront;
  };

  const updateStorefront = (id: string, updates: Partial<MerchantStorefront>) => {
    const updated = storefronts.map(sf => {
      if (sf.id === id) {
        return { ...sf, ...updates };
      }
      return sf;
    });
    setStorefronts(updated);
    localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(updated));
  };

  return {
    towns,
    activeTown,
    activeTownId,
    setActiveTown,
    registerTown,
    products,
    sellers,
    shoutouts,
    cards,
    tapLogs,
    feedbacks,
    cart,
    deliveryOrders,
    notificationSettings,
    userMembership,
    storefronts,
    isLoaded,
    addShoutout,
    reactToShoutout,
    addCommunityProduct,
    addSeller,
    addCard,
    updateCard,
    deleteCard,
    recordTap,
    submitFeedback,
    updateFeedbackStatus,
    resolveFeedbackWithCoupon,
    submitGeneralFeedback,
    addToCart,
    updateCartQuantity,
    clearCart,
    updateNotificationSettings,
    placeDeliveryOrder,
    updateOrderStatus,
    playDeliveryChime,
    subscribeMembership,
    cancelMembership,
    createStorefront,
    updateStorefront,
  };
}
