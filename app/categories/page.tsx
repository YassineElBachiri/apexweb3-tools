import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/api/wordpress';
import { getCategoryUrl } from '@/lib/utils';
import { Folder, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Browse Articles by Category | ApexWeb3',
    description: 'Explore ApexWeb3 intelligence, tokenomics, and guides by category.',
};

export default async function CategoriesIndexPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-brand-dark pb-24">
            {/* Header / Hero */}
            <div className="relative border-b border-slate-800 bg-slate-900/50 py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-brand-primary/10 blur-[120px]" />
                </div>
                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <Link href="/insights" className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-white mb-6 transition-colors">
                            &larr; Back to All Articles
                        </Link>
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                            Browse <span className="text-brand-primary">Categories</span>
                        </h1>
                        <p className="text-xl text-slate-400">
                            Find specific analysis, tokenomics data, and security insights organized by topic.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-16 md:px-6">
                {categories.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                        <p className="text-slate-500">No categories found or unable to connect to CMS.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={getCategoryUrl(category.slug)}
                                className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors hover:border-brand-primary/50"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform">
                                        <Folder className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                                    <span className="text-sm text-slate-400">
                                        {category.count} {category.count === 1 ? 'Article' : 'Articles'}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
