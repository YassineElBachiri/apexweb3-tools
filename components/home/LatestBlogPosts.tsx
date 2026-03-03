import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts } from '@/lib/api/wordpress';
import { ArrowRight, Calendar, User, AlertCircle } from 'lucide-react';

export async function LatestBlogPosts() {
    // Requirements specified 5-10 posts, updating to 6 to fit neatly into the 3-column grid
    const posts = await getLatestPosts(6);

    if (!posts || posts.length === 0) {
        return (
            <section className="relative overflow-hidden border-t border-slate-800 bg-brand-dark py-24">
                <div className="container relative z-10 mx-auto px-4 md:px-6">
                    <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                                Latest Web3 <span className="text-brand-primary">Insights</span>
                            </h2>
                            <p className="text-lg text-slate-400">
                                Research, market updates, and tokenomic analysis straight from the ApexWeb3 team.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/50">
                        <AlertCircle className="h-12 w-12 text-slate-500 mb-4" />
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Connecting to Intelligence Hub...</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Our research feeds are currently syncing. Please check back in a moment for the latest web3 insights.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative overflow-hidden border-t border-slate-800 bg-brand-dark py-24">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-purple/5 opacity-50" />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                            Latest Web3 <span className="text-brand-primary">Insights</span>
                        </h2>
                        <p className="text-lg text-slate-400">
                            Research, market updates, and tokenomic analysis straight from the ApexWeb3 team.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-6 py-3 font-medium text-slate-300 transition-all hover:border-brand-primary/50 hover:bg-slate-800 hover:text-white"
                    >
                        View All Articles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group relative flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-1 transition-all hover:-translate-y-1 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10"
                        >
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
                                            <span className="text-4xl opacity-20">📰</span>
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {post.categories?.nodes?.[0] && (
                                        <div className="absolute top-4 left-4 rounded-full bg-brand-dark/80 backdrop-blur-sm border border-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
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
                                            {post.author?.node?.name || 'Admin'}
                                        </span>
                                    </div>

                                    <h3
                                        className="mb-3 text-xl font-bold text-slate-100 transition-colors group-hover:text-brand-primary line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: post.title }}
                                    />

                                    <div
                                        className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400"
                                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                    />

                                    <div className="mt-auto flex items-center font-semibold text-brand-primary text-sm transition-colors group-hover:text-white">
                                        Read Article
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
