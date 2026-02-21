
import { LayoutDashboard, Briefcase } from "lucide-react";

export const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
];

export const FOOTER_LINKS = {
    intelligence: [
        { label: "Tokenomics Analyzer", href: "/analyzer" },
        { label: "Whale Watch", href: "/whales" },
        { label: "Meme Coin Scanner", href: "/spike-detector" },
    ],
    risk: [
        { label: "Security Scanner", href: "/scan" },
        { label: "Portfolio Tracker", href: "/portfolio" },
    ],
    utilities: [
        { label: "Avg Cost Calculator", href: "/calculator" },
        { label: "Crypto Converter", href: "/converter" },
        { label: "Fiat Exchange", href: "/fiat-converter" },
    ],
    careers: [
        { label: "Web3 Jobs", href: "/jobs" },
        { label: "Salary Estimator", href: "/salary-estimator" },
    ],
    resources: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "Trading Guides", href: "/guides" },
        { label: "API Access", href: "/api" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Contact", href: "/contact" },
    ]
};
