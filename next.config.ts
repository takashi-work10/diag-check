import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,          // 任意ですが推奨
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;