
"use client";

import { SalaryConversionResult, PaycheckBreakdown } from "@/types/salary-calculator";
import { formatCurrency, formatCrypto } from "@/lib/salary-calculator";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wallet, Calendar, PieChart } from "lucide-react";

interface ResultsDisplayProps {
    result: SalaryConversionResult | null;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
    if (!result) return null;

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Primary Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-brand-dark/40 border-brand-purple/20 shadow-lg shadow-brand-purple/5">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center mb-2">
                            <Wallet className="w-5 h-5 text-brand-purple" />
                        </div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Per Paycheck</p>
                        {result.perPaycheck.map((item, i) => (
                            <div key={i} className="space-y-1">
                                <h3 className="text-2xl font-bold text-white">
                                    {formatCrypto(item.cryptoAmount, 4)} <span className="text-sm text-brand-purple">{item.cryptoSymbol}</span>
                                </h3>
                                <p className="text-xs text-gray-500">
                                    ≈ {formatCurrency(item.fiatValue)}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-brand-dark/40 border-white/5">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Annual Total</p>
                        {result.annual.map((item, i) => (
                            <div key={i} className="space-y-1">
                                <h3 className="text-xl font-bold text-gray-200">
                                    {formatCrypto(item.cryptoAmount, 2)} <span className="text-sm text-gray-400">{item.cryptoSymbol}</span>
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Total Value: {formatCurrency(item.fiatValue)}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-brand-dark/40 border-white/5">
                    <CardContent className="p-6 text-center space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                            <PieChart className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Breakdown</p>
                        <ul className="text-sm text-gray-300 space-y-2 pt-1 text-left px-4">
                            <li className="flex justify-between">
                                <span className="text-gray-500">Paychecks/Yr:</span>
                                <span className="font-mono">{result.paychecksPerYear}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-500">Total Fiat:</span>
                                <span className="font-mono">{formatCurrency(result.totalFiatAnnual)}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <h4 className="font-semibold text-gray-200">Paycheck Details</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-3">Asset</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.perPaycheck.map((item, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                        <div className="w-2 h-8 rounded-full bg-brand-purple/50"></div>
                                        <div>
                                            {item.cryptoName}
                                            <span className="block text-xs text-gray-500">{item.cryptoSymbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {formatCurrency(item.priceAtPayment)}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-brand-blue">
                                        {formatCrypto(item.cryptoAmount)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-200">
                                        {formatCurrency(item.fiatValue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
