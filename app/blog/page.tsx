import { Metadata } from 'next';
import Link from 'next/link';
import { getPaginatedPosts, getCategories } from '@/lib/api/wordpress';
import { Calendar, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Blog | ApexWeb3',
    description: 'Latest news, insights, and research from ApexWeb3.',
    alternates: {
        canonical: 'https://apexweb3.com/blog',
    },
    openGraph: {
        title: 'Blog | ApexWeb3',
        description: 'Latest news, insights, and research from ApexWeb3.',
        url: 'https://apexweb3.com/blog',
        type: 'website',
    }
};

export default async function BlogHomepage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    // Fetch posts and categories in parallel
    const [postsData, categories] = await Promise.all([
        getPaginatedPosts(12, page),
        getCategories()
    ]);

    const { posts, totalPages } = postsData;

    return (
        <div className="min-h-screen bg-brand-dark pb-24">
            {/* Header / Hero */}
            <div className="relative border-b border-slate-800 bg-slate-900/50 pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-brand-primary/5 to-transparent object-cover opacity-50 mix-blend-overlay" />
                <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                        ApexWeb3 <span className="text-brand-primary">Blog</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl">
                        Stay ahead of the curve with our latest insights, technical updates, and deep dives into the Web3 ecosystem.
                    </p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="border-b border-slate-800 bg-slate-900/30">
                <div className="container mx-auto px-4 py-4 md:px-6">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">Filter by Topic:</span>
                        <Link href="/blog" className="whitespace-nowrap rounded-full bg-brand-primary/20 px-4 py-1.5 text-sm font-medium text-brand-primary hover:bg-brand-primary/30 transition-colors">
                            All
                        </Link>
                        {categories.slice(0, 8).map(category => (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                className="whitespace-nowrap rounded-full bg-slate-800/50 border border-slate-700 px-4 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                {category.name} <span className="ml-1 text-slate-500 text-xs">({category.count})</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-16 md:px-6">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No posts found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-1 transition-all hover:-translate-y-1 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10 flex flex-col h-full">
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
                                                <span className="text-4xl opacity-20">📝</span>
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        {post.categories.nodes.length > 0 && (
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
                                                {post.author.node.name}
                                            </span>
                                        </div>

                                        <h2 className="mb-3 text-xl font-bold text-slate-100 group-hover:text-brand-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title }}>
                                        </h2>

                                        <div
                                            className="mb-6 line-clamp-3 text-sm flex-1 leading-relaxed text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                                        />

                                        <div className="mt-auto flex items-center font-semibold text-brand-primary text-sm group-hover:text-white transition-colors">
                                            Read Full Article
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Link
                                key={i}
                                href={`/blog?page=${i + 1}`}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${page === i + 1
                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                                    } transition-colors font-medium`}
                            >
                                {i + 1}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
