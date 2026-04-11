import React from "react";
import Image from "next/image";
import { Affiliate } from "@/lib/config/affiliates.config";
import { buildAffiliateUrl } from "@/lib/utils/affiliateUrl";

interface AffiliateCardProps {
  affiliate: Affiliate;
  pageId: string;
}

export default function AffiliateCard({ affiliate, pageId }: AffiliateCardProps) {
  const finalUrl = buildAffiliateUrl(affiliate.url, affiliate.id, pageId);

  return (
    <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 relative max-w-sm w-full animate-fade-in group"
      style={{ "--hover-color": affiliate.badgeColor } as React.CSSProperties}
    >
      <style jsx>{`
        .group:hover {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 0 20px var(--hover-color);
        }
      `}</style>
      
      {/* Badge */}
      <div 
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
        style={{ backgroundColor: affiliate.badgeColor }}
      >
        {affiliate.badge}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow-inner overflow-hidden">
             <Image
                src={affiliate.logo}
                alt={`${affiliate.name} logo`}
                width={32}
                height={32}
                className="object-contain"
                loading="lazy"
              />
        </div>
        <div>
          <h3 className="font-serif font-bold text-xl text-white">{affiliate.name}</h3>
          <p className="text-[10px] uppercase tracking-wider text-white/50">{affiliate.tagline}</p>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-white/80 mb-4 line-clamp-3">
        {affiliate.description}
      </p>

      {/* Highlight */}
      <div className="flex items-start gap-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
        <span className="text-green-500 font-bold shrink-0">✓</span>
        <p className="text-xs text-white/90 font-medium">
          {affiliate.highlight}
        </p>
      </div>

      {/* Badges */}
      <div className="mb-6 flex-grow">
        <p className="text-xs text-white/50 mb-2">Used with:</p>
        <div className="flex flex-wrap gap-2">
          {affiliate.placements.map((tool) => (
            <span key={tool} className="text-[10px] px-2 py-1 bg-white/10 border border-white/10 rounded-md text-white/70">
              {tool.replace("-", " ")}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-white/10 mb-4" />

      {/* CTA */}
      <a
        href={finalUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`Visit ${affiliate.name} — partner link, opens in new tab`}
        className="w-full py-3 rounded-lg text-center text-sm font-bold transition-all hover:brightness-110 mb-3"
        style={{ backgroundColor: affiliate.badgeColor, color: "#fff" }}
      >
        {affiliate.ctaText}
      </a>

      {/* Disclosure */}
      <p className="text-[10px] text-center text-white/40" role="note">
        Partner link &middot; ApexWeb3 may earn a commission
      </p>
    </div>
  );
}
