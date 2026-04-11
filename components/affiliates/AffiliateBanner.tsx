"use client";

import React, { useMemo } from "react";
import {
  getAffiliatesForPage,
  getPrimaryCopy,
  getAffiliateForPortfolio,
} from "@/lib/config/affiliates.config";
import AffiliateInline from "./AffiliateInline";
import AffiliateCard from "./AffiliateCard";
import AffiliateSidebar from "./AffiliateSidebar";

interface AffiliateBannerProps {
  pageId: string;
  variant?: "inline" | "card" | "sidebar";
  portfolioVal?: number;
  limit?: number;
}

export const AffiliateBanner = React.memo(function AffiliateBannerComp({
  pageId,
  variant = "inline",
  portfolioVal,
  limit,
}: AffiliateBannerProps) {
  const affiliates = useMemo(() => {
    let matched = getAffiliatesForPage(pageId);

    // If portfolio value is provided, override and pick the smartest affiliate
    if (portfolioVal !== undefined) {
      const portfolioAffiliate = getAffiliateForPortfolio(portfolioVal);
      if (portfolioAffiliate) {
        matched = [portfolioAffiliate];
      }
    }

    if (limit && limit > 0) {
      matched = matched.slice(0, limit);
    } else if (variant === "inline") {
      matched = matched.slice(0, 1);
    }

    return matched;
  }, [pageId, portfolioVal, limit, variant]);

  if (!affiliates || affiliates.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
      
      {variant === "inline" && affiliates.map((aff) => (
        <AffiliateInline 
          key={aff.id} 
          affiliate={aff} 
          copy={getPrimaryCopy(pageId, aff.id)} 
          pageId={pageId} 
        />
      ))}

      {variant === "card" && affiliates.map((aff) => (
        <AffiliateCard key={aff.id} affiliate={aff} pageId={pageId} />
      ))}

      {variant === "sidebar" && (
        <div className="flex flex-col gap-4">
          {affiliates.map((aff) => (
             <AffiliateSidebar key={aff.id} affiliate={aff} pageId={pageId} />
          ))}
        </div>
      )}
    </>
  );
});

export default AffiliateBanner;
