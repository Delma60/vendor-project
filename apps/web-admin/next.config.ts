// apps/web-admin/next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = { transpilePackages: ['@foodconnect/ui', '@foodconnect/shared-utils', '@foodconnect/shared-types'] };
export default nextConfig;
