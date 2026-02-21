import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { PillarGrid } from "@/components/home/PillarGrid";

// Below-the-fold sections loaded lazily to reduce initial JS bundle & TBT
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks").then(m => m.HowItWorks), { ssr: true });
const FeaturesShowcase = dynamic(() => import("@/components/home/FeaturesShowcase").then(m => m.FeaturesShowcase), { ssr: true });
const StatsSection = dynamic(() => import("@/components/home/StatsSection").then(m => m.StatsSection), { ssr: true });
const CTASection = dynamic(() => import("@/components/home/CTASection").then(m => m.CTASection), { ssr: true });

export default function Home() {
    return (
        <div className="min-h-screen bg-brand-dark text-white selection:bg-brand-purple/30">
            <Hero />
            <PillarGrid />
            <HowItWorks />
            <FeaturesShowcase />
            <StatsSection />
            <CTASection />
        </div>
    );
}
