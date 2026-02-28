"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseSearchInput, loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

const RECENT_SEARCHES_KEY = "apexweb3_recent_searches";
const MAX_RECENT_SEARCHES = 5;

interface CoinSuggestion {
    id: string;
    symbol: string;
    name: string;
    address: string;
}

interface SearchBarProps {
    onSearch?: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const router = useRouter();

    const [input, setInput] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [coinSuggestions, setCoinSuggestions] = useState<CoinSuggestion[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const recent = loadFromLocalStorage<string[]>(RECENT_SEARCHES_KEY, []);
        setRecentSearches(recent);
    }, []);

    // Fetch coin suggestions when user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (input.length < 2) {
                setCoinSuggestions([]);
                return;
            }

            // If it looks like an address, don't fetch suggestions
            if (input.startsWith("0x")) {
                setCoinSuggestions([]);
                return;
            }

            setLoadingSuggestions(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(input)}`);
                const data = await response.json();
                if (data.success && data.data) {
                    setCoinSuggestions(data.data);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [input]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pathname = usePathname();

    const handleSearch = (searchValue?: string) => {
        const valueToSearch = searchValue || input;
        if (!valueToSearch.trim()) return;

        setIsSearching(true);
        const result = parseSearchInput(valueToSearch);

        if (result.isValid) {
            // Save to recent searches
            const updated = [valueToSearch, ...recentSearches.filter(s => s !== valueToSearch)].slice(0, MAX_RECENT_SEARCHES);
            setRecentSearches(updated);
            saveToLocalStorage(RECENT_SEARCHES_KEY, updated);

            // If callback provided, use that
            if (onSearch) {
                onSearch(valueToSearch);
                return;
            }

            // Context-aware routing
            if (pathname?.startsWith("/discovery/scan")) {
                router.push(`/discovery/scan/${valueToSearch}`);
            } else if (pathname?.startsWith("/analysis/analyzer")) {
                router.push(`/analysis/analyzer?q=${valueToSearch}`);
            } else if (pathname?.startsWith("/portfolio")) {
                router.push(`/portfolio/${valueToSearch}`);
            } else {
                // Default fallback: Go to Analyzer
                router.push(`/analysis/analyzer?q=${valueToSearch}`);
            }
        } else {
            alert("Invalid address format. Please enter a valid Ethereum address (0x...) or search for a coin name.");
            setIsSearching(false);
        }
    };

    const handleCoinSelect = (coin: CoinSuggestion) => {
        if (coin.address) {
            setInput(coin.address);
            setShowSuggestions(false);

            // Also save to recent
            const updated = [coin.address, ...recentSearches.filter(s => s !== coin.address)].slice(0, MAX_RECENT_SEARCHES);
            setRecentSearches(updated);
            saveToLocalStorage(RECENT_SEARCHES_KEY, updated);

            // If callback provided, use that instead of routing
            if (onSearch) {
                onSearch(coin.address);
                return;
            }

            // Fallback: Go to Analyzer
            router.push(`/analysis/analyzer?q=${coin.address}`);
        } else {
            alert(`${coin.name} is not an Ethereum-based token. This platform currently supports ERC-20 tokens on Ethereum. Please search for Ethereum-based tokens like UNI, LINK, AAVE, etc.`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const selectRecentSearch = (search: string) => {
        setInput(search);
        setShowSuggestions(false);
        handleSearch(search);
    };

    const showRecentSearches = showSuggestions && recentSearches.length > 0 && !input;
    const showCoinSuggestions = showSuggestions && coinSuggestions.length > 0 && input.length >= 2 && !input.startsWith("0x");

    return (
        <div className="relative w-full max-w-2xl" ref={searchRef}>
            <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by coin name (Bitcoin, Ethereum) or address (0x...)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        className="pl-10 pr-4 h-12 text-base glass border-primary/30 focus:border-primary"
                        disabled={isSearching}
                    />
                </div>
                <Button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !input.trim()}
                    size="lg"
                    className="h-12 px-6"
                >
                    {isSearching ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Searching...
                        </>
                    ) : (
                        "Analyze"
                    )}
                </Button>
            </div>

            {/* Suggestions Dropdown */}
            {(showRecentSearches || showCoinSuggestions) && (
                <div className="absolute top-full mt-2 w-full glass rounded-lg border border-primary/20 p-2 z-50 animate-slideIn max-h-96 overflow-y-auto custom-scrollbar">
                    {/* Coin Suggestions */}
                    {showCoinSuggestions && (
                        <>
                            <div className="text-xs text-muted-foreground px-2 py-1 flex items-center gap-2">
                                <TrendingUp className="h-3 w-3" />
                                Coin Suggestions
                                {loadingSuggestions && <Loader2 className="h-3 w-3 animate-spin" />}
                            </div>
                            {coinSuggestions.map((coin, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCoinSelect(coin)}
                                    className="w-full text-left px-3 py-3 rounded hover:bg-primary/10 transition-smooth flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="font-medium">{coin.name}</div>
                                        <div className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</div>
                                    </div>
                                    {coin.address && (
                                        <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                                            Analyze →
                                        </div>
                                    )}
                                </button>
                            ))}
                        </>
                    )}

                    {/* Recent Searches */}
                    {showRecentSearches && (
                        <>
                            <div className="text-xs text-muted-foreground px-2 py-1">Recent Searches</div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectRecentSearch(search)}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 transition-smooth text-sm font-mono"
                                >
                                    {search}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
