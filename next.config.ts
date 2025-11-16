import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const remotePatterns: NonNullable<NextConfig["images"]>['remotePatterns'] = [
    {
        protocol: 'https',
        hostname: 'img.spoonacular.com',
        pathname: '/**',
    }
];

if (supabaseHostname) {
    remotePatterns.push({ protocol: 'https', hostname: supabaseHostname, pathname: '/**' });
}

const isProd = process.env.NODE_ENV === 'production';

const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    `img-src 'self' data: https://img.spoonacular.com${supabaseHostname ? ` https://${supabaseHostname}` : ''}`,
    `connect-src 'self'${supabaseHostname ? ` https://${supabaseHostname}` : ''} https://www.google.com https://www.gstatic.com`,
    isProd
        ? "script-src 'self' https://www.google.com https://www.gstatic.com"
        : "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
].join('; ');

const securityHeaders = [
    ...(isProd
        ? [{
            key: 'Content-Security-Policy',
            value: csp,
        }]
        : []),
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
    },
];

const nextConfig: NextConfig = {
    images: {
        remotePatterns,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
