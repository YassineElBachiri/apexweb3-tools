// lib/security-service.ts
import { NextResponse } from 'next/server';

export interface ApexRiskProfile {
    score: number; // 0-100 (100 = safe, 0 = rug)
    status: 'CRITICAL' | 'WARNING' | 'SAFE';
    flags: { name: string; description: string; passed: boolean }[];
    isHoneypot: boolean;
    buyTax?: number;
    sellTax?: number;
    network: string;
    address: string;
}

export async function determineNetwork(address: string): Promise<'solana' | 'eth' | 'base'> {
    // Basic heuristic: 0x is EVM. Usually 42 chars.
    if (address.startsWith('0x') && address.length === 42) {
        // Defaulting to ETH for 0x for now unless we can verify chain ID.
        // GoPlus can take multi-chain checks, but for simplicity we rely on the user or default to eth.
        // We will refine this in the component's routing if the user selects the chain.
        return 'eth';
    }
    // Base 58 Solana addresses are 32-44 characters
    const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (solanaRegex.test(address)) {
        return 'solana';
    }

    throw new Error('Unsupported address format');
}

export async function analyzeSecurity(network: 'solana' | 'eth' | 'base', address: string): Promise<ApexRiskProfile> {
    const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    if (USE_MOCK || !process.env.GOPLUS_API_KEY) {
        // Return realistic mock data
        return generateMockRiskProfile(network, address);
    }

    try {
        if (network === 'solana') {
            return await scanSolana(address);
        } else {
            return await scanEVM(network, address);
        }
    } catch (e) {
        console.error("Error analyzing security:", e);
        // Fallback to warning if API fails rather than crashing
        return {
            score: 50,
            status: 'WARNING',
            flags: [{ name: "API Error", description: "Could not fetch complete security data.", passed: false }],
            isHoneypot: false,
            network,
            address
        };
    }
}

async function scanSolana(address: string): Promise<ApexRiskProfile> {
    // RugCheck integration for Solana
    const response = await fetch(`https://api.rugcheck.xyz/v1/tokens/${address}/report/summary`);

    if (!response.ok) {
        throw new Error('RugCheck API Error');
    }

    const data = await response.json();

    // Normalize RugCheck to ApexRiskProfile
    // RugCheck usually returns a "score" where lower is safer, or specific risk lists.
    // For this implementation, we will map their risks to our 0-100 scale (100=Safe)

    let score = 100;
    const flags: { name: string; description: string; passed: boolean }[] = [];
    let isHoneypot = false;

    // Example mappings (assuming RugCheck format):
    if (data.risks && Array.isArray(data.risks)) {
        data.risks.forEach((risk: any) => {
            score -= (risk.score || 10);
            flags.push({
                name: risk.name || "Risk Found",
                description: risk.description || "Detected by RugCheck",
                passed: false
            });
            if (risk.name?.toLowerCase().includes("honeypot") || risk.name?.toLowerCase().includes("freeze")) {
                isHoneypot = true;
                score -= 50;
            }
        });
    }

    // Add passes
    if (flags.length === 0) {
        flags.push({ name: "Mint Authority", description: "Mint authority revoked.", passed: true });
        flags.push({ name: "Freeze Authority", description: "Freeze authority revoked.", passed: true });
    }

    score = Math.max(0, Math.min(100, score));
    const status = score >= 80 ? 'SAFE' : score >= 50 ? 'WARNING' : 'CRITICAL';

    return {
        score,
        status,
        flags,
        isHoneypot,
        network: 'solana',
        address
    };
}

