"use client";

import { useState, useEffect } from "react";
import { Wallet, PieChart, Activity, Lock, UserX, ShieldCheck } from "lucide-react";
import AssetDetail from "@/components/portfolio/asset-detail";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { PortfolioAsset, InvestmentScore, TokenData } from "@/types";
import { calculateInvestmentScore } from "@/lib/scoring";
import { getTokenData } from "@/lib/coingecko";
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { PortfolioChart } from "@/components/portfolio/PortfolioChart";
import { AddAssetDialog } from "@/components/portfolio/AddAssetDialog";
import { RelatedTools } from "@/components/gas/RelatedTools"; // Reusing existing RelatedTools

export default function PortfolioPage() {
    // State
    const [assets, setAssets] = useState<PortfolioAsset[]>([]);
    const [scores, setScores] = useState<Map<string, InvestmentScore>>(new Map());
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from local storage on mount
    useEffect(() => {
        const savedAssets = localStorage.getItem("apex_portfolio_assets");
        if (savedAssets) {
            const parsed = JSON.parse(savedAssets);
            setAssets(parsed);

            // Recalculate scores for loaded assets
            recalculateScores(parsed);
        }
        setLoading(false);
    }, []);

    // Save to local storage whenever assets change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("apex_portfolio_assets", JSON.stringify(assets));
        }
    }, [assets, loading]);

    const recalculateScores = async (currentAssets: PortfolioAsset[]) => {
        const newScores = new Map<string, InvestmentScore>();

        for (const asset of currentAssets) {
            const supplyRatio = asset.token.circulating_supply && asset.token.total_supply
                ? (asset.token.circulating_supply / asset.token.total_supply)
                : 1;

            const inflationRisk = (1 - supplyRatio) * 100; // Simplified

            const currentPrice = asset.token.current_price || 0;
            const supply = asset.token.total_supply || asset.token.circulating_supply || 0;
            const fdv = currentPrice * supply;

            const mcap = asset.token.market_cap;
            const fdvRatio = mcap ? fdv / mcap : 1;

            const scoreToken: TokenData = {
                ...asset.token,
                price: asset.token.current_price || 0,
                marketCap: asset.token.market_cap || 0,
                totalSupply: asset.token.total_supply || 0,
                circulatingSupply: asset.token.circulating_supply || 0,
                fdv: fdv,
                priceChange24h: asset.token.priceChange24h || 0,
                address: asset.id
            };

            const score = calculateInvestmentScore(scoreToken, inflationRisk, fdvRatio);
            newScores.set(asset.id, score);
        }
        setScores(newScores);
    };

    const handleAddAsset = async (tokenId: string, entryPrice: number, quantity: number, entryDate?: string) => {
        setLoading(true);
        // Fetch full token data
        const tokenData = await getTokenData(tokenId);

        if (!tokenData) {
            alert("Failed to fetch token data");
            setLoading(false);
            return;
        }

        const newAsset: PortfolioAsset = {
            id: crypto.randomUUID(),
            token: {
                ...tokenData,
                address: tokenData.id,
                price: tokenData.current_price,
                marketCap: tokenData.market_cap,
                totalSupply: tokenData.total_supply,
                circulatingSupply: tokenData.circulating_supply,
                fdv: tokenData.current_price * tokenData.total_supply,
                priceChange24h: tokenData.price_change_percentage_24h,
            },
            entryPrice,
            quantity,
            investedAmount: entryPrice * quantity,
            price: tokenData.current_price,
            entryDate
        };

        const updatedAssets = [...assets, newAsset];
        setAssets(updatedAssets);
        await recalculateScores(updatedAssets);
        setLoading(false);
    };

    const handleRemoveAsset = (assetId: string) => {
        const updated = assets.filter(a => a.id !== assetId);
        setAssets(updated);
        // Remove score
        const newScores = new Map(scores);
        newScores.delete(assetId);
        setScores(newScores);

        if (selectedAssetId === assetId) {
            setSelectedAssetId(null);
        }
    };

    const selectedAsset = assets.find(a => a.id === selectedAssetId);
    const selectedScore = selectedAssetId ? scores.get(selectedAssetId) : undefined;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Hero / Header Section */}
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex flex-wrap justify-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                            <UserX className="w-3.5 h-3.5" /> No Login Required
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                            <Lock className="w-3.5 h-3.5" /> No Wallet Connect
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 pb-2">
                        Privacy-First Portfolio
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Track your crypto net worth and analyze risk without connecting a wallet.
                        We store data locally in your browser.
                    </p>
                </div>

                {/* Dashboard Grid */}
                {assets.length > 0 ? (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        <PortfolioSummary assets={assets} />

                        <div className="w-full mb-8">
                            <div className="bg-card/40 border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                    <PieChart className="h-5 w-5 text-purple-400" />
                                    Portfolio Analysis
                                </h3>
                                <PortfolioChart assets={assets} />
                            </div>
                        </div>

                        {/* Asset Detail View (Conditionally Rendered Full Width) */}
                        {selectedAsset && (
                            <div className="w-full mb-8 animate-in slide-in-from-top-4 duration-500">
                                <div className="bg-card/40 border border-primary/20 rounded-xl p-1 shadow-2xl backdrop-blur-md">
                                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-primary/10 rounded-t-lg">
                                        <span className="font-bold text-lg flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-primary" />
                                            Deep Analysis: {selectedAsset.token.name}
                                        </span>
                                        <button
                                            onClick={() => setSelectedAssetId(null)}
                                            className="px-3 py-1 rounded-full bg-black/20 hover:bg-white/10 text-sm transition-colors border border-white/5"
                                        >
                                            Close Analysis
                                        </button>
                                    </div>
                                    <div className="overflow-hidden">
                                        <AssetDetail asset={selectedAsset} score={selectedScore} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table Section (Full Width) */}
                        <div className="w-full">
                            <div className="bg-card/40 border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Holdings
                                    </h3>
                                    <AddAssetDialog
                                        onAddAsset={handleAddAsset}
                                        existingAssets={assets.map(a => a.token.id).filter((id): id is string => !!id)}
                                    />
                                </div>
                                <PortfolioTable
                                    assets={assets}
                                    scores={scores}
                                    onRemoveAsset={handleRemoveAsset}
                                    onSelectAsset={setSelectedAssetId}
                                    selectedAssetId={selectedAssetId}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Check for Empty State */
                    <div className="max-w-md mx-auto mt-12 mb-20 p-8 border border-dashed border-white/20 rounded-2xl text-center bg-card/20 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Wallet className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Start Tracking</h2>
                        <p className="text-muted-foreground mb-8">
                            Add your first asset to see your net worth, P&L, and risk analysis.
                        </p>
                        <AddAssetDialog
                            onAddAsset={handleAddAsset}
                            existingAssets={assets.map(a => a.token.id).filter((id): id is string => !!id)}
                        />
                    </div>
                )}

                <RelatedTools />
            </div>
        </div>
    );
}
