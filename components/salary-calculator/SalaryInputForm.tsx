
"use client";

import { useState, useEffect } from "react";
import { SalaryInput, SalaryAllocation, FiatCurrency, PaymentFrequency, CryptoAsset } from "@/types/salary-calculator";
import { CryptoSelector } from "./CryptoSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // We'll mock this if needed or use basic select
import { Slider } from "@/components/ui/slider"; // Check if exists
import { Button } from "@/components/ui/button";
import { AdvancedToggle } from "./AdvancedToggle";
import { TooltipHelper } from "./TooltipHelper";
import { Trash2, Plus } from "lucide-react";

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
    onChange: (value: SalaryInput) => void;
    onCalculate: () => void;
    loading: boolean;
}

export function SalaryInputForm({ value, onChange, onCalculate, loading }: SalaryInputFormProps) {
    const [isAdvanced, setIsAdvanced] = useState(false);

    const handleFiatChange = (amount: string) => {
        onChange({ ...value, fiatAmount: parseFloat(amount) || 0 });
    };

    const handleAllocationChange = (index: number, field: keyof SalaryAllocation, val: any) => {
        const newAllocations = [...value.allocations];
        newAllocations[index] = { ...newAllocations[index], [field]: val };
        onChange({ ...value, allocations: newAllocations });
    };

    const addAllocation = () => {
        const currentTotal = value.allocations.reduce((sum, a) => sum + a.percentage, 0);
        const remaining = Math.max(0, 100 - currentTotal);
        onChange({
            ...value,
            allocations: [
                ...value.allocations,
                { cryptoId: 'bitcoin', percentage: remaining }
            ]
        });
    };

    const removeAllocation = (index: number) => {
        onChange({
            ...value,
            allocations: value.allocations.filter((_, i) => i !== index)
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
                            onChange={(val: any) => onChange({ ...value, fiatCurrency: val })}
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
                            onChange={(val: any) => onChange({ ...value, frequency: val })}
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
                                value={allocation.cryptoId}
                                onChange={(id) => handleAllocationChange(index, 'cryptoId', id)}
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
                                    value={allocation.percentage}
                                    onChange={(e) => handleAllocationChange(index, 'percentage', parseFloat(e.target.value))}
                                />
                                <span className="absolute right-2 top-2.5 text-xs text-gray-400">%</span>
                            </div>
                        </div>

                        {value.allocations.length > 1 && (
                            <div className="space-y-1 pt-1">
                                {index === 0 && <span className="block h-5 mb-1"></span>}
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
                        onClick={addAllocation}
                        className="w-full border-dashed border-white/20 hover:border-brand-purple/50 hover:bg-brand-purple/5 text-gray-400 hover:text-white"
                        disabled={value.allocations.reduce((s, a) => s + a.percentage, 0) >= 100}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Asset
                    </Button>
                )}

                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Total Allocation:</span>
                    <span className={value.allocations.reduce((s, a) => s + a.percentage, 0) !== 100 ? "text-yellow-500" : "text-green-500"}>
                        {value.allocations.reduce((s, a) => s + a.percentage, 0)}%
                    </span>
                </div>
            </div>

            <Button
                onClick={onCalculate}
                disabled={loading}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity shadow-lg shadow-brand-purple/20 mt-6"
            >
                {loading ? 'Calculating...' : 'Calculate Income'}
            </Button>
        </div>
    );
}