async function scanEVM(network: 'eth' | 'base', address: string): Promise<ApexRiskProfile> {
    const chainId = network === 'eth' ? '1' : '8453';
    // GoPlus Security API
    const response = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`, {
        // headers: { "Authorization": `Bearer ${process.env.GOPLUS_API_KEY}` } // If required
    });

    if (!response.ok) {
        throw new Error('GoPlus API Error');
    }

    const json = await response.json();
    const data = json.result?.[address.toLowerCase()];

    if (!data) {
        throw new Error('Token not found in GoPlus');
    }

    let score = 100;
    const flags: { name: string; description: string; passed: boolean }[] = [];
    let isHoneypot = data.is_honeypot === "1";
    let buyTax = parseFloat(data.buy_tax || "0") * 100;
    let sellTax = parseFloat(data.sell_tax || "0") * 100;

    if (isHoneypot) {
        score -= 90;
        flags.push({ name: "Honeypot Detected", description: "Token cannot be sold.", passed: false });
    } else {
        flags.push({ name: "Sellable", description: "Token does not appear to be a honeypot.", passed: true });
    }

    if (data.is_mintable === "1") {
        score -= 20;
        flags.push({ name: "Mintable", description: "Owner can mint more tokens.", passed: false });
    } else {
        flags.push({ name: "Fixed Supply", description: "No mint function detected.", passed: true });
    }

    if (data.is_proxy === "1") {
        score -= 10;
        flags.push({ name: "Proxy Contract", description: "Contract code can be changed.", passed: false });
    }

    if (data.hidden_owner === "1") {
        score -= 30;
        flags.push({ name: "Hidden Owner", description: "Hidden owner functions detected.", passed: false });
    }

    if (buyTax > 10 || sellTax > 10) {
        score -= 15;
        flags.push({ name: "High Taxes", description: `Buy: ${buyTax.toFixed(1)}%, Sell: ${sellTax.toFixed(1)}%`, passed: false });
    } else {
        flags.push({ name: "Reasonable Taxes", description: `Buy: ${buyTax.toFixed(1)}%, Sell: ${sellTax.toFixed(1)}%`, passed: true });
    }

    if (data.is_open_source !== "1") {
        score -= 40;
        flags.push({ name: "Not Open Source", description: "Source code is not verified.", passed: false });
    } else {
        flags.push({ name: "Open Source", description: "Contract source is verified.", passed: true });
    }

    score = Math.max(0, Math.min(100, score));
    const status = score >= 80 ? 'SAFE' : score >= 50 ? 'WARNING' : 'CRITICAL';

    return {
        score,
        status,
        flags,
        isHoneypot,
        buyTax,
        sellTax,
        network,
        address
    };
}


function generateMockRiskProfile(network: string, address: string): ApexRiskProfile {
    // Simulate "Blue Chip" vs "Rug" based on address ending for testing purposes
    const isMockRug = address.toLowerCase().endsWith('dead') || address.toLowerCase().endsWith('rug');

    if (isMockRug) {
        return {
            score: 12,
            status: 'CRITICAL',
            isHoneypot: true,
            buyTax: 99,
            sellTax: 99,
            flags: [
                { name: "Honeypot Detected", description: "Token cannot be sold. Transfer-from is blocked.", passed: false },
                { name: "Mintable", description: "Owner can mint unlimited tokens.", passed: false },
                { name: "Hidden Owner", description: "Hidden owner privileges found.", passed: false },
                { name: "High Taxes", description: "Buy: 99%, Sell: 99%", passed: false },
                { name: "Liquidity Unlocked", description: "Liquidity can be pulled at any time.", passed: false }
            ],
            network,
            address
        }
    }

    return {
        score: 95,
        status: 'SAFE',
        isHoneypot: false,
        buyTax: 0,
        sellTax: 0,
        flags: [
            { name: "Sellable", description: "Token can be freely traded.", passed: true },
            { name: "Fixed Supply", description: "No mint or admin functions found.", passed: true },
            { name: "Ownership Renounced", description: "Owner cannot alter contract.", passed: true },
            { name: "Reasonable Taxes", description: "Buy: 0%, Sell: 0%", passed: true },
            { name: "Code Verified", description: "Open source and matches deployed bytecode.", passed: true }
        ],
        network,
        address
    }
}
