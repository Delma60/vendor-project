// apps/web-b2b/app/sitemap.ts
import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: 'https://foodconnect.example', lastModified: new Date() }, { url: 'https://foodconnect.example/pricing', lastModified: new Date() }, { url: 'https://foodconnect.example/signup', lastModified: new Date() }]; }
