import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img2.rtve.es',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'hitsnoodles.com',
                pathname: '/**',
            },{
                protocol: 'https',
                hostname: 'i.ytimg.com',
                pathname: '/**',
            },{
                protocol: 'https',
                hostname: 'galbani.es',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
