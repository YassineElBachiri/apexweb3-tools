import { ScoredPair } from "@/lib/actions/spike-detector";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Flame, Droplets, TrendingUp } from "lucide-react";
import Image from "next/image";

interface ResultsTableProps {
    pairs: ScoredPair[];
}

export function ResultsTable({ pairs }: ResultsTableProps) {
    if (pairs.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-slate-400">
                <p className="text-lg">No meme coins found matching your filters.</p>
                <p className="text-sm">Try using broader filters or refreshing.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Token</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Liquidity</th>
                            <th className="px-6 py-4">5m Vol</th>
                            <th className="px-6 py-4">Txns (5m)</th>
                            <th className="px-6 py-4">Age</th>
                            <th className="px-6 py-4 text-right">Spike Score</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {pairs.map((pair) => (
                            <tr key={pair.pairAddress} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-800">
                                            {/* Placeholder icon since we don't have easy access to all token logos yet without proxy */}
                                            <div className="flex h-full w-full items-center justify-center font-bold text-slate-500">
                                                {pair.baseToken.symbol.slice(0, 2)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {pair.baseToken.symbol}
                                                <span className="text-slate-500">/ {pair.quoteToken.symbol}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 capitalize">{pair.chainId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">${Number(pair.priceUsd).toFixed(6)}</div>
                                    <div className={`text-xs ${pair.priceChange.m5 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {pair.priceChange.m5 > 0 ? '+' : ''}{pair.priceChange.m5}% (5m)
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Droplets className="h-3.5 w-3.5 text-blue-400" />
                                        ${pair.liquidity.usd.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-orange-400" />
                                        ${pair.volume.m5.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-xs">
                                        <span className="text-green-400">Buys: {pair.txns.m5.buys}</span>
                                        <span className="text-red-400">Sells: {pair.txns.m5.sells}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {pair.pairAgeHours < 24 ? (
                                        <Badge variant="outline" className="border-brand-primary/50 text-brand-primary text-[10px] h-5">
                                            {Math.round(pair.pairAgeHours)}h NEW
                                        </Badge>
                                    ) : (
                                        <span className="text-slate-500">{Math.round(pair.pairAgeHours)}h</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className={`text-lg font-bold ${pair.spikeScore > 80 ? 'text-brand-primary' :
                                            pair.spikeScore > 50 ? 'text-green-400' : 'text-slate-400'
                                            }`}>
                                            {pair.spikeScore}
                                        </span>
                                        {pair.spikeScore > 75 && <Flame className="h-4 w-4 text-orange-500 animate-pulse" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <a
                                            href={`https://bullx.io/terminal?chainId=${pair.chainId}&address=${pair.baseToken.address}`}
                                            target="_blank"
                                            rel="sponsored nofollow noopener noreferrer"
                                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-brand-primary/50 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 text-xs font-bold transition-colors"
                                        >
                                            Buy on BullX
                                        </a>
                                        <a
                                            href={pair.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white"
                                            title="View Data"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
