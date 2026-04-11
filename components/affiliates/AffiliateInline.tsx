import React from "react";
import Image from "next/image";
import { Affiliate, PlacementCopy } from "@/lib/config/affiliates.config";
import { buildAffiliateUrl } from "@/lib/utils/affiliateUrl";

interface AffiliateInlineProps {
  affiliate: Affiliate;
  copy: PlacementCopy | null;
  pageId: string;
}

export default function AffiliateInline({ affiliate, copy, pageId }: AffiliateInlineProps) {
  const headline = copy?.headline || affiliate.tagline;
  const subline = copy?.subline || affiliate.description;
  const finalUrl = buildAffiliateUrl(affiliate.url, affiliate.id, pageId);

  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/8 backdrop-blur animate-fade-in ${
        copy?.urgency ? "ring-1 ring-red-500/30" : ""
      }`}
      style={{ backgroundColor: `${affiliate.badgeColor}14` }} // 8% hex approximate
    >
      <div className="flex items-center gap-4 w-full mb-4 sm:mb-0">
        <div className="relative w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <Image
            src={affiliate.logo}
            alt={`${affiliate.name} logo`}
            width={24}
            height={24}
            className="object-contain"
            loading="lazy"
          />
          {copy?.urgency && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        
        <div className="flex flex-col flex-grow">
          <h4 className="text-white font-medium text-sm sm:text-base">
            {headline}
          </h4>
          <p className="text-white/60 text-xs sm:text-sm line-clamp-1">
            {subline}
          </p>
          <span className="text-[10px] text-white/40 mt-1" role="note">
            Partner link &middot; ApexWeb3 may earn a commission
          </span>
        </div>
      </div>

      <a
        href={finalUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`Visit ${affiliate.name} — partner link, opens in new tab`}
        className="w-full sm:w-auto whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
        style={{ backgroundColor: affiliate.badgeColor, color: "#fff" }}
      >
        {affiliate.ctaText}
      </a>
    </div>
  );
}
