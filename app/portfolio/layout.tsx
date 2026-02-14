import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
    title: "Crypto Portfolio Tracker - Free Multi-Chain Portfolio Manager | ApexWeb3",
    description: "Track your cryptocurrency portfolio privately across all blockchains. Real-time P&L calculations, asset allocation, performance analytics. No wallet connection required. Your data stays on your device.",
    keywords: [
        "crypto portfolio tracker",
        "cryptocurrency portfolio manager",
        "bitcoin portfolio tracker",
        "crypto holdings tracker",
        "multi-chain portfolio",
        "private portfolio tracker",
        "crypto profit loss calculator",
        "asset allocation tracker",
        "cryptocurrency tax reporting",
        "portfolio performance analytics",
    ],
    canonical: "/portfolio",
});

export { default } from "./page";
