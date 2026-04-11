import React from "react";
import Image from "next/image";
import { Affiliate } from "@/lib/config/affiliates.config";
import { buildAffiliateUrl } from "@/lib/utils/affiliateUrl";

interface AffiliateSidebarProps {
  affiliate: Affiliate;
  pageId: string;
}

export default function AffiliateSidebar({ affiliate, pageId }: AffiliateSidebarProps) {
  const finalUrl = buildAffiliateUrl(affiliate.url, affiliate.id, pageId);

  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-4 w-[240px] animate-fade-in group">
      <div className="flex items-center gap-3 mb-3">
          <Image
            src={affiliate.logo}
            alt={`${affiliate.name} logo`}
            width={24}
            height={24}
            className="object-contain"
            loading="lazy"
          />
        <h4 className="font-bold text-white text-sm">{affiliate.name}</h4>
      </div>
      
      <p className="text-xs text-white/70 mb-4 line-clamp-2">
        {affiliate.description}
      </p>

      <a
        href={finalUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`Visit ${affiliate.name} — partner link, opens in new tab`}
        className="w-full py-2 rounded-md text-center text-xs font-semibold transition-all hover:brightness-110 mb-2"
        style={{ backgroundColor: affiliate.badgeColor, color: "#fff" }}
      >
        {affiliate.ctaText}
      </a>

      <p className="text-[9px] text-center text-white/40" role="note">
        Partner link &middot; may earn commission
      </p>
    </div>
  );
}
