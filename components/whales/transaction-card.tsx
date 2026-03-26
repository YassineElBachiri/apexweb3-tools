"use client";

import { WhaleTransaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUSD, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, ArrowRight, Share2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

    const getAddressExplorerUrl = (address: string, network: string) => {
        switch (network.toLowerCase()) {
            case "solana":
                return `https://solscan.io/account/${address}`;
            case "bitcoin":
                return `https://blockchair.com/bitcoin/address/${address}`;
            case "base":
                return `https://basescan.org/address/${address}`;
            case "ethereum":
            default:
                return `https://etherscan.io/address/${address}`;
        }
    };

    const getTxExplorerUrl = (hash: string, network: string) => {
        switch (network.toLowerCase()) {
            case "solana":
                return `https://solscan.io/tx/${hash}`;
            case "bitcoin":
                return `https://blockchair.com/bitcoin/transaction/${hash}`;
            case "base":
                return `https://basescan.org/tx/${hash}`;
            case "ethereum":
            default:
                return `https://etherscan.io/tx/${hash}`;
        }
    };

    const explorerUrl = transaction.explorerUrl || getTxExplorerUrl(transaction.hash, transaction.network);

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
                        <a
                            href={getAddressExplorerUrl(transaction.from, transaction.network)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm truncate bg-black/20 p-1.5 rounded border border-white/5 flex items-center gap-1 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200 group/addr"
                            title={transaction.from}
                        >
                            <span className="truncate">{shortenAddress(transaction.from)}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
                        </a>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destination</span>
                        <a
                            href={getAddressExplorerUrl(transaction.to, transaction.network)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm truncate bg-black/20 p-1.5 rounded border border-white/5 flex items-center gap-1 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200 group/addr"
                            title={transaction.to}
                        >
                            <span className="truncate">{shortenAddress(transaction.to)}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover/addr:opacity-100 transition-opacity" />
                        </a>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground transition-all border border-white/5">
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-white/10 z-50">
                                <DropdownMenuItem onClick={() => {
                                    const text = `🚨 Whale Alert! 🚨\n\n${formatUSD(transaction.valueUsd || 0, 0)} of ${transaction.token} moved on ${transaction.network}!\n\nView details on ApexWeb3:`;
                                    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.apexweb3.com/analysis/whales';
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                                }} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                                    Share on X
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    const text = `🚨 Whale Alert! 🚨\n\n${formatUSD(transaction.valueUsd || 0, 0)} of ${transaction.token} moved on ${transaction.network}!\n\nView details on ApexWeb3:`;
                                    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.apexweb3.com/analysis/whales';
                                    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                                }} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                                    Share on Telegram
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
