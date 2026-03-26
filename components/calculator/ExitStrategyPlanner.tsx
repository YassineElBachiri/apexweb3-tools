"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Target, TrendingUp, SlidersHorizontal, Calculator, DollarSign, Percent, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

export interface ExitStrategyPlannerProps {
    avgCost: number;
    totalQuantity: number;
    totalInvested: number;
    currentPrice: number;
    onPlanChange?: (planData: any) => void;
}

interface SellTarget {
    id: string;
    price: number;
    percentage: number;
}

export function ExitStrategyPlanner({
    avgCost,
    totalQuantity,
    totalInvested,
    currentPrice: marketPrice,
    onPlanChange
}: ExitStrategyPlannerProps) {
    // 1. "What If" Slider State
    const [useSimulatedPrice, setUseSimulatedPrice] = useState(false);
    const [sliderValue, setSliderValue] = useState(marketPrice || avgCost || 100);

    // Update slider when market price changes if not currently simulating
    useEffect(() => {
        if (!useSimulatedPrice && marketPrice > 0) {
            setSliderValue(marketPrice);
        }
    }, [marketPrice, useSimulatedPrice]);

    const activePrice = useSimulatedPrice ? sliderValue : marketPrice;

    // 2. Sell Target Ladder State
    const [targets, setTargets] = useState<SellTarget[]>([
        { id: '1', price: Number((avgCost * 1.5).toFixed(2)) || 0, percentage: 25 },
        { id: '2', price: Number((avgCost * 2.0).toFixed(2)) || 0, percentage: 25 }
    ]);

    const addTarget = () => {
        if (targets.length >= 5) return;
        setTargets([...targets, { id: Math.random().toString(), price: 0, percentage: 0 }]);
    };

    const updateTarget = (id: string, field: keyof SellTarget, value: number) => {
        setTargets(targets.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const removeTarget = (id: string) => {
        setTargets(targets.filter(t => t.id !== id));
    };

    const totalPercentage = targets.reduce((sum, t) => sum + t.percentage, 0);

    // Pass data to parent for CSV export
    useEffect(() => {
        if (onPlanChange) {
            onPlanChange({ targets, activePrice, avgCost, totalQuantity });
        }
    }, [targets, activePrice, avgCost, totalQuantity, onPlanChange]);

    // 3. Break-Even With Fees State
    const [exchangeFeePct, setExchangeFeePct] = useState(0.1);
    const [networkFeeUsd, setNetworkFeeUsd] = useState(0);

    const baseBreakEven = avgCost;
    // Fee calculation logic:
    // To break even, we need: Exit Revenue - Exchange Fee - Network Fee = Total Invested
    // Exit Revenue = Price * Qty
    // Exchange Fee = Exit Revenue * (FeePct / 100)
    // Price * Qty - Price * Qty * (FeePct / 100) - Network Fee = Total Invested
    // Price * Qty * (1 - FeePct/100) = Total Invested + Network Fee
    // Price = (Total Invested + Network Fee) / (Qty * (1 - FeePct/100))
    const feeMultiplier = 1 - (exchangeFeePct / 100);
    const breakEvenWithFees = totalQuantity > 0 && feeMultiplier > 0
        ? (totalInvested + networkFeeUsd) / (totalQuantity * feeMultiplier)
        : 0;
    const feeImpact = breakEvenWithFees - baseBreakEven;
    const totalFeeCostUsd = totalQuantity > 0 ? (breakEvenWithFees * totalQuantity * (exchangeFeePct/100)) + networkFeeUsd : 0;

    // 4. DCA Down Planner State
    const [targetAvgPrice, setTargetAvgPrice] = useState<number>(0);
    const [expectedDipPrice, setExpectedDipPrice] = useState<number>(0);

    // Required Buy = (Current Total Invested - Target Avg * Current Qty) / (Target Avg - Dip Price)
    // Only valid if Target Avg is between Dip Price and Current Avg
    const reqBuyQty = (targetAvgPrice > expectedDipPrice && targetAvgPrice < avgCost)
        ? (totalInvested - targetAvgPrice * totalQuantity) / (targetAvgPrice - expectedDipPrice)
        : 0;
    const reqBuyUsd = reqBuyQty * expectedDipPrice;
    const newPositionSize = totalQuantity + reqBuyQty;

    return (
        <div className="bg-[#13082a] border border-[#2a1b4e] rounded-xl p-6 mt-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="text-[#C77DFF] h-5 w-5" />
                    Exit Strategy Planner
                </h3>
                <span className="text-[10px] uppercase tracking-wider bg-[#2a1b4e]/60 text-[#C77DFF] px-2 py-1 rounded font-bold">
                    Advanced
                </span>
            </div>
            <p className="text-gray-400 text-sm mb-6">Plan your exits and simulate market conditions.</p>

            <Accordion type="multiple" className="w-full space-y-4">
                
                {/* 1. What If Price Slider */}
                <AccordionItem value="what-if" className="border border-[#2a1b4e] rounded-lg px-4 bg-[#0a0118]/50 data-[state=open]:bg-[#0a0118]">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <SlidersHorizontal className="h-4 w-4 text-[#00D4FF]" />
                            Real-Time &quot;What If&quot; Simulator
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                        <div className="flex justify-between items-end mb-4 text-sm">
                            <label className="text-gray-400 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={useSimulatedPrice}
                                    onChange={(e) => setUseSimulatedPrice(e.target.checked)}
                                    className="rounded border-[#2a1b4e] text-[#C77DFF] focus:ring-[#C77DFF] bg-[#0a0118]"
                                />
                                Override Market Price
                            </label>
                            <div className="text-right">
                                <p className="text-gray-400 text-xs">Simulated Price</p>
                                <p className={cn("text-xl font-bold", useSimulatedPrice ? "text-[#00D4FF]" : "text-white")}>
                                    ${activePrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                </p>
                            </div>
                        </div>

                        <div className="px-2 pt-6 pb-2">
                            <Slider
                                disabled={!useSimulatedPrice}
                                min={avgCost * 0.1 || 0}
                                max={avgCost * 5 || activePrice * 2 || 100}
                                step={(avgCost * 5) / 1000 || 0.1}
                                value={[activePrice]}
                                onValueChange={(val) => setSliderValue(val[0])}
                                className={cn("my-6", !useSimulatedPrice && "opacity-50")}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>-90%</span>
                                <span>Avg: ${avgCost.toFixed(2)}</span>
                                <span>+400%</span>
                            </div>
                            
                            {/* ROI Tooltip equivalent display */}
                            {totalInvested > 0 && useSimulatedPrice && (
                                <div className="mt-4 p-3 rounded-lg bg-[#2a1b4e]/30 border border-[#2a1b4e] flex justify-between items-center text-sm">
                                    <span className="text-gray-300">Simulated ROI:</span>
                                    <span className={cn("font-bold", activePrice >= avgCost ? "text-green-400" : "text-red-400")}>
                                        {((activePrice - avgCost) / avgCost * 100).toFixed(2)}% 
                                        ({((activePrice * totalQuantity) - totalInvested).toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
                                    </span>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. Staged Sell Target Ladder */}
                <AccordionItem value="sell-ladder" className="border border-[#2a1b4e] rounded-lg px-4 bg-[#0a0118]/50 data-[state=open]:bg-[#0a0118]">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            Staged Sell Target Ladder
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        {totalQuantity <= 0 ? (
                            <p className="text-sm text-gray-500 italic">Add purchases to plan your exit staging.</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {targets.map((target, index) => {
                                        const sellQty = totalQuantity * (target.percentage / 100);
                                        const revenue = sellQty * target.price;
                                        const costBasis = sellQty * avgCost;
                                        const profitUsd = revenue - costBasis;
                                        const profitPct = avgCost > 0 ? ((target.price - avgCost) / avgCost) * 100 : 0;
                                        
                                        // Calculate remaining
                                        const prevSoldPct = targets.slice(0, index).reduce((sum, t) => sum + t.percentage, 0);
                                        const remainingQty = totalQuantity * (1 - (prevSoldPct + target.percentage) / 100);
                                        const remainingValue = remainingQty * activePrice;

                                        return (
                                            <div key={target.id} className="p-4 rounded-lg bg-[#13082a] border border-[#2a1b4e] flex flex-col gap-3 relative overflow-hidden">
                                                {/* Progress Bar Background */}
                                                <div 
                                                    className="absolute inset-y-0 left-0 bg-green-500/5 -z-0 transition-all"
                                                    style={{ width: `${Math.min(100, Math.max(0, (activePrice / target.price) * 100))}%` }}
                                                />

                                                <div className="flex items-center justify-between z-10">
                                                    <span className="text-xs font-bold text-gray-400">STAGE {index + 1}</span>
                                                    <button onClick={() => removeTarget(target.id)} className="text-gray-500 hover:text-red-400 text-xs">
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 z-10">
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">TARGET PRICE ($)</label>
                                                        <Input 
                                                            type="number" 
                                                            value={target.price || ''}
                                                            onChange={(e) => updateTarget(target.id, 'price', Number(e.target.value))}
                                                            className="h-8 bg-[#0a0118] border-[#2a1b4e] text-white text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 block mb-1">SELL AMOUNT (%)</label>
                                                        <Input 
                                                            type="number" 
                                                            value={target.percentage || ''}
                                                            onChange={(e) => updateTarget(target.id, 'percentage', Number(e.target.value))}
                                                            className="h-8 bg-[#0a0118] border-[#2a1b4e] text-white text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#2a1b4e]/50 pt-2 mt-1 z-10">
                                                    <div>
                                                        <span className="text-gray-500 block">Estimated Profit</span>
                                                        <span className={profitUsd >= 0 ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                                                            ${profitUsd.toFixed(2)} ({profitPct.toFixed(2)}%)
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-gray-500 block">Remaining Holdings</span>
                                                        <span className="text-white font-medium">
                                                            {remainingQty.toLocaleString(undefined, {maximumFractionDigits: 4})} 
                                                            <span className="text-gray-500 ml-1">(@ ${activePrice.toFixed(2)} = ${remainingValue.toFixed(2)})</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className={cn("text-xs font-medium", totalPercentage > 100 ? "text-red-400" : "text-gray-400")}>
                                        Total Planned: {totalPercentage}% / 100%
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={addTarget}
                                        disabled={targets.length >= 5 || totalPercentage >= 100}
                                        className="border-[#C77DFF]/50 text-[#C77DFF] hover:bg-[#C77DFF]/10 h-8 text-xs"
                                    >
                                        + Add Target
                                    </Button>
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* 3. Break-Even With Fees */}
                <AccordionItem value="fees" className="border border-[#2a1b4e] rounded-lg px-4 bg-[#0a0118]/50 data-[state=open]:bg-[#0a0118]">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <Calculator className="h-4 w-4 text-amber-400" />
                            Break-Even & Fees Impact
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Percent className="h-3 w-3" /> Exchange Fee
                                </label>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={exchangeFeePct}
                                    onChange={(e) => setExchangeFeePct(Number(e.target.value))}
                                    className="bg-[#0a0118] border-[#2a1b4e] text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Network/Gas Fee
                                </label>
                                <Input 
                                    type="number" 
                                    value={networkFeeUsd || ''}
                                    onChange={(e) => setNetworkFeeUsd(Number(e.target.value))}
                                    placeholder="0.00"
                                    className="bg-[#0a0118] border-[#2a1b4e] text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 bg-[#13082a] border border-[#2a1b4e]/50 rounded-lg p-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Base Avg Cost:</span>
                                <span className="text-white font-medium">${baseBreakEven.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Fee Impact:</span>
                                <span className="text-amber-400 font-medium">+${feeImpact.toFixed(4)}</span>
                            </div>
                            <div className="w-full h-px bg-[#2a1b4e]/50 my-1" />
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 font-semibold">True Break-Even:</span>
                                <span className="text-xl font-bold text-amber-500">${breakEvenWithFees.toFixed(4)}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 text-right mt-1">
                                Estimated total fees to exit: ${totalFeeCostUsd.toFixed(2)}
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. DCA Down Planner */}
                <AccordionItem value="dca-down" className="border border-[#2a1b4e] rounded-lg px-4 bg-[#0a0118]/50 data-[state=open]:bg-[#0a0118]">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <ArrowRight className="h-4 w-4 text-[#C77DFF] rotate-45" />
                            DCA Down Planner
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Expected Dip Price ($)</label>
                                <Input 
                                    type="number" 
                                    value={expectedDipPrice || ''}
                                    onChange={(e) => setExpectedDipPrice(Number(e.target.value))}
                                    placeholder="Enter dip price"
                                    className="bg-[#0a0118] border-[#2a1b4e] text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Target Avg Price ($)</label>
                                <Input 
                                    type="number" 
                                    value={targetAvgPrice || ''}
                                    onChange={(e) => setTargetAvgPrice(Number(e.target.value))}
                                    placeholder={`Must be < ${avgCost.toFixed(2)}`}
                                    className="bg-[#0a0118] border-[#2a1b4e] text-white"
                                />
                            </div>
                        </div>

                        {targetAvgPrice > 0 && expectedDipPrice > 0 && (
                            <div className="bg-[#13082a] border border-[#2a1b4e]/50 rounded-lg p-4 text-center">
                                {targetAvgPrice >= avgCost ? (
                                    <p className="text-amber-400 text-sm">Target Average must be lower than your current Average Cost (${avgCost.toFixed(2)}).</p>
                                ) : targetAvgPrice <= expectedDipPrice ? (
                                    <p className="text-amber-400 text-sm">Target Average must be higher than the Dip Price.</p>
                                ) : (
                                    <>
                                        <p className="text-gray-400 text-xs mb-1">Required Buy Amount</p>
                                        <p className="text-2xl font-bold text-[#00D4FF] mb-1">
                                            ${reqBuyUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {reqBuyQty.toLocaleString(undefined, { maximumFractionDigits: 4 })} coins
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-[#2a1b4e]/50 flex justify-between text-xs">
                                            <span className="text-gray-500">New Position Size:</span>
                                            <span className="text-white font-medium">{newPositionSize.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
