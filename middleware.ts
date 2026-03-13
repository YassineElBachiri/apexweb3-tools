import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * SEO Middleware — prevents duplicate indexing
 *
 * 1. Strips tracking query parameters (?utm_*, ?ref, ?fbclid, etc.) via 301 redirect
 * 2. Adds X-Robots-Tag: noindex for WordPress-style paths that shouldn't be indexed
 */

// Query parameters to strip (these cause "Duplicate without user-selected canonical")
const TRACKING_PARAMS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'ref', 'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid',
    '_ga', '_gl', 'hsCtaTracking',
];

// WordPress-style path prefixes that should not be indexed from the Next.js frontend
const NOINDEX_PREFIXES = [
    '/tag/',
    '/author/',
    '/wp-admin',
    '/wp-content',
    '/wp-includes',
    '/wp-json',
    '/feed',
    '/trackback',
    '/xmlrpc.php',
];

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // --- 1. Strip tracking query parameters ---
    let hasTrackingParam = false;
    const cleanParams = new URLSearchParams(searchParams.toString());

    for (const param of TRACKING_PARAMS) {
        if (cleanParams.has(param)) {
            cleanParams.delete(param);
            hasTrackingParam = true;
        }
    }

    if (hasTrackingParam) {
        const cleanUrl = new URL(pathname, request.url);
        // Preserve non-tracking params (e.g., ?page=2)
        const remaining = cleanParams.toString();
        if (remaining) {
            cleanUrl.search = `?${remaining}`;
        }
        return NextResponse.redirect(cleanUrl, 301);
    }

    // --- 2. Noindex WordPress-style paths ---
    const isWordPressPath = NOINDEX_PREFIXES.some(prefix =>
        pathname.startsWith(prefix)
    );

    if (isWordPressPath) {
        const response = NextResponse.next();
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    // Run on all paths except static files, images, and Next.js internals
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    ],
};
