import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/api/wordpress';
import { Sidebar, parseHeadings } from '@/components/blog/Sidebar';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PostParams {
    params: {
        slug: string;
    }
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        return { title: 'Post Not Found | ApexWeb3' };
    }

    return {
        title: `${post.title} | ApexWeb3 Intelligence`,
        description: post.excerpt.replace(/<[^>]+>/g, '').trim(), // Strip HTML for meta desc
        openGraph: {
            title: post.title,
            description: post.excerpt.replace(/<[^>]+>/g, '').trim(),
            images: post.featuredImage?.node.sourceUrl ? [post.featuredImage.node.sourceUrl] : [],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.node.name]
        },
    };
}

export default async function BlogPostPage({ params }: PostParams) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // Server-side parsing of headings for the Sticky ToC Sidebar
    const { html: contentWithIds, toc } = parseHeadings(post.content);

    // Rough read time estimate (200 words per minute)
    const wordCount = post.content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen bg-brand-dark">
            {/* Header Hero */}
            <header className="relative border-b border-slate-800 bg-slate-900/80 pt-24 pb-16 overflow-hidden">
                {/* Background Image Logic */}
                {post.featuredImage?.node.sourceUrl && (
                    <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
                        <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt=""
                            fill
                            className="object-cover blur-sm"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
                    </div>
                )}

                <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-5xl">
                    <Link href="/insights" className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Intelligence
                    </Link>

                    {post.categories?.nodes[0] && (
                        <Link href={`/category/${post.categories.nodes[0].slug}`} className="mb-6 inline-block rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary hover:bg-brand-primary/20 transition-colors">
                            {post.categories.nodes[0].name}
                        </Link>
                    )}

                    <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 border-t border-slate-800 pt-6">
                        <div className="flex items-center gap-3">
                            {post.author.node.avatar?.url ? (
                                <Image src={post.author.node.avatar.url} alt={post.author.node.name} width={32} height={32} className="rounded-full" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                            <span className="font-medium text-slate-300">{post.author.node.name}</span>
                        </div>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {readTime} min read
                        </span>
                    </div>
                </div>
            </header>

            {/* Layout: Content + Sticky Sidebar */}
            <div className="container mx-auto px-4 py-12 md:px-6 max-w-6xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                    {/* Main Content Area */}
                    <main className="lg:col-span-8">
                        {/* Featured Image inside content if needed */}
                        {post.featuredImage?.node.sourceUrl && (
                            <div className="mb-12 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
                                <Image
                                    src={post.featuredImage.node.sourceUrl}
                                    alt={post.featuredImage.node.altText || post.title}
                                    width={1000}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        <article
                            className="prose prose-invert max-w-none prose-lg
                            prose-headings:font-bold prose-headings:text-slate-100 prose-headings:scroll-mt-28
                            prose-h1:text-4xl prose-h1:mt-14 prose-h1:mb-8
                            prose-h2:text-3xl prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-h2:mt-12 prose-h2:mb-6
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-4
                            prose-a:text-brand-primary hover:prose-a:text-teal-400
                            prose-img:rounded-xl prose-img:border prose-img:border-slate-800
                            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }}
                        />
                    </main>

                    {/* Sidebar / Table of Contents */}
                    <div className="hidden lg:block lg:col-span-4 pl-4 pt-12">
                        <Sidebar toc={toc} />
                    </div>
                </div>
            </div>
        </div>
    );
}
