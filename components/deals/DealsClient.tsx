"use client";

import React, { useState, useMemo } from "react";
import { AFFILIATES } from "@/lib/config/affiliates.config";
import AffiliateCard from "@/components/affiliates/AffiliateCard";

const CATEGORIES = ["All", "Exchange", "Wallet", "Analytics"];

export default function DealsClient() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredAffiliates = useMemo(() => {
    const all = Object.values(AFFILIATES).filter((a) => a.active);
    if (activeTab === "All") return all.sort((a, b) => a.priority - b.priority);
    return all.filter(a => a.category.toLowerCase() === activeTab.toLowerCase()).sort((a, b) => a.priority - b.priority);
  }, [activeTab]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === cat
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in" key={activeTab}>
        {filteredAffiliates.map(aff => (
          <AffiliateCard key={aff.id} affiliate={aff} pageId="deals" />
        ))}
        {filteredAffiliates.length === 0 && (
          <div className="col-span-full text-center text-white/50 py-10">
            No deals found in this category.
          </div>
        )}
      </div>
    </>
  );
}
