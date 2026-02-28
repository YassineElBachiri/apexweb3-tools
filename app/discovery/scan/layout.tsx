import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
    title: "Smart Contract Security Scanner - Free Rug Pull & Honeypot Detector | ApexWeb3",
    description: "Free cryptocurrency security scanner. Detect rug pulls, honeypots, and scam tokens before investing. Verify contract ownership, liquidity locks, and malicious code patterns. Protect your crypto investments.",
    keywords: [
        "crypto security scanner",
        "honeypot detector",
        "rug pull detector",
        "smart contract scanner",
        "token security check",
        "scam token detector",
        "liquidity lock checker",
        "contract verification",
        "crypto scam prevention",
        "token safety analysis",
    ],
    canonical: "/scan",
});

export { default } from "./page";
