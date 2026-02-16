"use client";

import { useState } from "react";
import { categories, deals, DealCategory } from "@/lib/deals-data";
import { DealCard } from "./DealCard";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export function DealsFilterSystem() {
    const [activeCategory, setActiveCategory] = useState<DealCategory>("All");

    const filteredDeals = activeCategory === "All"
        ? deals
        : deals.filter(deal => deal.category === activeCategory);

    // Sort: Featured first, then Editor's Pick
    const sortedDeals = [...filteredDeals].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.editorsPick && !b.editorsPick) return -1;
        if (!a.editorsPick && b.editorsPick) return 1;
        return 0;
    });

    return (
        <div className="space-y-8">
            {/* Category Tabs */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-4xl overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex min-w-max justify-center gap-2 px-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${activeCategory === category
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 ring-1 ring-brand-primary"
                                    : "bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-slate-500">
                    Showing {sortedDeals.length} {activeCategory === "All" ? "total" : activeCategory.toLowerCase()} deals
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {sortedDeals.map((deal) => (
                        <motion.div
                            key={deal.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DealCard deal={deal} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {sortedDeals.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-xl text-slate-500">No deals found in this category yet.</p>
                    <button
                        onClick={() => setActiveCategory("All")}
                        className="mt-4 text-brand-primary underline hover:text-brand-primary/80"
                    >
                        View all deals
                    </button>
                </div>
            )}
        </div>
    );
}
