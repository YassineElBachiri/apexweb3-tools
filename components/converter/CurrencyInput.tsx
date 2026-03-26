import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoinSelect } from "./CoinSelect";

interface CurrencyInputProps {
    label: string;
    amount: number;
    selectedCurrency: string;
    onAmountChange: (value: number) => void;
    onCurrencyChange: (currency: string) => void;
    currencies?: string[]; // Kept for backwards compatibility but unused
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
                <div className="absolute left-3 z-10 w-24">
                    <CoinSelect
                        value={selectedCurrency}
                        onChange={onCurrencyChange}
                        className="w-full"
                    />
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
