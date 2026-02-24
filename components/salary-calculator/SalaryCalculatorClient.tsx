
"use client";

import { useState } from "react";
import { SalaryInput, SalaryConversionResult } from "@/types/salary-calculator";
import { calculateCryptoSalary } from "@/lib/salary-calculator";
import { SalaryInputForm } from "./SalaryInputForm";
import { ResultsDisplay } from "./ResultsDisplay";
// import { getBulkPrices } from "@/lib/coingecko"; // We'll use this directly or via API

export function SalaryCalculatorClient() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SalaryConversionResult | null>(null);
    const [input, setInput] = useState<SalaryInput>({
        fiatAmount: 60000,
        fiatCurrency: 'USD',
        frequency: 'monthly',
        allocations: [{ asset: 'bitcoin', percent: 100 }],
        network: 'ethereum',
        isStakingActive: false,
        monthlyExpensesUSD: 2000,
        taxBracket: 25,
    });

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Fetch live prices
            const cryptoIds = input.allocations.map(a => a.asset).join(',');
            const response = await fetch(`/api/salary/prices?crypto=${cryptoIds}`);

            if (!response.ok) {
                throw new Error('Failed to fetch prices');
            }

            const data = await response.json();
            const pricesMap = new Map<string, number>();

            // Populate map from API response
            Object.entries(data.prices).forEach(([key, value]) => {
                pricesMap.set(key, value as number);
            });

            // Mock metadata (in real app, fetch this too)
            const metadataMap = new Map<string, { symbol: string; name: string }>();
            input.allocations.forEach(a => {
                metadataMap.set(a.asset, {
                    symbol: a.asset.substring(0, 3).toUpperCase(), // fallback
                    name: a.asset.charAt(0).toUpperCase() + a.asset.slice(1) // fallback
                });
            });

            const conversionResult = calculateCryptoSalary(input, pricesMap, metadataMap);
            setResult(conversionResult);
        } catch (error) {
            console.error("Calculation failed", error);
            // Handle error (toast, etc.)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <SalaryInputForm
                value={input}
                onChange={setInput}
                onCalculate={handleCalculate}
                loading={loading}
            />
            {result && <ResultsDisplay result={result} />}
        </div>
    );
}
