import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/q1j74ir7zza4/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/s2/favicons',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/android-chrome-192x192.png',
        destination: '/images/favicon.ico',
      },
      {
        source: '/images/android-chrome-512x512.png',
        destination: '/images/favicon.ico',
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/images/favicon.ico',
      },
    ];
  },
};

export default nextConfig;
