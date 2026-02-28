import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestPosts } from '@/lib/api/wordpress';
import { Calendar, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Web3 Intelligence & Insights | ApexWeb3',
    description: 'Deep dives, tokenomics analysis, and technical Web3 insights from the ApexWeb3 research team.',
};

export default async function InsightsPage() {
    // SSR Fetch from Headless WP
    const posts = await getLatestPosts(12);

    return (
        <div className="min-h-screen bg-brand-dark pb-24">
            {/* Header / Hero */}
            <div className="relative border-b border-slate-800 bg-slate-900/50 py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-brand-primary/10 blur-[120px]" />
                </div>
                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="max-w-3xl">
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                            Web3 <span className="bg-gradient-to-r from-brand-primary to-teal-400 bg-clip-text text-transparent">Intelligence</span>
                        </h1>
                        <p className="text-xl text-slate-400">
                            Deep analysis, tokenomics breakdowns, and technical insights from the frontiers of crypto.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-16 md:px-6">
                {posts.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                        <p className="text-slate-500">No insights published yet or failed to connect to CMS.</p>
                    </div>
                ) : (
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
                                        {/* Category Badge */}
                                        {post.categories?.nodes[0] && (
                                            <div className="absolute left-4 top-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-brand-dark backdrop-blur-md">
                                                {post.categories.nodes[0].name}
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
                )}
            </div>
        </div>
    );
}
