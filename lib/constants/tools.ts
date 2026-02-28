
import {
    TrendingUp, Shield, Wallet, Eye, ArrowRightLeft,
    DollarSign, Calculator, Zap, Briefcase, Flame
} from "lucide-react";

export type ToolPillar = 'Intelligence' | 'Risk' | 'Utilities' | 'Careers';

export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: any;
    href: string;
    pillar: ToolPillar;
    pillarHref: string;
    color: string;
    features: string[];
    badge?: string;
}

export const TOOLS: Tool[] = [
    // ── INTELLIGENCE PILLAR ──────────────────────────────────────────────────
    {
        id: 'analyzer',
        title: "Tokenomics Analyzer",
        description: "Deep-dive token analysis with investment scoring, supply metrics, and risk assessment",
        icon: TrendingUp,
        href: "/analysis/analyzer",
        pillar: "Intelligence",
        pillarHref: "/intelligence",
        color: "purple",
        features: [
            "0-100 Investment Score",
            "Supply & Inflation Analysis",
            "Risk Verdicts"
        ],
        badge: "Most Popular"
    },
    {
        id: 'whales',
        title: "Whale Watch",
        description: "Track smart money movements and large wallet transactions in real-time",
        icon: Eye,
        href: "/analysis/whales",
        pillar: "Intelligence",
        pillarHref: "/intelligence",
        color: "blue",
        features: [
            "Live Transaction Feed",
            "$100K+ Movements",
            "Wallet Labels"
        ]
    },
    {
        id: 'spike-detector',
        title: "Meme Coin Scanner",
        description: "Detect early liquidity events and volume spikes on meme coins across Solana and Base",
        icon: Flame,
        href: "/discovery/spike-detector",
        pillar: "Intelligence",
        pillarHref: "/intelligence",
        color: "orange",
        features: [
            "Early Liquidity Alerts",
            "Solana & Base Coverage",
            "Volume Spike Detection"
        ],
        badge: "Live"
    },

    // ── RISK PILLAR ──────────────────────────────────────────────────────────
    {
        id: 'scanner',
        title: "Security Scanner",
        description: "Detect honeypots, rug pulls, and contract vulnerabilities before you invest",
        icon: Shield,
        href: "/discovery/scan",
        pillar: "Risk",
        pillarHref: "/risk",
        color: "pink",
        features: [
            "Honeypot Detection",
            "Liquidity Lock Check",
            "Smart Contract Audit"
        ],
        badge: "New"
    },
    {
        id: 'portfolio',
        title: "Portfolio Tracker",
        description: "Monitor your crypto holdings with real-time prices, P&L tracking and exposure analysis",
        icon: Wallet,
        href: "/portfolio",
        pillar: "Risk",
        pillarHref: "/risk",
        color: "green",
        features: [
            "Multi-Asset Support",
            "Real-Time Prices",
            "P&L Dashboard"
        ]
    },

    // ── UTILITIES PILLAR ─────────────────────────────────────────────────────
    {
        id: 'calculator',
        title: "Avg Cost Calculator",
        description: "Calculate your average buy price, total investment, and break-even points",
        icon: Calculator,
        href: "/finance/calculator",
        pillar: "Utilities",
        pillarHref: "/utilities",
        color: "cyan",
        features: [
            "Multi-Purchase Tracking",
            "DCA Simulation",
            "Profit/Loss Analysis"
        ]
    },
    {
        id: 'converter',
        title: "Crypto Converter",
        description: "Convert between 100+ cryptocurrencies with live exchange rates",
        icon: ArrowRightLeft,
        href: "/finance/converter",
        pillar: "Utilities",
        pillarHref: "/utilities",
        color: "indigo",
        features: [
            "100+ Crypto Pairs",
            "Real-Time Rates",
            "Bi-Directional Conversion"
        ]
    },
    {
        id: 'fiat',
        title: "Fiat Exchange",
        description: "Calculate crypto value in 30+ fiat currencies (USD, EUR, GBP, JPY...)",
        icon: DollarSign,
        href: "/finance/fiat-converter",
        pillar: "Utilities",
        pillarHref: "/utilities",
        color: "emerald",
        features: [
            "30+ Fiat Currencies",
            "Multi-Currency Grid",
            "Fee Calculator"
        ]
    },

    // ── CAREERS PILLAR ───────────────────────────────────────────────────────
    {
        id: 'jobs',
        title: "Web3 Jobs",
        description: "Browse live blockchain and DeFi job listings from top Web3 companies worldwide",
        icon: Briefcase,
        href: "/jobs",
        pillar: "Careers",
        pillarHref: "/careers",
        color: "violet",
        features: [
            "Live Job Board",
            "Remote & On-site",
            "DeFi, NFT, L2 Roles"
        ],
        badge: "New"
    },
    {
        id: 'salary-estimator',
        title: "Salary Estimator",
        description: "Benchmark Web3 salaries by role, seniority, and location — know your market value",
        icon: Zap,
        href: "/finance/salary-estimator",
        pillar: "Careers",
        pillarHref: "/careers",
        color: "yellow",
        features: [
            "Role Benchmarking",
            "Seniority Levels",
            "Fiat & Crypto Breakdown"
        ]
    },
];

export const PILLAR_META = {
    Intelligence: {
        label: "Intelligence",
        href: "/intelligence",
        description: "Market signals, smart money tracking & token analysis",
        color: "text-brand-blue",
        bgColor: "bg-brand-blue/10",
        borderColor: "border-brand-blue/20",
        glowColor: "bg-brand-blue/20",
        emoji: "🔵",
    },
    Risk: {
        label: "Risk",
        href: "/risk",
        description: "Security scanning & portfolio exposure management",
        color: "text-brand-pink",
        bgColor: "bg-brand-pink/10",
        borderColor: "border-brand-pink/20",
        glowColor: "bg-brand-pink/20",
        emoji: "🔴",
    },
    Utilities: {
        label: "Utilities",
        href: "/utilities",
        description: "Fast converters & calculators for every trade",
        color: "text-brand-purple",
        bgColor: "bg-brand-purple/10",
        borderColor: "border-brand-purple/20",
        glowColor: "bg-brand-purple/20",
        emoji: "🟡",
    },
    Careers: {
        label: "Careers",
        href: "/careers",
        description: "Web3 jobs & salary benchmarks for builders",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
        borderColor: "border-emerald-400/20",
        glowColor: "bg-emerald-400/20",
        emoji: "🟢",
    },
} as const;
