"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchGasFees, fetchNativeTokenPrice, SupportedChainId } from "@/lib/gas";
import { Skeleton } from "@/components/ui/skeleton";

interface CostEstimatorProps {
    chainId: SupportedChainId;
}

const TX_TYPES = [
    { id: "transfer", name: "ETH/Native Transfer", limit: 21000 },
    { id: "erc20", name: "USDT/ERC20 Transfer", limit: 65000 },
    { id: "swap", name: "Uniswap Swap", limit: 150000 }, // Approx
    { id: "nft_mint", name: "NFT Mint", limit: 160000 },
    { id: "deploy", name: "Contract Deployment", limit: 2000000 }, // Rough avg for medium contract
];

export function CostEstimator({ chainId }: CostEstimatorProps) {
    const [txType, setTxType] = useState("transfer");
    const [customLimit, setCustomLimit] = useState("21000");
    const [gasPrice, setGasPrice] = useState<number | null>(null); // in Gwei
    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        try {
            const [fees, price] = await Promise.all([
                fetchGasFees(chainId),
                fetchNativeTokenPrice(chainId)
            ]);
            // Use 'Fast' for estimation to be safe
            setGasPrice(parseFloat(fees.fast.maxFeePerGas));
            setTokenPrice(price);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [chainId]);

    useEffect(() => {
        const predef = TX_TYPES.find(t => t.id === txType);
        if (predef) setCustomLimit(predef.limit.toString());
    }, [txType]);

    // Calc
    const isSolana = chainId === "solana";
    const isSui = chainId === "sui";

    // Limits / multipliers
    // EVM: Limit (units) * Price (Gwei) / 1e9 = ETH
    // Solana: Price is usually Lamports per sig. Limit is "signatures"? Or compute units. 
    // Simply: We'll treat "Gas Limit" as "Compute Units" or "Signatures" for advanced users, 
    // but for "Standard" types we just use the fetched fee (which is per-sig) * count?
    // Let's simplify: 
    // Solana Fee = (Base 5000 + Priority uLamports) per sig.
    // Sui Fee = Storage + Comp * RefPrice. 

    // For MVP, we will assume "Gas Price" field holds the "Fee Per Basic Unit"
    // and "Limit" is 1 for basic transfers on Sol/Sui, or custom.

    let costEth = 0;
    const priceVal = gasPrice || 0;
    const limitVal = parseInt(customLimit) || 0;

    if (isSolana) {
        // Price is in MicroLamports (from our API fetcher logic) or Lamports?
        // In our fetcher: standard = avgPriority (MicroLamports). 
        // Base is 5000 Lamports.
        // Total Cost (Lamports) = 5000 + (PriorityMicro / 1e6)? No, usually Priority is in MicroLamports per Compute Unit.
        // Let's assume the fetcher returns what we display: "MicroLamports".
        // 1 SOL = 1e9 Lamports.

        // Simplified Model: Price is TOTAL FEE in Lamports for a standard tx? 
        // Our fetcher returns "avgPriority".
        // Let's assume Cost ~ (5000 + priceVal) Lamports [Very ROUGH]
        costEth = (5000 + priceVal) / 1e9;
    } else if (isSui) {
        // Price is MIST. 1 SUI = 1e9 MIST.
        // Cost = Price * Limit (Gas Budget?)
        // Standard transfer ~ 1-2k MIST?
        costEth = (priceVal * 1000) / 1e9; // 1000 gas units arbitrary
        if (txType === 'deploy') costEth = (priceVal * 100000) / 1e9;
    } else {
        // EVM
        costEth = (limitVal * priceVal) / 1e9;
    }

    const costUsd = costEth * tokenPrice;
    const unit = isSolana ? "SOL" : isSui ? "SUI" : "ETH";
    const priceUnit = isSolana ? "uLamports" : isSui ? "MIST" : "Gwei";

    return (
        <Card className="border-white/10 bg-card/40 backdrop-blur-sm h-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select value={txType} onValueChange={setTxType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="transfer">Standard Transfer</SelectItem>
                            {(!isSolana && !isSui) && (
                                <>
                                    <SelectItem value="erc20">ERC20 / High Comp</SelectItem>
                                    <SelectItem value="swap">Swap / DeFi</SelectItem>
                                    <SelectItem value="nft_mint">NFT Mint</SelectItem>
                                </>
                            )}
                            <SelectItem value="deploy">Contract Deployment</SelectItem>
                            <SelectItem value="custom">Custom Gas Limit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Gas Limit / Units</Label>
                    <Input
                        type="number"
                        value={customLimit}
                        onChange={(e) => {
                            setCustomLimit(e.target.value);
                            setTxType("custom");
                        }}
                        className="font-mono bg-background/50"
                    />
                </div>

                {/* Results Box */}
                <div className="bg-background/40 p-4 rounded-lg border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Estimated Cost (USD)</span>
                        <span className="font-bold text-xl text-green-400">
                            {loading ? <Skeleton className="h-6 w-20 inline-block" /> : `$${costUsd.toFixed(4)}`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Native Cost</span>
                        <span className="font-mono">
                            {loading ? "..." : `${costEth.toFixed(6)} ${unit}`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-white/5 mt-2">
                        <span>Gas Price Used</span>
                        <span className="font-mono">{priceVal} {priceUnit}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
