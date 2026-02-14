
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-24 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20" />
                    <div className="absolute inset-0 backdrop-blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10 py-20 px-8 text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Ready to Master Crypto?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of traders using ApexWeb3 tools to make smarter,
                            data-driven investment decisions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="bg-white text-brand-dark hover:bg-gray-100 px-8 py-6 text-lg rounded-full w-full sm:w-auto font-bold"
                                >
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="#tools">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full w-full sm:w-auto"
                                >
                                    View All Tools
                                </Button>
                            </Link>
                        </div>

                        <p className="text-sm text-gray-500 mt-8 font-medium">
                            No credit card required • No login needed • 100% Free forever
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
