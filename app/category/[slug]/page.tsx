import { Metadata } from 'next';
import Link from 'next/link';
import { getPostsByCategory } from '@/lib/api/wordpress';
import { Calendar, ArrowRight, User, Folder } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CategoryParams {
    params: {
        slug: string;
    }
}

export async function generateMetadata({ params }: CategoryParams): Promise<Metadata> {
    return {
        title: `${params.slug.toUpperCase()} Insights | ApexWeb3`,
        description: `Deep dives and analysis for the ${params.slug} category by the ApexWeb3 research team.`,
    };
}

export default async function CategoryPage({ params }: CategoryParams) {
    const posts = await getPostsByCategory(params.slug, 12);

    if (!posts || posts.length === 0) {
        return (
            <div className="min-h-screen bg-brand-dark pb-24 flex items-center justify-center">
                <div className="text-center p-8 border border-slate-800 rounded-2xl bg-slate-900/50">
                    <Folder className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-300 mb-2">Category Empty</h2>
                    <p className="text-slate-500 mb-6">No insights found for category &quot;{params.slug}&quot;.</p>
                    <Link href="/insights" className="text-brand-primary hover:text-teal-400 font-medium">
                        Return to All Insights &rarr;
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark pb-24">
            {/* Header / Hero */}
            <div className="relative border-b border-slate-800 bg-slate-900/50 py-16 overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <Link href="/insights" className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-white mb-6 transition-colors">
                            &larr; Back to Intelligence
                        </Link>
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl capitalize">
                            <span className="text-slate-500">Category:</span> {params.slug.replace(/-/g, ' ')}
                        </h1>
                        <p className="text-lg text-slate-400">
                            Browsing the latest Web3 research and tokenomics for this topic.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-16 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/${post.slug}`} className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-1 transition-all hover:-translate-y-1 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10">
                            <article className="flex h-full flex-col overflow-hidden rounded-xl bg-slate-900">
                                {/* Featured Image placeholder/handler */}
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-800">
                                    {post.featuredImage?.node.sourceUrl ? (
                                        <Image
                                            src={post.featuredImage.node.sourceUrl}
                                            alt={post.featuredImage.node.altText || post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                            <span className="text-4xl opacity-20">📊</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-4 flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1.5 border-r border-slate-700 pr-4">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            {post.author.node.name}
                                        </span>
                                    </div>

                                    <h2 className="mb-3 text-xl font-bold text-slate-100 group-hover:text-brand-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    <div
                                        className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400"
                                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                    />

                                    <div className="mt-auto flex items-center font-semibold text-brand-primary text-sm group-hover:text-white transition-colors">
                                        Read Full Analysis
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
