"use client";

import { useEffect, useState } from "react";
import { AffiliateRecommendation, AffiliateContext } from "@/lib/affiliate-prompt";
import { AFFILIATES } from "@/lib/config/affiliates.config";
import { ExternalLink, Zap, Sparkles } from "lucide-react";

interface AiAffiliateBannerProps {
  context: AffiliateContext;
  variant?: "inline" | "card";
  className?: string;
}

export function AiAffiliateBanner({ context, variant = "inline", className = "" }: AiAffiliateBannerProps) {
  const [recs, setRecs] = useState<AffiliateRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For blog posts, use a cache key to avoid redundant calls
    const cacheKey = context.type === 'blog'
      ? `affiliate_blog_${context.category}_${(context as any).title?.slice(0, 30)}`
      : null;

    if (cacheKey) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setRecs(JSON.parse(cached));
        setLoading(false);
        return;
      }
    }

    fetch('/api/affiliate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    })
      .then(res => res.json())
      .then(data => {
        const result = data.recommendations ?? [];
        setRecs(result);
        if (cacheKey && result.length > 0) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      })
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className={`h-16 animate-pulse rounded-xl bg-slate-800/40 ${className}`} />
    );
  }

  if (!recs || recs.length === 0) return null;

  if (variant === "card") {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
        {recs.map(rec => <AiAffiliateCard key={rec.affiliateId} rec={rec} />)}
      </div>
    );
  }

  // Default: inline (show first one)
  return <AiAffiliateInline rec={recs[0]} className={className} />;
}

// ── Inline variant ─────────────────────────────────────────────────────────────
function AiAffiliateInline({ rec, className }: { rec: AffiliateRecommendation; className?: string }) {
  const aff = AFFILIATES[rec.affiliateId];
  if (!aff) return null;

  return (
    <a
      href={rec.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={`relative group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900/80 to-slate-800/80 px-5 py-4 shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-brand-primary/20 hover:border-brand-primary/50 backdrop-blur-md ${className}`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="min-w-0 flex-1 relative z-10 w-full sm:w-auto">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary/20 px-2 py-0.5 text-[10px] font-bold text-brand-primary border border-brand-primary/20">
             <Sparkles className="h-3 w-3" />
             Recommended
          </span>
          {rec.urgency && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
              <Zap className="h-3 w-3 fill-current" />
              NOW
            </span>
          )}
        </div>
        <p className="text-base font-bold text-white truncate">{rec.headline}</p>
        <p className="text-sm text-slate-400 truncate mt-0.5">{rec.subline}</p>
      </div>
      <span className="relative z-10 shrink-0 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-brand-dark transition-all hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 whitespace-nowrap">
        {rec.ctaText}
        <ExternalLink className="h-4 w-4" />
      </span>
    </a>
  );
}

// ── Card variant ───────────────────────────────────────────────────────────────
function AiAffiliateCard({ rec }: { rec: AffiliateRecommendation }) {
  const aff = AFFILIATES[rec.affiliateId];
  if (!aff) return null;

  return (
    <a
      href={rec.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="relative group flex flex-col gap-4 rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-5 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-primary/20 hover:border-brand-primary/50 backdrop-blur-md"
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/20 px-2.5 py-1 text-[10px] font-bold text-brand-primary uppercase tracking-wide border border-brand-primary/20">
           <Sparkles className="h-3 w-3" />
           {aff.category}
        </span>
        {rec.urgency && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-400 border border-amber-500/20">
            <Zap className="h-3 w-3 fill-current" />
            Time-sensitive
          </span>
        )}
      </div>
      <div className="relative z-10 flex-1">
        <p className="font-bold text-white text-base mb-1.5 leading-snug">{rec.headline}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{rec.subline}</p>
      </div>
      <span className="relative z-10 mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-brand-dark transition-all hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20">
        {rec.ctaText}
        <ExternalLink className="h-4 w-4" />
      </span>
    </a>
  );
}

export default AiAffiliateBanner;
