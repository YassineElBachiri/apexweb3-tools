import { LucideIcon, Server, Database, Shield, Cloud, CreditCard, Box, Wallet, Code, GraduationCap, Cpu } from "lucide-react";

export type DealCategory =
    | "All"
    | "Exchanges"
    | "Infrastructure"
    | "Security"
    | "Cloud Hosting"
    | "Learning"
    | "Hardware Wallets";

export interface Deal {
    id: string;
    name: string;
    logo: string; // URL to logo image
    category: DealCategory;
    summary: string;
    bestFor: string;
    benefits: string[];
    offer: string;
    link: string;
    code?: string;
    editorsPick?: boolean;
    featured?: boolean;
}

export const categories: DealCategory[] = [
    "All",
    "Exchanges",
    "Infrastructure",
    "Security",
    "Cloud Hosting",
    "Learning",
    "Hardware Wallets"
];

export const deals: Deal[] = [
    // FEATURED INFRASTRUCTURE
    {
        id: "alchemy",
        name: "Alchemy",
        logo: "https://logo.clearbit.com/alchemy.com",
        category: "Infrastructure",
        summary: "The most powerful set of Web3 development tools to build and scale your dApp with ease.",
        bestFor: "Multi-chain Building",
        benefits: [
            "Supernode API for reliability",
            "Enhanced APIs for NFT & cleanup",
            "24/7 specialized support"
        ],
        offer: "$500 in Free Credits",
        link: "https://alchemy.com/?r=apexweb3",
        editorsPick: true,
        featured: true
    },
    {
        id: "quicknode",
        name: "QuickNode",
        logo: "https://logo.clearbit.com/quicknode.com",
        category: "Infrastructure",
        summary: "Lightning-fast global blockchain infrastructure. Scale your dApp with the fastest RPC nodes.",
        bestFor: "High-Performance Solana/EVM",
        benefits: [
            "Global low-latency network",
            "Marketplace for add-ons",
            "Real-time analytics dashboard"
        ],
        offer: "1 Month Free (Build Plan)",
        link: "https://quicknode.com/?via=apexweb3",
        featured: true
    },
    {
        id: "infura",
        name: "Infura",
        logo: "https://logo.clearbit.com/infura.io",
        category: "Infrastructure",
        summary: "The world's most powerful blockchain development suite, trusted by millions of developers.",
        bestFor: "Ethereum & IPFS",
        benefits: [
            "Industry standard reliability",
            "Durable IPFS storage",
            "Advanced archive data access"
        ],
        offer: "20% Off Annual Plans",
        link: "https://infura.io",
        featured: true
    },

    // EXCHANGES
    {
        id: "binance",
        name: "Binance",
        logo: "https://logo.clearbit.com/binance.com",
        category: "Exchanges",
        summary: "The world's largest crypto exchange by trading volume, offering deep liquidity and advanced trading tools.",
        bestFor: "Spot & Futures Trading",
        benefits: [
            "Lowest trading fees",
            "Huge asset selection",
            "Advanced API for algorithmic trading"
        ],
        offer: "$100 Signup Bonus + 20% Fee Discount",
        link: "https://accounts.binance.com/register?ref=apexweb3",
        code: "APEXWEB3"
    },
    {
        id: "bybit",
        name: "Bybit",
        logo: "https://logo.clearbit.com/bybit.com",
        category: "Exchanges",
        summary: "Top-tier derivatives exchange known for high-speed matching engine and reliable uptime.",
        bestFor: "Derivatives & Copy Trading",
        benefits: [
            "99.99% system availability",
            "Smart trading bot Integration",
            "Unified trading account"
        ],
        offer: "Up to $30,000 Deposit Bonus",
        link: "https://www.bybit.com/register?affiliate_id=apexweb3",
    },
    {
        id: "okx",
        name: "OKX",
        logo: "https://logo.clearbit.com/okx.com",
        category: "Exchanges",
        summary: "Innovative cryptocurrency exchange with a powerful Web3 wallet and DeFi integration.",
        bestFor: "DeFi & Web3 Access",
        benefits: [
            "Self-custody Web3 wallet",
            "NFT Marketplace aggregation",
            "Earn high APY on staking"
        ],
        offer: "Mystery Box up to $10,000",
        link: "https://www.okx.com/join/apexweb3",
    },

    // SECURITY & HARDWARE
    {
        id: "ledger",
        name: "Ledger",
        logo: "https://logo.clearbit.com/ledger.com",
        category: "Hardware Wallets",
        summary: "The smartest way to secure, buy, exchange, and grow your crypto assets.",
        bestFor: "Long-term Security",
        benefits: [
            "EAL5+ Secure Element chip",
            "Supports 5,500+ coins",
            "Bluetooth connectivity (Nano X)"
        ],
        offer: "10% Discount on Nano X",
        link: "https://shop.ledger.com/?r=apexweb3",
        code: "WEB3DEV10"
    },
    {
        id: "trezor",
        name: "Trezor",
        logo: "https://logo.clearbit.com/trezor.io",
        category: "Hardware Wallets",
        summary: "The original hardware wallet. Open-source security for your digital independence.",
        bestFor: "Open Source Advocates",
        benefits: [
            "Fully open-source firmware",
            "Shamir Backup standard",
            "Touchscreen interface (Model T)"
        ],
        offer: "15% Off Model T",
        link: "https://trezor.io/?offer_id=apexweb3",
    },

    // CLOUD & HOSTING
    {
        id: "digitalocean",
        name: "DigitalOcean",
        logo: "https://logo.clearbit.com/digitalocean.com",
        category: "Cloud Hosting",
        summary: "Simple, scalable cloud computing solutions designed for developers and startups.",
        bestFor: "Node Hosting & VPS",
        benefits: [
            "Predictable pricing",
            "One-click apps (inc. Blockchain nodes)",
            "Excellent documentation"
        ],
        offer: "$200 Free Credit (60 Days)",
        link: "https://m.do.co/c/apexweb3",
        editorsPick: true
    },
    {
        id: "vultr",
        name: "Vultr",
        logo: "https://logo.clearbit.com/vultr.com",
        category: "Cloud Hosting",
        summary: "High-performance cloud compute with 32 global locations and infinite possibilities.",
        bestFor: "Global Low-Latency",
        benefits: [
            "100% SSD Architecture",
            "Crypto payments accepted",
            "Bare Metal instances available"
        ],
        offer: "$100 Free Credit",
        link: "https://www.vultr.com/?ref=apexweb3",
    }
];
