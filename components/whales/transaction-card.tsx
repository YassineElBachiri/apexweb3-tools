"use client";

import { WhaleTransaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUSD, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, ArrowRight, Share2 } from "lucide-react";

interface TransactionCardProps {
    transaction: WhaleTransaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
    const getTypeColor = () => {
        switch (transaction.type) {
            case "buy":
                return "success";
            case "sell":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getNetworkColor = (network: string) => {
        switch (network.toLowerCase()) {
            case "ethereum": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "solana": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "bitcoin": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "base": return "bg-blue-600/10 text-blue-300 border-blue-600/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    const getTypeIcon = () => {
        switch (transaction.type) {
            case "buy":
                return <TrendingUp className="h-4 w-4" />;
            case "sell":
                return <TrendingDown className="h-4 w-4" />;
            default:
                return <ArrowRight className="h-4 w-4" />;
        }
    };

    const explorerUrl = transaction.explorerUrl || `https://etherscan.io/tx/${transaction.hash}`;

    return (
        <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-slate-900/40 backdrop-blur-sm border-white/5">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getTypeColor()} className="flex items-center gap-1 rounded-md px-2 py-0">
                                {getTypeIcon()}
                                {transaction.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`rounded-md px-2 py-0 border ${getNetworkColor(transaction.network)}`}>
                                {transaction.network.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-2xl tracking-tight">
                                {formatUSD(transaction.valueUsd || 0, 0)}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                                MOVEMENT
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                            {formatTimeAgo(transaction.timestamp)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Origin</span>
                        <div className="font-mono text-sm truncate bg-black/20 p-1.5 rounded border border-white/5">
                            {shortenAddress(transaction.from)}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destination</span>
                        <div className="font-mono text-sm truncate bg-black/20 p-1.5 rounded border border-white/5">
                            {shortenAddress(transaction.to)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                            {transaction.token.substring(0, 2)}
                        </div>
                        <div>
                            <div className="text-xs font-bold">{transaction.token}</div>
                            <div className="text-[10px] text-muted-foreground">
                                {transaction.value.toLocaleString(undefined, { maximumFractionDigits: 4 })} UNITS
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                            title="View Explorer"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground transition-all border border-white/5">
                            <Share2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
