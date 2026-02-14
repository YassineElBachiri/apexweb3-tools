"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { searchTokens } from "@/lib/coingecko";
import { TokenSearchResult } from "@/types";

interface AddAssetProps {
    onAddAsset: (
        tokenId: string,
        entryPrice: number,
        investedAmount?: number,
        entryDate?: string
    ) => void;
    existingAssets?: string[];
}

export default function AddAsset({ onAddAsset, existingAssets = [] }: AddAssetProps) {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
    const [selectedToken, setSelectedToken] = useState<TokenSearchResult | null>(
        null
    );
    const [entryPrice, setEntryPrice] = useState("");
    const [investedAmount, setInvestedAmount] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 1) {
                setIsSearching(true);
                const results = await searchTokens(query);
                // Filter out assets that are already in the portfolio
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
    }, [query, existingAssets]);

    const handleSelectToken = (token: TokenSearchResult) => {
        setSelectedToken(token);
        setQuery(token.name);
        setShowResults(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedToken && entryPrice) {
            onAddAsset(
                selectedToken.id,
                parseFloat(entryPrice),
                investedAmount ? parseFloat(investedAmount) : undefined,
                entryDate || undefined
            );
            // Reset form
            setQuery("");
            setSelectedToken(null);
            setEntryPrice("");
            setInvestedAmount("");
            setEntryDate("");
        }
    };

    return (
        <section id="add-asset" className="mb-8">
            <div className="bg-card rounded-xl p-6 glow-card gradient-border">
                <h2 className="text-2xl font-bold mb-4 gradient-text">
                    Add Asset
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Token Search - Flex Grow */}
                    <div className="relative flex-1 w-full md:w-auto">
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                            Token <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-2.5 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedToken(null);
                                }}
                                placeholder="Search token..."
                                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-10"
                                required
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {searchResults.map((token) => (
                                    <button
                                        key={token.id}
                                        type="button"
                                        onClick={() => handleSelectToken(token)}
                                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 transition-colors text-left"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={token.thumb}
                                            alt={token.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">{token.name}</div>
                                            <div className="text-xs text-gray-400">
                                                {token.symbol.toUpperCase()}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Entry Price */}
                    <div className="flex-1 w-full md:w-auto">
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                            Buy Price <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={entryPrice}
                            onChange={(e) => setEntryPrice(e.target.value)}
                            placeholder="$0.00"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-10"
                            required
                        />
                    </div>

                    {/* Invested Amount */}
                    <div className="flex-1 w-full md:w-auto">
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                            Invested Amount
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={investedAmount}
                            onChange={(e) => setInvestedAmount(e.target.value)}
                            placeholder="$0.00"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors h-10"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!selectedToken || !entryPrice}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 h-10 text-sm whitespace-nowrap"
                    >
                        Add Asset
                    </button>
                </form>
            </div>
        </section>
    );
}
