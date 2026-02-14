"use client";

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Purchase } from '@/lib/types/calculator';
import { PurchaseRow } from './PurchaseRow';
import { generateId } from '@/lib/calculator';

interface PurchaseTableProps {
    purchases: Purchase[];
    setPurchases: (purchases: Purchase[]) => void;
}

export function PurchaseTable({ purchases, setPurchases }: PurchaseTableProps) {

    const addPurchase = () => {
        const newPurchase: Purchase = {
            id: generateId(),
            price: 0,
            quantity: 0,
            date: new Date().toISOString().split('T')[0]
        };
        setPurchases([...purchases, newPurchase]);
    };

    const updatePurchase = (id: string, field: keyof Purchase, value: unknown) => {
        const updated = purchases.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        setPurchases(updated);
    };

    const deletePurchase = (id: string) => {
        setPurchases(purchases.filter(p => p.id !== id));
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Purchase History</h3>
                <Button
                    onClick={addPurchase}
                    className="bg-[#C77DFF] hover:bg-[#b05ad5] text-black font-semibold"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Purchase
                </Button>
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Purchase Price</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-3">Total Cost</div>
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="space-y-2">
                {purchases.length === 0 ? (
                    <div className="text-center py-10 bg-[#13082a] border border-[#2a1b4e] rounded-lg text-gray-500">
                        No purchases added. Click "Add Purchase" to start.
                    </div>
                ) : (
                    purchases.map((purchase, index) => (
                        <PurchaseRow
                            key={purchase.id}
                            index={index}
                            purchase={purchase}
                            onUpdate={updatePurchase}
                            onDelete={deletePurchase}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
