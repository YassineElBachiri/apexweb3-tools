"use client";

import React, { useState, useMemo } from 'react';
import { useCoinsList, CoinInfo } from '@/hooks/useCoinsList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoinSelectProps {
    value: string;
    onChange: (id: string) => void;
    className?: string;
}

export function CoinSelect({ value, onChange, className }: CoinSelectProps) {
    const { coins, loading } = useCoinsList();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Pre-filter so the DOM doesn't crash trying to render 14,000 CommandItems at once
    const filteredCoins = useMemo(() => {
        if (!search) return coins.slice(0, 150); // Show top 150 by default
        
        const lowerSearch = search.toLowerCase();
        return coins.filter(c => 
            c.name.toLowerCase().includes(lowerSearch) || 
            c.symbol.toLowerCase().includes(lowerSearch) ||
            c.id.toLowerCase().includes(lowerSearch)
        ).slice(0, 100); // Limit rendered search results for performance
    }, [coins, search]);

    const activeCoin = coins.find(c => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div 
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="coin-select-command"
                    className={cn(
                        "flex items-center justify-between cursor-pointer appearance-none bg-zinc-900 border border-zinc-700 text-white pl-3 pr-2 py-1.5 rounded-md hover:bg-zinc-800 transition-colors uppercase font-bold text-sm",
                        className
                    )}
                >
                    <span className="truncate mr-2">
                        {activeCoin ? activeCoin.symbol.toUpperCase() : 'SELECT...'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 bg-zinc-900 border-zinc-800">
                <Command>
                    <CommandInput 
                        placeholder="Search coins..." 
                        value={search}
                        onValueChange={setSearch}
                        className="h-9"
                    />
                    <CommandList className="max-h-[300px]">
                        <CommandEmpty>{loading ? 'Loading coins...' : 'No coin found.'}</CommandEmpty>
                        <CommandGroup>
                            {filteredCoins.map((coin) => (
                                <CommandItem
                                    key={coin.id}
                                    value={coin.id}
                                    onSelect={(currentValue) => {
                                        onChange(coin.id);
                                        setOpen(false);
                                        setSearch('');
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === coin.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="font-bold flex-1">{coin.name}</span>
                                    <span className="text-zinc-500 text-xs ml-2 uppercase">{coin.symbol}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
