// apps/web-seller/next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = { transpilePackages: ['@foodconnect/ui', '@foodconnect/shared-utils', '@foodconnect/shared-types', '@foodconnect/firebase'] };
export default nextConfig;
