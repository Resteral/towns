'use client';

import { useState, useEffect } from 'react';
import { 
  ReviewProduct, NfcCardConfig, TapLog, PrivateFeedback, 
  CartItem, DeliveryOrder, NotificationSettings, DeliveryItem,
  SellerProfile, ShoutoutPost, TownNode, UserMembership, MembershipTier,
  MerchantStorefront, StorefrontProduct, DriverTelemetry, ProofOfDelivery, DriverShiftSummary,
  BeforeAfterShowcase, WorkRequest, ContractorQuote,
  NfcMenuProduct, NfcHardwareOrder, NfcFormFactor,
  ManagedServicePackage, ClientServiceSubscription, ServiceAutomationBot, ServiceCategory,
  DirectoryListing, DirectoryCategory, AffiliateAmbassador, TownLoyaltyReward, UserLoyaltyWallet
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_CARDS, INITIAL_TAP_LOGS, 
  INITIAL_FEEDBACKS, INITIAL_SELLERS, INITIAL_SHOUTOUTS, INITIAL_TOWNS,
  INITIAL_BEFORE_AFTER_SHOWCASES, INITIAL_WORK_REQUESTS,
  INITIAL_NFC_MENU_PRODUCTS, INITIAL_NFC_HARDWARE_ORDERS,
  INITIAL_MANAGED_SERVICES, INITIAL_CLIENT_SUBSCRIPTIONS, INITIAL_AUTOMATION_BOTS,
  INITIAL_DIRECTORY_LISTINGS, INITIAL_AFFILIATES, INITIAL_LOYALTY_REWARDS, DEFAULT_USER_LOYALTY_WALLET
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
  DRIVER_TELEMETRY: 'pulpulse_driver_telemetry_v1',
  DRIVER_SHIFT: 'pulpulse_driver_shift_v1',
  BEFORE_AFTER_SHOWCASES: 'pulpulse_showcases_v1',
  WORK_REQUESTS: 'pulpulse_work_requests_v1',
  NFC_MENU_PRODUCTS: 'pulpulse_nfc_menu_products_v1',
  NFC_HARDWARE_ORDERS: 'pulpulse_nfc_hardware_orders_v1',
  MANAGED_SERVICES: 'pulpulse_managed_services_v1',
  CLIENT_SUBSCRIPTIONS: 'pulpulse_client_subscriptions_v1',
  AUTOMATION_BOTS: 'pulpulse_automation_bots_v1',
  DIRECTORY_LISTINGS: 'pulpulse_directory_listings_v1',
  AFFILIATES: 'pulpulse_affiliates_v1',
  LOYALTY_REWARDS: 'pulpulse_loyalty_rewards_v1',
  LOYALTY_WALLET: 'pulpulse_loyalty_wallet_v1',
};

const DEFAULT_DRIVER_SHIFT: DriverShiftSummary = {
  isOnline: true,
  shiftStartTime: new Date().toISOString(),
  shiftDeliveriesCount: 4,
  shiftEarningsTotal: 96.50,
  shiftTipsTotal: 38.00,
  shiftMileageEstimate: 21.2,
  totalBalance: 312.40,
};

