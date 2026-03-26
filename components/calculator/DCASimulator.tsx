"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface DCASimulatorProps {
    currentQuantity?: number;
    currentInvested?: number;
    currentPrice?: number;
}

export function DCASimulator({
    currentQuantity = 0,
    currentInvested = 0,
    currentPrice = 0,
}: DCASimulatorProps) {
    const [amount, setAmount] = useState(100);
    const [frequency, setFrequency] = useState('weekly');
    const [duration, setDuration] = useState(12); // months

    // Frequency multiplier per month
    const getMultiplier = () => {
        if (frequency === 'daily') return 30;
        if (frequency === 'weekly') return 4.33; // ~4.33 weeks in a month
        return 1;
    };

    const totalPeriods = getMultiplier() * duration;
    const projectedNewInvestmentUsd = amount * totalPeriods;
    
    // Simulations assuming purchase at currentPrice
    const projectedCoinsAcquired = currentPrice > 0 ? projectedNewInvestmentUsd / currentPrice : 0;
    const newTotalQuantity = currentQuantity + projectedCoinsAcquired;
    const newTotalInvested = currentInvested + projectedNewInvestmentUsd;
    const newAverageCost = newTotalQuantity > 0 ? newTotalInvested / newTotalQuantity : 0;

    return (
        <div className="bg-[#13082a] border border-[#2a1b4e] rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00D4FF]">DCA</span> Simulator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Investment Amount ($)</label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-[#0a0118] border-[#2a1b4e] text-white"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Frequency</label>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-[#0a0118] border border-[#2a1b4e] text-white focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/50"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Duration (Months)</label>
                    <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="bg-[#0a0118] border-[#2a1b4e] text-white"
                    />
                </div>
            </div>

            <div className="bg-[#0a0118] border border-[#2a1b4e]/50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 gap-y-6">
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">New Investment</p>
                        <p className="text-lg font-bold text-white">
                            ${projectedNewInvestmentUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Added Coins</p>
                        <p className="text-lg font-bold text-[#C77DFF]">
                            {currentPrice > 0 
                                ? `+${projectedCoinsAcquired.toLocaleString(undefined, { maximumFractionDigits: 4 })}` 
                                : 'Need Price'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Projected Total Holdings</p>
                        <p className="text-lg font-bold text-white">
                            {newTotalQuantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </p>
                        {newTotalQuantity > 0 && currentInvested > 0 && (
                            <span className="text-xs text-gray-500">
                                (${newTotalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })} total)
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Projected New Average</p>
                        <p className="text-lg font-bold text-[#00D4FF]">
                            {newAverageCost > 0 
                                ? `$${newAverageCost.toLocaleString(undefined, { maximumFractionDigits: 4 })}` 
                                : '---'}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-gray-500 text-center">
                *Simulates adding to your existing position at the current market price (${currentPrice.toFixed(2)}).
            </p>
        </div>
    );
}
