"use client";

import { useState, useEffect } from "react";
import { Search, Calculator, Calendar } from "lucide-react";
import { searchTokens } from "@/lib/coingecko";
import { TokenSearchResult } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddAssetProps {
    onAddAsset: (
        tokenId: string,
        entryPrice: number,
        quantity: number,
        entryDate?: string
    ) => void;
    existingAssets?: string[];
}

export default function AddAsset({ onAddAsset, existingAssets = [] }: AddAssetProps) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
    const [selectedToken, setSelectedToken] = useState<TokenSearchResult | null>(null);

    // Form States
    const [entryPrice, setEntryPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [entryDate, setEntryDate] = useState("");

    // Search States
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (selectedToken && query === selectedToken.name) return;

            if (query.length > 1) {
                setIsSearching(true);
                const results = await searchTokens(query);
                const filtered = results.filter(r => !existingAssets.includes(r.id));
                setSearchResults(filtered);
                setIsSearching(false);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, existingAssets, selectedToken]);

    const handleSelectToken = (token: TokenSearchResult) => {
        setSelectedToken(token);
        setQuery(token.name);
        setShowResults(false);
        // Reset price/qty on new token select? Maybe not needed.
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(entryPrice);
        const qty = parseFloat(quantity);

        if (selectedToken && price > 0 && qty > 0) {
            onAddAsset(
                selectedToken.id,
                price,
                qty,
                entryDate || undefined
            );
            // Reset form
            setQuery("");
            setSelectedToken(null);
            setEntryPrice("");
            setQuantity("");
            setEntryDate("");
        }
    };

    // Calculate Total Invested for display
    const totalInvested = (parseFloat(entryPrice) || 0) * (parseFloat(quantity) || 0);

    return (
        <section id="add-asset">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Token Search */}
                <div className="relative space-y-2">
                    <Label htmlFor="token-search">Select Token</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <Input
                            id="token-search"
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedToken(null);
                            }}
                            placeholder="Search e.g. Bitcoin, Ethereum..."
                            className="pl-9 bg-background/50 border-white/10 focus:border-primary transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Results Dropdown */}
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-[#1e1e1e] border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                            {searchResults.map((token) => (
                                <button
                                    key={token.id}
                                    type="button"
                                    onClick={() => handleSelectToken(token)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={token.thumb} alt={token.name} className="w-6 h-6 rounded-full" />
                                    <div>
                                        <div className="font-medium text-sm text-foreground">{token.name}</div>
                                        <div className="text-xs text-muted-foreground">{token.symbol.toUpperCase()}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 2. Buy Price */}
                    <div className="space-y-2">
                        <Label htmlFor="entry-price">Buy Price ($)</Label>
                        <Input
                            id="entry-price"
                            type="number"
                            step="any"
                            value={entryPrice}
                            onChange={(e) => setEntryPrice(e.target.value)}
                            placeholder="0.00"
                            className="bg-background/50 border-white/10 focus:border-primary"
                            required
                        />
                    </div>

                    {/* 3. Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            step="any"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0.00"
                            className="bg-background/50 border-white/10 focus:border-primary"
                            required
                        />
                    </div>
                </div>

                {/* Total Preview */}
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary">
                        <Calculator className="w-4 h-4" />
                        <span className="font-medium">Total Invested</span>
                    </div>
                    <span className="font-bold text-xl">${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={!selectedToken || !entryPrice || !quantity}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg text-lg shadow-lg shadow-primary/20"
                >
                    Add to Portfolio
                </Button>
            </form>
        </section>
    );
}
