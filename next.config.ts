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

const nextConfig: NextConfig = {
    images: {
        remotePatterns,
    },
};

export default nextConfig;
