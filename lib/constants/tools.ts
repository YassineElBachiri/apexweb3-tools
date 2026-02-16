
import {
    TrendingUp, Shield, Wallet, Eye, ArrowRightLeft,
    DollarSign, Calculator, LineChart, Lock, Zap, Briefcase
} from "lucide-react";

export interface Tool {
    id: string;
    title: string;
    description: string;
    icon: any; // using any for Icon component type
    href: string;
    category: 'Analysis' | 'Tracking' | 'Conversion' | 'Calculation';
    color: string;
    features: string[];
    badge?: string;
}

export const TOOLS: Tool[] = [
    {
        id: 'salary-estimator',
        title: "Salary Estimator",
        description: "Convert fiat salary to crypto, simulate DCA, and estimate taxes",
        icon: Briefcase,
        href: "/salary-estimator",
        category: "Conversion",
        color: "indigo",
        features: [
            "Fiat to Crypto",
            "DCA Simulator",
            "Tax Estimator"
        ],
        badge: "New"
    },
    {
        id: 'analyzer',
        title: "Tokenomics Analyzer",
        description: "Deep-dive token analysis with investment scoring, supply metrics, and risk assessment",
        icon: TrendingUp,
        href: "/analyzer",
        category: "Analysis",
        color: "purple",
        features: [
            "0-100 Investment Score",
            "Supply & Inflation Analysis",
            "Risk Verdicts"
        ],
        badge: "Most Popular"
    },
    {
        id: 'scanner',
        title: "Security Scanner",
        description: "Detect honeypots, rug pulls, and contract vulnerabilities before you invest",
        icon: Shield,
        href: "/scan",
        category: "Analysis",
        color: "blue",
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
        description: "Monitor your crypto holdings with real-time prices and P&L tracking",
        icon: Wallet,
        href: "/portfolio",
        category: "Tracking",
        color: "green",
        features: [
            "Multi-Asset Support",
            "Real-Time Prices",
            "P&L Dashboard"
        ]
    },
    {
        id: 'whales',
        title: "Whale Watch",
        description: "Track smart money movements and large wallet transactions in real-time",
        icon: Eye,
        href: "/whales",
        category: "Tracking",
        color: "orange",
        features: [
            "Live Transaction Feed",
            "$100K+ Movements",
            "Wallet Labels"
        ]
    },
    {
        id: 'converter',
        title: "Crypto Converter",
        description: "Convert between 100+ cryptocurrencies with live exchange rates",
        icon: ArrowRightLeft,
        href: "/converter",
        category: "Conversion",
        color: "cyan",
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
        href: "/fiat-converter",
        category: "Conversion",
        color: "emerald",
        features: [
            "30+ Fiat Currencies",
            "Multi-Currency Grid",
            "Fee Calculator"
        ]
    },
    {
        id: 'calculator',
        title: "Avg Cost Calculator",
        description: "Calculate your average buy price, total investment, and break-even points",
        icon: Calculator,
        href: "/calculator",
        category: "Calculation",
        color: "pink",
        features: [
            "Multi-Purchase Tracking",
            "DCA Simulation",
            "Profit/Loss Analysis"
        ]
    },
    {
        id: 'gas-calculator',
        title: "Gas Fee Calculator",
        description: "Real-time multi-chain gas estimator with USD conversion and advanced settings",
        icon: Zap,
        href: "/gas-fees",
        category: "Calculation",
        color: "orange",
        features: [
            "Multi-Chain (L1/L2)",
            "Live Prices & Charts",
            "Cost Estimator"
        ],
        badge: "Hot"
    },
    {
        id: 'contract-analyzer',
        title: "Smart Contract Audit",
        description: "Analyze Solidity code for security risks, gas optimizations, and cost estimation",
        icon: Lock,
        href: "/contract-analyzer",
        category: "Analysis",
        color: "red", // Using red for security/audit theme
        features: [
            "Static Analysis",
            "Gas Optimization",
            "Vulnerability Scan"
        ],
        badge: "Beta"
    }
];
