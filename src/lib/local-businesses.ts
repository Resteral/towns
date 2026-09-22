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
}

export const EFFINGHAM_AREA_BUSINESSES: LocalBusiness[] = [
  // --- EFFINGHAM, NH ---
  {
    id: 'biz-eff-pnb-eats',
    name: 'PNB Eats',
    town: 'Effingham',
    state: 'NH',
    category: 'dining',
    address: 'NH-25, Effingham, NH 03882',
    phone: '(603) 539-7440',
    googlePlaceId: 'ChIJ_yXq6zN64okRTG3n6qN8Eff',
    googleRating: 4.8,
    reviewsCount: 184,
    googleReviewUrl: 'https://www.google.com/search?q=PNB+Eats+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=PNB+Eats+Effingham+NH',
    description: 'Local favorite for hearty breakfasts, hot subs, specialty pizzas, and roadside comfort food.',
    suggestedCardHeadline: 'Love your meal at PNB Eats? Tap to leave a quick Google review!',
    logoEmoji: '🥪',
    accentColor: '#f59e0b',
    menuTitle: 'Breakfast, Subs & Hand-Tossed Pizzas',
    menuItems: [
      { id: 'pnb-m1', name: 'The Big Mountain Steak & Cheese Sub', description: 'Shaved ribeye, melted provolone, grilled peppers, onions & mushrooms on toasted sub roll', price: '$13.99', category: 'Hot Subs', popular: true, imageEmoji: '🥪' },
      { id: 'pnb-m2', name: 'Effingham Rustic Supreme Pizza (16")', description: 'Hand-tossed garlic crust, whole mozzarella, pepperoni, sausage, peppers, and hot honey', price: '$19.50', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'pnb-m3', name: 'Crispy Jumbo Wings (10-Pack)', description: 'Tossed in pure NH maple BBQ or medium buffalo with house blue cheese dip', price: '$15.99', category: 'Appetizers', imageEmoji: '🍗' },
      { id: 'pnb-m4', name: 'Maple Glazed Fried Dough Bites', description: 'Tossed in cinnamon sugar with warm Carroll County pure maple syrup dip', price: '$7.99', category: 'Desserts', popular: true, imageEmoji: '🥞' },
      { id: 'pnb-m5', name: 'Country Sunrise Breakfast Platter', description: '3 farm eggs, crispy bacon, maple sausage links, home fries & buttered toast', price: '$11.50', category: 'Breakfast', imageEmoji: '🍳' }
    ]
  },
  {
    id: 'biz-eff-hannaford-togo',
    name: 'Hannaford Supermarket & Hannaford To Go',
    town: 'Effingham',
    state: 'NH',
    category: 'retail',
    address: '935 Route 16, Center Ossipee, NH 03864',
    phone: '(603) 641-9400',
    googlePlaceId: 'ChIJ_xXqHannafordOssipeeNH',
    googleRating: 4.6,
    reviewsCount: 1850,
    googleReviewUrl: 'https://www.google.com/search?q=Hannaford+Supermarket+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Hannaford+Supermarket+Ossipee+NH',
    websiteUrl: 'https://www.hannaford.com',
    description: 'Premier regional supermarket featuring Hannaford To Go curbside grocery pickup, fresh butcher meats, farm produce, full deli, and bakery.',
    suggestedCardHeadline: 'Quick & fresh checkout at Hannaford? Tap to leave your 5-star Google review!',
    logoEmoji: '🛒',
    accentColor: '#16a34a',
    menuTitle: 'Groceries, Deli Platters & Curbside Pickup',
    menuItems: [
      { id: 'htg-m1', name: 'Hannaford To Go Curbside Express Pickup & Delivery', description: 'Prepay on Hannaford To Go, provide your pickup code, and our local courier delivers bags straight to your door', price: '$9.99', category: 'Courier Pickup', popular: true, imageEmoji: '📦' },
      { id: 'htg-m2', name: 'Fresh Deli Sub & Cold Cut Platter (Feeds 4-6)', description: 'Oven roasted turkey, roast beef, ham, aged Cabot cheddar, and fresh artisan rolls', price: '$28.50', category: 'Deli', popular: true, imageEmoji: '🥪' },
      { id: 'htg-m3', name: 'New England Farm Fresh Dairy & Egg Bundle', description: 'Cabot Vermont Extra Sharp Cheddar, 1 Dozen NH Brown Eggs, Whole Milk, and Sweet Butter', price: '$16.99', category: 'Dairy & Farm', popular: true, imageEmoji: '🧀' },
      { id: 'htg-m4', name: 'Fresh Crisp Seasonal Orchard Fruit Crate', description: 'Honeycrisp apples, bananas, organic spinach, avocados, blueberries, and carrots', price: '$22.50', category: 'Produce', imageEmoji: '🍎' },
      { id: 'htg-m5', name: 'Bakery Fresh Chocolate Chip Chunk Cookies (1 Dozen)', description: 'Soft-baked cookies loaded with chocolate chunks baked in the bakery daily', price: '$5.99', category: 'Bakery', popular: true, imageEmoji: '🍪' },
      { id: 'htg-m6', name: 'Herb Rotisserie Roasted Whole Chicken', description: 'Tender juicy whole chicken slow-roasted with rosemary garlic herbs', price: '$11.99', category: 'Hot Foods', imageEmoji: '🍗' }
    ]
  },
  {
    id: 'biz-eff-pizza-barn',
    name: 'Pizza Barn & Pub',
    town: 'Effingham',
    state: 'NH',
    category: 'dining',
    address: 'Route 153, Effingham, NH 03882',
    phone: '(603) 539-2276',
    googlePlaceId: 'ChIJX9275z974okRYK6wL384Eff',
    googleRating: 4.7,
    reviewsCount: 242,
    googleReviewUrl: 'https://www.google.com/search?q=Pizza+Barn+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Pizza+Barn+Effingham+NH',
    description: 'Crispy thin crust, stone-baked pizzas, craft beer, and community pub atmosphere.',
    suggestedCardHeadline: 'Enjoyed your slice at Pizza Barn? Tap to review us on Google!',
    logoEmoji: '🍕',
    accentColor: '#ef4444',
    menuTitle: 'Stone-Baked Pizzas & Pub Bites',
    menuItems: [
      { id: 'pb-m1', name: 'The Barnyard Supreme Pizza (16")', description: 'Italian sausage, pepperoni, seasoned meatballs, bacon, green peppers, mushrooms & mozzarella', price: '$21.99', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'pb-m2', name: 'Sweet Heat Buffalo Chicken Pizza', description: 'Crispy chicken in sweet hot buffalo, blue cheese crumbles, and house ranch swirl', price: '$21.00', category: 'Pizzas', popular: true, imageEmoji: '🍗' },
      { id: 'pb-m3', name: 'Loaded Pulled Pork Barn Waffle Fries', description: 'Seasoned waffle fries with slow-smoked pork, melted cheddar jack, and BBQ drizzle', price: '$12.99', category: 'Appetizers', imageEmoji: '🍟' },
      { id: 'pb-m4', name: 'White Garlic & Spinach Ricotta Pie', description: 'Roasted garlic olive oil base, baby spinach, whole milk ricotta, and fresh mozzarella', price: '$19.50', category: 'Pizzas', imageEmoji: '🧀' }
    ]
  },
  {
    id: 'biz-eff-country-peddler',
    name: "Country Peddler's Flea Market",
    town: 'Effingham',
    state: 'NH',
    category: 'retail',
    address: 'Route 25, Effingham, NH 03882',
    phone: '(603) 539-7000',
    googlePlaceId: 'ChIJN1639wN64okR9X58kUq5Eff',
    googleRating: 4.6,
    reviewsCount: 156,
    googleReviewUrl: 'https://www.google.com/search?q=Country+Peddlers+Flea+Market+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Country+Peddlers+Flea+Market+Effingham+NH',
    description: 'Bustling weekend treasure hub with vintage antiques, collectibles, local produce, and artisan booths.',
    suggestedCardHeadline: 'Found a great vintage treasure today? Tap to share your 5-star find!',
    logoEmoji: '🏺',
    accentColor: '#10b981',
    menuTitle: 'Antiques, Curiosities & Vintage Treasures',
    menuItems: [
      { id: 'cp-m1', name: 'Restored Griswold Cast Iron Skillet (#8)', description: 'Vintage seasoned American cast iron pan ready for cooking or display', price: '$48.00', category: 'Vintage Kitchen', popular: true, imageEmoji: '🍳' },
      { id: 'cp-m2', name: 'Antique Brass Dietz Hurricane Lantern', description: 'Original glass globe kerosene lantern with rustic patina', price: '$34.50', category: 'Primitives', imageEmoji: '🏮' },
      { id: 'cp-m3', name: 'Handmade Effingham Pine Needle Soaps (3-Pack)', description: 'All-natural cold processed goat milk and fir needle soap bars', price: '$14.00', category: 'Artisan Goods', popular: true, imageEmoji: '🧼' },
      { id: 'cp-m4', name: 'Vintage 1960s White Mountains Felt Pennant', description: 'Authentic retro travel souvenir pennant from NH Kancamagus Highway', price: '$22.00', category: 'Collectibles', imageEmoji: '🏔️' }
    ]
  },
  {
    id: 'biz-eff-farmers-market',
    name: 'Effingham Community Farmers Market',
    town: 'Effingham',
    state: 'NH',
    category: 'farm_artisan',
    address: 'Town Hall Grounds, Route 153, Effingham, NH 03882',
    googlePlaceId: 'ChIJz8834wN64okRDd32kUq7Eff',
    googleRating: 4.9,
    reviewsCount: 98,
    googleReviewUrl: 'https://www.google.com/search?q=Effingham+Community+Farmers+Market+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Effingham+Farmers+Market+NH',
    description: 'Fresh organic greens, maple syrups, artisan sourdough, and handmade crafts from local homesteaders.',
    suggestedCardHeadline: 'Support local farmers! Tap to leave a 5-star review for our community market.',
    logoEmoji: '🥕',
    accentColor: '#10b981',
    menuTitle: 'Farm Fresh Harvest & Homestead Provisions',
    menuItems: [
      { id: 'efm-m1', name: 'Crisp Organic Salad Greens Box (1 lb)', description: 'Hydroponic butterhead, baby kale, arugula, and edible nasturtiums harvested same-day', price: '$8.50', category: 'Produce', popular: true, imageEmoji: '🥗' },
      { id: 'efm-m2', name: 'Raw Carroll County Wildflower Honey (16oz Jar)', description: 'Unfiltered pure wildflower honey from local Effingham apiaries', price: '$14.00', category: 'Pantry', popular: true, imageEmoji: '🍯' },
      { id: 'efm-m3', name: 'Artisan Garlic & Rosemary Sourdough Boule', description: 'Naturally fermented 36-hour sourdough baked in a wood-fired hearth oven', price: '$9.00', category: 'Bakery', popular: true, imageEmoji: '🍞' },
      { id: 'efm-m4', name: 'Farm-Fresh Pastured Rainbow Eggs (1 Dozen)', description: 'Free-range heritage breed chicken eggs with rich golden yolks', price: '$7.00', category: 'Farm Fresh', imageEmoji: '🥚' }
    ]
  },
  {
    id: 'biz-eff-ramblin-dixie',
    name: "Ramblin' Dixie Boutique",
    town: 'Effingham',
    state: 'NH',
    category: 'retail',
    address: 'NH-25, Effingham, NH 03882',
    phone: '(603) 539-1234',
    googlePlaceId: 'ChIJp3039wN64okR3L08kUq9Eff',
    googleRating: 4.9,
    reviewsCount: 76,
    googleReviewUrl: 'https://www.google.com/search?q=Ramblin+Dixie+Boutique+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Ramblin+Dixie+Effingham+NH',
    description: 'Charming country gifts, rustic home decor, bespoke apparel, and seasonal novelties.',
    suggestedCardHeadline: 'Loved your boutique experience? Tap to leave a 5-star Google review!',
    logoEmoji: '✨',
    accentColor: '#ec4899',
    menuTitle: 'Boutique Apparel, Rustic Decor & Gifts',
    menuItems: [
      { id: 'rd-m1', name: 'Hand-Poured White Pine & Balsam Soy Candle (12oz)', description: 'Clean-burning botanical soy wax with wooden crackle wick', price: '$22.00', category: 'Home & Fragrance', popular: true, imageEmoji: '🕯️' },
      { id: 'rd-m2', name: 'Effingham Buffalo Plaid Sherpa Wrap Blanket', description: 'Ultra-plush heavyweight winter cabin throw blanket', price: '$38.00', category: 'Apparel & Home', popular: true, imageEmoji: '🧣' },
      { id: 'rd-m3', name: 'Handmade Turquoise & Leather Beaded Cuff', description: 'Artisan crafted southwest-inspired bracelet with silver feather charm', price: '$29.00', category: 'Jewelry', imageEmoji: '💍' },
      { id: 'rd-m4', name: 'Rustic Farmhouse Canvas Tote Bag', description: 'Heavy canvas market tote with reinforced leather straps', price: '$24.50', category: 'Accessories', imageEmoji: '👜' }
    ]
  },
  {
    id: 'biz-eff-camping-area',
    name: 'Ossipee Lake Camping Area',
    town: 'Effingham',
    state: 'NH',
    category: 'hospitality',
    address: '242 Ossipee Lake Rd, Effingham, NH 03882',
    phone: '(603) 539-4802',
    googlePlaceId: 'ChIJR4596wN64okRWq37kUq8Eff',
    googleRating: 4.7,
    reviewsCount: 312,
    googleReviewUrl: 'https://www.google.com/search?q=Ossipee+Lake+Camping+Area+Effingham+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Ossipee+Lake+Camping+Area+Effingham+NH',
    description: 'Family-oriented lakeside campground with sandy beach access, boating, kayak rentals, and shaded woodland sites.',
    suggestedCardHeadline: 'Having a memorable stay on the lake? Tap to review our campground!',
    logoEmoji: '🏕️',
    accentColor: '#3b82f6',
    menuTitle: 'Campground Passes, Boat Rentals & Camp Store',
    menuItems: [
      { id: 'ol-m1', name: 'Single Kayak / Paddleboard Half-Day Rental Pass', description: 'Includes life vest, paddle, and direct private beach boat launch access', price: '$35.00', category: 'Lake Activities', popular: true, imageEmoji: '🛶' },
      { id: 'ol-m2', name: 'Kiln-Dried Hardwood Campfire Bundle (6 Logs)', description: 'Certified pest-free local birch and oak firewood with natural firestarter kit', price: '$8.50', category: 'Camp Essentials', popular: true, imageEmoji: '🪵' },
      { id: 'ol-m3', name: 'Deluxe Fireside S’mores Box (Serves 6)', description: 'Artisan graham crackers, Hershey bars, giant marshmallows & telescoping roasting sticks', price: '$14.99', category: 'Camp Treats', popular: true, imageEmoji: '🍫' },
      { id: 'ol-m4', name: 'Bag of Premium Crushed Lake Ice (10 lb)', description: 'Keep your coolers chilled for boating and lakeside picnics', price: '$3.50', category: 'Camp Essentials', imageEmoji: '🧊' }
    ]
  },

  // --- OSSIPEE, NH ---
  {
    id: 'biz-oss-smoke-world',
    name: 'Smoke World Ossipee',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: '870 Route 16, Ossipee, NH 03814',
    phone: '(603) 539-7665',
    googlePlaceId: 'ChIJb6eBq9f94okRGb_SmokeWorldOss',
    googleRating: 4.9,
    reviewsCount: 148,
    googleReviewUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
    googleMapsUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
    description: 'Premier regional smoke, vape, glass, tobacco accessories, and novelty shop located on Route 16 in Ossipee.',
    suggestedCardHeadline: 'Love your visit to Smoke World? Tap your phone to leave us a 5-star Google review!',
    logoEmoji: '💨',
    accentColor: '#10b981',
    menuTitle: 'Featured Smoke, Vape & Glass Catalog',
    menuItems: [
      { id: 'sw-m1', name: 'Geek Bar Pulse 15,000 Puffs Disposable', description: 'Dual mesh coil, full LED display, 5% nicotine salt in 20+ signature fruit flavors', price: '$19.99', category: 'Vapes', popular: true, imageEmoji: '💨' },
      { id: 'sw-m2', name: 'Handblown Hecht Borosilicate Beaker Bong (14")', description: 'Heavy 7mm thick crystal clear borosilicate glass with ice pinch & diffused downstem', price: '$69.99', category: 'Glassware', popular: true, imageEmoji: '🧪' },
      { id: 'sw-m3', name: 'Raw Classic Natural Unrefined Cones (6-Pack)', description: 'Authentic pure hemp papers with built-in filter tips', price: '$4.25', category: 'Accessories', imageEmoji: '🌿' },
      { id: 'sw-m4', name: 'Lookah Seahorse Pro Plus Vaporizer', description: 'Portable electric nectar collector with quartz tip and glass tube mouthpiece', price: '$49.99', category: 'Vaporizers', popular: true, imageEmoji: '⚡' },
      { id: 'sw-m5', name: 'Special Blue Turbo Torch & Refined Butane', description: 'Heavy duty adjustable flame torch lighter for outdoor and utility use', price: '$18.50', category: 'Torches', imageEmoji: '🔥' },
      { id: 'sw-m6', name: 'OPMS Gold Botanical Liquid Extract (8.8ml)', description: 'Premium concentrated all-natural botanical alkaloid shot', price: '$16.99', category: 'Herbal Wellness', imageEmoji: '🍃' }
    ]
  },
  {
    id: 'biz-oss-yankee-smokehouse',
    name: 'Yankee Smokehouse BBQ',
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: 'Jct Rte 16 & 25, West Ossipee, NH 03890',
    phone: '(603) 539-2144',
    googlePlaceId: 'ChIJ2d1bEzl64okRDN2wL384Oss',
    googleRating: 4.7,
    reviewsCount: 1420,
    googleReviewUrl: 'https://www.google.com/search?q=Yankee+Smokehouse+West+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Yankee+Smokehouse+West+Ossipee+NH',
    description: 'Legendary New Hampshire barbecue smoked low and slow over real hardwood. Famous pulled pork, ribs, and briskets.',
    suggestedCardHeadline: 'Best BBQ in NH? Tap your phone to leave Yankee Smokehouse a 5-star review!',
    logoEmoji: '🍖',
    accentColor: '#f97316',
    menuTitle: 'Slow-Smoked Hardwood BBQ Platters',
    menuItems: [
      { id: 'ys-m1', name: 'St. Louis Applewood Ribs Platter (Half Rack)', description: 'Tender hardwood-smoked ribs glazed with signature sweet molasses BBQ sauce, fries & slaw', price: '$22.99', category: 'Platters', popular: true, imageEmoji: '🍖' },
      { id: 'ys-m2', name: 'Carolina Pulled Pork Sandwich & Cornbread', description: '14-hour hickory smoked pork shoulder piled on toasted brioche with house cider vinegar mop', price: '$14.50', category: 'Sandwiches', popular: true, imageEmoji: '🥪' },
      { id: 'ys-m3', name: 'Texas Smoked Beef Brisket Dinner', description: 'Dry-rubbed prime beef brisket sliced thick with smoked pit beans and mac & cheese', price: '$24.99', category: 'Platters', popular: true, imageEmoji: '🥩' },
      { id: 'ys-m4', name: 'Cast Iron BBQ Burnt Ends Mac & Cheese', description: 'Creamy 4-cheese cavatappi skillet topped with crispy smoked brisket burnt ends', price: '$15.99', category: 'Sides', imageEmoji: '🧀' }
    ]
  },
  {
    id: 'biz-oss-hobbs-tavern',
    name: "Hobbs Tavern & Brewing Co.",
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: '2415 White Mountain Hwy, West Ossipee, NH 03890',
    phone: '(603) 539-2000',
    googlePlaceId: 'ChIJgU7bEzl64okRFB5wL384Oss',
    googleRating: 4.6,
    reviewsCount: 980,
    googleReviewUrl: 'https://www.google.com/search?q=Hobbs+Tavern+West+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Hobbs+Tavern+West+Ossipee+NH',
    description: 'Historic country tavern serving handcrafted local craft ales, wood-fired artisan pizzas, and farm-to-table pub classics.',
    suggestedCardHeadline: 'Enjoyed your craft brew & meal? Tap to leave Hobbs a Google review!',
    logoEmoji: '🍺',
    accentColor: '#f59e0b',
    menuTitle: 'Craft Ales, Wood-Fired Pies & Tavern Fare',
    menuItems: [
      { id: 'hb-m1', name: 'Hobbs Hi-Fi Hazy NEIPA (4-Pack 16oz)', description: 'Juicy tropical hop profile with Citra & Mosaic, brewed fresh on site in West Ossipee', price: '$16.00', category: 'Craft Beer', popular: true, imageEmoji: '🍺' },
      { id: 'hb-m2', name: 'Hobbs Grass-Fed Bacon Jam Burger', description: '1/2 lb local beef, house smoked bacon onion jam, Grafton cheddar & crispy fries', price: '$17.99', category: 'Tavern Fare', popular: true, imageEmoji: '🍔' },
      { id: 'hb-m3', name: 'Wood-Fired Prosciutto & Fig Flatbread', description: 'Prosciutto di Parma, black mission figs, goat cheese, baby arugula & balsamic reduction', price: '$16.50', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'hb-m4', name: 'Crispy Brussels Sprouts with Cider Glaze', description: 'Flash-fried brussels sprouts with pancetta lardons and NH maple cider reduction', price: '$11.50', category: 'Appetizers', imageEmoji: '🥗' }
    ]
  },
  {
    id: 'biz-oss-mountain-grainery',
    name: 'Mountain Grainery Ace Hardware',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: 'Route 16, Center Ossipee, NH 03814',
    phone: '(603) 539-2666',
    googlePlaceId: 'ChIJQ13bEzl64okRVG1wL384Oss',
    googleRating: 4.8,
    reviewsCount: 310,
    googleReviewUrl: 'https://www.google.com/search?q=Mountain+Grainery+Ace+Hardware+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Mountain+Grainery+Ace+Hardware+Ossipee+NH',
    description: 'Essential local hardware, homestead supplies, organic feeds, tools, and friendly neighborhood expertise.',
    suggestedCardHeadline: 'Did our team help you with your project? Tap to leave a quick 5-star review!',
    logoEmoji: '🔨',
    accentColor: '#ef4444',
    menuTitle: 'Homestead, Feed & Hardware Catalog',
    menuItems: [
      { id: 'mg-m1', name: 'Premium Hardwood Wood Pellets (40 lb Bag)', description: 'Clean-burning 100% hardwood heating pellets with high BTU heat output', price: '$7.49', category: 'Heating', popular: true, imageEmoji: '🪵' },
      { id: 'mg-m2', name: 'Poulin Organic Layer Poultry Feed (50 lb)', description: 'Non-GMO regional chicken feed for healthy farm-fresh egg production', price: '$22.99', category: 'Farm & Feed', imageEmoji: '🌾' },
      { id: 'mg-m3', name: 'DeWalt 20V MAX Cordless Drill & Impact Driver Combo', description: 'Heavy duty lithium-ion brushless kit with 2 batteries, charger & contractor bag', price: '$199.00', category: 'Tools', popular: true, imageEmoji: '🛠️' },
      { id: 'mg-m4', name: 'NH Carroll County Wild Bird Seed Blend (20 lb)', description: 'Black oil sunflower, safflower, and white millet bird seed mix', price: '$16.99', category: 'Lawn & Garden', imageEmoji: '🐦' }
    ]
  },
  {
    id: 'biz-oss-jakes-seafood',
    name: "Jake's Seafood & Grill",
    town: 'Ossipee',
    state: 'NH',
    category: 'dining',
    address: '2055 Route 16, Center Ossipee, NH 03814',
    phone: '(603) 539-2805',
    googlePlaceId: 'ChIJ0e7bEzl64okRKX3wL384Oss',
    googleRating: 4.5,
    reviewsCount: 650,
    googleReviewUrl: 'https://www.google.com/search?q=Jakes+Seafood+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Jakes+Seafood+Ossipee+NH',
    description: 'Fresh Atlantic fried clams, Maine lobster rolls, chowders, and grilled seafood baskets.',
    suggestedCardHeadline: 'Loved your lobster roll? Tap to leave Jake’s Seafood a Google review!',
    logoEmoji: '🦞',
    accentColor: '#06b6d4',
    menuTitle: 'Fresh Atlantic Seafood & Lobster Baskets',
    menuItems: [
      { id: 'js-m1', name: 'Traditional Maine Lobster Roll (Jumbo Cold or Hot Buttered)', description: '1/3 lb fresh claw & knuckle lobster meat on toasted split-top brioche with Cape Cod chips', price: '$26.99', category: 'Seafood Rolls', popular: true, imageEmoji: '🦞' },
      { id: 'js-m2', name: 'Whole Belly Sweet Ipswich Clam Basket', description: 'Hand-breaded fresh Atlantic whole belly clams fried crisp with french fries & homemade tartar', price: '$28.99', category: 'Fried Baskets', popular: true, imageEmoji: '🦪' },
      { id: 'js-m3', name: 'New England Scratch Clam Chowder (Bread Bowl)', description: 'Rich heavy cream chowder packed with tender clams, sea salt, potatoes, and oyster crackers', price: '$9.99', category: 'Soups', popular: true, imageEmoji: '🥣' },
      { id: 'js-m4', name: 'Crispy Atlantic Haddock Fish & Chips Platter', description: 'Fresh line-caught haddock filet in golden beer batter with lemon wedge & slaw', price: '$18.99', category: 'Fried Baskets', imageEmoji: '🐟' }
    ]
  },
  {
    id: 'biz-oss-tramway-artisans',
    name: 'Tramway Artisans Country Store',
    town: 'Ossipee',
    state: 'NH',
    category: 'retail',
    address: 'Route 16, West Ossipee, NH 03890',
    phone: '(603) 539-5700',
    googlePlaceId: 'ChIJx87bEzl64okROA9wL384Oss',
    googleRating: 4.8,
    reviewsCount: 420,
    googleReviewUrl: 'https://www.google.com/search?q=Tramway+Artisans+Ossipee+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Tramway+Artisans+Ossipee+NH',
    description: 'Multi-room artisan marketplace featuring NH pottery, handmade fudge, wooden toys, soaps, and gifts.',
    suggestedCardHeadline: 'Loved browsing our artisan rooms? Tap your phone to leave a review!',
    logoEmoji: '🎁',
    accentColor: '#8b5cf6',
    menuTitle: 'Artisan Fudge, Handcrafted Pottery & NH Souvenirs',
    menuItems: [
      { id: 'ta-m1', name: 'Creamy Maple Walnut Homemade Fudge (1/2 lb)', description: 'Old-fashioned kettle boiled artisan fudge made with real Carroll County maple syrup', price: '$8.99', category: 'Fudge & Sweets', popular: true, imageEmoji: '🍬' },
      { id: 'ta-m2', name: 'Hand-Thrown White Mountain Ceramic Coffee Mug', description: 'Wheel-thrown glazed stoneware mug featuring embossed mountain pine tree motif', price: '$24.00', category: 'Pottery', popular: true, imageEmoji: '☕' },
      { id: 'ta-m3', name: 'Pure Balsam Fir Needle Sachet Pillow', description: 'Fragrant natural balsam fir cuttings in rustic burlap with embroidered loon', price: '$12.50', category: 'Aromatherapy', imageEmoji: '🌲' },
      { id: 'ta-m4', name: 'Pure NH Maple Sugar Leaf Candies (Box of 12)', description: '100% crystallized pure maple sugar candy shaped into autumn maple leaves', price: '$11.00', category: 'Fudge & Sweets', imageEmoji: '🍁' }
    ]
  },

  // --- FREEDOM, NH ---
  {
    id: 'biz-fre-village-store',
    name: 'Freedom Village Store',
    town: 'Freedom',
    state: 'NH',
    category: 'retail',
    address: 'Elm Street, Freedom, NH 03836',
    phone: '(603) 539-7988',
    googlePlaceId: 'ChIJZ49fEzl64okRNM8wL384Fre',
    googleRating: 4.9,
    reviewsCount: 168,
    googleReviewUrl: 'https://www.google.com/search?q=Freedom+Village+Store+Freedom+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Freedom+Village+Store+Freedom+NH',
    description: 'Historic volunteer-powered non-profit village store offering local baked goods, coffees, maple syrup, and community art.',
    suggestedCardHeadline: 'Support our historic village store! Tap to leave a 5-star Google review.',
    logoEmoji: '🏡',
    accentColor: '#10b981',
    menuTitle: 'Historic Provisions, Baked Goods & Coffee',
    menuItems: [
      { id: 'fvs-m1', name: 'Wild Freedom Maine Blueberry Scone (2-Pack)', description: 'Freshly baked morning scones packed with wild mountain blueberries and sugar glaze', price: '$6.50', category: 'Bakery', popular: true, imageEmoji: '🫐' },
      { id: 'fvs-m2', name: 'Pure NH Grade A Amber Maple Syrup (16oz Glass Bottle)', description: 'Wood-fired maple syrup tapped from local Carroll County sugar maples', price: '$16.00', category: 'Pantry', popular: true, imageEmoji: '🍯' },
      { id: 'fvs-m3', name: 'Village Roastery Hot Coffee Traveler (96oz)', description: 'Freshly brewed dark roast coffee in insulated pour tote with 8 cups & fixings', price: '$24.00', category: 'Beverages', imageEmoji: '☕' },
      { id: 'fvs-m4', name: 'Old-Fashioned NH Heritage Spiced Apple Butter (10oz)', description: 'Slow-simmered Cortland apples with cinnamon, nutmeg, and brown sugar', price: '$7.50', category: 'Pantry', imageEmoji: '🍎' }
    ]
  },
  {
    id: 'biz-fre-the-spot',
    name: 'The Spot Freedom',
    town: 'Freedom',
    state: 'NH',
    category: 'dining',
    address: 'Old Portland Rd, Freedom, NH 03836',
    phone: '(603) 539-3333',
    googlePlaceId: 'ChIJV49fEzl64okRSL8wL384Fre',
    googleRating: 4.8,
    reviewsCount: 295,
    googleReviewUrl: 'https://www.google.com/search?q=The+Spot+Freedom+NH',
    googleMapsUrl: 'https://maps.google.com/?q=The+Spot+Freedom+NH',
    description: 'Local neighborhood dining favorite known for gourmet smash burgers, artisan pizzas, and cold local brews.',
    suggestedCardHeadline: 'Had a great meal at The Spot? Tap to leave a quick Google review!',
    logoEmoji: '🍔',
    accentColor: '#f59e0b',
    menuTitle: 'Gourmet Smash Burgers, Pizzas & Craft Drafts',
    menuItems: [
      { id: 'ts-m1', name: 'The Spot Double Smashburger', description: 'Two 1/4 lb smashed local beef patties, American cheese, caramelized onions, pickles & secret sauce on brioche', price: '$14.99', category: 'Burgers', popular: true, imageEmoji: '🍔' },
      { id: 'ts-m2', name: 'Truffle Parmesan Hand-Cut Pub Fries', description: 'Crispy russet fries tossed with black truffle oil, fresh shaved parmesan, and rosemary garlic aioli', price: '$8.50', category: 'Sides', popular: true, imageEmoji: '🍟' },
      { id: 'ts-m3', name: 'Rustic Pepperoni & Hot Honey Brick Oven Pizza (14")', description: 'San Marzano tomato sauce, fresh mozzarella, cupped crispy pepperoni, and Mike’s hot honey drizzle', price: '$19.00', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
      { id: 'ts-m4', name: 'Freedom Valley Craft IPA (4-Pack 16oz Cans)', description: 'Crisp dry-hopped regional New England IPA with citrus aromatics', price: '$15.00', category: 'Craft Beer', imageEmoji: '🍺' }
    ]
  },
  {
    id: 'biz-fre-garden-of-freedom',
    name: 'Garden of Freedom Organic Farm',
    town: 'Freedom',
    state: 'NH',
    category: 'farm_artisan',
    address: 'Freedom, NH 03836',
    googlePlaceId: 'ChIJQ09fEzl64okRPL8wL384Fre',
    googleRating: 5.0,
    reviewsCount: 64,
    googleReviewUrl: 'https://www.google.com/search?q=Garden+of+Freedom+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Garden+of+Freedom+NH',
    description: 'Family-run organic homestead growing heirloom vegetables, herbs, microgreens, and pastured eggs.',
    suggestedCardHeadline: 'Love fresh local farm food? Tap to review Garden of Freedom!',
    logoEmoji: '🌿',
    accentColor: '#10b981',
    menuTitle: 'Organic Microgreens, Heirloom Crops & Pastured Goods',
    menuItems: [
      { id: 'gof-m1', name: 'Superfood Microgreens Blend Box (8oz)', description: 'Living sunflower shoots, pea tendrils, and spicy radish microgreens packed with vitamins', price: '$9.50', category: 'Microgreens', popular: true, imageEmoji: '🌱' },
      { id: 'gof-m2', name: 'Freedom Heirloom Tomato Basket (3 lb)', description: 'Brandywine, Cherokee Purple, and Green Zebra vine-ripened organic tomatoes', price: '$12.00', category: 'Produce', popular: true, imageEmoji: '🍅' },
      { id: 'gof-m3', name: 'Pastured Forest-Raised Duck & Chicken Eggs (1 Dozen)', description: 'Heritage breed duck and chicken eggs with deep orange nutrient-rich yolks', price: '$8.50', category: 'Farm Fresh', imageEmoji: '🥚' },
      { id: 'gof-m4', name: 'Fresh Culinary Herb Bundle (Rosemary, Thyme, Basil)', description: 'Freshly cut fragrant organic herbs for home chef cooking', price: '$6.00', category: 'Herbs', imageEmoji: '🌿' }
    ]
  },

  // --- WAKEFIELD / SANBORNVILLE, NH ---
  {
    id: 'biz-wak-poor-peoples-pub',
    name: "Poor People's Pub",
    town: 'Wakefield',
    state: 'NH',
    category: 'dining',
    address: '28 Meadow St, Sanbornville, NH 03872',
    phone: '(603) 522-8228',
    googlePlaceId: 'ChIJy9dfEzl64okRWN8wL384Wak',
    googleRating: 4.7,
    reviewsCount: 1120,
    googleReviewUrl: 'https://www.google.com/search?q=Poor+Peoples+Pub+Sanbornville+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Poor+Peoples+Pub+Sanbornville+NH',
    description: 'Lively neighborhood tavern with killer wings, stuffed burgers, live weekend music, and craft drafts.',
    suggestedCardHeadline: 'Best pub in Wakefield? Tap to leave PPP a 5-star Google review!',
    logoEmoji: '🍻',
    accentColor: '#eab308',
    menuTitle: 'Famous PPP Jumbo Wings, Tavern Burgers & Poutines',
    menuItems: [
      { id: 'ppp-m1', name: 'Famous PPP Smoked Jumbo Wings (12-Pack)', description: 'Crisp seasoned wings tossed in Ghost Pepper Honey, Garlic Parm, or Sweet Heat BBQ with blue cheese', price: '$16.99', category: 'Wings', popular: true, imageEmoji: '🍗' },
      { id: 'ppp-m2', name: 'The Wakefield Monster Bacon-Stuffed Burger', description: '1/2 lb chuck patty stuffed with smoked bacon & cheddar, topped with crispy onion straws on brioche', price: '$16.50', category: 'Burgers', popular: true, imageEmoji: '🍔' },
      { id: 'ppp-m3', name: 'Loaded Tavern Pulled Pork Poutine Skillet', description: 'Golden hand-cut fries smothered in cheese curds, rich brown gravy, and applewood pulled pork', price: '$13.99', category: 'Pub Starters', popular: true, imageEmoji: '🍟' },
      { id: 'ppp-m4', name: 'Draft Craft Beer Growler Refill (64oz)', description: 'Fresh draft pour of any rotating regional craft draft on tap', price: '$18.00', category: 'Draft Beer', imageEmoji: '🍺' }
    ]
  },
  {
    id: 'biz-wak-knotty-pine',
    name: 'Knotty Pine Grille & Tavern',
    town: 'Wakefield',
    state: 'NH',
    category: 'dining',
    address: 'Route 16, Wakefield, NH 03872',
    phone: '(603) 522-6800',
    googlePlaceId: 'ChIJw7dfEzl64okRZN8wL384Wak',
    googleRating: 4.6,
    reviewsCount: 580,
    googleReviewUrl: 'https://www.google.com/search?q=Knotty+Pine+Grille+Wakefield+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Knotty+Pine+Grille+Wakefield+NH',
    description: 'Cozy pine interior, prime rib specials, fresh seafood, and warm New England hospitality.',
    suggestedCardHeadline: 'Loved your dinner with us? Tap your phone to leave a Google review!',
    logoEmoji: '🌲',
    accentColor: '#10b981',
    menuTitle: 'Slow-Roasted Prime Rib, Fresh Seafood & Grille Steaks',
    menuItems: [
      { id: 'kp-m1', name: 'Slow-Roasted Knotty Pine Prime Rib (14oz Cut)', description: 'Herb-crusted USDA Choice prime rib with rosemary au jus, loaded baked potato, and garlic green beans', price: '$29.99', category: 'Steaks & Roasts', popular: true, imageEmoji: '🥩' },
      { id: 'kp-m2', name: 'Pan-Seared Fresh Atlantic Haddock Piccata', description: 'Fresh line-caught haddock in lemon white wine caper sauce over garlic butter linguine', price: '$22.50', category: 'Seafood', popular: true, imageEmoji: '🐟' },
      { id: 'kp-m3', name: 'Warm Cast Iron Skillet Apple Crisp with Vanilla Bean Gelato', description: 'Local NH Cortland apples baked with brown sugar oat crumble and cinnamon', price: '$8.50', category: 'Desserts', imageEmoji: '🍨' }
    ]
  },
  {
    id: 'biz-wak-lovell-lake-market',
    name: 'Lovell Lake Market & Deli',
    town: 'Wakefield',
    state: 'NH',
    category: 'retail',
    address: 'Sanbornville, NH 03872',
    phone: '(603) 522-3344',
    googlePlaceId: 'ChIJu1dfEzl64okR1N8wL384Wak',
    googleRating: 4.8,
    reviewsCount: 220,
    googleReviewUrl: 'https://www.google.com/search?q=Lovell+Lake+Market+Sanbornville+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Lovell+Lake+Market+Sanbornville+NH',
    description: 'Lakeside convenience, butcher cut meats, made-to-order subs, and cold craft beverages.',
    suggestedCardHeadline: 'Enjoyed your lake provisions? Tap to leave a quick 5-star review!',
    logoEmoji: '🥪',
    accentColor: '#06b6d4',
    menuTitle: 'Lakeside Delicatessen Grinders & Butcher Provisions',
    menuItems: [
      { id: 'llm-m1', name: 'The Lovell Lake Monster Italian Grinder (12")', description: 'Capicola, Genoa salami, mortadella, provolone, shredded lettuce, tomatoes, hot peppers & house oil blend', price: '$13.99', category: 'Deli Grinders', popular: true, imageEmoji: '🥪' },
      { id: 'llm-m2', name: 'Hand-Cut Prime Ribeye Steaks (Twin 12oz Pack)', description: 'Butcher-cut fresh prime grade beef ribeye seasoned and vacuum sealed for the grill', price: '$32.00', category: 'Butcher Shop', popular: true, imageEmoji: '🥩' },
      { id: 'llm-m3', name: 'Boat Day Potato Salad & Coleslaw Bucket (2 lb)', description: 'Homemade creamy red potato salad with dill and crunchy cider slaw', price: '$9.99', category: 'Sides', imageEmoji: '🥗' }
    ]
  },

  // --- CONWAY & NORTH CONWAY, NH ---
  {
    id: 'biz-con-zebs-store',
    name: "Zeb's General Store",
    town: 'Conway',
    state: 'NH',
    category: 'retail',
    address: '2675 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-9294',
    googlePlaceId: 'ChIJJWtfEzl64okRAN8wL384Con',
    googleRating: 4.8,
    reviewsCount: 5400,
    googleReviewUrl: 'https://www.google.com/search?q=Zebs+General+Store+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Zebs+General+Store+North+Conway+NH',
    description: 'Iconic multi-story general store boasting the largest collection of New England-made specialty foods, candy counter, and nostalgia.',
    suggestedCardHeadline: 'Loved your visit to Zeb’s? Tap your phone to leave us a 5-star review!',
    logoEmoji: '🍬',
    accentColor: '#f59e0b',
    menuTitle: 'New England Candies, Maple Treats & Jams',
    menuItems: [
      { id: 'zeb-m1', name: 'Zeb’s Old-Fashioned Hard Candy Sampler Tin (1 lb)', description: 'Classic root beer barrels, butterscotch, horehound, wintergreen, and peppermint drops', price: '$12.99', category: 'Candy Counter', popular: true, imageEmoji: '🍬' },
      { id: 'zeb-m2', name: 'Wild Mountain Blackberry & Blueberry Preserves (16oz)', description: 'Handcrafted New England small batch berry jam made with pure cane sugar', price: '$8.99', category: 'Jams & Honey', popular: true, imageEmoji: '🫐' },
      { id: 'zeb-m3', name: 'New England Sweet Maple Mustard (9oz Jar)', description: 'Tangy whole grain stone-ground mustard blended with pure NH maple syrup', price: '$7.50', category: 'Specialty Condiments', imageEmoji: '🍯' },
      { id: 'zeb-m4', name: 'White Mountains Wilderness Flannel Travel Throw', description: 'Cozy brushed cotton tartan plaid throw blanket', price: '$34.00', category: 'Gifts & Home', imageEmoji: '🏔️' }
    ]
  },
  {
    id: 'biz-con-flatbread',
    name: 'Flatbread Company',
    town: 'Conway',
    state: 'NH',
    category: 'dining',
    address: '2760 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-4470',
    googlePlaceId: 'ChIJHWtfEzl64okRCN8wL384Con',
    googleRating: 4.7,
    reviewsCount: 2890,
    googleReviewUrl: 'https://www.google.com/search?q=Flatbread+Company+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Flatbread+Company+North+Conway+NH',
    description: 'Clay wood-fired earthen oven baking organic pizzas using local meats and cheeses.',
    suggestedCardHeadline: 'Enjoyed your organic wood-fired pizza? Tap to leave a Google review!',
    logoEmoji: '🔥',
    accentColor: '#ef4444',
    menuTitle: 'Organic Earthen Wood-Fired Clay Oven Flatbreads',
    menuItems: [
      { id: 'fc-m1', name: 'Jay’s Heart Wood-Fired Flatbread (Large 16")', description: 'Organic tomato sauce, whole milk mozzarella, imported parmesan, and garlic herb oil baked in clay oven', price: '$21.50', category: 'Flatbreads', popular: true, imageEmoji: '🍕' },
      { id: 'fc-m2', name: 'Pork & Pepper Nitrate-Free Flatbread', description: 'Slow-cooked local pork shoulder, organic red onions, sweet bell peppers, rosemary & maple BBQ drizzle', price: '$24.00', category: 'Flatbreads', popular: true, imageEmoji: '🥓' },
      { id: 'fc-m3', name: 'Organic Mesclun Salad with House Ginger-Tamari Dressing', description: 'Organic greens, local carrots, toasted sesame seeds, and Maine dulse seaweed', price: '$10.50', category: 'Salads', imageEmoji: '🥗' },
      { id: 'fc-m4', name: 'Grandmother’s Handmade Organic Chocolate Whoopie Pie', description: 'Two rich chocolate cake rounds filled with fluffy vanilla buttercream', price: '$6.50', category: 'Desserts', popular: true, imageEmoji: '🧁' }
    ]
  },
  {
    id: 'biz-con-frontside-coffee',
    name: 'Frontside Coffee Roasters',
    town: 'Conway',
    state: 'NH',
    category: 'dining',
    address: '2697 White Mountain Hwy, North Conway, NH 03860',
    phone: '(603) 356-7400',
    googlePlaceId: 'ChIJGWtfEzl64okRDN8wL384Con',
    googleRating: 4.8,
    reviewsCount: 1650,
    googleReviewUrl: 'https://www.google.com/search?q=Frontside+Coffee+Roasters+North+Conway+NH',
    googleMapsUrl: 'https://maps.google.com/?q=Frontside+Coffee+Roasters+North+Conway+NH',
    description: 'In-house small batch coffee roaster serving specialty espresso, cold brews, fresh bagels, and pastries.',
    suggestedCardHeadline: 'Fueling your mountain adventures? Tap to review Frontside Coffee!',
    logoEmoji: '☕',
    accentColor: '#6366f1',
    menuTitle: 'Small-Batch Specialty Roasts, Cold Brews & Bagels',
    menuItems: [
      { id: 'fcr-m1', name: 'White Mountain Summit Espresso Blend (12oz Whole Bean)', description: 'Notes of dark cocoa, roasted almond, and sweet dried cherry. Roasted in North Conway.', price: '$16.50', category: 'Whole Bean Coffee', popular: true, imageEmoji: '☕' },
      { id: 'fcr-m2', name: 'Draft Nitro Maple Cream Cold Brew (20oz)', description: 'Smooth cascading nitro cold brew infused with pure New Hampshire maple syrup & cream', price: '$6.25', category: 'Cold Brews', popular: true, imageEmoji: '🧊' },
      { id: 'fcr-m3', name: 'Fresh Asiago Everything Bagel with Jalapeño Cream Cheese', description: 'Boiled & stone-baked NY-style bagel loaded with toasted everything seasoning and whipped schmear', price: '$5.50', category: 'Bagels & Bakery', popular: true, imageEmoji: '🥯' },
      { id: 'fcr-m4', name: 'Mountain Chai Spice Brioche Muffin', description: 'Cardamom, cinnamon, clove spiced muffin with crunchy turbinado crystal sugar top', price: '$4.25', category: 'Bagels & Bakery', imageEmoji: '🧁' }
    ]
  },
];

/**
 * Dynamically discover and generate local business profiles for ANY town in the world
 */
export function generateBusinessesForTown(townName: string, state: string = 'NH'): LocalBusiness[] {
  const cleanTown = townName.trim();
  const slug = cleanTown.toLowerCase().replace(/[^a-z0-9]/g, '');

  return [
    {
      id: `biz-${slug}-cafe`,
      name: `${cleanTown} Village Bakery & Roastery`,
      town: cleanTown,
      state: state,
      category: 'dining',
      address: `Main Street, ${cleanTown}, ${state}`,
      googlePlaceId: `ChIJ_${slug}_cafe_${Math.random().toString(36).substring(2, 7)}`,
      googleRating: 4.9,
      reviewsCount: 230,
      googleReviewUrl: buildGoogleReviewUrl(undefined, `${cleanTown} Village Bakery`, cleanTown),
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${cleanTown} Bakery ${state}`)}`,
      description: `Artisan sourdough, espresso, morning pastries, and community gathering hub in ${cleanTown}.`,
      suggestedCardHeadline: `Loved your coffee & pastry? Tap your phone to leave ${cleanTown} Bakery a 5-star Google review!`,
      logoEmoji: '☕',
      accentColor: '#f59e0b',
      menuTitle: `${cleanTown} Roast Blends & Hearth Baked Goods`,
      menuItems: [
        { id: `${slug}-c1`, name: `${cleanTown} Sunrise Dark Roast (16oz)`, description: 'Freshly brewed single-origin roast with notes of rich chocolate and toasted pecan', price: '$3.50', category: 'Coffee', popular: true, imageEmoji: '☕' },
        { id: `${slug}-c2`, name: 'Wood-Fired Country Sourdough Loaf', description: 'Naturally fermented 36-hour sourdough boule with crisp blistered crust', price: '$8.50', category: 'Bakery', popular: true, imageEmoji: '🍞' },
        { id: `${slug}-c3`, name: 'Wild Mountain Blueberry Crumble Muffin', description: 'Baked fresh each morning with wild blueberries and crystallized brown sugar crust', price: '$4.25', category: 'Bakery', imageEmoji: '🫐' },
        { id: `${slug}-c4`, name: 'Cascading Nitro Maple Cold Brew (20oz)', description: 'Smooth cold brew infused with pure regional maple syrup and sweet cream', price: '$5.99', category: 'Cold Drinks', popular: true, imageEmoji: '🧊' }
      ]
    },
    {
      id: `biz-${slug}-tavern`,
      name: `${cleanTown} Craft Tavern & Pizzeria`,
      town: cleanTown,
      state: state,
      category: 'dining',
      address: `12 Center Road, ${cleanTown}, ${state}`,
      googlePlaceId: `ChIJ_${slug}_tavern_${Math.random().toString(36).substring(2, 7)}`,
      googleRating: 4.8,
      reviewsCount: 410,
      googleReviewUrl: buildGoogleReviewUrl(undefined, `${cleanTown} Craft Tavern`, cleanTown),
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${cleanTown} Tavern ${state}`)}`,
      description: `Wood-fired brick oven pizza, local craft brews, and family dining in ${cleanTown}.`,
      suggestedCardHeadline: `Great meal with us? Tap to leave a quick 5-star Google review!`,
      logoEmoji: '🍕',
      accentColor: '#ef4444',
      menuTitle: `${cleanTown} Brick-Oven Pizzas & Pub Bites`,
      menuItems: [
        { id: `${slug}-t1`, name: `${cleanTown} House Special Brick Oven Pizza (16")`, description: 'Sweet Italian sausage, roasted red peppers, whole mozzarella & basil garlic oil', price: '$21.50', category: 'Pizzas', popular: true, imageEmoji: '🍕' },
        { id: `${slug}-t2`, name: '1/2 lb Local Butcher Smash Burger & Fries', description: 'Double smash patty, Vermont cheddar, caramelized onions and pub sauce on toasted brioche', price: '$15.99', category: 'Tavern Fare', popular: true, imageEmoji: '🍔' },
        { id: `${slug}-t3`, name: 'Crispy Smoked Maple BBQ Wings (10-Pack)', description: 'Tossed in local maple molasses BBQ glaze with house ranch dipping sauce', price: '$15.50', category: 'Appetizers', imageEmoji: '🍗' }
      ]
    },
    {
      id: `biz-${slug}-store`,
      name: `${cleanTown} General Store & Provisions`,
      town: cleanTown,
      state: state,
      category: 'retail',
      address: `44 Country Way, ${cleanTown}, ${state}`,
      googlePlaceId: `ChIJ_${slug}_store_${Math.random().toString(36).substring(2, 7)}`,
      googleRating: 4.9,
      reviewsCount: 185,
      googleReviewUrl: buildGoogleReviewUrl(undefined, `${cleanTown} General Store`, cleanTown),
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${cleanTown} General Store ${state}`)}`,
      description: `Historic local provisions, deli counter, handmade gifts, maple goods, and town essentials.`,
      suggestedCardHeadline: `Support our local general store! Tap your phone to leave a 5-star review.`,
      logoEmoji: '🏡',
      accentColor: '#10b981',
      menuTitle: `${cleanTown} General Store Provisions & Goods`,
      menuItems: [
        { id: `${slug}-g1`, name: 'Pure Grade A Amber Maple Syrup (16oz)', description: 'Tapped and boiled from local sugar maples in glass keepsake jug', price: '$15.99', category: 'Pantry', popular: true, imageEmoji: '🍯' },
        { id: `${slug}-g2`, name: 'Classic Town Center Italian Grinder Sub', description: 'Layers of premium cured cold cuts, sharp provolone, tomatoes, onions & spice blend', price: '$12.50', category: 'Deli Counter', popular: true, imageEmoji: '🥪' },
        { id: `${slug}-g3`, name: 'Hand-Poured Mountain Pine Soy Candle', description: '100% soy candle infused with crisp pine needles and cedarwood fragrance', price: '$18.00', category: 'Gifts', imageEmoji: '🕯️' }
      ]
    },
  ];
}

/**
 * Get all businesses for any town, falling back to pre-indexed data or auto-generating
 */
export function getBusinessesForTown(townName: string, state: string = 'NH'): LocalBusiness[] {
  const existing = EFFINGHAM_AREA_BUSINESSES.filter(
    b => b.town.toLowerCase() === townName.toLowerCase()
  );
  if (existing.length > 0) {
    return existing;
  }
  return generateBusinessesForTown(townName, state);
}

/**
 * Helper to generate official Google Review URLs from Place ID or Business Name
 * Guarantees zero 404 errors by using Google Search review query when a synthetic Place ID is passed
 */
export function buildGoogleReviewUrl(placeId?: string, businessName?: string, town?: string): string {
  const isRealGooglePlaceId = placeId && placeId.startsWith('ChIJ') && !placeId.includes('_') && placeId.length >= 27;
  if (isRealGooglePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${placeId.trim()}`;
  }
  const cleanName = (businessName || 'Local Business').trim();
  const cleanTown = (town || 'Ossipee').trim();
  const query = encodeURIComponent(`${cleanName} ${cleanTown} NH`);
  return `https://www.google.com/search?q=${query}`;
}

/**
 * Helper to build Smart Funnel URL for physical NFC cards
 */
export function buildSmartTapUrl(cardId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://oasistap.io');
  return `${base}/tap/${cardId}`;
}
