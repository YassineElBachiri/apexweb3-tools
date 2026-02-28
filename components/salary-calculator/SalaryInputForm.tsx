
"use client";

import { useState, useEffect } from "react";
import { SalaryInput, SalaryAllocation, FiatCurrency, PaymentFrequency, CryptoAsset } from "@/types/salary-calculator";
import { CryptoSelector } from "./CryptoSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // We'll mock this if needed or use basic select
import { Slider } from "@/components/ui/slider"; // Check if exists
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdvancedToggle } from "./AdvancedToggle";
import { TooltipHelper } from "./TooltipHelper";
import { Trash2, Plus, Globe, Wallet, TrendingUp } from "lucide-react";

// Mock Select if needed, or use standard HTML select for robustness
const StandardSelect = ({ value, onChange, options, className }: any) => (
    <div className={className}>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

interface SalaryInputFormProps {
    value: SalaryInput;
    onChange: React.Dispatch<React.SetStateAction<SalaryInput>>;
    onCalculate: () => void;
    loading: boolean;
}

export function SalaryInputForm({ value, onChange, onCalculate, loading }: SalaryInputFormProps) {
    const [isAdvanced, setIsAdvanced] = useState(false);

    const handleFiatChange = (amount: string) => {
        onChange((prev) => ({ ...prev, fiatAmount: parseFloat(amount) || 0 }));
    };

    const handleAllocationChange = (index: number, field: keyof SalaryAllocation, val: any) => {
        onChange((prev) => {
            const newAllocations = [...prev.allocations];
            newAllocations[index] = { ...newAllocations[index], [field]: val };
            return { ...prev, allocations: newAllocations };
        });
    };

    const handleAddAsset = () => {
        onChange((prev) => {
            const currentTotal = prev.allocations.reduce((sum, a) => sum + a.percent, 0);
            if (currentTotal >= 100) {
                window.alert("Allocation already at 100%");
                return prev;
            }
            return {
                ...prev,
                allocations: [
                    ...prev.allocations,
                    { asset: 'usd-coin', percent: 0 }
                ]
            };
        });
    };

    const removeAllocation = (index: number) => {
        onChange((prev) => {
            if (prev.allocations.length <= 1) return prev;
            return {
                ...prev,
                allocations: prev.allocations.filter((_, i) => i !== index)
            };
        });
    };

    return (
        <div className="space-y-6 w-full max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Salary Details
                </h2>
                <AdvancedToggle isAdvanced={isAdvanced} onToggle={setIsAdvanced} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fiat Amount */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="flex items-center gap-2">
                        Salary Amount
                        <TooltipHelper content="Enter your gross annual or monthly salary in fiat currency." />
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                        <Input
                            type="number"
                            placeholder="60000"
                            className="pl-8 bg-brand-dark/50 border-white/10 text-lg"
                            value={value.fiatAmount || ''}
                            onChange={(e) => handleFiatChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Currency & Frequency */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label>Currency & Frequency</Label>
                    <div className="flex gap-2">
                        <StandardSelect
                            value={value.fiatCurrency}
                            onChange={(val: any) => onChange((prev) => ({ ...prev, fiatCurrency: val }))}
                            options={[
                                { value: 'USD', label: 'USD ($)' },
                                { value: 'EUR', label: 'EUR (€)' },
                                { value: 'GBP', label: 'GBP (£)' },
                                { value: 'CAD', label: 'CAD ($)' },
                                { value: 'AUD', label: 'AUD ($)' },
                            ]}
                            className="w-1/3 min-w-[80px]"
                        />
                        <StandardSelect
                            value={value.frequency}
                            onChange={(val: any) => onChange((prev) => ({ ...prev, frequency: val }))}
                            options={[
                                { value: 'annual', label: 'Annual' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'biweekly', label: 'Bi-weekly' },
                                { value: 'weekly', label: 'Weekly' },
                            ]}
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Network Selection */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        Network (Gas Fee Estimation)
                    </Label>
                    <StandardSelect
                        value={value.network || 'ethereum'}
                        onChange={(val: any) => onChange((prev) => ({ ...prev, network: val }))}
                        options={[
                            { value: 'ethereum', label: 'Ethereum (High Fee: ~$15)' },
                            { value: 'base', label: 'Base (Low Fee: ~$0.01)' },
                            { value: 'solana', label: 'Solana (Low Fee: ~$0.01)' },
                            { value: 'arbitrum', label: 'Arbitrum (Low Fee: ~$0.01)' },
                        ]}
                        className="w-full"
                    />
                </div>

                {/* Monthly Expenses */}
                <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="flex items-center gap-2">
                        <Wallet className="w-3.5 h-3.5" />
                        Monthly Fixed Expenses (USD)
                        <TooltipHelper content="Used for the 'Volatility Shield' calculation to ensure your stablecoins cover your rent/bills." />
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                        <Input
                            type="number"
                            placeholder="2000"
                            className="pl-8 bg-brand-dark/50 border-white/10"
                            value={value.monthlyExpensesUSD || ''}
                            onChange={(e) => onChange((prev) => ({ ...prev, monthlyExpensesUSD: parseFloat(e.target.value) || 0 }))}
                        />
                    </div>
                </div>
            </div>

            {/* Staking & Tax (Advanced) */}
            <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between flex-1 gap-4">
                    <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Enable Staking
                        </Label>
                        <p className="text-xs text-gray-400">Apply 5%-7% yield to crypto holdings</p>
                    </div>
                    <Switch
                        checked={value.isStakingActive || false}
                        onCheckedChange={(checked) => onChange((prev) => ({ ...prev, isStakingActive: checked }))}
                    />
                </div>

                {isAdvanced && (
                    <div className="flex-1 space-y-2">
                        <Label className="text-xs">Est. Tax Bracket (%)</Label>
                        <Input
                            type="number"
                            className="h-8 bg-brand-dark/50 border-white/10 text-xs"
                            value={value.taxBracket || 25}
                            onChange={(e) => onChange((prev) => ({ ...prev, taxBracket: parseFloat(e.target.value) || 0 }))}
                        />
                    </div>
                )}
            </div>

            {/* Crypto Allocations */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <Label className="flex items-center gap-2">
                    Crypto Allocation
                    <TooltipHelper content="Select which crypto you want to be paid in. You can split your salary across multiple assets." />
                </Label>

                {value.allocations.map((allocation, index) => (
                    <div key={index} className="flex gap-3 items-start animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className="flex-1 space-y-1">
                            {index === 0 && <span className="text-xs text-muted-foreground w-full block mb-1">Asset</span>}
                            <CryptoSelector
                                value={allocation.asset}
                                onChange={(id) => handleAllocationChange(index, 'asset', id)}
                            />
                        </div>

                        <div className="w-24 space-y-1">
                            {index === 0 && <span className="text-xs text-muted-foreground w-full block mb-1">Split %</span>}
                            <div className="relative">
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="pr-6 bg-brand-dark/50 border-white/10"
                                    value={allocation.percent}
                                    onChange={(e) => handleAllocationChange(index, 'percent', parseFloat(e.target.value) || 0)}
                                />
                                <span className="absolute right-2 top-2.5 text-xs text-gray-400">%</span>
                            </div>
                        </div>

                        {index !== 0 && (
                            <div className="space-y-1 pt-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-red-400 hover:bg-red-900/10"
                                    onClick={() => removeAllocation(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {isAdvanced && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddAsset}
                        className="w-full border-dashed border-white/20 hover:border-brand-purple/50 hover:bg-brand-purple/5 text-gray-400 hover:text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Asset
                    </Button>
                )}

                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Total Allocation:</span>
                    <span className={value.allocations.reduce((s, a) => s + a.percent, 0) !== 100 ? "text-yellow-500" : "text-green-500"}>
                        {value.allocations.reduce((s, a) => s + a.percent, 0)}%
                    </span>
                </div>
            </div>

            <Button
                onClick={onCalculate}
                disabled={loading}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20 mt-6"
            >
                {loading ? 'Calculating...' : 'Generate Wealth Report'}
            </Button>
        </div>
    );
}
