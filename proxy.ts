import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();

    // Example: Redirecting old WP date paths to root permalinks
    if (url.pathname.match(/\/\d{4}\/\d{2}\//)) {
        const slug = url.pathname.split('/').filter(Boolean).pop();
        if (slug) {
            return NextResponse.redirect(new URL(`/${slug}`, request.url), 301);
        }
    }

    return NextResponse.next();
}
