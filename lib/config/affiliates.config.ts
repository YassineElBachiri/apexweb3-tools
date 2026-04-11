// ================================================================
// APEXWEB3 AFFILIATE CONFIG
// ================================================================
// TO ADD A NEW AFFILIATE: Copy any block below, paste at the end,
// fill in your details, set active: true. That's it.
// TO DISABLE: Set active: false
// TO UPDATE A LINK: Change the `url` field only
// ================================================================

export type Affiliate = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlight: string;
  logo: string;
  wordmark: string;
  url: string;
  ctaText: string;
  badge: string;
  badgeColor: string;
  category: string;
  commission: string;
  priority: number;
  active: boolean;
  placements: string[];
};

export const AFFILIATES: Record<string, Affiliate> = {

  binance: {
    id: "binance",
    name: "Binance",
    tagline: "World's largest crypto exchange",
    description: "Trade 350+ cryptocurrencies with the industry's lowest fees and deepest liquidity.",
    highlight: "0% fees on spot trading for new users",
    logo: "/images/affiliates/binance-icon.svg",
    wordmark: "/images/affiliates/Binance-logo.svg",
    url: "https://www.binance.com/register?ref=147791032",
    ctaText: "Get 20% Fee Discount",
    badge: "Most Popular",
    badgeColor: "#F0B90B",
    category: "exchange",
    commission: "Up to 50% trading fee revenue share",
    priority: 1,
    active: true,
    placements: [
      "deals",
      "portfolio",
      "whale-watch",
      "meme-scanner",
      "tokenomics-analyzer",
      "converter",
      "fiat-converter",
      "sidebar-global",
    ],
  },

  ledger: {
    id: "ledger",
    name: "Ledger",
    tagline: "The #1 hardware wallet for crypto security",
    description: "Keep your crypto safe offline. Ledger hardware wallets protect your assets from hacks, phishing, and smart contract exploits.",
    highlight: "Free shipping on orders over $50",
    logo: "/images/affiliates/ledger-logo.svg",
    wordmark: "/images/affiliates/ledger-logo.svg",
    url: "https://shop.ledger.com/?r=e3e6078f2c56",
    ctaText: "Secure Your Crypto",
    badge: "Editor's Pick",
    badgeColor: "#00D395",
    category: "wallet",
    commission: "10% per sale",
    priority: 2,
    active: true,
    placements: [
      "deals",
      "security-scanner",
      "portfolio",
    ],
  },

  trezor: {
    id: "trezor",
    name: "Trezor",
    tagline: "Original open-source hardware wallet",
    description: "The original hardware wallet. Open-source, battle-tested, and trusted by millions. Supports 9,000+ coins and tokens.",
    highlight: "Ships to 180+ countries worldwide",
    logo: "/images/affiliates/trezor-logo.svg",
    wordmark: "/images/affiliates/trezor-wordmark.svg",
    url: "https://affil.trezor.io/aff_i?offer_id=133&file_id=1016&aff_id=35709",
    ctaText: "Get Trezor Wallet",
    badge: "Open Source",
    badgeColor: "#1AC964",
    category: "wallet",
    commission: "12-15% per sale",
    priority: 3,
    active: true,
    placements: [
      "deals",
      "security-scanner",
    ],
  },

  tradingview: {
    id: "tradingview",
    name: "TradingView",
    tagline: "Professional charting & market analysis",
    description: "The world's most powerful charting platform. Real-time data, 100+ technical indicators, and a community of 50M+ traders.",
    highlight: "30-day free trial — no credit card required",
    logo: "/images/affiliates/tradingview-wordmark.svg",
    wordmark: "/images/affiliates/tradingview-wordmark.svg",
    url: "https://www.tradingview.com/?aff_id=165471",
    ctaText: "Try TradingView Free",
    badge: "30% Recurring",
    badgeColor: "#2962FF",
    category: "analytics",
    commission: "30% recurring commission",
    priority: 4,
    active: true,
    placements: [
      "deals",
      "tokenomics-analyzer",
      "whale-watch",
      "meme-scanner",
      "calculator",
      "sidebar-global",
    ],
  },

  nordvpn: {
    id: "nordvpn",
    name: "NordVPN",
    tagline: "Secure your crypto browsing",
    description: "Military-grade encryption for your crypto transactions and daily browsing. Hide your IP and stay safe from targeted attacks.",
    highlight: "Up to 65% off + extra months free",
    logo: "/images/affiliates/nordvpn-logo.svg",
    wordmark: "/images/affiliates/nordvpn-logo.svg",
    url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145370&url_id=902",
    ctaText: "Get NordVPN Deal",
    badge: "Privacy Essential",
    badgeColor: "#4687FF",
    category: "security",
    commission: "High converting subscription",
    priority: 5,
    active: true,
    placements: [
      "deals",
      "security-scanner",
      "portfolio",
      "sidebar-global",
    ],
  },

  nordpass: {
    id: "nordpass",
    name: "NordPass",
    tagline: "Next-gen password manager",
    description: "Store your crypto exchange credentials, seed phrases, and passwords securely in an encrypted vault you can access anywhere.",
    highlight: "Advanced encryption architecture xChaCha20",
    logo: "/images/affiliates/nordpass-logo.svg",
    wordmark: "/images/affiliates/nordpass-logo.svg",
    url: "https://go.nordpass.io/aff_c?offer_id=488&aff_id=145370&url_id=9356",
    ctaText: "Secure Your Passwords",
    badge: "Top Security",
    badgeColor: "#F04359",
    category: "security",
    commission: "High converting subscription",
    priority: 6,
    active: true,
    placements: [
      "deals",
      "security-scanner",
    ],
  },
};

