"use client";

import { WhaleTransaction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUSD, formatTimeAgo, shortenAddress } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

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

    const explorerUrl = `https://etherscan.io/tx/${transaction.hash}`;

    return (
        <Card className="hover:border-primary/50 transition-smooth">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getTypeColor()} className="flex items-center gap-1">
                                {getTypeIcon()}
                                {transaction.type.toUpperCase()}
                            </Badge>
                            <span className="font-bold text-lg">
                                {formatUSD(transaction.valueUsd || 0, 0)}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {transaction.value.toLocaleString()} {transaction.token}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(transaction.timestamp)}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">From:</span>
                        <div className="flex items-center gap-2">
                            {transaction.walletLabel && (
                                <Badge variant="outline" className="text-xs">
                                    {transaction.walletLabel}
                                </Badge>
                            )}
                            <span className="font-mono">{shortenAddress(transaction.from)}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-mono">{shortenAddress(transaction.to)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">Token:</span>
                        <span className="font-medium">{transaction.token}</span>
                    </div>
                </div>

                <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-smooth"
                >
                    View on Etherscan
                    <ExternalLink className="h-4 w-4" />
                </a>
            </CardContent>
        </Card>
    );
}
