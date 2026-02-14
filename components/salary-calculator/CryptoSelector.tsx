
"use client";

import * as React from "react";
import { Search, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { searchTokens } from "@/lib/coingecko";
import { TokenSearchResult } from "@/types";
import { useDebounce } from "@/lib/hooks/use-debounce"; // Need to check if this exists or implement it

interface CryptoSelectorProps {
    value: string;
    onChange: (value: string, symbol: string, name: string) => void;
    className?: string;
}

const POPULAR_TOKENS = [
    { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
    { id: "ethereum", symbol: "eth", name: "Ethereum" },
    { id: "solana", symbol: "sol", name: "Solana" },
    { id: "usd-coin", symbol: "usdc", name: "USDC" },
    { id: "tether", symbol: "usdt", name: "Tether" },
];

export function CryptoSelector({ value, onChange, className }: CryptoSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<TokenSearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Initial selected token display
    const selectedToken =
        results.find((token) => token.id === value) ||
        POPULAR_TOKENS.find((token) => token.id === value);

    React.useEffect(() => {
        const fetchTokens = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const tokens = await searchTokens(query);
                setResults(tokens);
            } catch (error) {
                console.error("Failed to search tokens", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchTokens, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between bg-brand-dark/50 border-white/10 hover:bg-brand-dark/80 hover:text-white text-left font-normal", className)}
                >
                    {selectedToken ? (
                        <div className="flex items-center gap-2">
                            {/* Optional: Add image here if available */}
                            <span className="font-bold text-brand-purple">{selectedToken.symbol.toUpperCase()}</span>
                            <span className="text-muted-foreground truncate">{selectedToken.name}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Select crypto...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-brand-dark border-brand-purple/20">
                <div className="p-2 border-b border-white/10">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-md">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <input
                            className="bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground w-full"
                            placeholder="Search token..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto py-1">
                    {query.length < 2 && (
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            Popular
                        </div>
                    )}

                    {(query.length < 2 ? POPULAR_TOKENS : results).map((token) => (
                        <div
                            key={token.id}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-brand-purple/10 transition-colors",
                                value === token.id ? "bg-brand-purple/20 text-brand-purple" : "text-gray-300"
                            )}
                            onClick={() => {
                                onChange(token.id, token.symbol, token.name);
                                setOpen(false);
                            }}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-4 w-4",
                                    value === token.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            <span className="font-bold w-12">{token.symbol.toUpperCase()}</span>
                            <span className="truncate opacity-80">{token.name}</span>
                        </div>
                    ))}

                    {query.length >= 2 && results.length === 0 && !loading && (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No tokens found.
                        </div>
                    )}

                    {loading && (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground animate-pulse">
                            Searching...
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
