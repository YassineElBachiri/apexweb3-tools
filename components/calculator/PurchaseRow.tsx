"use client";

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Purchase } from '@/lib/types/calculator';

interface PurchaseRowProps {
    purchase: Purchase;
    onUpdate: (id: string, field: keyof Purchase, value: unknown) => void;
    onDelete: (id: string) => void;
    index: number;
}

export function PurchaseRow({ purchase, onUpdate, onDelete, index }: PurchaseRowProps) {
    const totalCost = purchase.price * purchase.quantity;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-[#13082a] border border-[#2a1b4e] rounded-lg mb-2 hover:border-[#C77DFF]/30 transition-colors">

            {/* Index */}
            <div className="hidden md:block col-span-1 text-gray-500 font-mono text-sm">
                #{index + 1}
            </div>

            {/* Price Input */}
            <div className="col-span-12 md:col-span-3">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Price (USD)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                        type="number"
                        value={purchase.price || ''}
                        onChange={(e) => onUpdate(purchase.id, 'price', parseFloat(e.target.value) || 0)}
                        className="pl-7 bg-[#0a0118] border-[#2a1b4e] text-white focus:ring-[#C77DFF]/50"
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Quantity Input */}
            <div className="col-span-12 md:col-span-3">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Quantity</label>
                <Input
                    type="number"
                    value={purchase.quantity || ''}
                    onChange={(e) => onUpdate(purchase.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="bg-[#0a0118] border-[#2a1b4e] text-white focus:ring-[#C77DFF]/50"
                    placeholder="0.00"
                />
            </div>

            {/* Total Cost Display */}
            <div className="col-span-12 md:col-span-3">
                <label className="md:hidden text-xs text-gray-500 mb-1 block">Total Cost</label>
                <div className="h-10 px-3 py-2 bg-[#0a0118]/50 border border-[#2a1b4e] rounded-md text-gray-300 flex items-center">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>

            {/* Date */}
            <div className="col-span-12 md:col-span-1">
                {/* Optional: Date picker could go here if space permits, or maybe a modal */}
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(purchase.id)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
