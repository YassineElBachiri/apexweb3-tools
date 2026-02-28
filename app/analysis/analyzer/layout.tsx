import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
    title: "Crypto Tokenomics Analyzer - Free Investment Score Analysis | ApexWeb3",
    description: "Analyze cryptocurrency tokenomics with our free tool. Get 0-100 investment scores based on supply distribution, inflation risk, market cap, and sustainability metrics. Supports 10,000+ tokens across all chains.",
    keywords: [
        "tokenomics analyzer",
        "crypto tokenomics",
        "token analysis",
        "cryptocurrency investment score",
        "supply distribution analysis",
        "inflation risk calculator",
        "crypto fundamental analysis",
        "token economics",
        "fdv market cap ratio",
        "circulating supply",
    ],
    canonical: "/analysis/analyzer",
});

export { default } from "./page";
