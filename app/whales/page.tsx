"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionCard } from "@/components/whales/transaction-card";
import { Eye, RefreshCw } from "lucide-react";
import type { ApiResponse, WhaleWatchData } from "@/types";

const FILTER_OPTIONS = [
    { label: "All (>$100K)", value: 100000 },
    { label: ">$500K", value: 500000 },
    { label: ">$1M", value: 1000000 },
];

export default function WhalesPage() {
    const [data, setData] = useState<WhaleWatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(100000);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`/api/whales?minValue=${selectedFilter}`);
            const result: ApiResponse<WhaleWatchData> = await response.json();

            if (result.success && result.data) {
                setData(result.data);
            }
        } catch (error) {
            console.error("Error fetching whale data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [selectedFilter]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Whale Watch</h1>
                </div>
                <p className="text-muted-foreground">
                    Real-time tracking of large cryptocurrency transactions
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <CardTitle>Filter by Transaction Size</CardTitle>
                        <Button onClick={fetchData} disabled={refreshing} variant="outline" size="sm">
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {FILTER_OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                onClick={() => setSelectedFilter(option.value)}
                                variant={selectedFilter === option.value ? "default" : "outline"}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading whale transactions...</p>
                </div>
            ) : data && data.transactions.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Recent Transactions ({data.transactions.length})
                        </h2>
                        <p className="text-sm text-muted-foreground">Auto-refreshes every 30s</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.transactions.map((tx) => (
                            <TransactionCard key={tx.hash} transaction={tx} />
                        ))}
                    </div>
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">No Transactions Found</h2>
                        <p className="text-muted-foreground">
                            No whale transactions match your current filter criteria.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
