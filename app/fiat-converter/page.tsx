import { FiatConverterCard } from "@/components/fiat-converter/FiatConverterCard";

export default function FiatConverterPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                    Global Fiat Exchange
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    See exactly how much your crypto is worth in USD, EUR, JPY, GBP, and more.
                </p>
            </div>

            <FiatConverterCard />
        </div>
    );
}
