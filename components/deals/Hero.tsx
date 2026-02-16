import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function DealsHero() {
    return (
        <div className="relative overflow-hidden bg-brand-dark pb-16 pt-24 text-center md:pt-32">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute -left-10 top-20 h-72 w-72 rounded-full bg-brand-primary blur-[100px]" />
                <div className="absolute right-10 top-40 h-72 w-72 rounded-full bg-blue-600 blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10 px-4 md:px-6">
                <div className="mx-auto max-w-3xl space-y-6">
                    <Badge variant="outline" className="animate-fade-in border-brand-primary/30 bg-brand-primary/10 px-4 py-1 text-sm text-brand-primary">
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                        Curated by ApexWeb3
                    </Badge>

                    <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Exclusive Web3 Developer <br />
                        <span className="bg-gradient-to-r from-brand-primary to-blue-500 bg-clip-text text-transparent">
                            Deals & Builder Perks
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl animate-fade-in-up text-lg text-slate-400 delay-100 sm:text-xl">
                        Handpicked offers for blockchain developers, smart contract engineers, and crypto builders.
                        Save thousands on infrastructure, security, and tooling.
                    </p>

                    <div className="flex animate-fade-in-up flex-col justify-center gap-4 delay-200 sm:flex-row">
                        <Button size="lg" className="bg-brand-primary text-white hover:bg-brand-primary/90">
                            Explore Perks
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                            List Your Deal
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
