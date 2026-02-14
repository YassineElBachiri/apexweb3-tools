"use client";

import { useState, useEffect } from "react";
import { Wallet, PieChart, Activity } from "lucide-react";
import AddAsset from "@/components/portfolio/add-asset";
import AssetDetail from "@/components/portfolio/asset-detail";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { PortfolioAsset, InvestmentScore, TokenData } from "@/types";
import { calculateInvestmentScore } from "@/lib/scoring";
import { getTokenData } from "@/lib/coingecko";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/seo/faq-section";
import { RelatedTools } from "@/components/seo/related-tools";
import { portfolioFAQs } from "@/lib/seo-content/portfolio-faq";

const relatedTools = [
    {
        name: "Tokenomics Analyzer",
        description: "Analyze token fundamentals before adding to portfolio",
        href: "/analyzer",
    },
    {
        name: "Security Scanner",
        description: "Scan tokens for scams before investing",
        href: "/scan",
    },
    {
        name: "Whale Watch",
        description: "Follow smart money movements",
        href: "/whales",
    },
];

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

    const handleAddAsset = async (tokenId: string, entryPrice: number, investedAmount?: number, entryDate?: string) => {
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
            investedAmount,
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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <PieChart className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">My Portfolio</h1>
                </div>
                <p className="text-muted-foreground">
                    Track your assets and analyze their potential with our AI-powered scoring system.
                </p>
            </div>

            {/* Main Layout - Stacked Components (Rows) */}
            <div className="space-y-8 max-w-5xl mx-auto">
                {/* 1. Add Asset Component */}
                <AddAsset
                    onAddAsset={handleAddAsset}
                    existingAssets={assets.map(a => a.token.id).filter((id): id is string => !!id)}
                />

                {/* 2. Portfolio Table */}
                <div className="bg-card rounded-xl border border-border overflow-hidden glow-card">
                    <div className="p-4 border-b border-border bg-card/50 flex justify-between items-center">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Your Assets
                        </h3>
                        <span className="text-sm text-muted-foreground">{assets.length} assets</span>
                    </div>
                    {assets.length > 0 ? (
                        <PortfolioTable
                            assets={assets}
                            scores={scores}
                            onRemoveAsset={handleRemoveAsset}
                            onSelectAsset={setSelectedAssetId}
                            selectedAssetId={selectedAssetId}
                        />
                    ) : (
                        <div className="p-12 text-center text-muted-foreground">
                            <p>No assets added yet.</p>
                        </div>
                    )}
                </div>

                {/* 3. Asset Details (Conditional) */}
                {selectedAsset && (
                    <div id="asset-detail-view" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4 bg-muted/20 p-2 rounded-lg">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-secondary" />
                                Deep Analysis: {selectedAsset.token.name}
                            </h3>
                            <button
                                onClick={() => setSelectedAssetId(null)}
                                className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                            >
                                Close View
                            </button>
                        </div>
                        <AssetDetail asset={selectedAsset} score={selectedScore} />
                    </div>
                )}
            </div>
        </div>
    );
}
