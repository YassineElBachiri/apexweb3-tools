import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface CurrencyInputProps {
    label: string;
    amount: number;
    selectedCurrency: string;
    onAmountChange: (value: number) => void;
    onCurrencyChange: (currency: string) => void;
    currencies: string[];
    readOnly?: boolean;
}

export function CurrencyInput({
    label,
    amount,
    selectedCurrency,
    onAmountChange,
    onCurrencyChange,
    currencies,
    readOnly = false
}: CurrencyInputProps) {
    return (
        <div className="space-y-2">
            <Label className="text-zinc-400 font-mono text-xs uppercase tracking-wider">{label}</Label>
            <div className="relative flex items-center">
                <div className="absolute left-3 z-10">
                    <div className="relative">
                        <select
                            value={selectedCurrency}
                            onChange={(e) => onCurrencyChange(e.target.value)}
                            className="appearance-none bg-zinc-900 border border-zinc-700 text-white pl-3 pr-8 py-1.5 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer hover:bg-zinc-800 transition-colors uppercase font-bold text-sm"
                        >
                            {currencies.map((curr) => (
                                <option key={curr} value={curr}>
                                    {curr.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
                    className="pl-32 text-right font-mono text-lg bg-zinc-900/50 border-zinc-700 focus:border-primary"
                    disabled={readOnly}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}
