import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    poweredByHeader: false,
    trailingSlash: false,
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.apexweb3.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'wp.apexweb3.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
            },
            {
                protocol: 'https',
                hostname: 'logo.clearbit.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            // ── Static asset caching ─────────────────────────────────────────
            {
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            // Public images — 24h cache
            {
                source: "/(.*\.(?:png|jpg|jpeg|svg|ico|webp))",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=3600",
                    },
                ],
            },
            // ── Widget pages: allow embedding in any iframe ───────────────────
            // Must come BEFORE the catch-all /:path* rule.
            {
                source: "/widget/:path*",
                headers: [
                    { key: "X-Frame-Options", value: "ALLOWALL" },
                    { key: "Content-Security-Policy", value: "frame-ancestors *" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=300" },
                ],
            },
            // ── Security & performance headers (all other routes) ─────────────
            {
                source: "/:path*",
                headers: [
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                ],
            },
        ];
    },
    experimental: {
        useCache: true,
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'apexweb3.com',
                    },
                ],
                destination: 'https://www.apexweb3.com/:path*',
                permanent: true,
            },
            {
                source: '/:category(news|defi|guide|blockchain-basics|web3-and-ai|reviews-and-analysis|blockchain-dev-hub|nfts-and-metaverse|security-and-audits)',
                destination: '/blog/category/:category',
                permanent: true,
            },
            // WordPress duplicate path redirects
            {
                source: '/tag/:slug*',
                destination: '/blog',
                permanent: true,
            },
            {
                source: '/author/:slug*',
                destination: '/blog',
                permanent: true,
            },
            {
                source: '/category/:slug',
                destination: '/blog/category/:slug',
                permanent: true,
            },
            {
                source: '/page/:num',
                destination: '/blog',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
