"use client";

import { useEffect, useState } from "react";
import { AffiliateRecommendation, AffiliateContext } from "@/lib/affiliate-prompt";
import { AFFILIATES, getAffiliatesForPage, getPrimaryCopy } from "@/lib/config/affiliates.config";
import { ExternalLink, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        
        // If no AI recommendations, try heuristic fallback
        if (result.length === 0) {
          const pageId = context.type === 'job' ? 'jobs' : (context.type === 'tool' ? context.toolId : context.category);
          const fallbackAffs = getAffiliatesForPage(pageId);
          if (fallbackAffs.length > 0) {
            const aff = fallbackAffs[0];
            const copy = getPrimaryCopy(pageId, aff.id);
            const fallbackRec: AffiliateRecommendation = {
              affiliateId: aff.id,
              headline: copy?.headline || aff.tagline,
              subline: copy?.subline || aff.description,
              ctaText: aff.ctaText,
              url: aff.url,
              urgency: copy?.urgency || false,
              placement_reason: "Heuristic match"
            };
            setRecs([fallbackRec]);
          } else {
            setRecs([]);
          }
        } else {
          setRecs(result);
        }

        if (cacheKey && result.length > 0) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      })
      .catch(() => {
        // Hard fallback on error
        const pageId = context.type === 'job' ? 'jobs' : (context.type === 'tool' ? context.toolId : (context as any).category);
        const fallbackAffs = getAffiliatesForPage(pageId);
        if (fallbackAffs.length > 0) {
          const aff = fallbackAffs[0];
          setRecs([{
            affiliateId: aff.id,
            headline: aff.tagline,
            subline: aff.description,
            ctaText: aff.ctaText,
            url: aff.url,
            urgency: false,
            placement_reason: "Safe mode"
          }]);
        } else {
          setRecs([]);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className={`h-24 animate-pulse rounded-2xl bg-slate-800/20 border border-white/5 ${className}`} />
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
      className={`relative group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-background to-background px-6 py-5 shadow-[0_0_30px_rgba(0,210,255,0.15)] overflow-hidden transition-all duration-300 hover:scale-[1.005] hover:shadow-primary/40 hover:border-primary/70 backdrop-blur-md ${className}`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="min-w-0 flex-1 relative z-10 w-full sm:w-auto text-left">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 font-mono text-[10px] uppercase tracking-widest px-2 py-0">
             <Sparkles className="h-3 w-3 mr-1" />
             AI_SIGNAL_MATCH
          </Badge>
          {rec.urgency && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-mono text-[10px] uppercase tracking-widest px-2 py-0">
              <Zap className="h-3 w-3 mr-1 fill-current" />
              PRIORITY_DEAL
            </Badge>
          )}
        </div>
        <p className="text-xl font-extrabold text-foreground leading-tight tracking-tight">{rec.headline}</p>
        <p className="text-sm text-muted-foreground mt-1 font-mono tracking-tight opacity-80">{rec.subline}</p>
      </div>
      <div className="relative z-10 shrink-0 w-full sm:w-auto">
        <div className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-xl shadow-primary/20 uppercase tracking-widest h-12">
            {rec.ctaText}
            <ExternalLink className="ml-2 h-4 w-4" />
        </div>
      </div>
    </a>
  );
}

// ── Card variant ───────────────────────────────────────────────────────────────
function AiAffiliateCard({ rec }: { rec: AffiliateRecommendation }) {
  const aff = AFFILIATES[rec.affiliateId];
  if (!aff) return null;

  return (
    <div
      className="relative group flex flex-col gap-4 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/30 hover:border-primary/60 backdrop-blur-md"
    >
      <a
        href={rec.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="absolute inset-0 z-0"
      />
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 font-mono text-[10px] uppercase tracking-widest">
           <Sparkles className="h-3 w-3 mr-1" />
           {aff.category.toUpperCase()}
        </Badge>
        {rec.urgency && (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-mono text-[10px] uppercase tracking-widest">
            <Zap className="h-3 w-3 mr-1 fill-current" />
            LIVE
          </Badge>
        )}
      </div>
      <div className="relative z-10 flex-1 text-left">
        <p className="font-extrabold text-foreground text-xl mb-2 leading-tight tracking-tight">{rec.headline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed font-mono opacity-80">{rec.subline}</p>
      </div>
      <div className="relative z-10 mt-auto pt-4">
        <div className="w-full bg-primary flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 uppercase tracking-widest h-11">
            {rec.ctaText}
            {/* @ts-ignore */}
            <ExternalLink className="ml-2 h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
