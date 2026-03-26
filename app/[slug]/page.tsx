import { notFound, redirect } from 'next/navigation';
import { getPostBySlug } from '@/lib/api/wordpress';

interface PostParams {
    params: Promise<{
        slug: string;
    }>
}

/**
 * SEO Preservation Redirects
 * This route acts as a catch-all at the top level for old WordPress URLs
 * (e.g., www.apexweb3.com/article-slug) and 301 redirects them to the new
 * /blog/article-slug path to ensure no SEO rankings or backlinks are lost.
 */
export default async function LegacyPostRedirect({ params }: PostParams) {
    const { slug } = await params;

    // Check if the slug corresponds to a valid WordPress post
    const post = await getPostBySlug(slug);

    if (post) {
        // If it's a valid post, permanently redirect (301) to new /blog path
        redirect(`/blog/${slug}`);
    } else {
        // If not found, let Next.js show the 404 page
        notFound();
    }
}
