
import type { Metadata } from 'next';
import { SalaryCalculatorClient } from '@/components/salary-calculator/SalaryCalculatorClient';
import { FAQ } from '@/components/salary-calculator/FAQ';
import RiskDisclaimer from '@/components/global/RiskDisclaimer';
import { SALARY_ESTIMATOR_CONTENT, SALARY_ESTIMATOR_SEO } from '@/lib/seo-content/salary-estimator';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: SALARY_ESTIMATOR_SEO.title,
    description: SALARY_ESTIMATOR_SEO.description,
    keywords: SALARY_ESTIMATOR_SEO.keywords,
    openGraph: {
        title: SALARY_ESTIMATOR_SEO.title,
        description: SALARY_ESTIMATOR_SEO.description,
        images: [
            {
                url: SALARY_ESTIMATOR_SEO.ogImage,
                width: 1200,
                height: 630,
                alt: 'Crypto Salary Estimator',
            },
        ],
    },
};

export default function SalaryEstimatorPage() {
    return (
        <div className="min-h-screen bg-brand-dark overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[80px]" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-20 lg:py-24">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <Shield className="w-4 h-4 text-brand-purple" />
                        <span className="font-medium">Production-Ready Utility</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Crypto Salary
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-blue">
                            Estimator
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        Accurately calculate your income in Bitcoin, Ethereum, or stablecoins.
                        Visualize volatility, simulate DCA strategies, and estimate tax obligations.
                    </p>
                </div>

                {/* Calculator Section */}
                <div className="relative mb-8 animate-in fade-in zoom-in-95 duration-700 delay-300">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl opacity-20 blur-lg" />
                    <div className="relative bg-brand-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl">
                        <SalaryCalculatorClient />
                    </div>
                </div>

                {/* Risk Disclaimer */}
                <div className="mb-24 animate-in fade-in zoom-in-95 duration-700 delay-400">
                    <RiskDisclaimer />
                </div>

                {/* Features / Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
                    {SALARY_ESTIMATOR_CONTENT.features.map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-purple/30 transition-colors group">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-purple transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <FAQ />

                {/* CTA / Footer Hook */}
                <div className="mt-24 text-center max-w-2xl mx-auto space-y-6 p-8 rounded-2xl bg-gradient-to-b from-brand-purple/10 to-transparent border border-brand-purple/20">
                    <h2 className="text-3xl font-bold text-white">Ready to Optimize Your Crypto Income?</h2>
                    <p className="text-gray-400">
                        Explore more advanced tools for portfolio tracking and token analysis on ApexWeb3.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button className="h-12 px-8 bg-white text-brand-dark hover:bg-gray-200 font-bold text-lg rounded-full">
                            Explore Tools
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
}
