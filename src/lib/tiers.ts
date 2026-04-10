export interface Tier {
  id: number;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  limited?: boolean;
  totalSpots?: number;
  spotsRemaining?: number;
  collectAtCheckout?: string[];
  highlight?: boolean;
  badge?: string;
}

export const tiers: Tier[] = [
  {
    id: 1,
    name: "Season Pass",
    price: 24.99,
    priceLabel: "$24.99",
    description: "Full Season 1 — stream and download every episode.",
    features: [
      "Unlock all 10 episodes instantly",
      "Stream anytime, anywhere",
      "Download for offline viewing",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: 2,
    name: "The Insider",
    price: 39.99,
    priceLabel: "$39.99",
    description: "Go deeper. Behind-the-scenes, deleted scenes, and more.",
    features: [
      "Everything in Season Pass",
      "Behind-the-scenes content",
      "Deleted scenes & bloopers",
      "Director's commentary per episode",
    ],
  },
  {
    id: 3,
    name: "Season 2 Early Bird",
    price: 49.99,
    priceLabel: "$49.99",
    description: "Lock in Season 2 free before anyone else.",
    features: [
      "Everything in Season Pass",
      "Free access to Season 2 on release",
      "Early notification of new episodes",
    ],
    limited: true,
    totalSpots: 500,
    spotsRemaining: 487,
    badge: "Limited",
  },
  {
    id: 4,
    name: "Superfan Bundle",
    price: 74.99,
    priceLabel: "$74.99",
    description: "Exclusive digital collectibles and a live cast Q&A.",
    features: [
      "Everything in The Insider",
      "Exclusive digital artwork collection",
      "Phone wallpapers & assets",
      "Digitally signed cast poster",
      "Private live Zoom Q&A with cast & creator",
    ],
    collectAtCheckout: [],
  },
  {
    id: 5,
    name: "Producer Credit",
    price: 99.99,
    priceLabel: "$99.99",
    description: 'Your name in the Season 2 credits. Literally.',
    features: [
      "Everything in The Insider",
      '"Supported By" credit in Season 2',
      "Digital certificate of support",
    ],
    collectAtCheckout: ["Preferred credit name"],
  },
  {
    id: 6,
    name: "Name a Character",
    price: 149.99,
    priceLabel: "$149.99",
    description: "Name a character in Season 2. They live in your honor.",
    features: [
      "Everything in Superfan Bundle",
      "Name a minor character in Season 2",
      "Character naming certificate",
    ],
    limited: true,
    totalSpots: 20,
    spotsRemaining: 18,
    collectAtCheckout: ["Preferred character name"],
    badge: "Rare",
  },
  {
    id: 7,
    name: "Virtual Set Visit",
    price: 199.99,
    priceLabel: "$199.99",
    description: "Watch Season 2 get made — live from set.",
    features: [
      "Everything in Superfan Bundle",
      "Live virtual set visit during S2 production",
      "Private video call access",
      "Behind-the-scenes photo package",
    ],
    limited: true,
    totalSpots: 50,
    spotsRemaining: 47,
  },
  {
    id: 8,
    name: "Meet & Greet",
    price: 299.99,
    priceLabel: "$299.99",
    description: "15 minutes with the cast. Bring a friend.",
    features: [
      "Everything above",
      "Private 15-min meet & greet (virtual or in-person)",
      "Bring one guest",
      "Signed digital memorabilia",
    ],
    limited: true,
    totalSpots: 30,
    spotsRemaining: 28,
    badge: "VIP",
  },
  {
    id: 9,
    name: "Executive Producer",
    price: 499.99,
    priceLabel: "$499.99",
    description: "Official EP credit. Shape Season 2 with the creator.",
    features: [
      "Everything above",
      "Executive Producer credit on Season 2",
      "Framed digital certificate",
      "Private 30-min call with creator",
      "Input on Season 2 creative direction",
    ],
    limited: true,
    totalSpots: 20,
    spotsRemaining: 19,
    badge: "Ultra Rare",
  },
  {
    id: 10,
    name: "Founding Supporter",
    price: 5,
    priceLabel: "Pay What You Want ($5 min)",
    description: "Join the wall. Support the movement.",
    features: [
      "Name on public Founding Supporters wall",
      "Personal thank-you email from creator",
      "Free access to Episode 1",
    ],
    badge: "Community",
  },
];

export const coinPackages = [
  { id: "coins-10", coins: 10, price: 8.99, savings: "Save 10%" },
  { id: "coins-30", coins: 30, price: 24.99, savings: "Save 17%" },
  { id: "coins-60", coins: 60, price: 44.99, savings: "Save 25%", popular: true },
];

export const COIN_PRICE = 0.99;
export const EPISODE_COIN_COST = 3;
export const FULL_SEASON_PRICE = 24.99;
export const CREW_FUND_PERCENTAGE = 0.15;
