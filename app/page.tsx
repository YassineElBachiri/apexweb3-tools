import { Hero } from "@/components/home/Hero";
import { PillarGrid } from "@/components/home/PillarGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesShowcase } from "@/components/home/FeaturesShowcase";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";

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
