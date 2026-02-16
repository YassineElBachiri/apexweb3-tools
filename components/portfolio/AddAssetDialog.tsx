"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddAsset from "@/components/portfolio/add-asset";

interface AddAssetDialogProps {
    onAddAsset: (id: string, price: number, quantity: number, date?: string) => void;
    existingAssets: string[];
}

export function AddAssetDialog({ onAddAsset, existingAssets }: AddAssetDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = (id: string, price: number, quantity: number, date?: string) => {
        onAddAsset(id, price, quantity, date);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    <Plus className="w-5 h-5" />
                    Add New Asset
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-[#1a1b1e] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add to Portfolio</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Search for a token and enter your buy price.
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                    {/* We modify AddAsset to not have its own container/header styling if needed, 
                        or we just accept it's a bit nested. 
                        Ideally we'd refactor AddAsset, but for now we wrap it.
                    */}
                    <div className="bg-card/50 rounded-xl p-1">
                        <AddAsset
                            onAddAsset={handleSuccess}
                            existingAssets={existingAssets}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
