
import { LayoutDashboard, FileText, BookOpen, HelpCircle, Briefcase } from "lucide-react";

export const NAV_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/docs", label: "Docs", icon: BookOpen },
    { href: "/guides", label: "Guides", icon: HelpCircle },
];

export const FOOTER_LINKS = {
    tools: [
        { label: "Web3 Jobs", href: "/jobs" },
        { label: "Tokenomics Analyzer", href: "/analyzer" },
        { label: "Portfolio Tracker", href: "/portfolio" },
        { label: "Crypto Converter", href: "/converter" },
        { label: "Fiat Exchange", href: "/fiat-converter" },
        { label: "Avg Cost Calculator", href: "/calculator" },
        { label: "Security Scanner", href: "/scan" },
        { label: "Whale Watch", href: "/whales" },
    ],
    resources: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "Trading Guides", href: "/guides" },
        { label: "API Access", href: "/api" },
        { label: "Changelog", href: "/changelog" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Contact", href: "/contact" },
    ]
};
