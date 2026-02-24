"use client";

import { useEffect, useState, useCallback } from "react";
import { GasPriceData, SupportedChainId, fetchGasFees, fetchNativeTokenPrice } from "@/lib/gas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge, Zap, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GasDashboardProps {
    initialChainId?: SupportedChainId;
}

const CHAINS = [
    { id: 1, name: "Ethereum Mainnet" },
    { id: 42161, name: "Arbitrum One" },
    { id: 10, name: "Optimism" },
    { id: 8453, name: "Base" },
    { id: 137, name: "Polygon" },
    { id: 11155111, name: "Sepolia Testnet" },
];

export function GasDashboard({ initialChainId = 1 }: GasDashboardProps) {
    const [chainId, setChainId] = useState<SupportedChainId>(initialChainId);
    const [gasData, setGasData] = useState<GasPriceData | null>(null);
    const [tokenPrice, setTokenPrice] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refresh = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [data, price] = await Promise.all([
                fetchGasFees(chainId),
                fetchNativeTokenPrice(chainId)
            ]);
            setGasData(data);
            setTokenPrice(price);
        } catch (err) {
            setError("Failed to fetch gas data. Access to RPC might be limited.");
        } finally {
            setLoading(false);
            // Re-fetch every 15s automatically? Maybe overkill for this strict component, let user refresh.
        }
    }, [chainId]);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 15000); // Auto-refresh every 15s
        return () => clearInterval(interval);
    }, [refresh]);

    // Derived Display Data
    const isSolana = chainId === "solana";
    const isSui = chainId === "sui";
    const unit = isSolana ? "Lamports" : isSui ? "MIST" : "Gwei";

    const PriceCard = ({ title, fee, icon: Icon, colorClass }: any) => (
        <Card className={`border-white/10 bg-card/40 backdrop-blur-sm ${loading ? 'opacity-80' : ''}`}>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
                <div className={`p-3 rounded-full ${colorClass} bg-opacity-20 mb-2`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{title}</div>
                <div className="text-3xl font-bold font-mono">
                    {loading ? <Skeleton className="h-8 w-16" /> : fee?.maxFeePerGas}
                    <span className="text-xs text-muted-foreground ml-1 font-sans">{unit}</span>
                </div>
                {tokenPrice > 0 && !loading && fee && (
                    <div className="text-xs text-muted-foreground">
                        {isSolana || isSui ? (
                            // Solana/Sui logic: Fee is strict (e.g. 5000 Lamports) + Priority.
                            // 1 SOL = 1e9 Lamports.
                            `~$${((parseFloat(fee.maxFeePerGas) / 1e9) * tokenPrice).toFixed(6)}`
                        ) : (
                            // EVM Logic: 21000 gas * price Gwei / 1e9
                            `~$${((parseFloat(fee.maxFeePerGas) * 21000) / 1e9 * tokenPrice).toFixed(2)}`
                        )}
                        {(!isSolana && !isSui) && " (Transfer)"}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/30 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Select Network:</span>
                    <Select value={String(chainId)} onValueChange={(v) => setChainId((isNaN(Number(v)) ? v : Number(v)) as SupportedChainId)}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="sui">Sui</SelectItem>
                            <div className="h-px bg-white/10 my-1" />
                            {CHAINS.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    {tokenPrice > 0 && (
                        <div className="text-sm bg-background/50 px-3 py-1.5 rounded-md border border-white/5">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-mono font-medium text-green-400">${tokenPrice.toLocaleString()}</span>
                        </div>
                    )}
                    <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PriceCard
                    title="Standard"
                    fee={gasData?.standard}
                    icon={Gauge}
                    colorClass="text-blue-500 bg-blue-500"
                />
                <PriceCard
                    title="Fast"
                    fee={gasData?.fast}
                    icon={TrendingUp}
                    colorClass="text-purple-500 bg-purple-500"
                />
                <PriceCard
                    title="Instant"
                    fee={gasData?.instant}
                    icon={Zap}
                    colorClass="text-green-500 bg-green-500"
                />
            </div>

            {/* EIP-1559 Details Block */}
            {gasData && !loading && (
                <div className="bg-card/20 rounded-lg p-4 text-xs font-mono text-muted-foreground border border-white/5 flex gap-6 justify-center">
                    <div>Base Fee: {gasData.baseFee} {unit}</div>
                    <div>Last Updated: {new Date(gasData.lastUpdated).toLocaleTimeString()}</div>
                </div>
            )}
        </div>
    );
}
