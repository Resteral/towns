export interface TownNode {
  id: string;
  name: string;
  state: string;
  fullName: string;
  tagline: string;
  icon: string;
  status: 'peak_flow' | 'stable' | 'launching';
  boutiquesCount: number;
  routesCount: number;
  occupancyLattice: number;
  vanguardLead: string;
  dispatchPhone: string;
  description: string;
  accentColor?: string;
  joinedDate: string;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  category: 'cards' | 'stands' | 'stickers' | 'bundles' | 'artisan' | 'food' | 'services';
  material?: string;
  colorOptions?: string[];
  features: string[];
  imageUrl: string;
  inStock: boolean;
  isBestSeller?: boolean;
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  town?: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  town: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  badge: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  totalProductsCount: number;
  totalDeliveriesCompleted: number;
  joinedDate: string;
}

export interface ShoutoutPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  tag: 'drop' | 'review' | 'news' | 'deal' | 'courier';
  reactions: {
    voltage: number;
    fire: number;
    heart: number;
  };
  userReactions?: { [type: string]: boolean };
  timestamp: string;
  imageUrl?: string;
  sellerId?: string;
  productLink?: string;
  town?: string;
}

export interface NfcCardConfig {
  id: string;
  cardName: string;
  businessName: string;
  googlePlaceId?: string;
  googleReviewUrl: string;
  yelpUrl?: string;
  tripAdvisorUrl?: string;
  mode: 'smart_funnel' | 'direct_google' | 'multi_hub';
  thresholdStars: number;
  customHeadline?: string;
  logoUrl?: string;
  primaryColor?: string;
  assignedLocation?: string;
  assignedStaff?: string;
  active: boolean;
  totalTaps: number;
  googleConversions: number;
  privateFeedbacksCount: number;
  createdAt: string;
  town?: string;
}

export interface TapLog {
  id: string;
  cardId: string;
  businessName: string;
  timestamp: string;
  device: 'iOS' | 'Android' | 'Desktop' | 'Other';
  action: 'google_redirect' | 'private_feedback' | 'multi_hub_view' | 'direct_redirect';
  ratingSelected?: number;
  location?: string;
}

export interface PrivateFeedback {
  id: string;
  cardId?: string;
  businessName: string;
  timestamp: string;
  rating: number;
  category?: 'experience' | 'courier' | 'product' | 'suggestion' | 'praise';
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  feedbackText: string;
  status: 'new' | 'in_progress' | 'resolved';
  replyNote?: string;
  resolutionAction?: string;
  resolvedAt?: string;
  town?: string;
}

export interface CartItem {
  product: ReviewProduct;
  quantity: number;
  selectedColor?: string;
  customBusinessName?: string;
  customLogoUrl?: string;
}

export interface ProductOptionChoice {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductOptionGroup {
  id: string;
  title: string;
  required?: boolean;
  type: 'single' | 'multiple';
  choices: ProductOptionChoice[];
}

export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  badge?: string;
  calories?: string;
  dietaryTags?: string[];
  optionGroups?: ProductOptionGroup[];
}

export interface SelectedOption {
  groupTitle: string;
  choiceName: string;
  priceDelta: number;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  selectedOptions?: SelectedOption[];
  storeName?: string;
}

export interface DeliveryDriverInfo {
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  rating: number;
  totalDeliveries: number;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  items: DeliveryItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: 'pending' | 'accepted' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  notifiedPhone: boolean;
  notificationLog?: string;
  town?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  orderType?: 'delivery' | 'pickup';
  driver?: DeliveryDriverInfo;
}

export interface NotificationSettings {
  phoneNumber: string;
  enableSms: boolean;
  enableTelegram: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  enableDiscord: boolean;
  discordWebhookUrl?: string;
  enableSoundChime: boolean;
}

export type MembershipTier = 'free' | 'citizen' | 'merchant_pro' | 'vanguard_master';

export interface UserMembership {
  tier: MembershipTier;
  tierName: string;
  active: boolean;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberTown: string;
  joinedDate: string;
  renewsAt: string;
  billingCycle: 'monthly' | 'annual';
  price: number;
  perks: string[];
  avatarEmoji?: string;
  customBadge?: string;
}

export interface MerchantStorefront {
  id: string;
  slug: string;
  businessName: string;
  tagline: string;
  description: string;
  logoEmoji: string;
  coverImageUrl?: string;
  phone: string;
  email?: string;
  address: string;
  town: string;
  state: string;
  accentColor: string;
  deliveryFee: number;
  minOrder: number;
  estimatedPrepTime: string;
  googlePlaceId?: string;
  googleRating: number;
  reviewsCount: number;
  googleReviewUrl?: string;
  enablePickup: boolean;
  enableDelivery: boolean;
  listOnMarketplace: boolean;
  products: StorefrontProduct[];
  isPublished: boolean;
  createdAt: string;
}


