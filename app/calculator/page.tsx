"use client";

import { useState, useEffect } from 'react';
import { Shield, Save, Share2, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetPicker } from '@/components/calculator/AssetPicker';
import { PurchaseTable } from '@/components/calculator/PurchaseTable';
import { ResultsCard } from '@/components/calculator/ResultsCard';
import { DCASimulator } from '@/components/calculator/DCASimulator';
import { PositionChart } from '@/components/calculator/PositionChart';
import { Asset, Purchase, CalculationResult, PnLResult } from '@/lib/types/calculator';
import { calculateAverageCost, calculatePnL } from '@/lib/calculator';
import { fetchCoinPrice } from '@/lib/api/coingecko';
import { cn } from '@/lib/utils';

export default function CalculatorPage() {
    // State
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [calculation, setCalculation] = useState<CalculationResult>({
        avgPrice: 0,
        totalCost: 0,
        totalQuantity: 0,
        breakEven: 0
    });
    const [pnl, setPnL] = useState<PnLResult>({
        currentValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        isProfit: false
    });

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('apexweb3_calculator_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.selectedAsset) setSelectedAsset(parsed.selectedAsset);
                if (parsed.purchases) setPurchases(parsed.purchases);
                if (parsed.currentPrice) setCurrentPrice(parsed.currentPrice);
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        const state = {
            selectedAsset,
            purchases,
            currentPrice
        };
        localStorage.setItem('apexweb3_calculator_state', JSON.stringify(state));
    }, [selectedAsset, purchases, currentPrice]);

    // Recalculate when inputs change
    useEffect(() => {
        const calc = calculateAverageCost(purchases);
        setCalculation(calc);

        // If no current price manually set, maybe default to last purchase price or 0
        // For now we keep it manual or 0
        const pnlCalc = calculatePnL(calc.avgPrice, currentPrice, calc.totalQuantity);
        setPnL(pnlCalc);

    }, [purchases, currentPrice]);


    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // ... (existing effects)

    const fetchPrice = async (assetId: string) => {
        setIsLoadingPrice(true);
        const price = await fetchCoinPrice(assetId);
        if (price) {
            setCurrentPrice(price);
        }
        setIsLoadingPrice(false);
    };

    const handleAssetSelect = async (asset: Asset) => {
        setSelectedAsset(asset);
        if (asset.id) {
            await fetchPrice(asset.id);
        }
    };

    const handleRefreshPrice = async () => {
        if (selectedAsset?.id) {
            await fetchPrice(selectedAsset.id);
        }
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to clear all data?')) {
            setPurchases([]);
            setSelectedAsset(undefined);
            setCurrentPrice(0);
        }
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Asset,Price,Quantity,Date\n"
            + purchases.map(p => `${selectedAsset?.symbol || 'Unknown'},${p.price},${p.quantity},${p.date}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "apex_calculator_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#0a0118] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-[#C77DFF] blur-[50px] opacity-20" />
                            <Shield className="h-16 w-16 text-[#C77DFF] relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#C77DFF] to-[#00D4FF]">
                        Average Cost Calculator
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Calculate your average entry price, track profit/loss, and optimize your position size for crypto, stocks, and forex.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                    {/* Main Input Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#13082a] border border-[#2a1b4e] rounded-xl p-6 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <AssetPicker onSelect={handleAssetSelect} selectedAsset={selectedAsset} />

                                <div className="w-full">
                                    <label className="text-sm text-gray-400 mb-2 block flex justify-between">
                                        <span>Current Price (USD)</span>
                                        {selectedAsset && (
                                            <button
                                                onClick={handleRefreshPrice}
                                                disabled={isLoadingPrice}
                                                className="text-[#C77DFF] hover:text-[#b05ad5] text-xs flex items-center gap-1 disabled:opacity-50"
                                            >
                                                <RefreshCw className={cn("h-3 w-3", isLoadingPrice && "animate-spin")} />
                                                {isLoadingPrice ? 'Fetching...' : 'Refresh'}
                                            </button>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={currentPrice || ''}
                                            onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                                            className="w-full h-10 pl-8 pr-3 rounded-md bg-[#0a0118] border border-[#2a1b4e] text-white focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/50"
                                            placeholder="Enter current market price"
                                        />
                                    </div>
                                </div>
                            </div>

                            <PurchaseTable purchases={purchases} setPurchases={setPurchases} />
                        </div>

                        {/* Charts */}
                        {calculation.totalQuantity > 0 && (
                            <PositionChart calculation={calculation} currentPrice={currentPrice} />
                        )}
                    </div>

                    {/* Sidebar / Results Column */}
                    <div className="space-y-6">
                        <ResultsCard
                            calculation={calculation}
                            pnl={pnl}
                            currentPrice={currentPrice}
                        />

                        <DCASimulator />

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="border-[#2a1b4e] hover:bg-[#2a1b4e]/50 text-gray-300" onClick={handleReset}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                            <Button variant="outline" className="border-[#2a1b4e] hover:bg-[#2a1b4e]/50 text-gray-300" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                            {/* Placeholders for future features */}
                            {/* 
               <Button variant="outline" className="col-span-2 border-[#C77DFF] text-[#C77DFF] hover:bg-[#C77DFF]/10">
                  <Save className="mr-2 h-4 w-4" /> Save to Portfolio
               </Button>
               */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