const DEFAULT_DRIVER_TELEMETRY: DriverTelemetry = {
  driverId: 'driver-sean-martin',
  driverName: 'Sean Martin',
  driverPhone: '508-507-0305',
  avatar: '👑',
  vehicle: 'Silver Subaru Outback (AWD Vanguard Unit)',
  rating: 5.0,
  totalDeliveries: 342,
  status: 'available',
  latitude: 43.7258,
  longitude: -71.1215,
  heading: 42,
  speedMph: 28,
  altitudeFeet: 680,
  batteryPercent: 94,
  isBroadcastingGps: true,
  lastPingTimestamp: new Date().toISOString(),
  currentRoad: 'Route 25 / White Mountain Hwy',
  deviceTrackingActive: false,
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
            id: 'sub-size',
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
        id: 'pnb-prod-cbr',
        name: 'Crispy Chicken Bacon Ranch Sub',
        description: 'Golden fried chicken cutlet, crispy smoked bacon, shredded lettuce, ripe tomatoes, and house buttermilk herb ranch on toasted sub roll.',
        price: 12.99,
        category: 'Hot Subs',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Staff Favorite',
        calories: '780 cal',
        optionGroups: [
          {
            id: 'cbr-size',
            title: 'Sub Size',
            required: true,
            type: 'single',
            choices: [
              { id: 'cbr-8', name: '8" Regular Sub', priceDelta: 0 },
              { id: 'cbr-12', name: '12" Giant Sub', priceDelta: 3.50 }
            ]
          },
          {
            id: 'cbr-sauce',
            title: 'Dressing Style',
            type: 'single',
            choices: [
              { id: 'cbr-ranch', name: 'Buttermilk Herb Ranch', priceDelta: 0 },
              { id: 'cbr-chipotle', name: 'Spicy Chipotle Ranch Swirl', priceDelta: 0.50 },
              { id: 'cbr-honey-mustard', name: 'Sweet Honey Dijon Mustard', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'pnb-prod-pastrami',
        name: 'New Hampshire Hot Pastrami & Swiss Sub',
        description: 'Extra lean hot pastrami piled high with melted Swiss cheese, spicy deli brown mustard, and grilled pickles on a toasted buttered sub roll.',
        price: 13.50,
        category: 'Hot Subs',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '810 cal',
        optionGroups: [
          {
            id: 'past-size',
            title: 'Sub Size',
            required: true,
            type: 'single',
            choices: [
              { id: 'past-8', name: '8" Regular Sub', priceDelta: 0 },
              { id: 'past-12', name: '12" Giant Sub', priceDelta: 3.50 }
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
        id: 'pnb-prod-meat-pizza',
        name: 'Mountain Carnivore All-Meat Pizza (16")',
        description: 'Loaded with crispy pepperoni, sweet Italian fennel sausage, applewood smoked bacon, shaved steak, and extra whole milk mozzarella.',
        price: 21.99,
        category: 'Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Meat Lover Special',
        calories: '340 cal/slice'
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
        id: 'pnb-prod-cheese-fries',
        name: 'Roadside Loaded Bacon Cheese Fries',
        description: 'Golden seasoned french fries smothered in melted cheddar jack cheese, real applewood bacon bits, scallions, and cool sour cream.',
        price: 9.99,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '720 cal'
      },
      {
        id: 'pnb-prod-skillet',
        name: 'Country Sunrise Big Breakfast Skillet',
        description: '3 fresh NH farm eggs, 3 thick-cut bacon strips, 2 country maple sausages, crispy home fries, melted cheddar cheese, and buttered toast.',
        price: 12.50,
        category: 'Breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Morning Star',
        calories: '890 cal',
        optionGroups: [
          {
            id: 'egg-prep',
            title: 'Egg Style',
            required: true,
            type: 'single',
            choices: [
              { id: 'egg-scrambled', name: 'Fluffy Scrambled Eggs', priceDelta: 0 },
              { id: 'egg-over-easy', name: 'Over Easy', priceDelta: 0 },
              { id: 'egg-sunny', name: 'Sunny Side Up', priceDelta: 0 }
            ]
          },
          {
            id: 'toast-choice',
            title: 'Toast Selection',
            type: 'single',
            choices: [
              { id: 't-sourdough', name: 'Artisan Sourdough Toast', priceDelta: 0 },
              { id: 't-white', name: 'Country White Toast', priceDelta: 0 },
              { id: 't-wheat', name: 'Whole Wheat Toast', priceDelta: 0 },
              { id: 't-croissant', name: 'Toasted Butter Croissant', priceDelta: 1.50 }
            ]
          }
        ]
      },
      {
        id: 'pnb-prod-pancakes',
        name: 'Maine Wild Blueberry Buttermilk Pancakes',
        description: '3 fluffy scratch buttermilk pancakes loaded with wild Maine blueberries, served with sweet whipped butter and pure Carroll County maple syrup.',
        price: 10.50,
        category: 'Breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '680 cal'
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
      }
    ]
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
        id: 'pb-prod-ribs',
        name: 'St. Louis Applewood Ribs Platter (Half Rack)',
        description: 'Hardwood smoked ribs glazed with signature molasses BBQ sauce. Served with hand-cut waffle fries, pit beans, and sweet cornbread.',
        price: 22.99,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Pitmaster Favorite',
        calories: '1080 cal'
      },
      {
        id: 'pb-prod-brisket',
        name: 'Texas Prime Smoked Beef Brisket Dinner',
        description: 'Dry-rubbed prime beef brisket smoked for 16 hours, sliced thick with smoked pit beans and 4-cheese baked mac & cheese.',
        price: 24.99,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Customer Pick',
        calories: '1120 cal'
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
        id: 'pb-prod-barnyard-pizza',
        name: 'Barnyard Carnivore BBQ Pizza (16")',
        description: 'Applewood smoked pulled pork, crispy bacon, caramelized red onions, whole mozzarella, and smoky sweet BBQ drizzle.',
        price: 23.50,
        category: 'Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Smokehouse Special',
        calories: '330 cal/slice'
      },
      {
        id: 'pb-prod-margherita',
        name: 'Classic Margherita Brick-Oven Pizza (16")',
        description: 'Fresh mozzarella slices, San Marzano tomato puree, fresh garden basil leaves, and extra virgin olive oil drizzle.',
        price: 18.99,
        category: 'Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '240 cal/slice'
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
      },
      {
        id: 'pb-prod-smores',
        name: 'Skillet S’mores Warm Chocolate Chip Cookie',
        description: 'Freshly baked cast-iron chocolate chip cookie topped with melted campfire marshmallows, graham cracker dust, and vanilla bean ice cream.',
        price: 8.50,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '540 cal'
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
        id: 'fvs-prod-sandwich',
        name: 'Freedom Country Egg & Cheese Breakfast Sandwich',
        description: 'Two farm-fresh fried eggs, melted Grafton Vermont cheddar cheese, and choice of meat on a warm toasted English muffin or butter croissant.',
        price: 7.99,
        category: 'Breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Morning Classic',
        calories: '460 cal',
        optionGroups: [
          {
            id: 'fvs-bread',
            title: 'Bread Selection',
            required: true,
            type: 'single',
            choices: [
              { id: 'b-muffin', name: 'Toasted English Muffin', priceDelta: 0 },
              { id: 'b-croissant', name: 'Flaky Butter Croissant', priceDelta: 1.00 },
              { id: 'b-sourdough', name: 'Artisan Sourdough Slice', priceDelta: 0.50 }
            ]
          },
          {
            id: 'fvs-meat',
            title: 'Breakfast Meat',
            type: 'single',
            choices: [
              { id: 'm-bacon', name: 'Thick-Cut Smoked Bacon', priceDelta: 0 },
              { id: 'm-sausage', name: 'Local Maple Sausage Patty', priceDelta: 0 },
              { id: 'm-ham', name: 'Shaved Country Ham', priceDelta: 0 },
              { id: 'm-none', name: 'Vegetarian (No Meat)', priceDelta: -1.00 }
            ]
          }
        ]
      },
      {
        id: 'fvs-prod-panini',
        name: 'Artisan Turkey & Cranberry Relish Panini',
        description: 'Thinly sliced roasted turkey breast, tangy New England cranberry orange relish, and sharp cheddar cheese pressed hot on sourdough bread.',
        price: 12.99,
        category: 'Lunch & Sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '610 cal'
      },
      {
        id: 'fvs-prod-chicken-salad',
        name: 'Historic Village Chicken Salad Croissant',
        description: 'Tender roasted chicken breast tossed with diced crisp apples, toasted walnuts, and fresh romaine lettuce on a giant flaky croissant.',
        price: 11.99,
        category: 'Lunch & Sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '580 cal'
      },
      {
        id: 'fvs-prod-2',
        name: 'Pure NH Grade A Amber Maple Syrup (16oz Glass Jug)',
        description: 'Wood-fired pure maple syrup tapped from local Carroll County sugar maples.',
        price: 16.00,
        category: 'Pantry',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Local Maple'
      },
      {
        id: 'fvs-prod-3',
        name: 'Village Roastery Hot Coffee Traveler (96oz Pour Box)',
        description: 'Freshly brewed dark roast coffee in insulated pour tote with 8 cups, organic sugars, and whole milk.',
        price: 24.00,
        category: 'Beverages',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'fvs-prod-pound-cake',
        name: 'Homemade Lemon Glazed Pound Cake Slice',
        description: 'Rich, moist butter pound cake topped with freshly squeezed Meyer lemon glaze.',
        price: 4.99,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '340 cal'
      }
    ]
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
        category: 'Coffee & Drinks',
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
              { id: 'fl-maple', name: 'Local NH Smoked Maple Syrup', priceDelta: 1.25 },
              { id: 'fl-caramel', name: 'Salted Butter Caramel', priceDelta: 1.00 }
            ]
          }
        ]
      },
      {
        id: 'oas-prod-macchiato',
        name: 'White Mountain Iced Caramel Macchiato',
        description: 'Double shot of signature espresso over cold milk, vanilla syrup, and heavy caramel drizzle.',
        price: 5.75,
        category: 'Coffee & Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '220 cal',
        optionGroups: [
          {
            id: 'macc-milk',
            title: 'Milk Selection',
            type: 'single',
            choices: [
              { id: 'm-whole', name: 'Farm Whole Milk', priceDelta: 0 },
              { id: 'm-oat', name: 'Creamy Oat Milk', priceDelta: 0.75 },
              { id: 'm-almond', name: 'Almond Milk', priceDelta: 0.75 }
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
        badge: 'Hearth Baked'
      },
      {
        id: 'oas-prod-avotoast',
        name: 'Avocado & Soft-Poached Egg Sourdough Toast',
        description: 'Toasted artisan sourdough slice topped with crushed Haas avocado, farm-poached egg, heirloom cherry tomatoes, microgreens, and everything seasoning.',
        price: 12.50,
        category: 'Brunch & Eats',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '440 cal'
      },
      {
        id: 'oas-prod-3',
        name: 'Maple Glazed Brioche Cinnamon Roll (4-Pack)',
        description: 'Warm fluffy brioche rolls swirled with Saigon cinnamon and drenched in pure maple cream cheese frosting.',
        price: 16.00,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'oas-prod-brunch-box',
        name: 'Effingham Morning Artisan Brunch Box',
        description: 'Includes 2 flaky French butter croissants, 2 maple cinnamon rolls, organic berry Greek yogurt parfait with granola, and fresh seasonal orchard fruit.',
        price: 28.00,
        category: 'Brunch & Eats',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Brunch Special'
      }
    ]
  },
  {
    id: 'sf-smoke-world',
    slug: 'smoke-world-ossipee',
    businessName: 'Smoke World Ossipee',
    tagline: 'Premier Glassware, Vapes, Vaporizers & Accessories in Carroll County',
    description: 'Ossipee’s premier smoke and vape destination located directly on Route 16. Featuring handblown borosilicate glassware, electric vaporizers, disposables, torches, and botanical wellness.',
    logoEmoji: '💨',
    coverImageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-7665',
    email: 'contact@smokeworldossipee.com',
    address: '870 Route 16, Ossipee, NH 03814',
    town: 'Ossipee',
    state: 'NH',
    accentColor: '#10b981',
    deliveryFee: 4.99,
    minOrder: 15.00,
    estimatedPrepTime: '15-25 mins',
    googlePlaceId: 'ChIJb6eBq9f94okRGb_SmokeWorldOss',
    googleRating: 4.9,
    reviewsCount: 148,
    googleReviewUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    products: [
      {
        id: 'sw-prod-1',
        name: 'Geek Bar Pulse 15,000 Puffs Disposable',
        description: 'Dual mesh coil, full smart LED screen displaying battery & juice levels, pulse boost mode, 5% nicotine salt.',
        price: 19.99,
        category: 'Disposables & Vapes',
        imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        optionGroups: [
          {
            id: 'gb-flavor',
            title: 'Choose Flavor',
            required: true,
            type: 'single',
            choices: [
              { id: 'f-fc', name: 'Frozen Cherry Apple', priceDelta: 0 },
              { id: 'f-wm', name: 'Watermelon Ice', priceDelta: 0 },
              { id: 'f-mr', name: 'Mexican Mango', priceDelta: 0 },
              { id: 'f-br', name: 'Blue Razz Ice', priceDelta: 0 },
              { id: 'f-bm', name: 'Blow Pop', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'sw-prod-2',
        name: 'Handblown Hecht Borosilicate Beaker Bong (14")',
        description: 'Heavy duty 7mm thick crystal clear borosilicate glass with ice catcher pinch, 14mm diffused downstem, and flower bowl.',
        price: 69.99,
        category: 'Glassware',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Staff Pick'
      },
      {
        id: 'sw-prod-3',
        name: 'Lookah Seahorse Pro Plus Electric Vaporizer',
        description: 'Portable electric nectar collector with porous quartz tip, USB-C fast charging, and see-through glass mouthpiece.',
        price: 49.99,
        category: 'Vaporizers',
        imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'High Tech'
      },
      {
        id: 'sw-prod-4',
        name: 'Raw Classic Natural Unrefined Cones (6-Pack King Size)',
        description: 'Authentic pure unrefined hemp paper cones with pre-rolled filter tips for easy packing.',
        price: 4.25,
        category: 'Rolling Essentials',
        imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'sw-prod-5',
        name: 'Special Blue Turbo Torch & Neon Refined Butane Canister',
        description: 'Heavy-duty ergonomic piezo-ignition torch lighter with 300ml 11x ultra-refined butane fuel.',
        price: 18.50,
        category: 'Torches & Lighters',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'sw-prod-cbd',
        name: 'Organic Hemp Extract CBD Recovery Gummies (750mg / 30ct)',
        description: 'Premium broad-spectrum organic hemp gummies infused with natural elderberry and calming botanical terpenes.',
        price: 34.99,
        category: 'Botanical Wellness',
        imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80',
        inStock: true
      }
    ]
  },
  {
    id: 'sf-yankee-smokehouse',
    slug: 'yankee-smokehouse-bbq',
    businessName: 'Yankee Smokehouse BBQ',
    tagline: 'Authentic Hardwood-Smoked Ribs, Pulled Pork & Texas Brisket',
    description: 'Legendary West Ossipee roadside smokehouse smoking meats low and slow over native New Hampshire applewood and hickory.',
    logoEmoji: '🍖',
    coverImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-2144',
    email: 'bbq@yankeesmokehouse.com',
    address: 'Jct Rte 16 & 25, West Ossipee, NH 03890',
    town: 'Ossipee',
    state: 'NH',
    accentColor: '#f97316',
    deliveryFee: 4.49,
    minOrder: 15.00,
    estimatedPrepTime: '20-30 mins',
    googlePlaceId: 'ChIJ2d1bEzl64okRDN2wL384Oss',
    googleRating: 4.7,
    reviewsCount: 1420,
    googleReviewUrl: 'https://www.google.com/search?q=Yankee+Smokehouse+West+Ossipee+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    products: [
      {
        id: 'ys-prod-triple',
        name: 'Yankee Triple Threat BBQ Sampler Platter',
        description: 'Generous combination of 1/2 rack St. Louis ribs, slow-smoked pulled pork, and sliced Texas prime beef brisket. Served with 3 scratch pit sides and grilled honey cornbread.',
        price: 32.99,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Pitmaster Feeder',
        calories: '1450 cal'
      },
      {
        id: 'ys-prod-1',
        name: 'St. Louis Applewood Ribs Platter (Half Rack)',
        description: 'Hardwood smoked ribs glazed with signature molasses BBQ sauce. Served with hand-cut fries, pit beans, and sweet cornbread.',
        price: 22.99,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Pitmaster Favorite',
        calories: '1080 cal'
      },
      {
        id: 'ys-prod-2',
        name: 'Carolina Hickory Pulled Pork Sandwich & Slaw',
        description: '14-hour hickory smoked pork shoulder piled high on grilled brioche with tangy cider mop and crunchy cider slaw.',
        price: 14.50,
        category: 'Sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        calories: '790 cal'
      },
      {
        id: 'ys-prod-3',
        name: 'Texas Prime Smoked Beef Brisket Dinner',
        description: 'Dry-rubbed prime beef brisket sliced thick with smoked pit beans and 4-cheese baked mac & cheese.',
        price: 24.99,
        category: 'BBQ Platters',
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Customer Pick',
        calories: '1120 cal'
      },
      {
        id: 'ys-prod-4',
        name: 'Cast Iron BBQ Burnt Ends Mac & Cheese Skillet',
        description: 'Creamy 4-cheese cavatappi skillet topped with crispy smoked brisket burnt ends and sweet BBQ drizzle.',
        price: 15.99,
        category: 'Sides & Starters',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '890 cal'
      },
      {
        id: 'ys-prod-onion-rings',
        name: 'Sweet Vidalia Crispy Onion Ring Tower',
        description: 'Hand-cut jumbo sweet Vidalia onion rings fried crispy in seasoned batter, served with house spicy remoulade dip.',
        price: 9.99,
        category: 'Sides & Starters',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '620 cal'
      },
      {
        id: 'ys-prod-pecan-pie',
        name: 'Southern Bourbon Pecan Pie Slice',
        description: 'Rich brown sugar and roasted pecan pie infused with Kentucky bourbon, topped with real vanilla whipped cream.',
        price: 6.99,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '520 cal'
      }
    ]
  },
  {
    id: 'sf-hobbs-tavern',
    slug: 'hobbs-tavern-brewing',
    businessName: 'Hobbs Tavern & Brewing Co.',
    tagline: 'Handcrafted Local Ales, Wood-Fired Pies & Country Tavern Fare',
    description: 'Historic country tavern in West Ossipee brewing fresh craft ales on site, crafting wood-fired flatbreads, and serving farm-to-table pub classics.',
    logoEmoji: '🍺',
    coverImageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-2000',
    email: 'info@hobbstavern.com',
    address: '2415 White Mountain Hwy, West Ossipee, NH 03890',
    town: 'Ossipee',
    state: 'NH',
    accentColor: '#f59e0b',
    deliveryFee: 4.49,
    minOrder: 15.00,
    estimatedPrepTime: '25-35 mins',
    googlePlaceId: 'ChIJgU7bEzl64okRFB5wL384Oss',
    googleRating: 4.6,
    reviewsCount: 980,
    googleReviewUrl: 'https://www.google.com/search?q=Hobbs+Tavern+West+Ossipee+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    products: [
      {
        id: 'hb-prod-1',
        name: 'Hobbs Hi-Fi Hazy NEIPA (4-Pack 16oz)',
        description: 'Juicy tropical hop profile with Citra & Mosaic, brewed fresh on site in West Ossipee.',
        price: 16.00,
        category: 'Craft Beer',
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Brewery Flagship'
      },
      {
        id: 'hb-prod-amber',
        name: 'Hobbs Tavern Amber Ale (4-Pack 16oz)',
        description: 'Traditional American amber ale brewed with toasted caramel malts and crisp Pacific Northwest hops.',
        price: 15.00,
        category: 'Craft Beer',
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'hb-prod-2',
        name: 'Hobbs Grass-Fed Bacon Jam Double Smash Burger',
        description: 'Double 1/4 lb local grass-fed beef smash patties, house smoked bacon onion jam, Grafton sharp cheddar & crispy french fries.',
        price: 17.99,
        category: 'Tavern Fare',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        calories: '940 cal'
      },
      {
        id: 'hb-prod-3',
        name: 'Wood-Fired Prosciutto & Fig Flatbread',
        description: 'Prosciutto di Parma, black mission figs, goat cheese, fresh baby arugula & balsamic reduction.',
        price: 16.50,
        category: 'Pizzas & Flatbreads',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '680 cal'
      },
      {
        id: 'hb-prod-fish-chips',
        name: 'Hobbs Ale Battered Atlantic Haddock Fish & Chips',
        description: 'Fresh wild-caught Atlantic haddock filet dipped in Hobbs Tavern Ale batter, golden fried with hand-cut fries and house caper tartar sauce.',
        price: 19.99,
        category: 'Tavern Fare',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '920 cal'
      },
      {
        id: 'hb-prod-pretzels',
        name: 'Bavarian Warm Pretzel Sticks with Hobbs Beer Cheese',
        description: '3 warm salted Bavarian pretzel sticks served with house warm Hobbs ale cheddar cheese dip and whole-grain mustard.',
        price: 11.50,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '610 cal'
      },
      {
        id: 'hb-prod-4',
        name: 'Crispy Brussels Sprouts with Cider Glaze',
        description: 'Flash-fried brussels sprouts with pancetta lardons and NH maple cider reduction.',
        price: 11.50,
        category: 'Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '420 cal'
      }
    ]
  },
  {
    id: 'sf-jakes-seafood',
    slug: 'jakes-seafood-grill',
    businessName: "Jake's Seafood & Grill",
    tagline: 'Fresh Atlantic Lobster Rolls, Fried Whole Belly Clams & Chowders',
    description: 'Center Ossipee’s seafood landmark serving line-caught Atlantic haddock, hot buttered Maine lobster rolls, and rich scratch clam chowder.',
    logoEmoji: '🦞',
    coverImageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-2805',
    email: 'orders@jakesseafoodnh.com',
    address: '2055 Route 16, Center Ossipee, NH 03814',
    town: 'Ossipee',
    state: 'NH',
    accentColor: '#06b6d4',
    deliveryFee: 4.99,
    minOrder: 15.00,
    estimatedPrepTime: '20-30 mins',
    googlePlaceId: 'ChIJ0e7bEzl64okRKX3wL384Oss',
    googleRating: 4.5,
    reviewsCount: 650,
    googleReviewUrl: 'https://www.google.com/search?q=Jakes+Seafood+Ossipee+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    products: [
      {
        id: 'js-prod-1',
        name: 'Traditional Maine Lobster Roll (Jumbo 1/3 lb)',
        description: '1/3 lb fresh claw & knuckle Maine lobster meat served warm with melted butter or chilled with light mayo on toasted split-top brioche.',
        price: 26.99,
        category: 'Lobster Rolls',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Jumbo Size',
        calories: '540 cal',
        optionGroups: [
          {
            id: 'lob-style',
            title: 'Preparation Style',
            required: true,
            type: 'single',
            choices: [
              { id: 'lob-hot', name: 'Hot Buttered Style', priceDelta: 0 },
              { id: 'lob-cold', name: 'Traditional Chilled with Mayo', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'js-prod-2',
        name: 'Whole Belly Sweet Ipswich Clam Basket',
        description: 'Hand-breaded fresh Atlantic whole belly clams fried crisp with french fries, coleslaw, and homemade tartar sauce.',
        price: 28.99,
        category: 'Fried Baskets',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Coastal Classic',
        calories: '980 cal'
      },
      {
        id: 'js-prod-combo-basket',
        name: 'Atlantic Sea Scallop & Gulf Shrimp Fried Basket',
        description: 'Sweet tender sea scallops and jumbo butterflied shrimp golden fried with crisp fries, creamy coleslaw, tartar, and zesty cocktail sauce.',
        price: 27.50,
        category: 'Fried Baskets',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Seafood Lovers',
        calories: '920 cal'
      },
      {
        id: 'js-prod-3',
        name: 'New England Scratch Clam Chowder (Bread Bowl)',
        description: 'Rich heavy cream chowder packed with tender clams, sea salt, potatoes, and oyster crackers in fresh sourdough bread bowl.',
        price: 9.99,
        category: 'Soups & Starters',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '650 cal'
      },
      {
        id: 'js-prod-4',
        name: 'Crispy Atlantic Haddock Fish & Chips Platter',
        description: 'Fresh line-caught haddock filet in golden beer batter with lemon wedge, fries, and slaw.',
        price: 18.99,
        category: 'Fried Baskets',
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '860 cal'
      },
      {
        id: 'js-prod-salmon-salad',
        name: 'Grilled Atlantic Salmon Summer Salad',
        description: 'Fresh pan-seared Atlantic salmon over tender mixed baby greens, crumbled goat cheese, candied pecans, and lemon herb vinaigrette.',
        price: 19.50,
        category: 'Salads & Entrees',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '540 cal'
      },
      {
        id: 'js-prod-blueberry-crisp',
        name: 'Warm Maine Wild Blueberry Crisp & Ice Cream',
        description: 'Baked wild blueberries with cinnamon oat crumble topping, served warm with a scoop of vanilla bean ice cream.',
        price: 7.50,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '480 cal'
      }
    ]
  },
  {
    id: 'sf-poor-peoples-pub',
    slug: 'poor-peoples-pub',
    businessName: "Poor People's Pub",
    tagline: 'Killer Jumbo Wings, Stuffed Burgers, Poutines & Cold Craft Drafts',
    description: 'Sanbornville’s lively neighborhood tavern serving massive 12-pack wings, bacon-stuffed burgers, loaded poutines, and draft growlers.',
    logoEmoji: '🍻',
    coverImageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 522-8228',
    email: 'orders@poorpeoplespub.com',
    address: '28 Meadow St, Sanbornville, NH 03872',
    town: 'Wakefield',
    state: 'NH',
    accentColor: '#eab308',
    deliveryFee: 3.99,
    minOrder: 12.00,
    estimatedPrepTime: '20-30 mins',
    googlePlaceId: 'ChIJy9dfEzl64okRWN8wL384Wak',
    googleRating: 4.7,
    reviewsCount: 1120,
    googleReviewUrl: 'https://www.google.com/search?q=Poor+Peoples+Pub+Sanbornville+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    products: [
      {
        id: 'ppp-prod-1',
        name: 'Famous PPP Smoked Jumbo Wings (12-Pack)',
        description: 'Crisp seasoned wings tossed in Ghost Pepper Honey, Garlic Parm, or Sweet Heat BBQ with celery and blue cheese.',
        price: 16.99,
        category: 'Wings',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Legendary',
        calories: '1050 cal',
        optionGroups: [
          {
            id: 'ppp-sauce',
            title: 'Wing Sauce',
            required: true,
            type: 'single',
            choices: [
              { id: 'ps-honey-ghost', name: 'Ghost Pepper Hot Honey', priceDelta: 0 },
              { id: 'ps-garlic-parm', name: 'Roasted Garlic Parmesan', priceDelta: 0 },
              { id: 'ps-bbq', name: 'Sweet Heat Smoky BBQ', priceDelta: 0 },
              { id: 'ps-buff', name: 'Classic Buffalo Medium', priceDelta: 0 }
            ]
          }
        ]
      },
      {
        id: 'ppp-prod-2',
        name: 'The Wakefield Monster Bacon-Stuffed Burger',
        description: '1/2 lb chuck patty stuffed with smoked bacon & cheddar, topped with crispy onion straws and pub sauce.',
        price: 16.50,
        category: 'Burgers',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Best Seller',
        calories: '980 cal'
      },
      {
        id: 'ppp-prod-3',
        name: 'Loaded Tavern Pulled Pork Poutine Skillet',
        description: 'Golden hand-cut fries smothered in cheese curds, rich brown gravy, and slow-smoked pulled pork.',
        price: 13.99,
        category: 'Starters',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '880 cal'
      },
      {
        id: 'ppp-prod-mac-skillet',
        name: 'Crispy Buffalo Chicken Mac & Cheese Skillet',
        description: 'Creamy 4-cheese cavatappi pasta skillet topped with crispy buffalo chicken bites and blue cheese crumbles.',
        price: 15.99,
        category: 'Starters & Entrees',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '940 cal'
      },
      {
        id: 'ppp-prod-mozzarella',
        name: 'Beer Battered Mozzarella Wedges',
        description: 'Crispy golden fried whole-milk mozzarella wedges served with rich house marinara and garlic herb dip.',
        price: 9.99,
        category: 'Starters',
        imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '640 cal'
      },
      {
        id: 'ppp-prod-growler',
        name: 'Local Craft IPA 64oz Draft Growler Fill',
        description: 'Fresh pour from our rotating local New Hampshire craft draft tap line into a chilled 64oz growler jug.',
        price: 18.00,
        category: 'Draft Beer',
        imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Fresh Pour'
      }
    ]
  },
  {
    id: 'sf-flatbread',
    slug: 'flatbread-company',
    businessName: 'Flatbread Company',
    tagline: 'Clay Earthen Wood-Fired Organic Flatbreads & Salads',
    description: 'North Conway’s handcrafted earthen wood-fired flatbread pizzeria baking organic dough with nitrate-free local meats and fresh herbs.',
    logoEmoji: '🔥',
    coverImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 356-4470',
    email: 'conway@flatbreadcompany.com',
    address: '2760 White Mountain Hwy, North Conway, NH 03860',
    town: 'Conway',
    state: 'NH',
    accentColor: '#ef4444',
    deliveryFee: 4.49,
    minOrder: 15.00,
    estimatedPrepTime: '20-30 mins',
    googlePlaceId: 'ChIJHWtfEzl64okRCN8wL384Con',
    googleRating: 4.7,
    reviewsCount: 2890,
    googleReviewUrl: 'https://www.google.com/search?q=Flatbread+Company+North+Conway+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 70 * 86400000).toISOString(),
    products: [
      {
        id: 'fc-prod-1',
        name: 'Jay’s Heart Wood-Fired Flatbread (Large 16")',
        description: 'Organic tomato sauce, whole milk mozzarella, imported parmesan, and garlic herb oil baked in clay earthen oven.',
        price: 21.50,
        category: 'Organic Flatbreads',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Signature',
        calories: '260 cal/slice'
      },
      {
        id: 'fc-prod-2',
        name: 'Pork & Pepper Nitrate-Free Flatbread',
        description: 'Slow-cooked local pork shoulder, organic red onions, sweet bell peppers, rosemary & maple BBQ drizzle.',
        price: 24.00,
        category: 'Organic Flatbreads',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Local Meat',
        calories: '290 cal/slice'
      },
      {
        id: 'fc-prod-mushroom',
        name: 'Coos Forest Mushroom & Caramelized Onion Flatbread',
        description: 'Sautéed shiitake and portobello mushrooms, sweet caramelized onions, fresh thyme, Vermont goat cheese, and balsamic reduction.',
        price: 22.50,
        category: 'Organic Flatbreads',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '250 cal/slice'
      },
      {
        id: 'fc-prod-salad',
        name: 'Organic Mesclun Farm Salad Bowl',
        description: 'Local organic spring greens, toasted pumpkin seeds, organic cranberries, and house-made ginger tamari vinaigrette.',
        price: 11.99,
        category: 'Salads',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '310 cal'
      },
      {
        id: 'fc-prod-3',
        name: 'Grandmother’s Handmade Organic Chocolate Whoopie Pie',
        description: 'Two rich chocolate cake rounds filled with fluffy vanilla buttercream.',
        price: 6.50,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Homemade',
        calories: '420 cal'
      },
      {
        id: 'fc-prod-lemonade',
        name: 'Fresh Organic Maple Lemonade (16oz)',
        description: 'Hand-squeezed organic lemons sweetened with pure New Hampshire amber maple syrup.',
        price: 4.75,
        category: 'Beverages',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '140 cal'
      }
    ]
  },
  {
    id: 'sf-hannaford-togo',
    slug: 'hannaford-to-go',
    businessName: 'Hannaford Supermarket & Hannaford To Go',
    tagline: 'Fresh Groceries, Deli Platters, Produce & Express Curbside Pickup Delivery',
    description: 'Order your weekly groceries, deli meats, farm fresh produce, bakery goods, and household essentials. Place your order directly through Hannaford To Go or prepay online and Sean Martin will pick up your bags curbside and deliver them express to your doorstep in Effingham, Ossipee, Freedom, and surrounding Carroll County towns.',
    logoEmoji: '🛒',
    coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 641-9400',
    email: 'togo@hannaford.com',
    address: '935 Route 16, Center Ossipee, NH 03864',
    town: 'Effingham',
    state: 'NH',
    accentColor: '#16a34a',
    deliveryFee: 5.99,
    minOrder: 15.00,
    estimatedPrepTime: '30-45 mins',
    googlePlaceId: 'ChIJ_xXqHannafordOssipeeNH',
    googleRating: 4.6,
    reviewsCount: 1850,
    googleReviewUrl: 'https://www.google.com/search?q=Hannaford+Supermarket+Ossipee+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    products: [
      {
        id: 'htg-prod-1',
        name: 'Hannaford To Go Curbside Pickup & Doorstep Delivery Service',
        description: 'Prepay your grocery cart on the Hannaford To Go app/website and Sean Martin will pick up your packed grocery bags curbside at the Ossipee store and deliver straight to your home.',
        price: 9.99,
        category: 'Courier Services',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Curbside Express'
      },
      {
        id: 'htg-prod-2',
        name: 'Fresh Deli Sub & Cold Cut Platter (Feeds 4-6)',
        description: 'Oven roasted turkey breast, rare roast beef, Black Forest ham, aged Cabot cheddar, imported swiss, and fresh artisan sub rolls with house dressings.',
        price: 28.50,
        category: 'Deli Platters',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Deli Fresh'
      },
      {
        id: 'htg-prod-3',
        name: 'New England Farm Fresh Dairy & Egg Bundle',
        description: 'Cabot Vermont Extra Sharp Cheddar (8oz), 1 Dozen NH Farm Brown Eggs, Hood Whole Milk (1 Gallon), and Salted Sweet Cream Butter.',
        price: 16.99,
        category: 'Dairy & Farm',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Local Dairy'
      },
      {
        id: 'htg-prod-4',
        name: 'Fresh Seasonal Orchard Fruit & Garden Crate',
        description: 'Crisp Honeycrisp apples, fresh bananas, organic baby spinach, Hass avocados, sweet blueberries, and organic carrots.',
        price: 22.50,
        category: 'Produce',
        imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Farm Fresh'
      },
      {
        id: 'htg-prod-5',
        name: 'Bakery Fresh Chocolate Chip Chunk Cookies (1 Dozen)',
        description: 'Warm soft-baked cookies loaded with semi-sweet chocolate chunks, baked fresh in the bakery daily.',
        price: 5.99,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Baked Daily'
      },
      {
        id: 'htg-prod-6',
        name: 'Herb Rotisserie Roasted Whole Chicken',
        description: 'Tender juicy whole chicken slow-roasted with rosemary garlic herbs. Hot and ready to eat.',
        price: 11.99,
        category: 'Hot Foods',
        imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Hot & Ready'
      },
      {
        id: 'htg-prod-pantry',
        name: 'Family Pantry Essentials Bundle',
        description: 'Barilla pasta (16oz), Rao’s Homemade Marinara Sauce (24oz), Skippy peanut butter, organic strawberry jam, and whole-wheat artisan bread.',
        price: 24.99,
        category: 'Pantry',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        inStock: true
      }
    ]
  },
  {
    id: 'sf-sweeties-icecream',
    slug: 'sweeties-lakeside-icecream',
    businessName: 'Sweeties Lakeside Ice Cream & Sweets',
    tagline: 'Hand-Churned NH Ice Cream, Waffle Bowls & Lakeside Sundaes',
    description: 'Freedom’s favorite seasonal scoop shop crafting small-batch homemade ice creams, loaded waffle sundaes, campfire shakes, and bakery treats.',
    logoEmoji: '🍨',
    coverImageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&auto=format&fit=crop&q=80',
    phone: '(603) 539-8822',
    email: 'icecream@sweetiesnh.com',
    address: 'Ossipee Lake Rd, Freedom, NH 03836',
    town: 'Freedom',
    state: 'NH',
    accentColor: '#ec4899',
    deliveryFee: 3.49,
    minOrder: 10.00,
    estimatedPrepTime: '10-20 mins',
    googlePlaceId: 'ChIJsw33tSweetiesFreedomNH',
    googleRating: 4.9,
    reviewsCount: 340,
    googleReviewUrl: 'https://www.google.com/search?q=Sweeties+Ice+Cream+Freedom+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    products: [
      {
        id: 'swi-prod-1',
        name: 'Maple Walnut Hot Fudge Hand-Dipped Waffle Bowl',
        description: 'Homemade Carroll County maple walnut ice cream in a freshly pressed waffle bowl, drenched in warm Ghirardelli hot fudge, whipped cream, and cherry.',
        price: 8.99,
        category: 'Specialty Sundaes',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'House Specialty',
        calories: '640 cal'
      },
      {
        id: 'swi-prod-2',
        name: 'Campfire S’mores Mountain Milkshake',
        description: 'Rich chocolate and marshmallow swirl shake topped with toasted marshmallow, graham cracker crust rim, and chocolate syrup drizzle.',
        price: 8.50,
        category: 'Milkshakes',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Customer Pick',
        calories: '710 cal'
      },
      {
        id: 'swi-prod-3',
        name: 'Maine Wild Blueberry Handcrafted Waffle Cone',
        description: 'Double scoop of real Maine wild blueberry cream ice cream inside a freshly rolled sweet waffle cone.',
        price: 6.75,
        category: 'Cones & Cups',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '490 cal'
      },
      {
        id: 'swi-prod-4',
        name: 'Handcrafted Ice Cream Cookie Sandwich',
        description: 'Two oversized bakery chocolate chunk cookies sandwiching a thick slab of Madagascar vanilla bean ice cream.',
        price: 6.25,
        category: 'Bakery Sweets',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '580 cal'
      },
      {
        id: 'swi-prod-5',
        name: 'Pint To-Go: Sweeties Small-Batch Ice Cream',
        description: 'Hand-packed pint of your favorite homemade ice cream flavor straight from our dipping cabinet.',
        price: 7.99,
        category: 'Pints To-Go',
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Pint',
        optionGroups: [
          {
            id: 'pint-flavor',
            title: 'Choose Pint Flavor',
            required: true,
            type: 'single',
            choices: [
              { id: 'pf-maple-walnut', name: 'NH Smoked Maple Walnut', priceDelta: 0 },
              { id: 'pf-blueberry', name: 'Maine Wild Blueberry', priceDelta: 0 },
              { id: 'pf-smores', name: 'Campfire S’mores Fudge', priceDelta: 0 },
              { id: 'pf-vanilla', name: 'Madagascar Vanilla Bean', priceDelta: 0 },
              { id: 'pf-choc-chunk', name: 'Dark Chocolate Fudge Chunk', priceDelta: 0 }
            ]
          }
        ]
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
    id: 'ord-842',
    orderNumber: '842',
    customerName: 'Sarah Jenkins',
    customerPhone: '(603) 641-9400',
    deliveryAddress: '42 Province Lake Rd, Effingham, NH 03882',
    deliveryInstructions: 'Please leave grocery bags on the front porch table by the door. Ring bell once dropped off. Thank you Sean!',
    items: [
      {
        id: 'htg-item-1',
        name: 'Hannaford To Go Curbside Express Pickup & Delivery (3 Grocery Bags)',
        price: 9.99,
        quantity: 1,
        notes: 'Prepaid on Hannaford To Go app under Sarah Jenkins'
      },
      {
        id: 'htg-item-2',
        name: 'Fresh Deli Sub & Cold Cut Platter (Feeds 4-6)',
        price: 28.50,
        quantity: 1,
      },
      {
        id: 'htg-item-3',
        name: 'New England Farm Fresh Dairy & Egg Bundle',
        price: 16.99,
        quantity: 1,
      },
      {
        id: 'htg-item-4',
        name: 'Bakery Fresh Chocolate Chip Chunk Cookies (1 Dozen)',
        price: 5.99,
        quantity: 1,
      }
    ],
    subtotal: 61.47,
    deliveryFee: 5.99,
    tip: 10.00,
    total: 77.46,
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedDeliveryTime: '25-35 mins',
    notifiedPhone: true,
    notificationLog: 'Relayed via SMS to Sean Martin ((508) 507-0305)',
    town: 'Effingham',
    restaurantName: 'Hannaford Supermarket & Hannaford To Go',
    restaurantAddress: '935 Route 16, Center Ossipee, NH 03864',
    orderType: 'delivery',
    serviceType: 'store_pickup',
    paymentMethod: 'cash_app',
    paymentStatus: 'prepaid',
    paymentReference: 'Cash App $sarahj (Prepaid)',
    pickupStoreName: 'Hannaford Supermarket & Hannaford To Go',
    pickupStoreAddress: '935 Route 16, Center Ossipee, NH 03864',
    pickupOrderCode: 'HTG-6419-842',
    estimatedItemCost: 61.47,
  },
  {
    id: 'ord-843',
    orderNumber: '843',
    customerName: 'Dave & Linda Miller',
    customerPhone: '(603) 641-9400',
    deliveryAddress: '118 Ossipee Lake Rd, Freedom, NH 03836',
    deliveryInstructions: 'Curbside pickup from Hannaford Bay #4. Please leave bags inside the screen porch. Gate code is #1180.',
    items: [
      {
        id: 'htg-item-5',
        name: 'Hannaford To Go Curbside Express Pickup & Delivery (5 Large Bags)',
        price: 9.99,
        quantity: 1,
        notes: 'Prepaid order under Dave Miller - Curbside Slot #4'
      },
      {
        id: 'htg-item-6',
        name: 'Weekly Family Pantry & Meat Groceries (Beef Roasts, Chicken, Milk, Cabot Cheese, Produce)',
        price: 108.52,
        quantity: 1,
      },
      {
        id: 'htg-item-7',
        name: 'Fresh Seasonal Orchard Fruit Crate',
        price: 22.50,
        quantity: 1,
      }
    ],
    subtotal: 141.01,
    deliveryFee: 6.99,
    tip: 18.00,
    total: 166.00,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    estimatedDeliveryTime: '35-45 mins',
    notifiedPhone: true,
    notificationLog: 'Relayed via SMS to Sean Martin ((508) 507-0305)',
    town: 'Freedom',
    restaurantName: 'Hannaford Supermarket & Hannaford To Go',
    restaurantAddress: '935 Route 16, Center Ossipee, NH 03864',
    orderType: 'delivery',
    serviceType: 'store_pickup',
    paymentMethod: 'venmo',
    paymentStatus: 'prepaid',
    paymentReference: 'Venmo @DaveMiller-NH (Prepaid)',
    pickupStoreName: 'Hannaford Supermarket & Hannaford To Go',
    pickupStoreAddress: '935 Route 16, Center Ossipee, NH 03864',
    pickupOrderCode: 'HTG-FREEDOM-843',
    estimatedItemCost: 141.01,
  },
  {
    id: 'ord-844',
    orderNumber: '844',
    customerName: 'Robert Chen',
    customerPhone: '(603) 641-9400',
    deliveryAddress: '15 Green Mountain Rd, Effingham, NH 03882',
    deliveryInstructions: 'Please leave on front steps. Watch out for friendly golden retriever in fenced yard!',
    items: [
      {
        id: 'htg-item-8',
        name: 'Hannaford To Go Curbside Express Pickup (2 Grocery Bags)',
        price: 9.99,
        quantity: 1,
        notes: 'Prepaid order under Robert Chen'
      },
      {
        id: 'htg-item-9',
        name: 'Herb Rotisserie Roasted Whole Chicken (Hot)',
        price: 11.99,
        quantity: 1,
      },
      {
        id: 'htg-item-10',
        name: 'Fresh Deli Sub Platter & Bakery Rolls',
        price: 28.50,
        quantity: 1,
      }
    ],
    subtotal: 50.48,
    deliveryFee: 5.99,
    tip: 8.50,
    total: 64.97,
    status: 'pending',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    estimatedDeliveryTime: '20-30 mins',
    notifiedPhone: true,
    notificationLog: 'Relayed via SMS to Sean Martin ((508) 507-0305)',
    town: 'Effingham',
    restaurantName: 'Hannaford Supermarket & Hannaford To Go',
    restaurantAddress: '935 Route 16, Center Ossipee, NH 03864',
    orderType: 'delivery',
    serviceType: 'store_pickup',
    paymentMethod: 'cash_app',
    paymentStatus: 'prepaid',
    paymentReference: 'Cash App $rchen44 (Prepaid)',
    pickupStoreName: 'Hannaford Supermarket & Hannaford To Go',
    pickupStoreAddress: '935 Route 16, Center Ossipee, NH 03864',
    pickupOrderCode: 'HTG-GREENMT-844',
    estimatedItemCost: 50.48,
  },
  {
    id: 'ord-845',
    orderNumber: '845',
    customerName: 'Emily Watson',
    customerPhone: '(603) 641-9400',
    deliveryAddress: '84 Moultonville Rd, Center Ossipee, NH 03864',
    deliveryInstructions: 'Leave in blue cooler on front deck if not home. Text when en route!',
    items: [
      {
        id: 'htg-item-11',
        name: 'Hannaford To Go Curbside Express Pickup & Delivery (3 Bags)',
        price: 9.99,
        quantity: 1,
      },
      {
        id: 'htg-item-12',
        name: 'New England Farm Fresh Dairy & Egg Bundle',
        price: 16.99,
        quantity: 1,
      },
      {
        id: 'htg-item-13',
        name: 'Fresh Seasonal Orchard Fruit Crate',
        price: 22.50,
        quantity: 1,
      },
      {
        id: 'htg-item-14',
        name: 'Bakery Fresh Chocolate Chip Chunk Cookies (1 Dozen)',
        price: 5.99,
        quantity: 1,
      }
    ],
    subtotal: 55.47,
    deliveryFee: 4.99,
    tip: 10.00,
    total: 70.46,
    status: 'pending',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    estimatedDeliveryTime: '20-30 mins',
    notifiedPhone: true,
    notificationLog: 'Relayed via SMS to Sean Martin ((508) 507-0305)',
    town: 'Ossipee',
    restaurantName: 'Hannaford Supermarket & Hannaford To Go',
    restaurantAddress: '935 Route 16, Center Ossipee, NH 03864',
    orderType: 'delivery',
    serviceType: 'store_pickup',
    paymentMethod: 'zelle',
    paymentStatus: 'prepaid',
    paymentReference: 'Zelle Verified (Prepaid)',
    pickupStoreName: 'Hannaford Supermarket & Hannaford To Go',
    pickupStoreAddress: '935 Route 16, Center Ossipee, NH 03864',
    pickupOrderCode: 'HTG-OSSIPEE-845',
    estimatedItemCost: 55.47,
  }
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
  const [driverTelemetry, setDriverTelemetry] = useState<DriverTelemetry>(DEFAULT_DRIVER_TELEMETRY);
  const [driverShift, setDriverShift] = useState<DriverShiftSummary>(DEFAULT_DRIVER_SHIFT);
  const [beforeAfterShowcases, setBeforeAfterShowcases] = useState<BeforeAfterShowcase[]>(INITIAL_BEFORE_AFTER_SHOWCASES);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>(INITIAL_WORK_REQUESTS);
  const [nfcMenuProducts, setNfcMenuProducts] = useState<NfcMenuProduct[]>(INITIAL_NFC_MENU_PRODUCTS);
  const [nfcHardwareOrders, setNfcHardwareOrders] = useState<NfcHardwareOrder[]>(INITIAL_NFC_HARDWARE_ORDERS);
  const [managedServices, setManagedServices] = useState<ManagedServicePackage[]>(INITIAL_MANAGED_SERVICES);
  const [clientSubscriptions, setClientSubscriptions] = useState<ClientServiceSubscription[]>(INITIAL_CLIENT_SUBSCRIPTIONS);
  const [automationBots, setAutomationBots] = useState<ServiceAutomationBot[]>(INITIAL_AUTOMATION_BOTS);
  const [directoryListings, setDirectoryListings] = useState<DirectoryListing[]>(INITIAL_DIRECTORY_LISTINGS);
  const [affiliates, setAffiliates] = useState<AffiliateAmbassador[]>(INITIAL_AFFILIATES);
  const [loyaltyRewards, setLoyaltyRewards] = useState<TownLoyaltyReward[]>(INITIAL_LOYALTY_REWARDS);
  const [loyaltyWallet, setLoyaltyWallet] = useState<UserLoyaltyWallet>(DEFAULT_USER_LOYALTY_WALLET);
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
      if (storedOrders) {
        const parsed: DeliveryOrder[] = JSON.parse(storedOrders);
        const existingIds = new Set(parsed.map(o => o.id));
        const merged = [...parsed, ...INITIAL_DELIVERY_ORDERS.filter(o => !existingIds.has(o.id))];
        setDeliveryOrders(merged);
      } else {
        setDeliveryOrders(INITIAL_DELIVERY_ORDERS);
      }

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (storedNotifications) setNotificationSettings(JSON.parse(storedNotifications));

      const storedMembership = localStorage.getItem(STORAGE_KEYS.MEMBERSHIP);
      if (storedMembership) setUserMembership(JSON.parse(storedMembership));

      const storedTelemetry = localStorage.getItem(STORAGE_KEYS.DRIVER_TELEMETRY);
      if (storedTelemetry) setDriverTelemetry(JSON.parse(storedTelemetry));

      const storedShift = localStorage.getItem(STORAGE_KEYS.DRIVER_SHIFT);
      if (storedShift) setDriverShift(JSON.parse(storedShift));

      const storedStorefronts = localStorage.getItem(STORAGE_KEYS.STOREFRONTS);
      if (storedStorefronts) {
        const parsed: MerchantStorefront[] = JSON.parse(storedStorefronts);
        const initialMap = new Map(INITIAL_STOREFRONTS.map(s => [s.id, s]));
        const merged = parsed.map(s => {
          const initSf = initialMap.get(s.id);
          if (initSf) {
            return {
              ...initSf,
              ...s,
              products: initSf.products
            };
          }
          return s;
        });
        const existingIds = new Set(parsed.map(s => s.id));
        const finalMerged = [...merged, ...INITIAL_STOREFRONTS.filter(s => !existingIds.has(s.id))];
        setStorefronts(finalMerged);
      } else {
        setStorefronts(INITIAL_STOREFRONTS);
      }

      const storedShowcases = localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES);
      if (storedShowcases) {
        const parsed: BeforeAfterShowcase[] = JSON.parse(storedShowcases);
        const existingIds = new Set(parsed.map(s => s.id));
        const merged = [...parsed, ...INITIAL_BEFORE_AFTER_SHOWCASES.filter(s => !existingIds.has(s.id))];
        setBeforeAfterShowcases(merged);
      } else {
        setBeforeAfterShowcases(INITIAL_BEFORE_AFTER_SHOWCASES);
      }

      const storedRequests = localStorage.getItem(STORAGE_KEYS.WORK_REQUESTS);
      const storedNfcProducts = localStorage.getItem(STORAGE_KEYS.NFC_MENU_PRODUCTS);
      if (storedNfcProducts) {
        const parsed: NfcMenuProduct[] = JSON.parse(storedNfcProducts);
        const existingIds = new Set(parsed.map(p => p.id));
        const merged = [...parsed, ...INITIAL_NFC_MENU_PRODUCTS.filter(p => !existingIds.has(p.id))];
        setNfcMenuProducts(merged);
      } else {
        setNfcMenuProducts(INITIAL_NFC_MENU_PRODUCTS);
      }

      const storedHardwareOrders = localStorage.getItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS);
      const storedServices = localStorage.getItem(STORAGE_KEYS.MANAGED_SERVICES);
      if (storedServices) {
        const parsed: ManagedServicePackage[] = JSON.parse(storedServices);
        const existingIds = new Set(parsed.map(s => s.id));
        setManagedServices([...parsed, ...INITIAL_MANAGED_SERVICES.filter(s => !existingIds.has(s.id))]);
      } else {
        setManagedServices(INITIAL_MANAGED_SERVICES);
      }

      const storedSubs = localStorage.getItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS);
      if (storedSubs) {
        const parsed: ClientServiceSubscription[] = JSON.parse(storedSubs);
        const existingIds = new Set(parsed.map(s => s.id));
        setClientSubscriptions([...parsed, ...INITIAL_CLIENT_SUBSCRIPTIONS.filter(s => !existingIds.has(s.id))]);
      } else {
        setClientSubscriptions(INITIAL_CLIENT_SUBSCRIPTIONS);
      }

      const storedBots = localStorage.getItem(STORAGE_KEYS.AUTOMATION_BOTS);
      if (storedBots) {
        const parsed: ServiceAutomationBot[] = JSON.parse(storedBots);
        const existingIds = new Set(parsed.map(b => b.id));
        setAutomationBots([...parsed, ...INITIAL_AUTOMATION_BOTS.filter(b => !existingIds.has(b.id))]);
      } else {
        setAutomationBots(INITIAL_AUTOMATION_BOTS);
      }

      const storedDirectory = localStorage.getItem(STORAGE_KEYS.DIRECTORY_LISTINGS);
      if (storedDirectory) {
        const parsed: DirectoryListing[] = JSON.parse(storedDirectory);
        const existingIds = new Set(parsed.map(d => d.id));
        setDirectoryListings([...parsed, ...INITIAL_DIRECTORY_LISTINGS.filter(d => !existingIds.has(d.id))]);
      } else {
        setDirectoryListings(INITIAL_DIRECTORY_LISTINGS);
      }

      const storedAffiliates = localStorage.getItem(STORAGE_KEYS.AFFILIATES);
      if (storedAffiliates) {
        const parsed: AffiliateAmbassador[] = JSON.parse(storedAffiliates);
        const existingIds = new Set(parsed.map(a => a.id));
        setAffiliates([...parsed, ...INITIAL_AFFILIATES.filter(a => !existingIds.has(a.id))]);
      } else {
        setAffiliates(INITIAL_AFFILIATES);
      }

      const storedRewards = localStorage.getItem(STORAGE_KEYS.LOYALTY_REWARDS);
      if (storedRewards) {
        const parsed: TownLoyaltyReward[] = JSON.parse(storedRewards);
        const existingIds = new Set(parsed.map(r => r.id));
        setLoyaltyRewards([...parsed, ...INITIAL_LOYALTY_REWARDS.filter(r => !existingIds.has(r.id))]);
      } else {
        setLoyaltyRewards(INITIAL_LOYALTY_REWARDS);
      }

      const storedWallet = localStorage.getItem(STORAGE_KEYS.LOYALTY_WALLET);
      if (storedWallet) {
        setLoyaltyWallet(JSON.parse(storedWallet));
      } else {
        setLoyaltyWallet(DEFAULT_USER_LOYALTY_WALLET);
      }

      if (storedHardwareOrders) {
        const parsed: NfcHardwareOrder[] = JSON.parse(storedHardwareOrders);
        const existingIds = new Set(parsed.map(o => o.id));
        const merged = [...parsed, ...INITIAL_NFC_HARDWARE_ORDERS.filter(o => !existingIds.has(o.id))];
        setNfcHardwareOrders(merged);
      } else {
        setNfcHardwareOrders(INITIAL_NFC_HARDWARE_ORDERS);
      }

      if (storedRequests) {
        const parsed: WorkRequest[] = JSON.parse(storedRequests);
        const existingIds = new Set(parsed.map(r => r.id));
        const merged = [...parsed, ...INITIAL_WORK_REQUESTS.filter(r => !existingIds.has(r.id))];
        setWorkRequests(merged);
      } else {
        setWorkRequests(INITIAL_WORK_REQUESTS);
      }
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

  // Driver Tracking & Telemetry Handlers
  const updateDriverTelemetry = (updates: Partial<DriverTelemetry>) => {
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        ...updates,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const toggleDriverGpsBroadcast = () => {
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        isBroadcastingGps: !prev.isBroadcastingGps,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const setDriverActiveOrder = (activeOrderId: string | null) => {
    updateDriverTelemetry({ activeOrderId: activeOrderId || undefined });
  };

  const syncDeviceGeolocation = (coords: { latitude: number; longitude: number; speedMph?: number; heading?: number; altitude?: number }) => {
    updateDriverTelemetry({
      latitude: coords.latitude,
      longitude: coords.longitude,
      speedMph: coords.speedMph !== undefined ? coords.speedMph : driverTelemetry.speedMph,
      heading: coords.heading !== undefined ? coords.heading : driverTelemetry.heading,
      altitudeFeet: coords.altitude !== undefined ? Math.round(coords.altitude * 3.28084) : driverTelemetry.altitudeFeet,
      deviceTrackingActive: true,
      isBroadcastingGps: true,
      lastPingTimestamp: new Date().toISOString(),
    });
  };

  const toggleDriverOnline = () => {
    setDriverShift(prev => {
      const next = { ...prev, isOnline: !prev.isOnline };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        status: prev.status === 'offline' ? 'available' : 'offline',
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const acceptDeliveryJob = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    setDriverActiveOrder(orderId);
    updateDriverTelemetry({ status: 'en_route_store' });
    playDeliveryChime();
  };

  const completeDeliveryWithProof = (orderId: string, proof: ProofOfDelivery) => {
    const order = deliveryOrders.find(o => o.id === orderId);
    const earnedFee = order?.deliveryFee || 4.50;
    const earnedTip = order?.tip || 0;
    const totalEarned = earnedFee + earnedTip;

    const updated = deliveryOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered' as const,
          deliveredAt: new Date().toISOString(),
          proofOfDelivery: proof,
        };
      }
      return o;
    });
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));

    setDriverShift(prev => {
      const next = {
        ...prev,
        shiftDeliveriesCount: prev.shiftDeliveriesCount + 1,
        shiftEarningsTotal: prev.shiftEarningsTotal + totalEarned,
        shiftTipsTotal: prev.shiftTipsTotal + earnedTip,
        shiftMileageEstimate: prev.shiftMileageEstimate + 3.8,
        totalBalance: prev.totalBalance + totalEarned,
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });

    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        status: 'available',
        totalDeliveries: (prev.totalDeliveries || 0) + 1,
        activeOrderId: undefined,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
  };

  const cashOutDriverEarnings = (amount: number) => {
    setDriverShift(prev => {
      const cashOutAmt = Math.min(prev.totalBalance, Math.max(0, amount));
      const next = {
        ...prev,
        totalBalance: Math.max(0, Number((prev.totalBalance - cashOutAmt).toFixed(2))),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const addBeforeAfterShowcase = (showcaseData: Omit<BeforeAfterShowcase, 'id' | 'createdAt' | 'likesCount' | 'userLiked'>) => {
    const newShowcase: BeforeAfterShowcase = {
      ...showcaseData,
      id: `showcase-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
      userLiked: true,
      featured: true,
    };

    setBeforeAfterShowcases(prev => {
      const next = [newShowcase, ...prev];
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newShowcase;
  };

  const likeShowcase = (id: string) => {
    setBeforeAfterShowcases(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const userLiked = !s.userLiked;
        const likesCount = (s.likesCount || 0) + (userLiked ? 1 : -1);
        return {
          ...s,
          userLiked,
          likesCount: Math.max(0, likesCount),
        };
      });
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES, JSON.stringify(next));
      return next;
    });
  };

  const addWorkRequest = (requestData: Omit<WorkRequest, 'id' | 'createdAt' | 'quotesCount' | 'status'>) => {
    const newReq: WorkRequest = {
      ...requestData,
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'open',
      quotesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setWorkRequests(prev => {
      const next = [newReq, ...prev];
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newReq;
  };

  const updateWorkRequestStatus = (id: string, status: WorkRequest['status']) => {
    setWorkRequests(prev => {
      const next = prev.map(r => r.id === id ? { ...r, status } : r);
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });
  };

  
  // --- ADMIN NFC MENU HARDWARE METHODS ---
  const addNfcMenuProduct = (productData: Omit<NfcMenuProduct, 'id' | 'createdAt' | 'unitsSold'>) => {
    const newProd: NfcMenuProduct = {
      ...productData,
      id: `nfc-menu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      unitsSold: 0,
      createdAt: new Date().toISOString()
    };
    setNfcMenuProducts(prev => {
      const next = [newProd, ...prev];
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newProd;
  };

  const updateNfcMenuProduct = (id: string, updates: Partial<NfcMenuProduct>) => {
    setNfcMenuProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteNfcMenuProduct = (id: string) => {
    setNfcMenuProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const toggleNfcMenuProductPublish = (id: string) => {
    setNfcMenuProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const addNfcHardwareOrder = (orderData: Omit<NfcHardwareOrder, 'id' | 'createdAt'>) => {
    const newOrd: NfcHardwareOrder = {
      ...orderData,
      id: `hord-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setNfcHardwareOrders(prev => {
      const next = [newOrd, ...prev];
      localStorage.setItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newOrd;
  };

  const updateNfcHardwareOrderStatus = (id: string, status: NfcHardwareOrder['status']) => {
    setNfcHardwareOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const toggleStorefrontProductStock = (storefrontId: string, productId: string) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: sf.products.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p)
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
  };

  const updateStorefrontProductPrice = (storefrontId: string, productId: string, newPrice: number) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: sf.products.map(p => p.id === productId ? { ...p, price: Number(newPrice) } : p)
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
  };

  
  // --- MANAGED SERVICES & AUTOMATION HANDLERS ---
  const addManagedService = (pkgData: Omit<ManagedServicePackage, 'id' | 'activeSubscribersCount'>) => {
    const newPkg: ManagedServicePackage = {
      ...pkgData,
      id: `srv-${Date.now().toString(36)}`,
      activeSubscribersCount: 0,
    };
    setManagedServices(prev => {
      const next = [newPkg, ...prev];
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newPkg;
  };

  const updateManagedService = (id: string, updates: Partial<ManagedServicePackage>) => {
    setManagedServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const deleteManagedService = (id: string) => {
    setManagedServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const enrollClientSubscription = (subData: Omit<ClientServiceSubscription, 'id' | 'startedDate' | 'totalRevenueGenerated'>) => {
    const newSub: ClientServiceSubscription = {
      ...subData,
      id: `sub-${Date.now().toString(36)}`,
      startedDate: new Date().toISOString().split('T')[0],
      totalRevenueGenerated: subData.monthlyFee,
    };
    setClientSubscriptions(prev => {
      const next = [newSub, ...prev];
      localStorage.setItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS, JSON.stringify(next));
      return next;
    });

    // Increment package subscriber count
    setManagedServices(prev => {
      const next = prev.map(pkg => pkg.id === subData.packageId ? { ...pkg, activeSubscribersCount: (pkg.activeSubscribersCount || 0) + 1 } : pkg);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newSub;
  };

  const updateClientSubscriptionStatus = (id: string, status: ClientServiceSubscription['status']) => {
    setClientSubscriptions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, status } : s);
      localStorage.setItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const toggleAutomationBot = (id: string) => {
    setAutomationBots(prev => {
      const next = prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
      localStorage.setItem(STORAGE_KEYS.AUTOMATION_BOTS, JSON.stringify(next));
      return next;
    });
  };

  const triggerAutomationBotManual = (id: string) => {
    setAutomationBots(prev => {
      const next = prev.map(b => b.id === id ? { 
        ...b, 
        executionCount: b.executionCount + 1,
        lastExecutedAt: new Date().toISOString()
      } : b);
      localStorage.setItem(STORAGE_KEYS.AUTOMATION_BOTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const addStorefrontProduct = (storefrontId: string, product: StorefrontProduct) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: [product, ...sf.products]
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const incrementWorkRequestQuotes = (id: string) => {
    setWorkRequests(prev => {
      const next: WorkRequest[] = prev.map(r => r.id === id ? { ...r, quotesCount: (r.quotesCount || 0) + 1, status: 'quotes_received' as const } : r);
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const claimDirectoryListing = (id: string, claimant: { ownerName: string; email: string; phone: string }) => {
    setDirectoryListings(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            isClaimed: true,
            claimedBy: claimant.ownerName,
            email: claimant.email,
            phone: claimant.phone,
            verifiedBadge: true,
          };
        }
        return d;
      });
      localStorage.setItem(STORAGE_KEYS.DIRECTORY_LISTINGS, JSON.stringify(next));
      return next;
    });

    // Award bonus loyalty points for claiming
    awardLoyaltyPoints(100, `Claimed business listing: ${claimant.ownerName}`);
    playDeliveryChime();
  };

  const addDirectoryListing = (listing: Omit<DirectoryListing, 'id' | 'slug' | 'viewsCount' | 'tapsCount'>) => {
    const slug = listing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newListing: DirectoryListing = {
      ...listing,
      id: `dir-${Date.now().toString(36)}`,
      slug,
      viewsCount: 1,
      tapsCount: 0,
    };
    setDirectoryListings(prev => {
      const next = [newListing, ...prev];
      localStorage.setItem(STORAGE_KEYS.DIRECTORY_LISTINGS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newListing;
  };

  const registerAffiliate = (ambassador: Omit<AffiliateAmbassador, 'id' | 'code' | 'referralsCount' | 'earnedBountyTotal' | 'pendingPayout' | 'joinedDate' | 'status'>) => {
    const code = `${ambassador.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}${Math.floor(10 + Math.random() * 90)}`;
    const newAffiliate: AffiliateAmbassador = {
      ...ambassador,
      id: `aff-${Date.now().toString(36)}`,
      code,
      referralsCount: 0,
      earnedBountyTotal: 0,
      pendingPayout: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setAffiliates(prev => {
      const next = [newAffiliate, ...prev];
      localStorage.setItem(STORAGE_KEYS.AFFILIATES, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newAffiliate;
  };

  const redeemLoyaltyReward = (rewardId: string): boolean => {
    const reward = loyaltyRewards.find(r => r.id === rewardId);
    if (!reward || loyaltyWallet.userPoints < reward.pointsCost) return false;

    const redeemCode = `REWARD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newWallet: UserLoyaltyWallet = {
      ...loyaltyWallet,
      userPoints: loyaltyWallet.userPoints - reward.pointsCost,
      redeemedRewards: [
        {
          rewardId,
          rewardTitle: reward.title,
          code: redeemCode,
          redeemedAt: new Date().toISOString().split('T')[0],
        },
        ...loyaltyWallet.redeemedRewards,
      ]
    };

    setLoyaltyWallet(newWallet);
    localStorage.setItem(STORAGE_KEYS.LOYALTY_WALLET, JSON.stringify(newWallet));

    // Increment reward claim count
    setLoyaltyRewards(prev => {
      const next = prev.map(r => r.id === rewardId ? { ...r, claimedCount: r.claimedCount + 1 } : r);
      localStorage.setItem(STORAGE_KEYS.LOYALTY_REWARDS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return true;
  };

  const awardLoyaltyPoints = (amount: number, reason?: string) => {
    setLoyaltyWallet(prev => {
      const nextPoints = prev.userPoints + amount;
      const nextTaps = prev.lifetimeTaps + 1;
      let nextLevel = prev.level;
      let tierNum = prev.tierNumber;

      if (nextPoints >= 1000) {
        nextLevel = 'Carroll County Legend 👑';
        tierNum = 4;
      } else if (nextPoints >= 500) {
        nextLevel = 'Town Vanguard Master ⚡';
        tierNum = 3;
      } else if (nextPoints >= 200) {
        nextLevel = 'Town Vanguard Insider ⭐';
        tierNum = 2;
      }

      const nextWallet: UserLoyaltyWallet = {
        ...prev,
        userPoints: nextPoints,
        lifetimeTaps: nextTaps,
        level: nextLevel,
        tierNumber: tierNum,
      };
      localStorage.setItem(STORAGE_KEYS.LOYALTY_WALLET, JSON.stringify(nextWallet));
      return nextWallet;
    });
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
    driverTelemetry,
    driverShift,
    beforeAfterShowcases,
    workRequests,
    nfcMenuProducts,
    nfcHardwareOrders,
    managedServices,
    clientSubscriptions,
    automationBots,
    directoryListings,
    affiliates,
    loyaltyRewards,
    loyaltyWallet,
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
    updateDriverTelemetry,
    toggleDriverGpsBroadcast,
    setDriverActiveOrder,
    syncDeviceGeolocation,
    toggleDriverOnline,
    acceptDeliveryJob,
    completeDeliveryWithProof,
    cashOutDriverEarnings,
    addBeforeAfterShowcase,
    likeShowcase,
    addWorkRequest,
    updateWorkRequestStatus,
    incrementWorkRequestQuotes,
    addNfcMenuProduct,
    updateNfcMenuProduct,
    deleteNfcMenuProduct,
    toggleNfcMenuProductPublish,
    addNfcHardwareOrder,
    updateNfcHardwareOrderStatus,
    toggleStorefrontProductStock,
    updateStorefrontProductPrice,
    addStorefrontProduct,
    addManagedService,
    updateManagedService,
    deleteManagedService,
    enrollClientSubscription,
    updateClientSubscriptionStatus,
    toggleAutomationBot,
    triggerAutomationBotManual,
    claimDirectoryListing,
    addDirectoryListing,
    registerAffiliate,
    redeemLoyaltyReward,
    awardLoyaltyPoints,
  };
}
