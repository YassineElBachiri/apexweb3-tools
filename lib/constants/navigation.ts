
import { LayoutDashboard, Briefcase, BookOpen, Folder } from "lucide-react";

export const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/insights", label: "Articles", icon: BookOpen },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
];

export const FOOTER_LINKS = {
    intelligence: [
        { label: "Tokenomics Analyzer", href: "/analysis/analyzer" },
        { label: "Whale Watch", href: "/analysis/whales" },
        { label: "Meme Coin Scanner", href: "/discovery/spike-detector" },
    ],
    risk: [
        { label: "Security Scanner", href: "/discovery/scan" },
        { label: "Portfolio Tracker", href: "/portfolio" },
    ],
    utilities: [
        { label: "Avg Cost Calculator", href: "/finance/calculator" },
        { label: "Crypto Converter", href: "/finance/converter" },
        { label: "Fiat Exchange", href: "/finance/fiat-converter" },
    ],
    careers: [
        { label: "Web3 Jobs", href: "/jobs" },
        { label: "Salary Estimator", href: "/finance/salary-estimator" },
    ],
    resources: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "Trading Guides", href: "/guides" },
        { label: "API Access", href: "/api" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Contact", href: "/contact" },
    ]
};
