import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SearchInputType, SearchResult } from "@/types";

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Detect input type (wallet address vs token contract)
 */
export function detectInputType(input: string): SearchInputType {
    const trimmed = input.trim();

    if (isValidAddress(trimmed)) {
        // Both wallets and tokens use the same address format
        // We'll need additional logic or user selection to differentiate
        return "wallet"; // Default to wallet for now
    }

    return "unknown";
}

/**
 * Validate and parse search input
 */
export function parseSearchInput(input: string): SearchResult {
    const trimmed = input.trim();
    const type = detectInputType(trimmed);

    const result: SearchResult = {
        type,
        value: trimmed,
        isValid: type !== "unknown",
    };

    if (result.isValid) {
        // Determine route based on type
        if (type === "wallet") {
            result.route = `/portfolio/${trimmed}`;
        } else if (type === "token") {
            result.route = `/token/${trimmed}`;
        }
    }

    return result;
}

/**
 * Format large numbers with abbreviations (K, M, B, T)
 */
export function formatNumber(num: number, decimals: number = 2): string {
    if (num === 0) return "0";

    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum >= 1e12) {
        return sign + (absNum / 1e12).toFixed(decimals) + "T";
    }
    if (absNum >= 1e9) {
        return sign + (absNum / 1e9).toFixed(decimals) + "B";
    }
    if (absNum >= 1e6) {
        return sign + (absNum / 1e6).toFixed(decimals) + "M";
    }
    if (absNum >= 1e3) {
        return sign + (absNum / 1e3).toFixed(decimals) + "K";
    }

    return sign + absNum.toFixed(decimals);
}

/**
 * Format USD currency
 */
export function formatUSD(amount: number, decimals: number = 2): string {
    return "$" + formatNumber(amount, decimals);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    const sign = value >= 0 ? "+" : "";
    return sign + value.toFixed(decimals) + "%";
}

/**
 * Calculate inflation risk ratio
 * Formula: (Total Supply - Circulating Supply) / Circulating Supply
 */
export function calculateInflationRisk(
    totalSupply: number,
    circulatingSupply: number
): number {
    if (circulatingSupply === 0) return 0;
    return ((totalSupply - circulatingSupply) / circulatingSupply) * 100;
}

/**
 * Determine risk level based on inflation ratio
 */
export function getRiskLevel(inflationRatio: number): "low" | "medium" | "high" {
    if (inflationRatio > 200) return "high"; // > 2.0 ratio
    if (inflationRatio > 100) return "medium"; // > 1.0 ratio
    return "low";
}

/**
 * Calculate sustainability score (0-100)
 * Lower inflation risk = higher score
 */
export function calculateSustainabilityScore(inflationRatio: number): number {
    // Inverse relationship: higher inflation = lower score
    const score = Math.max(0, 100 - inflationRatio / 3);
    return Math.min(100, Math.max(0, score));
}

/**
 * Get color class based on risk level
 */
export function getRiskColor(risk: "low" | "medium" | "high"): string {
    switch (risk) {
        case "low":
            return "text-success";
        case "medium":
            return "text-warning";
        case "high":
            return "text-danger";
    }
}

/**
 * Get color class for price change
 */
export function getPriceChangeColor(change: number): string {
    return change >= 0 ? "text-success" : "text-danger";
}

/**
 * Shorten address for display (0x1234...5678)
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (!isValidAddress(address)) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp to relative time
 */
export function formatTimeAgo(timestamp: number | string): string {
    const time = typeof timestamp === "string" ? new Date(timestamp).getTime() : timestamp;

    if (isNaN(time)) {
        return "Recently";
    }

    const seconds = Math.floor((Date.now() - time) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Save to localStorage with error handling
 */
export function saveToLocalStorage(key: string, value: any): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

/**
 * Load from localStorage with error handling
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
}
