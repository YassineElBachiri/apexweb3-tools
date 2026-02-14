"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DCASimulator() {
    const [amount, setAmount] = useState(100);
    const [frequency, setFrequency] = useState('weekly');
    const [duration, setDuration] = useState(12); // months

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

            <div className="p-4 bg-[#0a0118] rounded-lg border border-[#2a1b4e]/50 text-center">
                <p className="text-gray-400 text-sm mb-2">Projected Investment</p>
                <p className="text-2xl font-bold text-white">
                    ${(amount * (frequency === 'weekly' ? 4 : frequency === 'daily' ? 30 : 1) * duration).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    *Estimation based on stable prices. Past performance does not guarantee future results.
                </p>
            </div>

            <div className="mt-4 flex justify-end">
                <Button variant="outline" className="border-[#C77DFF] text-[#C77DFF] hover:bg-[#C77DFF]/10">
                    Run Detailed Simulation
                </Button>
            </div>
        </div>
    );
}
