
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Keep other experimental features here if needed in the future
  },
  allowedDevOrigins: ["https://6000-firebase-studio-1747236689446.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev"]
};

export default nextConfig;
