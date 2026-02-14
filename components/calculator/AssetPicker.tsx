"use client";

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Asset } from '@/lib/types/calculator';

interface AssetPickerProps {
    onSelect: (asset: Asset) => void;
    selectedAsset?: Asset;
}

const TOP_ASSETS: Asset[] = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'binance-coin', symbol: 'BNB', name: 'BNB' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
];

export function AssetPicker({ onSelect, selectedAsset }: AssetPickerProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredAssets = TOP_ASSETS.filter(asset =>
        asset.name.toLowerCase().includes(query.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="relative w-full max-w-sm mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Select Asset</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    className="pl-9 bg-[#13082a] border-[#2a1b4e] text-white focus:ring-[#C77DFF] focus:border-[#C77DFF]"
                    placeholder="Search coin (e.g. BTC)"
                    value={query || (selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : '')}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && query && (
                <div className="absolute z-10 w-full mt-1 bg-[#1a0b2e] border border-[#2a1b4e] rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredAssets.length > 0 ? (
                        filteredAssets.map((asset) => (
                            <button
                                key={asset.id}
                                className="w-full text-left px-4 py-2 hover:bg-[#2a1b4e] text-sm text-gray-200 flex justify-between items-center"
                                onClick={() => {
                                    onSelect(asset);
                                    setQuery('');
                                    setIsOpen(false);
                                }}
                            >
                                <span>{asset.name}</span>
                                <span className="text-gray-500 font-mono">{asset.symbol}</span>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No assets found</div>
                    )}
                </div>
            )}
        </div>
    );
}