// ================================================================
// CONTEXTUAL COPY — Per placement messaging
// Controls what headline and subline appear on each tool page
// If no entry exists for a placement, falls back to affiliate defaults
// ================================================================

type PlacementCopy = {
  headline: string;
  subline: string;
  urgency: boolean;
};

export const PLACEMENT_COPY: Record<string, Record<string, PlacementCopy>> = {

  "security-scanner": {
    ledger: {
      headline: "Contract looks risky. Your wallet shouldn't be.",
      subline: "Store your assets on a Ledger hardware wallet — fully offline, unhackable.",
      urgency: true,
    },
    trezor: {
      headline: "Found risks. Time to go cold storage.",
      subline: "Trezor keeps your crypto safe even when smart contracts aren't.",
      urgency: true,
    },
    nordvpn: {
      headline: "Protect your IP while scanning risky contracts.",
      subline: "Hide your identity from malicious actors with NordVPN's military-grade encryption.",
      urgency: false,
    },
    nordpass: {
      headline: "Are your exchange credentials safe?",
      subline: "Switch to NordPass to lock down your trading passwords efficiently.",
      urgency: false,
    },
  },

  "whale-watch": {
    binance: {
      headline: "Smart money is moving. Are you ready?",
      subline: "Execute fast on Binance — deepest liquidity, lowest fees.",
      urgency: false,
    },
    tradingview: {
      headline: "Spot the pattern behind the whale movement.",
      subline: "Pair live whale data with TradingView's professional charts.",
      urgency: false,
    },
  },

  "meme-scanner": {
    binance: {
      headline: "Early signal detected. Don't miss the move.",
      subline: "Trade on Binance — 0% spot fees for new users.",
      urgency: true,
    },
    tradingview: {
      headline: "Track the spike in real time.",
      subline: "TradingView gives you the charts to time your entry perfectly.",
      urgency: false,
    },
  },

  "portfolio": {
    binance: {
      headline: "Ready to grow your portfolio?",
      subline: "Trade 350+ assets on Binance with the industry's lowest fees.",
      urgency: false,
    },
    ledger: {
      headline: "Holding long term? Protect what you've built.",
      subline: "Move your assets to Ledger for cold storage security.",
      urgency: false,
    },
  },

  "tokenomics-analyzer": {
    tradingview: {
      headline: "Like the tokenomics? Check the chart next.",
      subline: "TradingView gives you the full technical picture before you invest.",
      urgency: false,
    },
    binance: {
      headline: "Token passed the analysis? Time to trade.",
      subline: "Binance — fast execution on 350+ assets.",
      urgency: false,
    },
  },

  "converter": {
    binance: {
      headline: "Ready to trade? Binance has the best rates.",
      subline: "0% spot trading fees for new users.",
      urgency: false,
    },
  },

  "deals": {
    // Deals page uses full affiliate descriptions — no override needed
  },

};

// ================================================================
// PORTFOLIO SIZE RULES
// Controls which affiliate shows on Portfolio Tracker
// based on the user's detected portfolio value
// ================================================================

export const PORTFOLIO_RULES = [
  {
    maxValue: 1000,
    affiliateId: "binance",
    reason: "Small portfolio — focus on growing it",
  },
  {
    maxValue: 10000,
    affiliateId: "binance",
    reason: "Mid portfolio — keep trading efficiently",
  },
  {
    maxValue: Infinity,
    affiliateId: "ledger",
    reason: "Large portfolio — security is the priority",
  },
];

// ================================================================
// HELPER FUNCTIONS
// ================================================================

export function getAffiliatesForPage(pageId: string): Affiliate[] {
  return Object.values(AFFILIATES)
    .filter((a) => a.active && a.placements.includes(pageId))
    .sort((a, b) => a.priority - b.priority);
}

export function getPrimaryCopy(pageId: string, affiliateId: string): PlacementCopy | null {
  return PLACEMENT_COPY?.[pageId]?.[affiliateId] ?? null;
}

export function getAffiliateById(id: string): Affiliate | null {
  return AFFILIATES[id] ?? null;
}

export function getAffiliateForPortfolio(totalValue: number): Affiliate | null {
  const rule = PORTFOLIO_RULES.find((r) => totalValue <= r.maxValue);
  return rule ? AFFILIATES[rule.affiliateId] : null;
}
