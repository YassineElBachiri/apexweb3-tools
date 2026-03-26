import { Metadata } from 'next';

const SITE_URL = 'https://www.apexweb3.com';

/**
 * Generate canonical metadata for a page.
 * Use this for static pages that only need to add a canonical tag to existing metadata.
 *
 * @param path - The path portion of the URL (e.g., '/about', '/finance/calculator')
 * @returns Partial Metadata object with alternates.canonical set
 *
 * @example
 * export const metadata: Metadata = {
 *     title: 'About Us',
 *     ...canonicalMetadata('/about'),
 * };
 */
export function canonicalMetadata(path: string): Pick<Metadata, 'alternates'> {
    // Ensure path starts with / and has no trailing slash
    const cleanPath = path === '/' ? '' : path.replace(/\/+$/, '');
    return {
        alternates: {
            canonical: `${SITE_URL}${cleanPath}`,
        },
    };
}

/**
 * Build a full canonical URL string for use in structured data, OG tags, etc.
 */
export function canonicalUrl(path: string): string {
    const cleanPath = path === '/' ? '' : path.replace(/\/+$/, '');
    return `${SITE_URL}${cleanPath}`;
}

export { SITE_URL };
